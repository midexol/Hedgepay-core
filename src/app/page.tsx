'use client';

import React, { useState, useEffect, useRef } from 'react';
import CsvUpload, { PayeeRecord } from '../components/CsvUpload';
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

// Federation mock database to demonstrate SEP-2 resolver
const MOCK_FEDERATION_DB: { [key: string]: string } = {
  "john.doe@gmail.com": "GDQWD34NJEX7HHLNXZQWUMQMKBVQ2SDFWQP6NQ2TRXYSJHG",
  "sarah.ph*lumina.flow": "GCWZ26Z47657L6QWUMQMEV2SDFWQP6NQ2TRX34YJHNXWZL",
  "alex.id*lumina.flow": "GB75FSLHNGQWUMQMEV2SDFWQP6NQ2TRXYSJHG34UJH23J4",
  "nguyen.vn@gmail.com": "GDH784HNGQWUMQMEV2SDFWQP6NQ2TRXYSJHG34UJH90KLJ",
};

export default function HRPortal() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [records, setRecords] = useState<PayeeRecord[]>([]);
  const [contractId, setContractId] = useState("CD4U2T3X5K7G2J6L4A8B9Z1Y0W_MOCK_CONTRACT_ID");
  const [tokenAddress, setTokenAddress] = useState("CDLZ47657L6QWUMQMEV2SDFWQP6NQ2TRX"); // Mock USDC
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [txHash, setTxHash] = useState("");
  
  // Real-time Salary streaming simulation
  const [accumulatedStream, setAccumulatedStream] = useState(0);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkConnection();
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // When records change, start/reset the streaming calculator
  useEffect(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    if (records.length > 0) {
      setAccumulatedStream(0);
      const totalAmount = records.reduce((acc, curr) => acc + curr.amount, 0);
      // Simulate streaming rate: total amount streamed over 30 days, updated every 50ms
      const ratePer50ms = (totalAmount / (30 * 24 * 3600)) * 0.05 * 100000; // Multiplied for dramatic visual effect in demo
      
      streamIntervalRef.current = setInterval(() => {
        setAccumulatedStream(prev => prev + ratePer50ms);
      }, 50);
    } else {
      setAccumulatedStream(0);
    }
  }, [records]);

  const checkConnection = async () => {
    try {
      const connected = await isConnected();
      if (connected) {
        setWalletConnected(true);
        const pubKey = await getPublicKey();
        setPublicKey(pubKey);
      }
    } catch (e) {
      console.error("Wallet connection failed", e);
    }
  };

  const connectWallet = async () => {
    try {
      const pubKey = await getPublicKey();
      setPublicKey(pubKey);
      setWalletConnected(true);
      setStatus({ type: 'success', message: "Wallet connected successfully!" });
    } catch (e) {
      setStatus({ type: 'error', message: "Failed to connect Freighter wallet. Make sure it is unlocked." });
    }
  };

  const handleParsedCsv = (parsedRecords: PayeeRecord[]) => {
    setRecords(parsedRecords);
    setStatus({ type: 'success', message: `Parsed ${parsedRecords.length} records. Resolving identity federations...` });
  };

  const handleParseError = (message: string) => {
    setStatus({ type: 'error', message });
    setRecords([]);
  };

  const totalSum = records.reduce((acc, curr) => acc + curr.amount, 0);

  const getCorridorBreakdown = () => {
    const breakdown: { [key: string]: { count: number, sum: number } } = {
      gcash: { count: 0, sum: 0 },
      ovo: { count: 0, sum: 0 },
      'local-vn': { count: 0, sum: 0 }
    };
    records.forEach(r => {
      if (breakdown[r.corridor]) {
        breakdown[r.corridor].count++;
        breakdown[r.corridor].sum += r.amount;
      }
    });
    return breakdown;
  };

  const breakdown = getCorridorBreakdown();

  // Helper to resolve email/federated id to mock public key (SEP-2 simulation)
  const resolveAddress = (addrOrId: string) => {
    if (addrOrId.startsWith("G") && addrOrId.length === 56) {
      return addrOrId;
    }
    return MOCK_FEDERATION_DB[addrOrId.toLowerCase()] || "GDQWD34NJEX7HHLNXZQWUMQMKBVQ2SDFWQP6NQ2MOCK_RESOLVED";
  };

  const handleExecuteBatch = async () => {
    if (!walletConnected || !publicKey) {
      setStatus({ type: 'error', message: "Please connect your wallet first." });
      return;
    }

    if (records.length === 0) {
      setStatus({ type: 'error', message: "Please upload a CSV file with valid recipient data." });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: "Initializing Soroban transaction..." });

    try {
      const server = new rpc.Server(TESTNET_RPC);

      // Load account details to get current sequence number
      const account = await server.getAccount(publicKey);
      
      // Instantiate contract client
      const contract = new Contract(contractId);

      // Map payee items to ScVal Structs matching contract layout
      // Note: Stellar assets standard uses 7 decimal places for amounts (i128)
      const payoutItemsScVal = records.map(r => {
        const resolvedKey = resolveAddress(r.walletAddress);
        const itemMap = new Map();
        itemMap.set("payee", new Address(resolvedKey));
        itemMap.set("amount", BigInt(Math.floor(r.amount * 10000000)));
        itemMap.set("department", xdr.ScVal.scvSymbol(r.department));
        return xdr.ScVal.scvMap(Array.from(itemMap).map(([k, v]) => {
          return new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol(k),
            val: v as xdr.ScVal
          });
        }));
      });

      // Construct declared total value
      const totalAmountParts = BigInt(Math.floor(totalSum * 10000000));

      const batchRequestMap = new Map();
      batchRequestMap.set("items", xdr.ScVal.scvVec(payoutItemsScVal));
      batchRequestMap.set("declared_total", totalAmountParts);
      batchRequestMap.set("batch_id", BigInt(Date.now())); // Unique timestamp batch ID

      const batchRequestScVal = xdr.ScVal.scvMap(Array.from(batchRequestMap).map(([k, v]) => {
        return new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol(k),
          val: v as xdr.ScVal
        });
      }));

      // Call execute_batch_payroll contract method
      const operation = contract.call("execute_batch_payroll", batchRequestScVal);

      // Build initial transaction wrapper
      let tx = new TransactionBuilder(account, {
        fee: "1000",
        networkPassphrase: TESTNET_PASSPHRASE,
      })
        .addOperation(operation)
        .setTimeout(TimeoutInfinite)
        .build();

      // Simulate transaction to gather gas resource requirements
      setStatus({ type: 'info', message: "Simulating on-chain resource footprint..." });
      tx = await server.prepareTransaction(tx);

      // Send to Freighter for user signing
      setStatus({ type: 'info', message: "Please approve signature in Freighter wallet..." });
      const signedTxXdr = await signTransaction(tx.toXDR(), {
        networkPassphrase: TESTNET_PASSPHRASE
      });

      // Submit signed transaction
      setStatus({ type: 'info', message: "Submitting batch transaction to Stellar testnet..." });
      const submitResult = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, TESTNET_PASSPHRASE));

      if (submitResult.status === "PENDING") {
        let response = await server.getTransaction(submitResult.hash);
        while (response.status === "NOT_FOUND" || response.status === "SUCCESS") {
          if (response.status === "SUCCESS") {
            setTxHash(submitResult.hash);
            setStatus({ type: 'success', message: `Batch Payroll Succeeded! Sequence confirmed on-chain.` });
            setRecords([]);
            setLoading(false);
            return;
          }
          await new Promise(r => setTimeout(r, 1000));
          response = await server.getTransaction(submitResult.hash);
        }
      } else {
        throw new Error((submitResult as any).errorResultXdr || "Transaction rejected on-chain");
      }
    } catch (e: any) {
      console.error(e);
      // For demo viability, show complete simulated success response if keys/contract not present
      if (contractId.includes("MOCK")) {
        setTimeout(() => {
          setTxHash("9642a8b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2");
          setStatus({ type: 'success', message: "Simulation Mode: Batch Payroll executed successfully!" });
          setLoading(false);
        }, 2000);
      } else {
        setStatus({ type: 'error', message: `Transaction failed: ${e.message || e.toString()}` });
        setLoading(false);
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="cyan-orb"></div>
      
      <header className="header">
        <div className="logo">
          <span style={{ fontSize: '32px', filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.45))' }}>✦</span> 
          LUMINA <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.08)', color: 'var(--color-cyan)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>flow</span>
        </div>
        {walletConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Signer: <span style={{ fontFamily: 'monospace', color: 'var(--color-cyan)' }}>{publicKey.slice(0, 5)}...{publicKey.slice(-5)}</span>
            </span>
            <button className="btn btn-secondary" onClick={() => { setPublicKey(""); setWalletConnected(false); }}>Disconnect</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Status Alert Panels */}
          {status && (
            <div className={`alert alert-${status.type}`}>
              <span>{status.type === 'error' ? '❌' : status.type === 'success' ? '✅' : '⚡'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '500' }}>{status.message}</p>
                {txHash && (
                  <div style={{ marginTop: '8px' }}>
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: 'var(--color-cyan)', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                      View transaction on StellarExplorer
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Real-time Salary stream active simulation */}
          {records.length > 0 && (
            <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.03) 100%)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-cyan)', animation: 'pulse 1.5s infinite' }}></span>
                  Real-Time Salary Stream Active
                </h3>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--text-muted)' }}>Stellar Soroban Flow</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="glowing-number" style={{ fontSize: '42px', letterSpacing: '-1px' }}>
                  ${accumulatedStream.toFixed(5)}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>USDC accumulated</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                This is a real-time visualization of the batch value accruing. Contractors see this dynamic balance stream directly on their dashboards, cashing out at will.
              </p>
            </div>
          )}

          {/* Config Settings Panel */}
          <div className="glass-panel">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Network Config</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Soroban Contract ID</label>
                <input 
                  type="text" 
                  value={contractId} 
                  onChange={(e) => setContractId(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>USDC Token Address</label>
                <input 
                  type="text" 
                  value={tokenAddress} 
                  onChange={(e) => setTokenAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CSV File Uploader Zone */}
          <div className="glass-panel">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Step 1: Upload CSV Payroll</h2>
            <CsvUpload onParsed={handleParsedCsv} onError={handleParseError} />
          </div>

          {/* Recipient Details Table */}
          {records.length > 0 && (
            <div className="glass-panel">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Step 2: Review & Federated Resolution</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Identifier / Email</th>
                      <th>Stellar Address (SEP-2 Resolved)</th>
                      <th>Corridor</th>
                      <th>USDC Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, idx) => {
                      const resolvedKey = resolveAddress(r.walletAddress);
                      const isFederated = !r.walletAddress.startsWith("G");
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: '500' }}>
                            {r.walletAddress}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: isFederated ? 'var(--color-cyan)' : 'var(--text-secondary)', fontSize: '12px' }}>
                            {resolvedKey.slice(0, 8)}...{resolvedKey.slice(-8)}
                            {isFederated && <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 4px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '3px' }}>resolved</span>}
                          </td>
                          <td>
                            <span className={`badge badge-${r.corridor}`}>
                              {r.corridor === 'local-vn' ? 'Viet Nam' : r.corridor}
                            </span>
                          </td>
                          <td style={{ fontWeight: '700', color: 'white' }}>
                            ${r.amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary & Execution Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--color-cyan)', background: 'linear-gradient(to bottom, rgba(6, 182, 212, 0.02), rgba(0,0,0,0))' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Recipients</span>
                <span style={{ fontWeight: 'bold' }}>{records.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Amount</span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-cyan)', fontSize: '16px' }}>${totalSum.toFixed(2)} USDC</span>
              </div>

              {/* Fee leakage ticker */}
              <div style={{ padding: '12px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '8px', border: '1px dashed rgba(236, 72, 153, 0.2)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f472b6', fontWeight: 'bold', marginBottom: '4px' }}>
                  <span>Traditional Fees (Avg):</span>
                  <span>~${(totalSum * 0.05 + 15).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 'bold' }}>
                  <span>Stellar Network Fee:</span>
                  <span>&lt; $0.01</span>
                </div>
              </div>

              {/* Corridor breakdowns */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Corridor Distribution</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>🇵🇭 GCash</span>
                    <span>{breakdown.gcash.count} · ${breakdown.gcash.sum.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>🇮🇩 OVO</span>
                    <span>{breakdown.ovo.count} · ${breakdown.ovo.sum.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>🇻🇳 Local VN</span>
                    <span>{breakdown['local-vn'].count} · ${breakdown['local-vn'].sum.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-action" 
                style={{ width: '100%', marginTop: '16px', padding: '14px' }}
                disabled={loading || records.length === 0}
                onClick={handleExecuteBatch}
              >
                {loading ? "Streaming Payouts..." : "Execute Settlement"}
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <h3 style={{ color: 'white', marginBottom: '8px', fontWeight: '600' }}>SEP-2 Onboarding</h3>
            <p style={{ lineHeight: '1.6' }}>
              Upload your CSV with simple contact emails/phone numbers. Lumina's federation server resolves them automatically to Stellar keys, eliminating contractor crypto setups.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Lumina Flow. Powered by the Stellar Soroban Network.</p>
      </footer>
    </div>
  );
}
