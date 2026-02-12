# Crypto FIFO Tax Calculator (TaxTim Challenge)

## 1. Project Overview

This project is a SARS-compliant crypto tax calculator designed to help South African taxpayers calculate their crypto **Base Cost** and **Capital Gains / Losses** accurately and transparently.

The calculator applies the **multi-balance FIFO (First-In, First-Out)** method as required by SARS and clearly displays the calculations used for each transaction.

The goal is not only correctness, but **clarity and trust** — users must be able to see *how* each value was calculated.

---

## 2. Problem Statement

South African taxpayers are required to declare crypto disposals (sales and trades) to SARS. While guidance exists, there are no free tools that:

- Apply SARS FIFO rules accurately
- Handle crypto-to-crypto trades correctly
- Show detailed, step-by-step calculations
- Group results by South African tax year

This project solves that gap.

---

## 3. Key Concepts

### 3.1 Transactions

A transaction is a dated event involving a crypto asset.

Supported transaction types:
- **BUY**: Acquire crypto using South African Rands (ZAR)
- **SELL**: Dispose of crypto in exchange for ZAR
- **TRADE**: Dispose of one crypto to acquire another crypto

Transactions are always processed **in chronological order**.

---

### 3.2 Crypto Lots (Balances)

Crypto is not treated as a single balance.

Instead, each acquisition creates a **lot**, defined by:
- Amount
- Acquisition price (in ZAR)
- Acquisition date

Each currency maintains a FIFO queue of lots.

---

### 3.3 FIFO Disposal Rule

When crypto is disposed of (SELL or TRADE):

- The **oldest available lot** is used first
- Lots may be partially or fully consumed
- Disposal continues until the required amount is reached

---

## 4. Tax Events

### 4.1 Non-Tax Events
- BUY transactions do **not** trigger tax

### 4.2 Taxable Events
- SELL (crypto → ZAR)
- TRADE (crypto → crypto)

Capital Gain / Loss = Proceeds − FIFO Cost

---

## 5. Crypto-to-Crypto Trades

A TRADE is treated as:
1. SELL source crypto at market value (tax event)
2. BUY destination crypto at that same market value

---

## 6. Base Cost Calculation

Base Cost answers:
"What did my remaining crypto holdings cost me at tax year end?"

Calculated per currency at end of February each year.

---

## 7. Capital Gain / Loss Calculation

Capital gains and losses are:
- Calculated per transaction
- Grouped per tax year (1 March → end February)
- Summed per currency and in total

---

## 8. Transparency & Explainability

Users must be able to see:
- Which lots were used
- Partial disposals
- Cost vs proceeds
- Resulting gain or loss

---

## 9. Non-Goals

This project does NOT:
- Track live prices
- Act as a wallet
- File tax returns

---

## 10. Success Criteria

- Accurate FIFO calculations
- SARS-aligned results
- Clear, explainable outputs
- Demo-ready product
