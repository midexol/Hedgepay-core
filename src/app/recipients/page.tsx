'use client';

import React, { useState } from 'react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  corridor: 'gcash' | 'ovo' | 'local-vn';
  payoutShare: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function HarborRecipients() {
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: "rec-01",
      name: "Sarah Jenkins",
      email: "sarah.ph*lumina.flow",
      corridor: "gcash",
      payoutShare: 50,
      status: "ACTIVE"
    },
    {
      id: "rec-02",
      name: "Alex Widjaja",
      email: "alex.id*lumina.flow",
      corridor: "ovo",
      payoutShare: 30,
      status: "ACTIVE"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Recipient Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [corridor, setCorridor] = useState<'gcash' | 'ovo' | 'local-vn'>("gcash");
  const [payoutShare, setPayoutShare] = useState("20");

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newRec: Recipient = {
      id: `rec-${Date.now()}`,
      name,
      email,
      corridor,
      payoutShare: parseFloat(payoutShare) || 0,
      status: "ACTIVE"
    };

    setRecipients(prev => [...prev, newRec]);
    setIsModalOpen(false);
    
    // Clear form
    setName("");
    setEmail("");
    setCorridor("gcash");
    setPayoutShare("20");
  };

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '980px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Recipients Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Manage your global remote contractors, their local corridors, and payout allocations.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add Recipient</button>
      </div>

      {/* Search Input Filter */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Search by name, email, or federation ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Empty State View */}
      {filteredRecipients.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 40px', borderStyle: 'dashed' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>No recipients found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
            You haven't added any contractors matching those criteria yet.
          </p>
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>Add your first recipient</button>
        </div>
      ) : (
        /* Recipient Cards Grid Layout */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredRecipients.map((rec) => (
            <div key={rec.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', padding: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{rec.name}</h3>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: '700', 
                    color: 'var(--color-success)',
                    background: 'var(--color-success-light)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {rec.status}
                  </span>
                </div>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {rec.email}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>DESTINATION RAIL</span>
                  <span className={`badge badge-${rec.corridor}`} style={{ marginTop: '4px' }}>
                    {rec.corridor === 'local-vn' ? 'Viet Nam' : rec.corridor.toUpperCase()}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>ALLOCATION</span>
                  <span style={{ fontWeight: '700', fontSize: '13px' }}>{rec.payoutShare}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styled Modal Dialog (Consistent Pattern) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Recipient</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRecipient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email or Federation ID</label>
                <input 
                  type="text" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="john.doe@gmail.com"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Payment Rail</label>
                  <select 
                    value={corridor}
                    onChange={(e: any) => setCorridor(e.target.value)}
                  >
                    <option value="gcash">GCash (Philippines)</option>
                    <option value="ovo">OVO (Indonesia)</option>
                    <option value="local-vn">Local Bank (Viet Nam)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Allocation Share (%)</label>
                  <input 
                    type="text" 
                    value={payoutShare} 
                    onChange={(e) => setPayoutShare(e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Recipient</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
