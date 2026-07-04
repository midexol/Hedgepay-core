'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VaultTransaction {
  id: string;
  type: 'deposit' | 'yield';
  amount: number;
  date: string;
}

export default function HarborVaults() {
  // Vault Initialized state (for empty state testing)
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Split allocation states
  const [splitYield, setSplitYield] = useState(20); // 20% to savings vault
  const [currentSavedSplit, setCurrentSavedSplit] = useState(20);
  
  // Dynamic Interest Ticking states
  const [vaultBalance, setVaultBalance] = useState(421.428931);
  const [showToast, setShowToast] = useState(false);
  
  // Mini transaction list
  const [transactions, setTransactions] = useState<VaultTransaction[]>([
    { id: "v-01", type: "deposit", amount: 300.00, date: "2026-07-03" },
    { id: "v-02", type: "yield", amount: 0.142, date: "2026-07-02" },
    { id: "v-03", type: "deposit", amount: 120.00, date: "2026-06-28" }
  ]);

  // Live ticking ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (vaultInitialized) {
      intervalRef.current = setInterval(() => {
        // Ticks up by $0.000018 per second (5.4% APY simulation)
        setVaultBalance(prev => prev + 0.000018);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [vaultInitialized]);

  const handleInitialize = () => {
    setInitializing(true);
    setTimeout(() => {
      setInitializing(false);
      setVaultInitialized(true);
    }, 1800); // Loader animation duration
  };

  const handleSaveConfiguration = () => {
    setCurrentSavedSplit(splitYield);
    setShowToast(true);
    
    // Add a simulated log entry for the change
    const newTx: VaultTransaction = {
      id: `v-${Date.now()}`,
      type: "yield",
      amount: 0.00,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [newTx, ...prev]);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const splitOfframp = 100 - splitYield;

  return (
    <div style={{ maxWidth: '980px', position: 'relative' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: '700', fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Yield Vaults & Splits
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Manage your inflation-hedging USD savings and configure automatic payout split parameters.
        </p>
      </div>

      {/* Save Settings Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: 'var(--color-accent)',
          border: '1px solid var(--color-gold)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span style={{ 
            display: 'inline-flex', 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            background: 'var(--color-gold)', 
            color: 'var(--color-accent)', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '900'
          }}>✓</span>
          <span style={{ fontSize: '13.5px', fontWeight: '600' }}>Split allocation configurations updated successfully.</span>
        </div>
      )}

      {/* 1. Empty State (Before Vault Initialization) */}
      {!vaultInitialized && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 40px', borderStyle: 'dashed', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '36px', color: 'var(--color-gold)', marginBottom: '16px' }}>🏦</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Stellar Yield Vault Not Deployed</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            To start earning 5.4% APY interest on your USD reserves, you must deploy an interest-bearing escrow account on the Stellar network.
          </p>
          <button 
            className="btn btn-action" 
            onClick={handleInitialize}
            disabled={initializing}
            style={{ minWidth: '180px' }}
          >
            {initializing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"></path>
                </svg>
                Deploying Contract...
              </div>
            ) : "Initialize Escrow Vault"}
          </button>
        </div>
      )}

      {/* 2. Full Vault Workspace (After Initialization) */}
      {vaultInitialized && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Split Allocator Draggable Slider with Liquid Fill Metaphor */}
            <div className="glass-panel" style={{ borderTop: '3px solid var(--color-gold)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Allocation Splitting
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Liquid Fill Visual Bar Metaphor */}
                <div style={{ 
                  height: '24px', 
                  borderRadius: '12px', 
                  background: 'var(--border-light)', 
                  display: 'flex', 
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  position: 'relative'
                }}>
                  {/* Left Pill (Local e-wallet payout) */}
                  <div style={{ 
                    width: `${splitOfframp}%`, 
                    background: 'var(--color-accent)', 
                    transition: 'width 0.1s ease', 
                    display: 'flex', 
                    alignItems: 'center', 
                    paddingLeft: '12px',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700'
                  }}>
                    {splitOfframp > 15 && `PAYOUT ${splitOfframp}%`}
                  </div>
                  {/* Right Pill (Yield Escrow Vault) */}
                  <div style={{ 
                    width: `${splitYield}%`, 
                    background: 'var(--color-gold)', 
                    transition: 'width 0.1s ease', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    paddingRight: '12px',
                    color: 'var(--color-accent)',
                    fontSize: '10px',
                    fontWeight: '700'
                  }}>
                    {splitYield > 15 && `SAVINGS ${splitYield}%`}
                  </div>
                </div>

                {/* Range Input controller */}
                <div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={splitYield} 
                    onChange={(e) => setSplitYield(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-gold)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <span>Drag left to Payout</span>
                    <span>Drag right to Save</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Before / After Preview Panel */}
            <div className="glass-panel">
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Before / After Preview</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: '#fdfaf6', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>CURRENT ROUTING</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Savings: <strong style={{ color: 'var(--color-gold-hover)' }}>{currentSavedSplit}%</strong></span>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>E-Wallet: <strong>{100 - currentSavedSplit}%</strong></span>
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--color-gold-light)', borderRadius: '8px', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-gold-hover)', display: 'block', fontWeight: '700' }}>PROPOSED ROUTING</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Savings: <strong style={{ color: 'var(--color-gold-hover)' }}>{splitYield}%</strong></span>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>E-Wallet: <strong>{splitOfframp}%</strong></span>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-action" 
                onClick={handleSaveConfiguration}
                disabled={splitYield === currentSavedSplit}
                style={{ width: '100%' }}
              >
                Save Split Configuration
              </button>
            </div>

          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Vault Balance Card with Ticking Numerals and Sparkline */}
            <div className="glass-panel" style={{ background: '#fdfaf6', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>STELLAR YIELD VAULT</span>
                  <h3 className="cabinet-number" style={{ fontSize: '32px', color: 'var(--text-primary)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                    ${vaultBalance.toFixed(6)}
                  </h3>
                </div>
                <span className="badge" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', border: '1px solid #bbf7d0' }}>5.4% APY</span>
              </div>

              {/* Ticking Interest Sparkline (SVG gentle wave animation) */}
              <div style={{ height: '60px', margin: '20px 0 10px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path 
                    d="M0,30 Q25,10 50,25 T100,15" 
                    fill="none" 
                    stroke="var(--color-gold)" 
                    strokeWidth="2"
                    style={{
                      strokeDasharray: '200',
                      strokeDashoffset: '0',
                      animation: 'drawSpark 4s infinite alternate ease-in-out'
                    }}
                  />
                </svg>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Escrow funds are deposited into fully backed USDC reserves accruing interest on-chain. Zero lockups, cancel splits anytime.
              </p>
            </div>

            {/* Vault transaction history */}
            <div className="glass-panel">
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Vault Ledger</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transactions.map((tx) => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: '600', display: 'block' }}>
                        {tx.type === 'deposit' ? "USDC Deposit" : "Split configuration updated"}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tx.date}</span>
                    </div>
                    <span style={{ fontWeight: '700', color: tx.amount > 0 ? 'var(--color-success)' : 'var(--text-primary)' }}>
                      {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : '--'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Custom Inline styles for sparkline and toast keyframes */}
      <style jsx global>{`
        @keyframes drawSpark {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes slideIn {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
    </div>
  );
}
