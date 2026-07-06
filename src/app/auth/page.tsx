'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isConnected, getPublicKey } from '@stellar/freighter-api';

export default function HarborAuth() {
  const router = useRouter();
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Validation Errors state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  
  const [loading, setLoading] = useState(false);

  // Validate Email on change / blur
  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate Password
  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required.");
      return false;
    }
    if (val.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleWalletConnect = async () => {
    setLoading(true);
    setGeneralError("");
    try {
      const connected = await isConnected();
      if (connected) {
        const pubKey = await getPublicKey();
        if (pubKey) {
          router.push('/dashboard');
        } else {
          setGeneralError("Failed to retrieve Freighter public key. Unlock your wallet.");
        }
      } else {
        setGeneralError("Freighter Wallet is not installed or enabled in your browser.");
      }
    } catch (e) {
      setGeneralError("An unexpected error occurred during wallet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    if (!isLoginTab && !agreeTerms) {
      setGeneralError("You must agree to the Terms of Service to register.");
      return;
    }

    setLoading(true);
    
    // Simulate database lookup / creation
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)'
    }}>
      
      {/* Form Side - Left Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 24px',
        background: 'var(--bg-panel)',
        zIndex: 10
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          
          {/* Logo Header */}
          <div style={{ marginBottom: '32px' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '22px', letterSpacing: '1px' }}>
                HARBOR
              </h2>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
              Create your account to setup USD routing coordinates.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
            <button 
              type="button"
              onClick={() => { setIsLoginTab(true); setGeneralError(""); }}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: isLoginTab ? '2px solid var(--color-gold)' : 'none',
                color: isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLoginTab(false); setGeneralError(""); }}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: !isLoginTab ? '2px solid var(--color-gold)' : 'none',
                color: !isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>

          {generalError && (
            <div className="alert alert-error" style={{ padding: '10px 14px', marginBottom: '20px' }}>
              {generalError}
            </div>
          )}

          {/* Social Logins + Wallet Connect - Equal Weight Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button 
              type="button"
              onClick={handleWalletConnect}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '10px', height: '40px', justifyContent: 'center' }}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              Freighter
            </button>
            <button 
              type="button"
              onClick={() => router.push('/dashboard')}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '10px', height: '40px', justifyContent: 'center' }}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.887H12.24z"/>
              </svg>
              Google
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
            <span>OR CONTINUE WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email Address</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => validateEmail(e.target.value)}
                placeholder="name@company.com"
                style={{ borderColor: emailError ? 'var(--color-error)' : 'var(--border-light)' }}
              />
              {emailError && (
                <span style={{ fontSize: '11px', color: 'var(--color-error)', display: 'block', marginTop: '4px' }}>
                  {emailError}
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Password</label>
                {isLoginTab && (
                  <a href="#" style={{ fontSize: '11px', color: 'var(--color-gold-hover)', textDecoration: 'none', fontWeight: '600' }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => validatePassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  borderColor: passwordError ? 'var(--color-error)' : 'var(--border-light)',
                  WebkitTextSecurity: 'disc' 
                } as any}
              />
              {passwordError && (
                <span style={{ fontSize: '11px', color: 'var(--color-error)', display: 'block', marginTop: '4px' }}>
                  {passwordError}
                </span>
              )}
            </div>

            {/* Checkbox for Registration */}
            {!isLoginTab && (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-gold)', marginTop: '2px' }}
                />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            )}

            <button 
              type="submit" 
              className="btn btn-action"
              style={{ width: '100%', padding: '12px', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              disabled={loading}
            >
              {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"></path>
                </svg>
              )}
              {loading ? "Processing..." : isLoginTab ? "Sign In" : "Register"}
            </button>
          </form>

          {/* New Trust & Benefits Density List */}
          <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '14px' }}>✓</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Stellar-Secured Payouts:</strong> Zero custody, fully cryptographic settlement validation.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '14px' }}>✓</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Instant Off-Ramps:</strong> Direct deposit routing to GCash, Maya, and local bank rails.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '14px' }}>✓</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Sub-0.1% Network Fees:</strong> Bypass predatory intermediary swift wire transaction costs.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Ambient Graphic Side - Right Panel (Desktop only) */}
      <div style={{
        flex: 1.1,
        background: 'var(--color-accent)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px'
      }}>
        {/* Animated Linear Grid Pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'linear-gradient(90deg, rgba(245, 158, 11, 0.3) 1px, transparent 1px), linear-gradient(0deg, rgba(245, 158, 11, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'gridMove 30s linear infinite'
        }}></div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'white', fontWeight: '700', lineHeight: '1.25' }}>
            Safe harbor for your global earnings.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginTop: '16px', lineHeight: '1.6' }}>
            Protect your revenue streams from high wire markup and conversion volatility. Withdraw to local payout networks in seconds.
          </p>
        </div>
      </div>

      {/* Inline styles for keyframe gridMove and spin */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>

    </div>
  );
}
