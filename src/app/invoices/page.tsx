'use client';

import React, { useState, useEffect } from 'react';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';
import { 
  nativeToScVal, 
  Address, 
  Contract, 
  TransactionBuilder, 
  Networks, 
  xdr, 
  rpc,
  TimeoutInfinite
} from '@stellar/stellar-sdk';

const TESTNET_RPC = "https://soroban-testnet.stellar.org";
const TESTNET_PASSPHRASE = Networks.TESTNET;

interface Invoice {
  id: string;
  payee: string;
  amount: number;
  corridor: string;
  token: string;
  reference: string;
  status: 'PENDING' | 'PAID';
}

export default function HarborInvoices() {
  const [activeTab, setActiveTab] = useState<'contractor' | 'client'>('contractor');
  
  // Wallet states
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [contractId] = useState("CD4U2T3X5K7G2J6L4A8B9Z1Y0W_MOCK_CONTRACT_ID");

  // Contractor Invoice Creator Form States
  const [invoiceAmount, setInvoiceAmount] = useState("1200");
  const [invoiceCorridor, setInvoiceCorridor] = useState("gcash");
  const [invoiceToken, setInvoiceToken] = useState("usdc");
  const [invoiceRef, setInvoiceRef] = useState("Consulting Services");
  const [payeeAddress, setPayeeAddress] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Client Settlement Hub States
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [settling, setSettling] = useState(false);
  const [settlementStep, setSettlementStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    checkConnection();
    parseIncomingUrlInvoice();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isConnected();
      if (connected) {
        const pubKey = await getPublicKey();
        if (pubKey) {
          setWalletConnected(true);
          setPublicKey(pubKey);
          setPayeeAddress(pubKey);
        }
      }
    } catch (e) {
      console.error("Freight check failed", e);
    }
  };

  const connectWallet = async () => {
    try {
      const pubKey = await getPublicKey();
      if (pubKey) {
        setPublicKey(pubKey);
        setPayeeAddress(pubKey);
        setWalletConnected(true);
      }
    } catch (e) {
      console.error("Wallet connection failed", e);
    }
  };

  // Parses parameters from the URL when invoice link is clicked
  const parseIncomingUrlInvoice = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const payee = params.get('payee');
      const amountStr = params.get('amount');
      const corridor = params.get('corridor');
      const token = params.get('token');
      const ref = params.get('ref');

      if (payee && amountStr) {
        const amount = parseFloat(amountStr);
        if (!isNaN(amount)) {
          const newInvoice: Invoice = {
            id: `inv_${Date.now()}`,
            payee,
            amount,
            corridor: corridor || 'gcash',
            token: token || 'usdc',
            reference: ref || 'Contractor Payment',
            status: 'PENDING'
          };
          setInvoices([newInvoice]);
          setSelectedInvoiceIds([newInvoice.id]);
          setActiveTab('client'); // Automatically switch client to the pay view
        }
      }
    }
  };

  const handleGenerateInvoice = () => {
    if (!payeeAddress) {
      alert("Please provide a valid payee Stellar wallet key.");
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const link = `${origin}/invoices?payee=${encodeURIComponent(payeeAddress)}&amount=${encodeURIComponent(invoiceAmount)}&corridor=${encodeURIComponent(invoiceCorridor)}&token=${encodeURIComponent(invoiceToken)}&ref=${encodeURIComponent(invoiceRef)}`;
    setGeneratedLink(link);
    setIsCopied(false);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedInvoiceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchSettleInvoices = async () => {
    const selected = invoices.filter(inv => selectedInvoiceIds.includes(inv.id));
    if (selected.length === 0) return;

    setSettling(true);
    setSettlementStep(1); // Step 1: Initiating Clearing
    setStatusMessage({ type: 'info', text: "Contacting banking partner to clear inbound USD wire reserves..." });

    // Step 2: Minting USDC
    setTimeout(() => {
      setSettlementStep(2);
      setStatusMessage({ type: 'info', text: "USDC minted successfully on Stellar. Reconciling split allocations..." });

      // Step 3: Executing split path routing / swaps
      setTimeout(() => {
        setSettlementStep(3);
        setStatusMessage({ type: 'info', text: "Executing on-chain DEX swaps and routing payouts directly to corridor endpoints..." });

        // Step 4: Finished payouts
        setTimeout(async () => {
          try {
            // If connected to wallet and not running mock mode, trigger live contract transaction
            if (walletConnected && publicKey && !contractId.includes("MOCK")) {
              const server = new rpc.Server(TESTNET_RPC);
              const account = await server.getAccount(publicKey);
              const contract = new Contract(contractId);

              // Compile batch request payload from selected invoices
              const payoutItems = selected.map(inv => {
                const targetTokenVal = inv.token.toLowerCase() !== 'usdc'
                  ? OptionSomeAddress(inv.payee) // Mock secondary asset address coordinate
                  : xdr.ScVal.scvVoid();

                return xdr.ScVal.scvMap([
                  new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("payee"), val: new Address(inv.payee).toScVal() }),
                  new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("amount"), val: nativeToScVal(BigInt(Math.floor(inv.amount * 10000000))) }),
                  new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("department"), val: xdr.ScVal.scvSymbol(inv.corridor.toUpperCase()) }),
                  new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("target_token"), val: targetTokenVal })
                ]);
              });

              const totalAmount = selected.reduce((sum, inv) => sum + inv.amount, 0);

              const request = xdr.ScVal.scvMap([
                new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("items"), val: xdr.ScVal.scvVec(payoutItems) }),
                new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("declared_total"), val: nativeToScVal(BigInt(Math.floor(totalAmount * 10000000))) }),
                new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol("batch_id"), val: xdr.ScVal.scvSymbol(Date.now().toString()) })
              ]);

              const operation = contract.call("execute_batch_payroll", request);
              let tx = new TransactionBuilder(account, { fee: "1000", networkPassphrase: TESTNET_PASSPHRASE })
                .addOperation(operation)
                .setTimeout(TimeoutInfinite)
                .build();

              tx = await server.prepareTransaction(tx);
              const signedTx = await signTransaction(tx.toXDR(), { networkPassphrase: TESTNET_PASSPHRASE });
              await server.sendTransaction(TransactionBuilder.fromXDR(signedTx, TESTNET_PASSPHRASE));
            }

            // Update local status as PAID
            setInvoices(prev => prev.map(inv => 
              selectedInvoiceIds.includes(inv.id) ? { ...inv, status: 'PAID' as const } : inv
            ));
            setSelectedInvoiceIds([]);
            setSettlementStep(4);
            setStatusMessage({ type: 'success', text: "Batch payroll settled successfully. Off-ramp wires routed locally." });
          } catch (err) {
            console.error(err);
            setStatusMessage({ type: 'error', text: "Transaction rejected or signature execution failed." });
          } finally {
            setSettling(false);
          }
        }, 1500);

      }, 1500);
    }, 1500);
  };

  const OptionSomeAddress = (addrStr: string) => {
    return new Address(addrStr).toScVal();
  };

  const selectedInvoices = invoices.filter(inv => selectedInvoiceIds.includes(inv.id));
  const totalSettlement = selectedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalFees = selectedInvoices.reduce((sum, inv) => sum + (inv.amount * 0.001), 0); // 0.1% Harbor Fee

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: '700', fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Invoices Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Generate decentralized billing requests or batch pay outstanding contractor invoices.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
        <button 
          onClick={() => { setActiveTab('contractor'); setStatusMessage(null); }}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'contractor' ? '2px solid var(--color-gold)' : 'none',
            color: activeTab === 'contractor' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Contractor View (Create Invoice)
        </button>
        <button 
          onClick={() => { setActiveTab('client'); setStatusMessage(null); }}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'client' ? '2px solid var(--color-gold)' : 'none',
            color: activeTab === 'client' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Client View (Settle Invoices)
        </button>
      </div>

      {statusMessage && (
        <div className={`alert alert-${statusMessage.type}`} style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '500' }}>{statusMessage.text}</p>
        </div>
      )}

      {/* Stepper (Only show when settling) */}
      {settling && (
        <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '32px' }}>
          <div className="stepper">
            <div className={`step-item ${settlementStep >= 1 ? 'active' : ''} ${settlementStep > 1 ? 'completed' : ''}`}>
              <div className="step-node">{settlementStep > 1 ? '✓' : '1'}</div>
              <span className="step-label">ACH Detected</span>
            </div>
            <div className={`step-item ${settlementStep >= 2 ? 'active' : ''} ${settlementStep > 2 ? 'completed' : ''}`}>
              <div className="step-node">{settlementStep > 2 ? '✓' : '2'}</div>
              <span className="step-label">USDC Minted</span>
            </div>
            <div className={`step-item ${settlementStep >= 3 ? 'active' : ''} ${settlementStep > 3 ? 'completed' : ''}`}>
              <div className="step-node">{settlementStep > 3 ? '✓' : '3'}</div>
              <span className="step-label">Split Routing</span>
            </div>
            <div className={`step-item ${settlementStep >= 4 ? 'active' : ''}`}>
              <div className="step-node">4</div>
              <span className="step-label">Paid Locally</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'contractor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
          
          {/* Form Card */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Create Invoice Request</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Payee Wallet Key (Stellar Address)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={payeeAddress} 
                    onChange={(e) => setPayeeAddress(e.target.value)}
                    placeholder="G..." 
                  />
                  {!walletConnected && (
                    <button className="btn btn-secondary" onClick={connectWallet} style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      Autofill Wallet
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Invoice Amount (USD)</label>
                  <input 
                    type="text" 
                    value={invoiceAmount} 
                    onChange={(e) => setInvoiceAmount(e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Split Target Token</label>
                  <select value={invoiceToken} onChange={(e) => setInvoiceToken(e.target.value)}>
                    <option value="usdc">USDC (Stablecoin)</option>
                    <option value="xlm">XLM (Stellar Native)</option>
                    <option value="eurc">EURC (Euro Stablecoin)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Target Off-Ramp Corridor</label>
                  <select value={invoiceCorridor} onChange={(e) => setInvoiceCorridor(e.target.value)}>
                    <option value="gcash">GCash (Philippines)</option>
                    <option value="ovo">OVO (Indonesia)</option>
                    <option value="local-vn">Local Bank (Viet Nam)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Reference / Description</label>
                  <input 
                    type="text" 
                    value={invoiceRef} 
                    onChange={(e) => setInvoiceRef(e.target.value)} 
                  />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleGenerateInvoice} style={{ marginTop: '10px' }}>
                Generate Invoice Link
              </button>
            </div>
          </div>

          {/* Generated Link Display Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {generatedLink ? (
              <div className="glass-panel" style={{ background: '#fdfaf6' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: 'var(--color-gold-hover)' }}>Billing Request Created</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  Send this link to your client. When they open it, they can pay the invoice directly using their corporate Harbor treasury vault.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={generatedLink} 
                    readOnly 
                    style={{ fontSize: '12px', background: '#ffffff', fontFamily: 'monospace' }} 
                  />
                  <button className="btn btn-secondary" onClick={copyLinkToClipboard} style={{ fontSize: '12px' }}>
                    {isCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', borderStyle: 'dashed', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', color: 'var(--text-muted)', marginBottom: '12px' }}>💳</div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>No invoice generated yet</span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Fill out the coordinates on the left to build a request.</span>
              </div>
            )}
          </div>

        </div>
      )}

      {activeTab === 'client' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          
          {/* Pending Invoices List */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Pending Invoices Settle Queue</h3>
            
            {invoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '28px', color: 'var(--text-muted)', marginBottom: '12px' }}>✓</div>
                <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block' }}>All invoices settled</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Open a contractor generated link to load payment requests into the queue.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {invoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    style={{ 
                      padding: '16px', 
                      background: inv.status === 'PAID' ? 'var(--color-success-light)' : '#ffffff', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start',
                      transition: 'all 0.2s'
                    }}
                  >
                    {inv.status === 'PENDING' && (
                      <input 
                        type="checkbox" 
                        checked={selectedInvoiceIds.includes(inv.id)} 
                        onChange={() => handleToggleSelect(inv.id)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)', marginTop: '4px', cursor: 'pointer' }}
                      />
                    )}
                    {inv.status === 'PAID' && (
                      <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' }}>✓</span>
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{inv.reference}</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '15px' }}>${inv.amount.toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '8px' }}>
                        Payee Address: {inv.payee.slice(0, 8)}...{inv.payee.slice(-6)}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold-hover)', background: 'var(--color-gold-light)', padding: '3px 8px', borderRadius: '4px' }}>
                          Offramp: {inv.corridor.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                          Split: {inv.token.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: inv.status === 'PAID' ? 'var(--color-success)' : 'var(--text-secondary)', background: inv.status === 'PAID' ? '#dcfce7' : '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                          Status: {inv.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settle Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ background: '#fdfaf6' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Settle Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Selected Invoices</span>
                  <span>{selectedInvoices.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Principal Sum</span>
                  <span>${totalSettlement.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Harbor Service Fee (0.1%)</span>
                  <span>${totalFees.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontWeight: '700', fontSize: '14.5px' }}>Total Settlement</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  ${(totalSettlement + totalFees).toFixed(2)}
                </span>
              </div>

              <button 
                className="btn btn-action" 
                onClick={handleBatchSettleInvoices}
                disabled={selectedInvoices.length === 0 || settling}
                style={{ width: '100%', height: '40px', justifyContent: 'center' }}
              >
                {settling ? "Executing Payouts..." : `Batch Settle (${selectedInvoices.length})`}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
