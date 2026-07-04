'use client';

import React, { useState } from 'react';

interface ActivityLog {
  id: string;
  type: 'incoming_ach' | 'tokenization' | 'offramp_payout';
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETE' | 'FAILED';
  txHash?: string;
  timestamp: string;
}

export default function HarborLedger() {
  const [logs] = useState<ActivityLog[]>([
    {
      id: "tx-001",
      type: "incoming_ach",
      amount: 1800,
      description: "ACH Direct Deposit: Upwork Global",
      status: "COMPLETE",
      timestamp: "2026-07-03T10:14:00Z"
    },
    {
      id: "tx-002",
      type: "offramp_payout",
      amount: 1350,
      description: "Auto-withdrawal routed to GCash Account",
      status: "COMPLETE",
      txHash: "9642a8b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2",
      timestamp: "2026-07-03T10:14:12Z"
    },
    {
      id: "tx-003",
      type: "incoming_ach",
      amount: 1200,
      description: "ACH Direct Deposit: Fiverr International",
      status: "COMPLETE",
      timestamp: "2026-06-28T09:44:00Z"
    },
    {
      id: "tx-004",
      type: "offramp_payout",
      amount: 960,
      description: "Auto-withdrawal routed to OVO Account",
      status: "COMPLETE",
      txHash: "20df84b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2",
      timestamp: "2026-06-28T09:44:15Z"
    }
  ]);

  return (
    <div style={{ maxWidth: '980px' }}>
      {/* Top Header Row */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Activity Ledger
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Review the historical record of incoming ACH payments and on-chain off-ramp settlements.
        </p>
      </div>

      <div className="glass-panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: '600' }}>
                    {log.type === 'incoming_ach' ? 'ACH Transfer' : 'Off-ramp Payout'}
                  </td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {log.description}
                    {log.txHash && (
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>
                        <a 
                          href={`https://stellar.expert/explorer/testnet/tx/${log.txHash}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
                        >
                          Tx Hash: {log.txHash.slice(0, 15)}...
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      color: 'var(--color-success)',
                      background: 'rgba(16, 185, 129, 0.08)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: '700', color: log.type === 'incoming_ach' ? 'var(--color-success)' : 'var(--text-primary)' }}>
                    {log.type === 'incoming_ach' ? '+' : '-'}${log.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
