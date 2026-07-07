'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Docs redesign specifications & helper constants
const COLORS = {
  bg: "#10181F",
  panel: "#16212B",
  panelAlt: "#131C24",
  border: "#28363F",
  textPrimary: "#E9EEF1",
  textSecondary: "#8CA2AC",
  textMuted: "#5E7079",
  brass: "#C08A4E",
  brassDim: "#8C6A45",
  teal: "#4FAE8A",
};

const FONTS = (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .harbor-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
    .harbor-body { font-family: 'IBM Plex Sans', sans-serif; }
    .harbor-mono { font-family: 'IBM Plex Mono', monospace; }
  `}} />
);

const NAV_SECTIONS = [
  {
    label: "Introduction",
    items: ["Abstract", "Problem Statement", "Solution Overview"],
  },
  {
    label: "Core Concepts",
    items: ["Technical Architecture", "Token / Asset Model"],
  },
  {
    label: "User Flows",
    items: ["Use Case Walkthroughs", "Market Landscape"],
  },
  {
    label: "Development",
    items: ["Roadmap", "Team"],
  },
  {
    label: "Security",
    items: ["Risks & Mitigations", "References & Links"],
  },
];

const SECTION_METADATA: Record<string, { subtitle: string; next: string | null }> = {
  "Abstract": { subtitle: "Section 01 — Introduction", next: "Problem Statement" },
  "Problem Statement": { subtitle: "Section 02 — Introduction", next: "Solution Overview" },
  "Solution Overview": { subtitle: "Section 03 — Introduction", next: "Technical Architecture" },
  "Technical Architecture": { subtitle: "Section 04 — Core Concepts", next: "Token / Asset Model" },
  "Token / Asset Model": { subtitle: "Section 05 — Core Concepts", next: "Use Case Walkthroughs" },
  "Use Case Walkthroughs": { subtitle: "Section 06 — User Flows", next: "Market Landscape" },
  "Market Landscape": { subtitle: "Section 07 — User Flows", next: "Roadmap" },
  "Roadmap": { subtitle: "Section 08 — Development", next: "Team" },
  "Team": { subtitle: "Section 09 — Development", next: "Risks & Mitigations" },
  "Risks & Mitigations": { subtitle: "Section 10 — Security", next: "References & Links" },
  "References & Links": { subtitle: "Section 11 — Security", next: null }
};

interface SidebarProps {
  active: string;
  onSelect: (item: string) => void;
}

function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside
      style={{ 
        width: '240px', 
        flexShrink: 0, 
        height: '100%', 
        overflowY: 'auto', 
        padding: '24px 20px', 
        background: COLORS.panel, 
        borderRight: `1px solid ${COLORS.border}` 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <div
          className="harbor-mono"
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '12px', 
            fontWeight: '600',
            background: COLORS.brass, 
            color: COLORS.bg 
          }}
        >
          H
        </div>
        <span
          className="harbor-display"
          style={{ color: COLORS.textPrimary, fontSize: '18px', fontWeight: '500', letterSpacing: '-0.3px' }}
        >
          Harbor
        </span>
      </div>

      <div
        className="harbor-mono"
        style={{ color: COLORS.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: "0.12em", marginBottom: '4px', fontWeight: '600' }}
      >
        TECHNICAL SPEC
      </div>
      <h1
        className="harbor-display"
        style={{ color: COLORS.textPrimary, fontSize: '24px', fontWeight: 500, marginBottom: '24px' }}
      >
        Documentation
      </h1>

      {NAV_SECTIONS.map((section) => (
        <div key={section.label} style={{ marginBottom: '20px' }}>
          <div
            className="harbor-mono"
            style={{ color: COLORS.textMuted, fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: "0.1em", marginBottom: '8px', fontWeight: '700' }}
          >
            {section.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {section.items.map((item) => {
              const isActive = item === active;
              return (
                <button
                  key={item}
                  onClick={() => onSelect(item)}
                  className="harbor-body"
                  style={{
                    textAlign: 'left',
                    fontSize: '13px',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
                    background: isActive ? "rgba(192,138,78,0.12)" : "transparent",
                    borderLeft: isActive
                      ? `2px solid ${COLORS.brass}`
                      : "2px solid transparent",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

function ManifestStamp() {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '16px 20px',
        borderRadius: '6px',
        border: `1px solid ${COLORS.brassDim}`,
        background: "rgba(192,138,78,0.06)",
        marginTop: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          className="harbor-mono"
          style={{ color: COLORS.brass, fontSize: '11px', textTransform: 'uppercase', letterSpacing: "0.1em" }}
        >
          Manifest — Total Friction
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span
          className="harbor-display"
          style={{ color: COLORS.textPrimary, fontSize: '36px', fontWeight: 500 }}
        >
          &lt;0.2%
        </span>
        <span className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '13.5px' }}>
          settlement cost, spot mid-market rate
        </span>
      </div>
      <p className="harbor-body" style={{ color: COLORS.textMuted, fontSize: '12px', marginTop: '4px', margin: 0, lineHeight: '1.5' }}>
        Routed through Stellar liquidity pools directly — no correspondent
        bank spread, no intermediary markup.
      </p>
    </div>
  );
}

interface ContentAreaProps {
  active: string;
  onSelect: (item: string) => void;
}

function ContentArea({ active, onSelect }: ContentAreaProps) {
  const meta = SECTION_METADATA[active] || { subtitle: "Section Overview", next: null };

  const renderContent = () => {
    switch (active) {
      case "Abstract":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Harbor is a Web3 payment infrastructure built on Stellar/Soroban that lets companies pay contractors across borders instantly, cheaply, and transparently.
            </p>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '24px' }}>
              It targets high-friction corridors — Philippines, Indonesia, Vietnam, and Nigeria — where existing rails (banks, legacy remittance apps, informal agents) impose slow settlement times, high fees, and poor visibility into transaction status. Harbor replaces this with a settlement layer built on Stellar's fast, low-cost network, giving employers and contractors a neobank-like experience without the correspondent-banking overhead.
            </p>
            <ManifestStamp />
          </>
        );
      
      case "Problem Statement":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Paying international contractors today is broken in predictable ways:
            </p>
            <ul className="harbor-body" style={{ paddingLeft: '20px', color: COLORS.textSecondary, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              <li><strong style={{ color: COLORS.textPrimary }}>Cost:</strong> Traditional wire transfers and remittance services often charge 3–8% per transaction once FX spread, intermediary bank fees, and payout fees are combined.</li>
              <li><strong style={{ color: COLORS.textPrimary }}>Speed:</strong> Cross-border payments frequently take 2–5 business days to settle, longer around bank holidays or when routed through multiple correspondent banks.</li>
              <li><strong style={{ color: COLORS.textPrimary }}>Opacity:</strong> Senders and recipients often can't see where a payment is in transit, leading to support overhead and lost trust.</li>
              <li><strong style={{ color: COLORS.textPrimary }}>Access:</strong> Contractors in emerging markets (Philippines, Indonesia, Vietnam, Nigeria) are frequently underserved by traditional banking rails, facing account restrictions or unfavorable conversion spreads.</li>
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', background: COLORS.panelAlt, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                <span className="harbor-display" style={{ fontWeight: '600', fontSize: '15px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>🇵🇭 Philippines (PHP)</span>
                <span className="harbor-body" style={{ fontSize: '12.5px', color: COLORS.textSecondary, lineHeight: '1.5' }}>High GCash/Maya reliance; legacy wires suffer heavy correspondent bank fees.</span>
              </div>
              <div style={{ padding: '16px', background: COLORS.panelAlt, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                <span className="harbor-display" style={{ fontWeight: '600', fontSize: '15px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>🇮🇩 Indonesia (IDR)</span>
                <span className="harbor-body" style={{ fontSize: '12.5px', color: COLORS.textSecondary, lineHeight: '1.5' }}>Fragmented e-wallet landscape (OVO, GoPay) requiring complex FX gateways.</span>
              </div>
              <div style={{ padding: '16px', background: COLORS.panelAlt, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                <span className="harbor-display" style={{ fontWeight: '600', fontSize: '15px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>🇻🇳 Vietnam (VND)</span>
                <span className="harbor-body" style={{ fontSize: '12.5px', color: COLORS.textSecondary, lineHeight: '1.5' }}>Capital controls and paperwork delay wire clearances by several days.</span>
              </div>
              <div style={{ padding: '16px', background: COLORS.panelAlt, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                <span className="harbor-display" style={{ fontWeight: '600', fontSize: '15px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>🇳🇬 Nigeria (NGN)</span>
                <span className="harbor-body" style={{ fontSize: '12.5px', color: COLORS.textSecondary, lineHeight: '1.5' }}>High inflation; extreme parallel market spreads and banking access issues.</span>
              </div>
            </div>
          </>
        );

      case "Solution Overview":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Harbor provides a single payment rail for global contractor payouts, built on Stellar/Soroban smart contracts. Employers fund a Harbor account once; contractors receive funds in their local corridor near-instantly.
            </p>
            <ul className="harbor-body" style={{ paddingLeft: '20px', color: COLORS.textSecondary, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', lineHeight: '1.6' }}>
              <li><strong style={{ color: COLORS.textPrimary }}>One integration, many corridors:</strong> Employers don't need separate relationships with local payment providers in each country.</li>
              <li><strong style={{ color: COLORS.textPrimary }}>Settlement in seconds:</strong> Leveraging Stellar's fast ~5 second transaction finality.</li>
              <li><strong style={{ color: COLORS.textPrimary }}>Transparent by default:</strong> Every payment is traceable on-chain, with readable status for both sides.</li>
              <li><strong style={{ color: COLORS.textPrimary }}>Low, predictable fees:</strong> A flat 0.15% transaction fee instead of FX-spread-based markups.</li>
            </ul>
          </>
        );

      case "Technical Architecture":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>3.1 Why Stellar/Soroban:</strong> Stellar was purpose-built for cross-border value transfer and has live anchor infrastructure (on/off-ramps) in target corridors. Soroban adds smart contract programmability to encode batch split calculations directly on-chain.
            </p>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>3.2 System Components:</strong> Payment contracts (Rust/Soroban validating sum limits), settlement layers (DEX routers), anchor integrations (local e-wallets), and application dashboards.
            </p>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '24px' }}>
              <strong>3.3 Custody & Security:</strong> Non-custodial signature model utilizing the Freighter wallet. Contractors retain full control over escrow accounts with zero administrative protocol override keys.
            </p>

            <span className="harbor-mono" style={{ fontSize: '10.5px', color: COLORS.brass, display: 'block', marginBottom: '6px', fontWeight: '700' }}>SUM RECONCILIATION METHOD</span>
            <pre style={{
              background: COLORS.panelAlt,
              padding: '16px',
              borderRadius: '6px',
              border: `1px solid ${COLORS.border}`,
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '11.5px',
              color: COLORS.textSecondary,
              lineHeight: '1.5'
            }}>
{`let mut calculated_total: i128 = 0;
for item in items.iter() {
    calculated_total = calculated_total.checked_add(item.amount)
        .ok_or(ContractError::MathOverflow)?;
}
if calculated_total != declared_total {
    return Err(ContractError::TotalMismatch);
}`}
            </pre>
          </>
        );

      case "Token / Asset Model":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Harbor does **not** introduce a native speculative token.
            </p>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8' }}>
              All settlements occur in fully-backed stablecoins (USDC/EURC) and Stellar's native utility asset (XLM) to avoid price volatility and ensure contractors retain the exact value of their invoices. Variable savings vaults deposit USDC directly into tokenized short-term US Treasury bills on Stellar, yielding 5.4% APY.
            </p>
          </>
        );

      case "Use Case Walkthroughs":
        return (
          <>
            <div className="harbor-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>1. Batch Payroll Payouts</strong>
                <span style={{ fontSize: '13px', color: COLORS.textSecondary, lineHeight: '1.6', display: 'block' }}>
                  A US employer sets up a monthly payroll batch. On payday, they approve the batch in a single Freighter signature transaction. The Soroban contract splits the batch and routes USDC to contractors in Nigeria, Vietnam, and the Philippines, settling within seconds.
                </span>
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>2. One-Off Contractor Transfers</strong>
                <span style={{ fontSize: '13px', color: COLORS.textSecondary, lineHeight: '1.6', display: 'block' }}>
                  For ad-hoc payout items, employers transfer directly to contractor addresses. The DEX router automatically performs path-payments to convert assets at mid-market spot rates.
                </span>
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: COLORS.textPrimary, display: 'block', marginBottom: '4px' }}>3. Contractor-Initiated Invoices</strong>
                <span style={{ fontSize: '13px', color: COLORS.textSecondary, lineHeight: '1.6', display: 'block' }}>
                  Freelancers generate invoice links (defining local bank cash-outs and split percentages). The client opens the link on their portal and settlements are batched and executed instantly.
                </span>
              </div>
            </div>
          </>
        );

      case "Market Landscape":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '24px' }}>
              The global remote contractor market represents over $150 billion in annual volume, with Southeast Asia and Africa being the fastest-growing remittance corridors.
            </p>
            
            <div style={{ overflowX: 'auto', borderRadius: '6px', border: `1px solid ${COLORS.border}`, background: COLORS.panelAlt }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>METRIC</th>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>TRADITIONAL WIRE</th>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>LEGACY REMITTANCE</th>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>HARBOR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Settlement</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>2 - 5 days</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>Hours - 1 day</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.teal, fontWeight: '700' }}>~5 seconds</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Typical Fee</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>3% - 8%</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>1% - 5%</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.teal, fontWeight: '700' }}>0.15% (flat)</td>
                  </tr>
                  <tr>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Transparency</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>Low</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>Medium</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.teal, fontWeight: '700' }}>High (on-chain)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );

      case "Roadmap":
        return (
          <>
            <div style={{ overflowX: 'auto', borderRadius: '6px', border: `1px solid ${COLORS.border}`, background: COLORS.panelAlt }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>PHASE</th>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>MILESTONE</th>
                    <th className="harbor-mono" style={{ padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: '700' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Phase 1</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>Core payment contract + Stellar settlement</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '12px', color: COLORS.teal, fontWeight: '700' }}>COMPLETED</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Phase 2</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>Anchor integrations (PH, ID, VN, NG)</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '12px', color: COLORS.teal, fontWeight: '700' }}>COMPLETED</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Phase 3</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>UI/UX polish, employer dashboard, contractor payout flow</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '12px', color: COLORS.brass, fontWeight: '700' }}>IN PROGRESS</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Phase 4</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>GrantFox OSS deliverables (Fee-sponsorship)</td>
                    <td className="harbor-mono" style={{ padding: '12px 16px', fontSize: '12px', color: COLORS.brass, fontWeight: '700' }}>ACTIVE</td>
                  </tr>
                  <tr>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textPrimary }}>Phase 5</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>Additional corridor expansion</td>
                    <td className="harbor-body" style={{ padding: '12px 16px', fontSize: '12px', color: COLORS.textMuted }}>PLANNED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );

      case "Team":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Harbor is developed by an experienced Web3 developer and FUTA Computer Science student.
            </p>
            <ul className="harbor-body" style={{ paddingLeft: '20px', color: COLORS.textSecondary, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', lineHeight: '1.6' }}>
              <li><strong style={{ color: COLORS.textPrimary }}>Tech Stack:</strong> Solidity, Rust/Soroban smart contracts, and React/TypeScript.</li>
              <li>
                <strong style={{ color: COLORS.textPrimary }}>Hackathon Track Record:</strong>
                <ul style={{ paddingLeft: '20px', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  <li>Morph Build In! Payments (FlowPay) — Winner</li>
                  <li>Agora Agents Hackathon — Winner</li>
                  <li>MetaMask Smart Accounts x 1Shot x Venice AI Dev Cook-Off — Winner</li>
                  <li>CDR Hackathon — Winner</li>
                </ul>
              </li>
              <li>
                <strong style={{ color: COLORS.textPrimary }}>Open-Source Portfolios:</strong>
                <span style={{ display: 'block', fontSize: '12.5px', color: COLORS.textMuted }}>Contributed to Soroban contracts and frontend portals (such as *Remitwise-Contracts* and *Credence-Frontend*).</span>
              </li>
            </ul>
          </>
        );

      case "Risks & Mitigations":
        return (
          <>
            <ul className="harbor-body" style={{ paddingLeft: '20px', color: COLORS.textSecondary, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: '1.6' }}>
              <li>
                <strong style={{ color: COLORS.textPrimary }}>Regulatory Risk:</strong> Cross-border rails touch complex money transfer rules.
                <span style={{ display: 'block', fontSize: '12.5px', color: COLORS.textMuted, marginTop: '2px' }}>➔ Mitigation: Partnering directly with licensed, regulated local anchors rather than transmitting funds.</span>
              </li>
              <li>
                <strong style={{ color: COLORS.textPrimary }}>Anchor/Liquidity Risk:</strong> Local cash-outs depend on anchor uptime and pool sizes.
                <span style={{ display: 'block', fontSize: '12.5px', color: COLORS.textMuted, marginTop: '2px' }}>➔ Mitigation: Integrating fallback anchor channels and redundant routes.</span>
              </li>
              <li>
                <strong style={{ color: COLORS.textPrimary }}>Adoption Risk:</strong> Freelancers fear complex Web3 interface operations.
                <span style={{ display: 'block', fontSize: '12.5px', color: COLORS.textMuted, marginTop: '2px' }}>➔ Mitigation: Transparent pricing, simple links, and gasless (Fee-bumped) setups to hide crypto mechanics.</span>
              </li>
              <li>
                <strong style={{ color: COLORS.textPrimary }}>Technical Risk:</strong> Contract bugs in payroll splitter math.
                <span style={{ display: 'block', fontSize: '12.5px', color: COLORS.textMuted, marginTop: '2px' }}>➔ Mitigation: Comprehensive on-chain sum verification tests and planned code audits.</span>
              </li>
            </ul>
          </>
        );

      case "References & Links":
        return (
          <>
            <p className="harbor-body" style={{ color: COLORS.textSecondary, fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Access Harbor technical specifications and setup guidelines:
            </p>
            <ul className="harbor-body" style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <a href="https://github.com/midexol/harbor" target="_blank" rel="noreferrer" style={{ color: COLORS.brass, textDecoration: 'none' }}>
                  GitHub Repository →
                </a>
              </li>
              <li>
                <a href="https://soroban.stellar.org/" target="_blank" rel="noreferrer" style={{ color: COLORS.brass, textDecoration: 'none' }}>
                  Stellar Soroban Documentation →
                </a>
              </li>
              <li>
                <a href="https://www.freighter.app/" target="_blank" rel="noreferrer" style={{ color: COLORS.brass, textDecoration: 'none' }}>
                  Freighter Wallet Portal →
                </a>
              </li>
            </ul>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '48px 40px' }}>
        <div
          className="harbor-mono"
          style={{ color: COLORS.brass, fontSize: '11px', textTransform: 'uppercase', letterSpacing: "0.12em", marginBottom: '12px', fontWeight: '700' }}
        >
          {meta.subtitle}
        </div>
        <h2
          className="harbor-display"
          style={{ color: COLORS.textPrimary, fontSize: '32px', fontWeight: 500, marginBottom: '24px' }}
        >
          {active}
        </h2>

        <div style={{ marginBottom: '40px' }}>
          {renderContent()}
        </div>

        {meta.next && (
          <div
            style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '24px', marginTop: '40px' }}
          >
            <div
              className="harbor-mono"
              style={{ color: COLORS.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: "0.15em", marginBottom: '8px', fontWeight: '600' }}
            >
              Next
            </div>
            <button 
              onClick={() => onSelect(meta.next!)}
              className="harbor-body" 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: COLORS.brass, 
                fontSize: '14px', 
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {meta.next} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HarborLanding() {
  // Animated Count-Up state for Fee Leakage comparison
  const [lossAmount, setLossAmount] = useState(0);
  const [harborAmount, setHarborAmount] = useState(0);
  
  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Active step reveal state
  const [activeStep, setActiveStep] = useState(1);

  // Active docs specification section state
  const [activeDoc, setActiveDoc] = useState("Abstract");

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
          <a href="#docs" style={{ fontSize: '13.5px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>Technical Spec</a>
          <a href="#faq" style={{ fontSize: '13.5px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>FAQ</a>
        </nav>

        <Link href="/auth" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          Enter Portal
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{ 
        maxWidth: '960px', 
        margin: '80px auto 48px', 
        textAlign: 'left', 
        padding: '80px 56px',
        position: 'relative',
        zIndex: 10,
        background: 'radial-gradient(circle at 85% 50%, rgba(232, 184, 75, 0.08) 0%, rgba(24, 40, 64, 0.0) 60%), var(--bg-panel)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        {/* Glow Mesh Ambient circle inside container */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(232, 184, 75, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'meshGlow 8s infinite ease-in-out'
        }}></div>

        {/* Animated SVG Route Line */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1000 400" 
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 2 }}
        >
          {/* Main Sweeping Route Path */}
          <path 
            d="M 300,320 L 160,110 C 260,130 360,200 465,280 C 560,290 660,250 730,100" 
            fill="none" 
            stroke="var(--color-gold)" 
            strokeWidth="2.5" 
            strokeOpacity="0.25"
            className="hero-svg-path"
          />
          {/* Branching Tail Path */}
          <path 
            d="M 465,280 L 650,300" 
            fill="none" 
            stroke="var(--color-gold)" 
            strokeWidth="2.5" 
            strokeOpacity="0.25"
            className="hero-svg-path"
          />
          {/* Staggered pulsing nodes precisely matching control points */}
          <circle cx="160" cy="110" r="5" fill="var(--color-gold)" className="hero-pulse-node" style={{ animationDelay: '0s' }} />
          <circle cx="300" cy="320" r="5" fill="var(--color-gold)" className="hero-pulse-node" style={{ animationDelay: '0.6s' }} />
          <circle cx="465" cy="280" r="5" fill="var(--color-gold)" className="hero-pulse-node" style={{ animationDelay: '1.2s' }} />
          <circle cx="650" cy="300" r="5" fill="var(--color-gold)" className="hero-pulse-node" style={{ animationDelay: '1.8s' }} />
          <circle cx="730" cy="100" r="5" fill="var(--color-gold)" className="hero-pulse-node" style={{ animationDelay: '2.4s' }} />
        </svg>

        {/* Content Overlay */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '580px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontWeight: '800', 
            fontSize: '44px', 
            lineHeight: '1.2', 
            color: 'var(--text-primary)', 
            letterSpacing: '-1.5px',
            marginBottom: '16px'
          }}>
            Stop losing remote earnings<br />
            to legacy bank markups.
          </h1>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '17px', 
            lineHeight: '1.5',
            fontFamily: 'var(--font-sans)',
            marginBottom: '32px'
          }}>
            Route USD wires into instant local payouts. Automatically route your salary onto Stellar USDC, and off-ramp instantly to local channels for near-zero fee leakage.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/auth" className="btn btn-action" style={{ padding: '12px 28px', fontSize: '13.5px' }}>
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Corridor Trust Bar */}
      <div style={{ 
        maxWidth: '780px', 
        margin: '0 auto 60px', 
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

      {/* 4-Step Process Section */}
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

      {/* Redesigned Interactive Technical Spec Explorer Section */}
      <section id="docs" style={{ 
        maxWidth: '1100px', 
        margin: '0 auto 100px', 
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            Technical Specification
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
            Explore our on-chain architecture, Soroban contracts, and security mitigations.
          </p>
        </div>

        <div
          style={{ 
            width: '100%', 
            display: 'flex', 
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bg, 
            minHeight: '600px',
            color: COLORS.textPrimary,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {FONTS}
          <Sidebar active={activeDoc} onSelect={setActiveDoc} />
          <ContentArea active={activeDoc} onSelect={setActiveDoc} />
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
