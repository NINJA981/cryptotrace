# Data Sources & Provenance

## 1. Blockchain Data Acquisition
The engine integrates with real Ethereum blockchain data providers via standard explorer REST APIs:
- **Default Endpoint**: Etherscan API (`https://api.etherscan.io/api`) or compatible EVM indexers.
- **Acquired Data**:
  - Native ETH normal transactions (`module=account&action=txlist`)
  - ERC-20 token transfer events (`module=account&action=tokentx`)
  - Block heights, UTC timestamps, sender, recipient, gas usage, and execution status.

---

## 2. Curated VASP Seed Dataset
To avoid fabricated or hallucinated exchange associations, the seed registry (`data/vasp/vasp_addresses.csv`) contains only verified public addresses from authoritative sources:

| VASP Entity | Role / Type | Provenance Source | Verification Confidence |
|---|---|---|---|
| **Binance** | Hot Wallets (Binance 7, 14, 15, 16), Cold Storage | Etherscan Verified Labels, DefiLlama Proof of Reserves | VERIFIED |
| **Coinbase** | Hot Wallets 1, 2, 3, Coinbase Custody | Etherscan Public Labels, Nansen Entity Tags | VERIFIED |
| **Kraken** | Kraken 1, 2 Hot Wallets, Cold Reserve | Etherscan Verified Labels, Arkham Intelligence | VERIFIED |
| **OKX** | OKX Hot Wallet 1, 2, Deposit Collectors | DefiLlama Reserve Proofs, Arkham Verified | VERIFIED |
| **KuCoin** | KuCoin 5, 6 Hot Wallets | Etherscan Public Labels, DefiLlama Reserves | VERIFIED |
| **Bitfinex** | Bitfinex 1 Hot Wallet, Cold Storage 1 | Etherscan Public Labels | VERIFIED |
| **Gate.io** | Gate.io 1, 2 Hot & Deposit Collectors | Etherscan Public Labels, DefiLlama Reserves | VERIFIED |
| **HTX / Huobi** | HTX 1 Hot Wallet, Cold Storage | Etherscan Public Labels, Arkham Verified | VERIFIED |
| **Bybit** | Bybit Hot Wallets 1, 2 | DefiLlama Proof of Reserves | VERIFIED |

---

## 3. Provenance Integrity Rules
1. Every address label must link to a reputable public source.
2. The system maintains a strict distinction between **Verified/Publicly Identified** and **Inferred** entities.
3. If the blockchain API fails or returns no transactions, the system reports this clearly and never falls back to fake/mock responses.
