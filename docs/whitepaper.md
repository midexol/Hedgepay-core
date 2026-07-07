# Harbor: Cross-Border Contractor Payments on Stellar/Soroban
**Whitepaper — Draft v0.2**  
**Date:** July 2026  
**Status:** Drips Wave Submission Draft  

---

## Abstract

Harbor is a Web3 payment infrastructure built on Stellar/Soroban that lets companies pay contractors across borders instantly, cheaply, and transparently. It targets high-friction corridors — Philippines, Indonesia, Vietnam, and Nigeria — where existing rails (banks, legacy remittance apps, informal agents) impose slow settlement times, high fees, and poor visibility into transaction status. Harbor replaces this with a settlement layer built on Stellar's fast, low-cost network, giving employers and contractors a neobank-like experience without the correspondent-banking overhead.

---

## 1. Problem Statement

Paying international contractors today is broken in predictable ways:

*   **Cost.** Traditional wire transfers and remittance services often charge 3–8% per transaction once FX spread, intermediary bank fees, and payout fees are combined.
*   **Speed.** Cross-border payments frequently take 2–5 business days to settle, longer around bank holidays or when routed through multiple correspondent banks.
*   **Opacity.** Senders and recipients often can't see where a payment is in transit, leading to support overhead and lost trust.
*   **Access.** Contractors in emerging markets (Philippines, Indonesia, Vietnam, Nigeria) are frequently underserved by traditional banking rails, facing account restrictions, delayed local payout, or unfavorable FX conversion at the point of cash-out.

Companies hiring globally distributed contractor teams absorb this friction directly — in cost, in contractor churn caused by late or reduced payments, and in the operational overhead of reconciling multiple payment providers per region.

---

## 2. Solution Overview

Harbor provides a single payment rail for global contractor payouts, built on Stellar/Soroban smart contracts. Employers fund a Harbor account once; contractors receive funds in their local corridor near-instantly, with an option to hold value on-chain or cash out to local currency through integrated anchors.

Core principles:
*   **One integration, many corridors** — employers don't need separate relationships with providers in each country.
*   **Settlement in seconds, not days** — leveraging Stellar's ~5 second finality.
*   **Transparent by default** — every payment is traceable on-chain, with a readable status for both sides.
*   **Low, predictable fees** — a flat 0.15% routing fee instead of FX-spread-based pricing that scales with volume.

---

## 3. Technical Architecture

### 3.1 Why Stellar/Soroban
Stellar was purpose-built for cross-border value transfer and already has live anchor infrastructure (on/off-ramps) in many of Harbor's target corridors. Soroban adds smart contract programmability on top of that settlement layer, letting Harbor encode payment logic — batching, approvals, sub-ledgers — directly on-chain rather than relying on a centralized backend for critical logic.

### 3.2 System Components
*   **Payment Contracts (Soroban):** Written in Rust, handling payment initiation, on-chain sum verification of batch payouts, and status tracking.
*   **Settlement Layer (Stellar):** Moves value between employer and contractor-controlled addresses, and to/from anchors for local currency conversion.
*   **Anchor Integrations:** Regional on/off-ramp partners providing local currency payout in the Philippines, Indonesia, Vietnam, and Nigeria.
*   **Application Layer:** React/TypeScript frontend giving employers a dashboard for batch payments, and contractors a wallet-like interface for receiving and cashing out funds.

### 3.3 Custody & Security Model
Harbor operates on an entirely **non-custodial** model. All authorization parameters and payout execution require direct cryptographic signatures from the employer's wallet (integrated via the persistent Freighter browser extension). 

Contractors retain full sovereign ownership of their credentials. Yield-bearing savings vaults are built as isolated, user-owned escrows; no administrator keys or protocol parameters can halt or seize contractor funds.

### 3.4 Architecture Diagram
```
[Employer ACH/Wire] 
        │
        ▼ (Convert to stablecoin)
[Stellar Anchor Wallet] ──(USDC)──► [Harbor Batch Contract]
                                              │
                                              ▼ (Split & Verify Sums)
                                    [Stellar DEX Router]
                                              │
                                              ▼ (Spot Swap Route)
                                      [Contractor Wallet]
                                              │
                                       ┌──────┴──────┐
                                       ▼             ▼
                             [Yield Escrow]    [Local Anchor Cash-out]
                             (5.4% Variable)   (VND / NGN / PHP / IDR)
```

---

## 4. Use Case Walkthroughs

### 4.1 Batch Payroll Payouts
1. **Employer Configuration:** A corporate employer funds their account and sets up a monthly payroll allocation.
2. **One-Click Settlement:** On payday, the employer opens the dashboard, reviews the batch list, and executes the payroll batch in a single Freighter signature transaction.
3. **Soroban Routing:** Harbor's smart contract validates the total sum on-chain and splits the funds, routing USDC to contractors in Nigeria, Vietnam, and the Philippines.
4. **On-Chain Delivery:** Contractors receive tokens in seconds.

### 4.2 One-Off Contractor Transfers
For ad-hoc service items, contractors can receive direct non-custodial payouts. The employer specifies the public address, target asset, and sends the transfer. The spot routing layer swaps USDC to native assets at mid-market rates instantly.

### 4.3 Contractor-Initiated Invoices
1. **Invoice Request:** A freelancer generates a billing coordinate request link (defining local corridor off-ramps and splits).
2. **Employer Review:** The employer opens the payment link on their dashboard client settlement queue.
3. **Instant Settle:** The employer clicks "Batch Settle" to pull the invoice into execution, completing the transfer instantly.

---

## 5. Market Landscape

The global remote contractor market represents over $150 billion in annual volume, with Southeast Asia and Africa being the fastest-growing remittance corridors.

### Competitive Matrix

| Feature | Traditional Bank/Wire | Legacy Remittance App | Harbor |
| :--- | :--- | :--- | :--- |
| **Settlement Time** | 2–5 days | Hours – 1 day | Seconds (~5s) |
| **Typical Fee** | 3–8% | 1–5% | 0.15% (flat) |
| **Transparency** | Low | Medium | High (on-chain) |
| **Corridor Coverage** | Broad but slow | Corridor-specific | PH, ID, VN, NG (expanding) |

---

## 6. Token / Asset Model

Harbor does **not** introduce a native speculative token. All settlements occur using fully-backed stablecoins (USDC/EURC) and Stellar's native utility asset (XLM) to avoid price volatility and ensure contractors retain the exact value of their invoices.

---

## 7. Roadmap

| Phase | Milestone | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core payment contract + Stellar settlement | **[COMPLETED]** |
| **Phase 2** | Anchor integrations (PH, ID, VN, NG) | **[COMPLETED]** |
| **Phase 3** | UI/UX polish, employer dashboard, contractor payout flow | **[IN PROGRESS]** |
| **Phase 4** | GrantFox OSS milestone deliverables (Fee-sponsorship integration) | **[ACTIVE]** |
| **Phase 5** | Additional corridor expansion | **[PLANNED]** |

---

## 8. Team

Harbor is developed by an experienced Web3 developer and FUTA Computer Science student. Key background details:
*   **Web3 Expertise:** Smart contract development across Solidity and Rust/Soroban, and React/TypeScript frontend engineering.
*   **Hackathon Track Record:**
    *   *Morph Build In! Payments* (FlowPay) — Winner
    *   *Agora Agents Hackathon* — Winner
    *   *MetaMask Smart Accounts x 1Shot x Venice AI Dev Cook-Off* — Winner
    *   *CDR Hackathon* — Winner
*   **Open-Source Contributions:** Actively contributing to Soroban and React projects, including `Remitwise-Contracts` and `Credence-Frontend`.

---

## 9. Risks & Mitigations

*   **Regulatory Risk:** Cross-border payment infrastructure touches complex money transmission regulations.  
    *   *Mitigation:* Harbor partners directly with licensed, regulated Stellar anchors rather than acting as a direct money transmitter.
*   **Anchor/Liquidity Risk:** Local currency cash-out relies on third-party anchor pool liquidity.  
    *   *Mitigation:* Integrating fallback anchor nodes and multiple partner channels per corridor where feasible.
*   **Adoption Risk:** End-users are hesitant to adopt Web3 tools due to complexity.  
    *   *Mitigation:* Hiding blockchain parameters behind invoice links, domestic banking coordinates, and gasless transactions.
*   **Technical Risk:** Smart contract vulnerabilities in payroll splitter logic.  
    *   *Mitigation:* Implementing comprehensive test coverages, sum validation checks, and planning security audits prior to mainnet launch.

---

## 10. References & Links

*   **GitHub Repository:** [https://github.com/midexol/harbor](https://github.com/midexol/harbor)
*   **Live Demo Portal:** [http://localhost:3000/](http://localhost:3000/)
*   **Framer & Spec Guide:** [CONTRIBUTING.md](file:///c:/Users/olamide/Desktop/Hedgepay/CONTRIBUTING.md)
