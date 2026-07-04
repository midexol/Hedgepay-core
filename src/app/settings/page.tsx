'use client';

import React, { useState } from 'react';

export default function HarborSettings() {
  const [profileName, setProfileName] = useState("Olamide Adesina");
  const [profileEmail, setProfileEmail] = useState("olamide@midexol.com");
  const [apiKey, setApiKey] = useState("hb_live_948f7d983ae47629b3fd8a");
  const [isCopied, setIsCopied] = useState(false);

  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationSlack, setNotificationSlack] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '780px' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          System Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Configure your virtual bank coordinates, API credentials, and notification settings.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* User Profile Config */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Profile Configuration
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Legal Name</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Administrative Email</label>
              <input 
                type="text" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Developer Access Credentials
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
            Integrate Harbor bank proxy routing directly into your own ERP pipelines or task boards (Upwork, Deel, Gusto) using our REST webhook endpoints.
          </p>
          
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Harbor API Token</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={apiKey} 
                readOnly
                style={{ fontFamily: 'monospace', background: '#f8fafc' }}
              />
              <button className="btn btn-secondary" onClick={handleCopyKey} style={{ whiteSpace: 'nowrap' }}>
                {isCopied ? "Copied" : "Copy Token"}
              </button>
            </div>
          </div>
        </div>

        {/* Webhook notification preferences */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Notification Channels
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notificationEmail} 
                onChange={(e) => setNotificationEmail(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-blue)' }}
              />
              Email receipts on completed ACH wire tokenization clearing events.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notificationSlack} 
                onChange={(e) => setNotificationSlack(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-blue)' }}
              />
              Slack webhook triggers on payout off-ramp failures.
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
