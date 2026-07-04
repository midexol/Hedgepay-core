'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HarborLanding() {
  // Animated Count-Up state for Fee Leakage comparison
  const [lossAmount, setLossAmount] = useState(0);
  const [harborAmount, setHarborAmount] = useState(0);
  
  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Active step reveal state
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Count up animation logic
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setLossAmount(Math.floor((3600 / steps) * currentStep));
      setHarborAmount(Math.floor((12 / steps) * currentStep));

      if (currentStep >= steps) {
        clearInterval(timer);
        setLossAmount(3600);
        setHarborAmount(12);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the virtual bank account proxy work?",
      a: "Harbor generates unique domestic US routing and account coordinates for your profile. When your client or gig platform pays USD into this account via ACH or wire, it is cleared by our banking partner and converted instantly to USDC on Stellar."
    },
    {
      q: "What local cash-out channels are supported?",
      a: "Currently, we support automated off-ramps directly to GCash and Maya (Philippines), OVO and GoPay (Indonesia), and local bank transfers in Vietnam. More corridors are added continuously."
    },
    {
      q: "Is there any exchange rate markup?",
      a: "No. Unlike PayPal or Payoneer which hide 3% to 4.5% markup in the exchange rate, Harbor routes funds directly through Stellar liquidity pools at institutional spot rates, taking a flat, transparent 0.15% service fee."
    },
    {
      q: "Do my clients need to install Freighter or understand crypto?",
      a: "No. Your clients pay you via standard US bank routing numbers just like a normal contractor bank account. The entire Stellar conversion is managed in the background, making web3 onboarding invisible."
    }
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Ripple Background Effect */}
      <div className="ripple-background"></div>

      {/* Nav Bar */}
      <header style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        height: '90px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '1.5px', fontFamily: 'var(--font-display)' }}>
          HARBOR
        </div>
        
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#how-it-works" style={{ fontSize: '13.5px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>How It Works</a>
          <a href="#pricing" style={{ fontSize: '13.5px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>Pricing</a>
          <a href="#faq" style={{ fontSize: '13.5px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>FAQ</a>
        </nav>

        <Link href="/auth" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          Enter Portal
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{ 
        maxWidth: '960px', 
        margin: '120px auto 100px', 
        textAlign: 'center', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          letterSpacing: '1.5px', 
          color: 'var(--color-gold)', 
          textTransform: 'uppercase',
          background: 'var(--color-gold-light)',
          padding: '6px 14px',
          borderRadius: '4px',
          border: '1px solid rgba(197, 160, 89, 0.15)'
        }}>
          Global Salary Infrastructure
        </span>
        
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontWeight: '700', 
          fontSize: '56px', 
          lineHeight: '1.15', 
          color: 'var(--text-primary)', 
          marginTop: '28px',
          letterSpacing: '-1px'
        }}>
          Stop losing remote earnings<br />
          to legacy bank markups.
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '18px', 
          maxWidth: '650px', 
          margin: '24px auto 36px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-sans)'
        }}>
          Receive standard USD wire deposits. Automatically route your salary onto Stellar USDC, and off-ramp instantly to local channels for near-zero fee leakage.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/auth" className="btn btn-action" style={{ padding: '14px 28px', fontSize: '14px' }}>
            Get Started
          </Link>
          <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '14px' }}>
            See how it works
          </a>
        </div>
      </section>

      {/* Corridor Trust Bar */}
      <div style={{ 
        maxWidth: '780px', 
        margin: '0 auto 100px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 24px', 
        background: 'var(--bg-panel)',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>ACTIVE CORRIDORS</span>
          <div style={{ display: 'flex', gap: '12px', fontSize: '20px' }}>
            <span>🇵🇭</span>
            <span>🇮🇩</span>
            <span>🇻🇳</span>
            <span>🇳🇬</span>
          </div>
        </div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          color: 'var(--color-gold-hover)', 
          background: 'var(--color-gold-light)', 
          padding: '4px 8px', 
          borderRadius: '4px',
          letterSpacing: '0.5px'
        }}>
          BUILT ON STELLAR
        </div>
      </div>

      {/* Animated Fee Leakage Comparison Widget */}
      <section style={{ 
        maxWidth: '1100px', 
        margin: '0 auto 100px', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.5px' }}>
              Why remote teams are switching
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Traditional wire transfers and platforms like PayPal eat up to 5% of cross-border salary values in hidden exchange rates and intermediary bank processing costs.
            </p>
            <div style={{ borderLeft: '4px solid var(--color-gold)', paddingLeft: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Framing the loss</span>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600', marginTop: '4px' }}>
                You lose significant monthly earnings to banking margin layers. Harbor bypasses legacy institutions entirely.
              </p>
            </div>
          </div>

          {/* Count-Up Animation Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ padding: '24px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-error)', display: 'block', letterSpacing: '0.5px' }}>OLD WAY FEES (YEAR)</span>
              <span className="cabinet-number" style={{ fontSize: '38px', color: 'var(--color-error)', display: 'block', margin: '8px 0' }}>
                ${lossAmount}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lost to PayPal markup</span>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--color-success-light)', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-success)', display: 'block', letterSpacing: '0.5px' }}>HARBOR FEES (YEAR)</span>
              <span className="cabinet-number" style={{ fontSize: '38px', color: 'var(--color-success)', display: 'block', margin: '8px 0' }}>
                ${harborAmount}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Network processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section (Visually matching dashboard stepper) */}
      <section id="how-it-works" style={{ 
        maxWidth: '1100px', 
        margin: '0 auto 100px', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            How Harbor Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
            Select a step below to reveal the transfer pipeline routing sequence.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
          {[1, 2, 3, 4].map((step) => (
            <button 
              key={step}
              onClick={() => setActiveStep(step)}
              className={`btn ${activeStep === step ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              Step {step}
            </button>
          ))}
        </div>

        {/* Step Description Card */}
        <div className="glass-panel" style={{ maxWidth: '680px', margin: '0 auto' }}>
          {activeStep === 1 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold-hover)', display: 'block', letterSpacing: '0.5px' }}>STEP 1</span>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 12px' }}>Payment Detected</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6' }}>
                Your client initiates a standard domestic wire or ACH transfer to your Harbor virtual bank account coordinates. The gateway immediately flags the incoming transfer event.
              </p>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold-hover)', display: 'block', letterSpacing: '0.5px' }}>STEP 2</span>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 12px' }}>USDC Minted</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6' }}>
                The fiat deposit is cleared and tokenized directly into USDC on the Stellar network (fully backed 1:1 in banking reserves), securing the dollar value instantly.
              </p>
            </div>
          )}
          {activeStep === 3 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold-hover)', display: 'block', letterSpacing: '0.5px' }}>STEP 3</span>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 12px' }}>Split Routing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6' }}>
                Harbor evaluates your profile allocation parameters, sweeping a chosen share into your savings vault and routing the rest to local cash-out channels.
              </p>
            </div>
          )}
          {activeStep === 4 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold-hover)', display: 'block', letterSpacing: '0.5px' }}>STEP 4</span>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 12px' }}>Paid Locally</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6' }}>
                Stellar anchors disperse the funds directly into your destination local bank account or e-wallet (GCash, OVO, etc.) in local currencies.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials section */}
      <section style={{ 
        maxWidth: '1100px', 
        margin: '0 auto 100px', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            Trusted by Remote Professionals
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
              "Before Harbor, I was losing close to $150 a month to bank conversion spreads. Now my clients pay me via simple wire and the funds arrive in my local wallet within minutes."
            </p>
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'block' }}>Maria Santos</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contract Engineer, Philippines</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
              "The ability to automatically split my salary—saving 25% in USDC while off-ramping the rest to my local bank—is amazing. Truly borderless banking."
            </p>
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'block' }}>Aditya Prabowo</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Designer, Indonesia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing comparison section */}
      <section id="pricing" style={{ 
        maxWidth: '900px', 
        margin: '0 auto 100px', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            Transparent Pricing
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
            We only make money when you save money. Compare our rates.
          </p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Service Provider</th>
                <th>Service Fee</th>
                <th>Exchange Markup</th>
                <th>Total Cost ($1k payout)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '700' }}>Legacy Wire Transfers</td>
                <td>$35.00</td>
                <td>2.5% avg</td>
                <td>$60.00</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>PayPal / Payoneer</td>
                <td>$2.00</td>
                <td>3.5% - 4.5%</td>
                <td>$42.00</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--color-gold-hover)' }}>Harbor (Stellar)</td>
                <td style={{ color: 'var(--color-gold-hover)' }}>0.15%</td>
                <td style={{ color: 'var(--color-gold-hover)' }}>0.00%</td>
                <td style={{ fontWeight: '700', color: 'var(--color-gold-hover)' }}>$1.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" style={{ 
        maxWidth: '780px', 
        margin: '0 auto 120px', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px 24px' }}>
              <button 
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: 'var(--text-primary)'
                }}
              >
                {faq.q}
                <span style={{ fontSize: '18px', color: 'var(--color-gold)' }}>
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              
              {activeFaq === idx && (
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '14px', 
                  marginTop: '12px', 
                  lineHeight: '1.6',
                  animation: 'slideDown 0.25s ease'
                }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '48px 24px', 
        borderTop: '1px solid var(--border-light)', 
        fontSize: '13px', 
        color: 'var(--text-secondary)',
        position: 'relative',
        zIndex: 10
      }}>
        <p>© 2026 Harbor Bank. All rights reserved. Powered by Stellar Soroban Network.</p>
      </footer>
      
    </div>
  );
}
