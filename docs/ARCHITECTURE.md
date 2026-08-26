# Comprehensive Low-Level System Architecture
## SIH Virtual Asset Service Provider (VASP) Attribution & Blockchain Intelligence Platform

---

## 1. System Overview & Core Philosophy

The **SIH VASP Attribution Engine** is a specialized, multi-chain cryptocurrency intelligence system designed for cybercrime investigators, financial intelligence units (FIUs), and law enforcement agencies (LEAs). 

Its primary mission is to trace fund flows originating from suspect or illicit cryptocurrency wallets across **Ethereum (ETH / ERC-20)** and **Tron (TRX / TRC-20)** networks, determine probabilistic and deterministic links to custodial **Virtual Asset Service Providers (VASPs)** (e.g., Binance, WazirX, CoinDCX, Coinbase, Kraken, OKX, KuCoin), synthesize tamper-evident on-chain evidence, and generate legally actionable **Section 91 CrPC / Section 94 BNSS Asset Preservation & Freeze Notices**.

### Core Architectural Pillars
1. **Explainable Multi-Dimensional Heuristic Attribution**: Deterministic, weighted scoring that decomposes attribution into 5 auditable pillars (Graph Proximity, Flow Volume Proportion, Interaction Frequency, Behavioral Continuity, and Recency).
2. **Deterministic Bounded Graph Traversal**: Bounded 3-hop Breadth-First Search (BFS) with cycle suppression and VASP terminal pruning to prevent graph state explosion.
3. **Multi-Chain Native Data Pipelines**: Unified data extraction and normalization engine supporting both Ethereum Mainnet (via Etherscan JSON-RPC / REST APIs) and Tron Network (via TronGrid API / TRC-20 Transfer Events).
4. **O(1) In-Memory VASP Registry Indexing**: Curated dataset of verified exchange hot wallets, deposit sweep addresses, and cold vaults loaded into memory with compound hash table lookups.
5. **Court-Admissible Evidence Synthesis & Legal Notice Automation**: Automated linkage of every attribution claim to cryptographic transaction hashes, block numbers, and addresses, integrated with automated legal notice generation.

---

## 2. End-to-End Data Processing Pipeline Flow

```
                      ┌────────────────────────────────────────┐
                      │  Investigator Inputs Suspect Address   │
                      │   (Ethereum 0x... / Tron T...)         │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │    Address Validation & Normalization  │
                      │  - detect_blockchain()                 │
                      │  - is_valid_crypto_address()           │
                      │  - EIP-55 Checksum / Base58Check       │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │   Analysis Initialization & Worker     │
                      │  - UUID generated                      │
                      │  - DB Status: QUEUED                   │
                      │  - In-Memory Cache Initialized         │
                      │  - BackgroundTasks: run_pipeline()     │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │ Blockchain Provider Factory Resolution │
                      │  - Ethereum -> EtherscanProvider       │
                      │  - Tron     -> TronGridProvider        │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │      Bounded BFS Graph Traversal       │
                      │       (TransactionGraphBuilder)        │
                      │  - Max Hops: 3 (Configurable)          │
                      │  - Max Nodes: 150 (Explosion Guard)    │
                      │  - Max Tx / Node: 50                   │
                      │  - Rate-Limited & Retried API Calls    │
                      │  - VASP Terminal Pruning               │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │ O(1) VASP Cluster Matching (InMemory)  │
                      │  - Check (chain, address) & address    │
                      │  - Tag Nodes: KNOWN_VASP vs EXTERNAL   │
                      │  - Attach Confidence & Provenance Meta │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │  Heuristic Attribution Scoring Engine  │
                      │  - Proximity Score (w=0.35, Hop Decay) │
                      │  - Flow Volume Ratio (w=0.25)          │
                      │  - Interaction Count (w=0.20)          │
                      │  - Behavioral Pattern (w=0.10)         │
                      │  - Recency Score (w=0.10)              │
                      │  - Evidence Strength: HIGH/MED/LOW     │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │   Risk Classifier & Indicator Engine   │
                      │  - Multi-hop Layering Detection        │
                      │  - Counterparty Dispersion / Fan-out   │
                      │  - Rapid Pass-Through Velocity (<2h)   │
                      │  - Burst Transaction Density           │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │      Audit Evidence Synthesizer        │
                      │  - Entity Verification Proofs          │
                      │  - Graph Proximity Proofs              │
                      │  - Fund Flow Transaction Proofs        │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │  Dual Persistence & Result Dispatch    │
                      │  - In-Memory Fast Cache Update         │
                      │  - SQLAlchemy ORM Commit (Postgres/DB) │
                      │  - Status -> COMPLETED                 │
                      └──────────────────┬─────────────────────┘
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
       ┌───────────────────────────┐           ┌───────────────────────────┐
       │   Frontend Interactive    │           │    Automated Requisitions │
       │   Cytoscape Visualization │           │ - Section 91 CrPC Notice  │
       │ - Physics Graph Canvas    │           │ - Section 94 BNSS Order   │
       │ - Ranked Attribution Card │           │ - Investigation Dossier   │
       │ - Evidence Stream Audit   │           │ - VASP Compliance Emails  │
       └───────────────────────────┘           └───────────────────────────┘
```

---

## 3. Detailed Low-Level Module & Function Directory

```
backend/app/
├── core/
│   ├── address_validator.py       # Cryptographic address detection & checksumming
│   └── config.py                  # Global Pydantic environment configuration
├── models/
│   └── database.py                # SQLAlchemy ORM async database schema
├── schemas/
│   └── analysis.py                # Pydantic validation & JSON serialization schemas
├── services/
│   ├── blockchain/
│   │   ├── base.py                # Abstract Base Class for blockchain providers
│   │   ├── etherscan.py           # Ethereum Mainnet data fetcher & normalizer
│   │   ├── tron.py                # Tron Network data fetcher & normalizer
│   │   └── factory.py             # Provider runtime resolver factory
│   ├── vasp/
│   │   └── matcher.py             # In-memory O(1) VASP registry matching engine
│   ├── graph/
│   │   └── builder.py             # NetworkX MultiDiGraph BFS traversal & Cytoscape exporter
│   ├── attribution/
│   │   └── engine.py              # Multi-variable heuristic scoring engine
│   ├── evidence/
│   │   └── generator.py           # Concrete audit evidence synthesizer
│   ├── risk/
│   │   └── classifier.py          # Structural on-chain risk pattern classifier
│   └── reporting/
│       ├── generator.py           # Investigation dossier & markdown generator
│       └── legal_notice_generator.py # CrPC / BNSS legal freeze notice generator
├── workers/
│   └── analysis_worker.py         # Asynchronous pipeline coordinator & cache manager
├── api/
│   └── v1/
│       └── router.py              # FastAPI REST endpoints & request handlers
└── main.py                        # Application bootstrap, CORS, and lifecycle setup
```

---

## 4. Deep-Dive: Address Validation & Cryptographic Core (`core/address_validator.py`)

This module provides deterministic blockchain identification and cryptographic address validation before network requests are dispatched.

### Key Functions

#### `detect_blockchain(address: str) -> str`
- **Logic**: Inspects string prefixes.
  - If `address.startswith("0x")` and `len == 42` (hex chars): returns `"ethereum"`.
  - If `address.startswith("T")` and `len == 34` (Base58 chars): returns `"tron"`.
  - Otherwise returns `"unknown"`.

#### `is_valid_eth_address(address: str) -> bool`
- **Logic**: Validates against regex `^0x[a-fA-F0-9]{40}$`. If casing is mixed, it executes EIP-55 Keccak-256 checksum verification:
  $$\text{Keccak256}(\text{address}_{\text{lower}})$$
  Checks that uppercase characters correspond to nibbles $\ge 8$.

#### `is_valid_tron_address(address: str) -> bool`
- **Logic**: Checks that string starts with `'T'`, length is 34, characters belong to Base58 alphabet (`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`), and decodes the 25-byte payload verifying that the 4-byte double SHA-256 checksum matches the byte stream prefix `0x41`.

#### `normalize_address(address: str) -> str`
- **Logic**: For Ethereum, converts to lowercase string standard `0x...`. For Tron, preserves strict Base58Check format.

---

## 5. Deep-Dive: Blockchain Data Acquisition Layer (`services/blockchain/`)

### Abstract Provider Interface (`services/blockchain/base.py`)

All blockchain adapters implement `BlockchainProvider`:
```python
class BlockchainProvider(ABC):
    @abstractmethod
    async def get_address_activity(self, address: str, max_tx: int = 50) -> List[NormalizedTransaction]:
        pass
```

### Data Normalization Contract (`NormalizedTransaction`)
Regardless of chain differences, every transaction is transformed into a uniform schema:
- `tx_hash` (str): Cryptographic transaction hash.
- `chain` (str): `"ethereum"` or `"tron"`.
- `block_number` (int): On-chain block height.
- `timestamp` (datetime): UTC execution time.
- `from_address` (str): Normalized sender address.
- `to_address` (str): Normalized recipient address.
- `asset_type` (str): `"ETH"`, `"ERC20"`, `"TRX"`, `"TRC20"`.
- `token_address` (Optional[str]): Smart contract address for tokens.
- `token_symbol` (str): Asset ticker (e.g., `USDT`, `USDC`, `ETH`, `TRX`).
- `token_decimals` (int): Precision exponent (e.g., 6 or 18).
- `amount` (float): Human-readable decimal amount ($\text{raw\_value} / 10^{\text{decimals}}$).
- `gas_used` (Optional[int]): Computational units consumed.
- `is_error` (bool): Execution outcome flag (reverted vs successful).
- `hop` (int): Distance from root wallet in investigation graph.

---

### Ethereum Implementation (`services/blockchain/etherscan.py`)

Interacts with Etherscan v2 API endpoints with rate-limiting, exponential backoff, and pagination.

```
                  ┌─────────────────────────────────────┐
                  │ EtherscanProvider.get_address_activity │
                  └──────────────────┬──────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
       ┌─────────────────────────┐       ┌─────────────────────────┐
       │ get_native_transactions │       │   get_token_transfers   │
       │  (module=account,       │       │    (module=account,     │
       │   action=txlist)        │       │     action=tokentx)     │
       └────────────┬────────────┘       └────────────┬────────────┘
                    │                                 │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                       ┌───────────────────────────┐
                       │ asyncio.gather (Parallel) │
                       └─────────────┬─────────────┘
                                     │
                                     ▼
                       ┌───────────────────────────┐
                       │ Deduplication & Filtering │
                       │ - Exclude reverted (isErr)│
                       │ - Convert Wei -> ETH      │
                       │ - Convert Decimals -> ERC │
                       │ - Sort by Timestamp (Desc)│
                       └───────────────────────────┘
```

#### Core Functions in `EtherscanProvider`:
1. `_throttle()`: Uses an asynchronous `asyncio.Lock()` to enforce a minimum interval (`settings.RATE_LIMIT_DELAY_SECONDS` = 0.22s, or ~4.5 requests/sec) to avoid HTTP 429 rate limit errors on free/pro tier keys.
2. `_fetch_with_retry(params: Dict[str, Any]) -> Dict[str, Any]`:
   - Appends `apikey` and `chainid=1` (Mainnet).
   - Executes HTTP GET via `httpx.AsyncClient` with configurable timeout (15s).
   - Handles Etherscan response payload statuses:
     - `status == "1"`: Success.
     - `status == "0"` and `"No transactions found"`: Returns clean empty list `[]`.
     - `status == "0"` and `"Max rate limit reached"`: Calculates linear-exponential backoff ($1.5 \times \text{attempt}$ seconds) and retries up to 3 times.
     - `status == "0"` and `"Invalid API Key"`: Raises `PermissionError` for clear investigator diagnostics.
3. `_parse_native_tx(raw: Dict) -> Optional[NormalizedTransaction]`:
   - Filters out contract creation transactions where `to == ""`.
   - Computes amount: $\text{value\_wei} / 10^{18}$.
   - Sets `asset_type="ETH"`, `token_symbol="ETH"`.
4. `_parse_token_tx(raw: Dict) -> Optional[NormalizedTransaction]`:
   - Extracts contract address, symbol, and decimals.
   - Computes normalized value: $\text{raw\_value} / 10^{\text{tokenDecimal}}$.
   - Sets `asset_type="ERC20"`.
5. `get_address_activity(address, max_tx=50)`:
   - Dispatches parallel `asyncio.gather` for native ETH (`txlist`) and ERC-20 (`tokentx`).
   - Merges lists, filters reverted transfers, sorts chronologically descending, and caps output to `max_tx`.

---

### Tron Implementation (`services/blockchain/tron.py`)

Interacts with TronGrid REST APIs (`https://api.trongrid.io/v1/accounts/{address}/...`).

#### Core Functions in `TronGridProvider`:
1. `_fetch_with_retry(endpoint, params)`: Queries TronGrid with custom header `TRON-PRO-API-KEY`. Handles HTTP 429 backoff.
2. `get_native_transactions(address, limit=50)`: Queries `/v1/accounts/{address}/transactions`. Parses `TransferContract` and `TransferAssetContract` protobuf objects. Converts Sun to TRX ($1 \text{ TRX} = 1,000,000 \text{ Sun}$).
3. `get_trc20_transfers(address, limit=50)`: Queries `/v1/accounts/{address}/transactions/trc20`. Formats TRC-20 transfers (such as USDT TRC-20 contract `TR7NHqjekKQxGTCi8q8ZY4pL8otSzgjLj6`).
4. `get_address_activity(address, max_tx=50)`: Combines and merges TRX and TRC-20 transactions into the unified `NormalizedTransaction` structure.

---

## 6. Deep-Dive: VASP Registry & O(1) Matcher (`services/vasp/matcher.py`)

The platform maintains an authoritative dataset of Virtual Asset Service Providers (`data/vasp/vasp_addresses_master.csv`) spanning over 170+ verified exchange hot wallets, cold vaults, sweepers, and OTC desks across Binance, WazirX, CoinDCX, Coinbase, Kraken, OKX, KuCoin, Bitfinex, Huobi/HTX, and Bybit.

### In-Memory Hash Indexes
To guarantee sub-millisecond lookup during recursive graph construction, `VASPMatcher` loads CSV data on startup into three hash tables:

1. `_chain_address_map: Dict[Tuple[str, str], Dict[str, Any]]`:
   - Key: `("ethereum", "0x28c6c06298d514db089934071355e5743bf21d60")`
   - Value: Full metadata dictionary (VASP Name, address type, confidence, provenance source URL, verification date).
2. `_address_map: Dict[str, Dict[str, Any]]`:
   - Key: Normalized address string.
3. `_vasp_map: Dict[str, Dict[str, Any]]`:
   - Key: VASP Entity Name (e.g. `"Binance"`).
   - Value: Grouped list of all associated addresses for entity-level cluster aggregation.

### Key Methods:
- `load_seed_data() -> int`: Parses CSV, validates address formats, builds indices, and returns the total address count.
- `match_address(address: str, chain: Optional[str] = None) -> Optional[Dict[str, Any]]`: Performs an $O(1)$ dictionary lookup. Returns matching VASP entity information or `None`.
- `is_known_vasp(address: str) -> bool`: Fast boolean check for graph pruning.
- `get_stats() -> Dict[str, Any]`: Aggregates real-time metrics (counts by VASP, by blockchain, by address type like hot wallet vs cold storage, and verification status).

---

## 7. Deep-Dive: Bounded Graph Construction (`services/graph/builder.py`)

`TransactionGraphBuilder` builds a directed multigraph ($G = (V, E)$) where vertices $V$ represent crypto wallet addresses and directed edges $E$ represent individual on-chain transactions or token transfers.

### Graph Construction Parameters
- `max_hops`: Traversal depth limit (default: 3).
- `max_nodes`: Graph node explosion guard (default: 150 nodes).
- `max_tx_per_address`: Transaction breadth limit per node (default: 50).

### Graph Traversal Algorithm (Bounded BFS)

```python
queue = [(root_wallet, 0)]
visited = set()

while queue and len(graph.nodes) < max_nodes:
    current_address, current_hop = queue.pop(0)
    if current_address in visited: continue
    visited.add(current_address)
    
    if current_hop >= max_hops: continue
    
    # 1. Query Blockchain Provider
    txs = await provider.get_address_activity(current_address, max_tx=max_tx_per_address)
    
    # 2. Iterate Transactions
    for tx in txs:
        u = tx.from_address
        v = tx.to_address
        
        # Add nodes with roles (INPUT_WALLET, KNOWN_VASP, INTERMEDIARY_HOP_N)
        _add_node_to_graph(u, hop=current_hop + 1)
        _add_node_to_graph(v, hop=current_hop + 1)
        
        # Add directed edge with transaction hash and transfer amount
        graph.add_edge(u, v, key=edge_id, tx_hash=tx.tx_hash, amount=tx.amount, asset_symbol=tx.token_symbol)
        
        # Terminal VASP Pruning: Do NOT expand crawl queue past known exchange endpoints
        if not vasp_matcher.is_known_vasp(u): queue.append((u, current_hop + 1))
        if not vasp_matcher.is_known_vasp(v): queue.append((v, current_hop + 1))
```

### Critical Graph Safety Features:
1. **Cycle Suppression**: Visited address set prevents infinite loops in circular fund routing (A $\rightarrow$ B $\rightarrow$ C $\rightarrow$ A).
2. **Terminal VASP Pruning**: Once an address is matched as a `KNOWN_VASP` (e.g. Binance Hot Wallet 6), the engine stops expanding that branch. This prevents pulling in millions of unrelated transactions from centralized exchange pooling wallets.
3. **MultiDiGraph Representation**: Preserves multiple transactions between the same two addresses across different timestamps and tokens without overwriting edge data.

### Cytoscape JSON Export (`export_cytoscape_data()`)
Transforms internal `networkx.MultiDiGraph` into Cytoscape.js compatible JSON with per-node volumetric statistics (`total_inflow`, `total_outflow`, `tx_count`) and UI styling roles.

---

## 8. Deep-Dive: Heuristic Attribution Scoring Engine (`services/attribution/engine.py`)

The attribution engine evaluates all paths connecting the root suspect wallet to identified VASP address clusters in the transaction graph.

### The 5 Attribution Pillars & Mathematical Formulation

The total attribution score $S_{\text{total}} \in [0.0, 100.0]$ for a candidate VASP cluster is computed as:

$$S_{\text{total}} = \min\left(100.0, \; \sum_{i \in \{\text{prox}, \text{flow}, \text{freq}, \text{behav}, \text{rec}\}} w_i \cdot S_i \right)$$

Where the weights $\sum w_i = 1.0$ are loaded from `attribution_config.yaml`:
- $w_{\text{prox}} = 0.35$ (Graph Proximity)
- $w_{\text{flow}} = 0.25$ (Fund Flow Volume Ratio)
- $w_{\text{freq}} = 0.20$ (Interaction Frequency)
- $w_{\text{behav}} = 0.10$ (Behavioral Continuity)
- $w_{\text{rec}} = 0.10$ (Temporal Recency)

---

### Mathematical Definition of Each Component

#### 1. Graph Proximity Score ($S_{\text{prox}}$)
Measures the topological distance (shortest hop count $h_{\min}$) between the root wallet and any address in the VASP cluster:

$$S_{\text{prox}} = 100.0 \times \text{Decay}(h_{\min})$$

$$\text{Decay}(h) = \begin{cases} 
1.00 & \text{if } h = 1 \text{ (Direct deposit into VASP)} \\
0.60 & \text{if } h = 2 \text{ (1 intermediary intermediary)} \\
0.30 & \text{if } h = 3 \text{ (2 intermediary hops)} \\
0.20 & \text{if } h > 3 
\end{cases}$$

#### 2. Fund Flow Volume Ratio ($S_{\text{flow}}$)
Measures what proportion of the root wallet's total observed outflow reaches the destination VASP cluster:

$$S_{\text{flow}} = 100.0 \times \min\left(1.0, \; \frac{\sum_{e \in E_{\text{in}}(\text{VASP})} \text{Amount}(e)}{\text{Outflow}(\text{Root})}\right)$$

#### 3. Interaction Frequency Score ($S_{\text{freq}}$)
Reflects repeated transactional relationships:

$$S_{\text{freq}} = \min(100.0, \; N_{\text{interactions}} \times 10.0)$$
*(Where 10 or more observed transfers maximize the score at 100.0)*

#### 4. Behavioral Pattern Score ($S_{\text{behav}}$)
Measures path directness and structural continuity:

$$S_{\text{behav}} = \begin{cases} 
100.0 & \text{if } h_{\min} = 1 \\
70.0  & \text{if } h_{\min} = 2 \\
40.0  & \text{if } h_{\min} \ge 3 
\end{cases}$$

#### 5. Temporal Recency Score ($S_{\text{rec}}$)
Baseline score ($80.0$) indicating active on-chain interaction within the queried block window.

---

### Evidence Strength Classification Thresholds
- **HIGH Confidence**: $S_{\text{total}} \ge 75.0$
- **MEDIUM Confidence**: $45.0 \le S_{\text{total}} < 75.0$
- **LOW Confidence**: $S_{\text{total}} < 45.0$

---

## 9. Deep-Dive: Risk Classifier (`services/risk/classifier.py`)

The `RiskClassifier` analyzes topological and temporal patterns across the graph to detect money laundering typologies, peeling chains, and obfuscation.

### Risk Rules & Indicators

| Indicator Rule | Trigger Condition | Points Added |
| :--- | :--- | :--- |
| **Multi-hop Layering** | Max hop distance $\ge 3$ | $+40.0$ |
| **Intermediary Layering** | Max hop distance $== 2$ | $+20.0$ |
| **High Transaction Density** | Total graph edges $> 20$ | $+25.0$ |
| **Active Transaction Volume** | Total graph edges $> 8$ | $+10.0$ |
| **Counterparty Dispersion (Fan-Out)** | $\ge 3$ distinct intermediary addresses | $+25.0$ |
| **Rapid Pass-Through Velocity** | $\text{Span} < 2.0\text{ hours}$ and $\ge 4\text{ transfers}$ | $+25.0$ |

### Overall Risk Categorization:
- **HIGH RISK**: $\text{Risk Score} \ge 50.0$ or ($\text{Max Hop} \ge 3$ and $\ge 2$ active indicators).
- **MEDIUM RISK**: $25.0 \le \text{Risk Score} < 50.0$ or $\ge 1$ active indicator.
- **LOW RISK**: $\text{Risk Score} < 25.0$ (Direct, simple transfers with no layering indicators).

---

## 10. Deep-Dive: Evidence Synthesis & Legal Generation (`services/evidence/` & `services/reporting/`)

### Concrete Audit Evidence Generation (`EvidenceGenerator`)
For every identified VASP attribution, the system synthesizes 3 concrete evidence items:
1. **Entity Identification**: Asserts that target address $X$ matches verified VASP $Y$ with provenance source and confidence level.
2. **Graph Proximity**: Formulates path distance proofs from root wallet to destination VASP.
3. **Fund Flow Transfer Proof**: Cites exact transaction hashes, transfer amounts, token symbols, and timestamps.

### Legal Notice Generator (`LegalNoticeGenerator`)
Generates standardized Section 91 CrPC (Code of Criminal Procedure, 1973) and Section 94 BNSS (Bharatiya Nagarik Suraksha Sanhita, 2023) statutory asset preservation notices directed to VASP compliance desks.

#### Integrated VASP Compliance Contact Directory
The engine maps identified exchanges to designated law enforcement desks:
- **Binance**: `case-management@binance.com` | Law Enforcement Portal
- **WazirX (Zanmai Labs Pvt. Ltd.)**: `lawenforcement@wazirx.com` | FIU-IND Registered
- **CoinDCX (Neblio Technologies Pvt. Ltd.)**: `compliance@coindcx.com` | FIU-IND Registered
- **Coinbase (Coinbase Inc.)**: `lawenforcement@coinbase.com`
- **Kraken (Payward Inc.)**: `compliance@kraken.com`
- **OKX**: `compliance@okx.com`
- **KuCoin**: `lawenforcement@kucoin.com`

---

## 11. Deep-Dive: Asynchronous Pipeline Worker (`workers/analysis_worker.py`)

To handle slow blockchain network requests without blocking HTTP worker threads, `AnalysisWorker` runs asynchronously as a background task.

```
 [Client POST /analyze] ──> [DB: AnalysisRun QUEUED] ──> [BackgroundTasks: run_pipeline]
                                                                     │
                                                                     ▼
                                                          [DB: FETCHING_DATA]
                                                          [Memory: Cache Init]
                                                                     │
                                                                     ▼
                                                          [DB: BUILDING_GRAPH]
                                                          [GraphBuilder: BFS]
                                                                     │
                                                                     ▼
                                                          [DB: ANALYZING]
                                                          [Attribution + Risk]
                                                                     │
                                                                     ▼
                                                          [DB: COMPLETED]
                                                          [Commit TXs, Evidence]
                                                          [Memory: Cache Ready]
```

### Analysis Lifecycle States:
- `QUEUED`: Analysis ID registered in DB; task scheduled.
- `FETCHING_DATA`: Network requests initiated to blockchain explorers.
- `BUILDING_GRAPH`: Bounded BFS graph construction and VASP matching in progress.
- `ANALYZING`: Attribution scoring, risk indicators, and evidence synthesis running.
- `COMPLETED`: Pipeline completed; results committed to database and fast in-memory cache.
- `FAILED`: Exception caught; detailed error message recorded.

---

## 12. Complete REST API Specifications (`api/v1/router.py`)

| Method | Endpoint | Description | Query / Body Params | Response Model |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/analyze` | Initiates asynchronous 3-hop VASP analysis | `{"wallet_address": "0x...", "max_hops": 3}` | `AnalysisStatusResponse` |
| `GET` | `/api/v1/analysis/{id}` | Polls pipeline execution status and summary | `id: str` | `AnalysisStatusResponse` |
| `GET` | `/api/v1/analysis/{id}/graph` | Returns Cytoscape JSON nodes & edges | `id: str` | `GraphData` |
| `GET` | `/api/v1/analysis/{id}/attributions` | Returns ranked VASP attributions | `id: str` | `List[AttributionSchema]` |
| `GET` | `/api/v1/analysis/{id}/evidence` | Returns verifiable evidence items | `id: str` | `List[EvidenceSchema]` |
| `GET` | `/api/v1/analysis/{id}/transactions` | Returns normalized transaction list | `id: str` | `List[NormalizedTransaction]` |
| `GET` | `/api/v1/analysis/{id}/report` | Generates investigation dossier | `id: str, format: "json" \| "markdown"` | `InvestigationReportSchema` |
| `GET` | `/api/v1/analysis/{id}/freeze-notice` | Generates Section 91 CrPC / BNSS legal notice | `officer_name, police_station, crime_number` | `Dict[str, Any]` |
| `GET` | `/api/v1/ncrp/cases` | Returns sample cybercrime complaint cases | None | `List[Dict[str, Any]]` |
| `GET` | `/api/v1/vasps/stats` | Returns VASP registry metrics | None | `Dict[str, Any]` |
| `GET` | `/api/v1/vasps/addresses` | Returns paginated VASP address records | `query, chain, vasp_name, limit, offset` | `PaginatedVASPAddresses` |
| `GET` | `/api/v1/vasps` | Returns all supported VASPs and clusters | None | `List[VASPSchema]` |
| `GET` | `/api/v1/recent` | Returns recent investigation cases | None | `List[AnalysisStatusResponse]` |
| `GET` | `/api/v1/health` | Service health and indexed VASP count | None | `Dict[str, Any]` |

---

## 13. Data Models & Schemas

### SQLAlchemy Database Entities (`models/database.py`)
- `AnalysisRun`: Stores case UUID, target wallet, status, timestamps, and graph dimensions.
- `Transaction`: Normalized on-chain transaction records (hash, from, to, amount, token, gas, error status).
- `VASP`: Centralized exchange entities (name, category, compliance email, FIU status).
- `VASPAddress`: Verified exchange addresses with provenance URLs, address types (hot/cold), and confidence scores.
- `Attribution`: Computed attribution scores, ranks, evidence strength, and metric JSON breakdowns.
- `Evidence`: Audit trail items linking attributions to transactions, addresses, and hops.
- `RiskAssessment`: Risk level (`LOW`, `MEDIUM`, `HIGH`), numerical risk score, and detected indicator lists.

---

## 14. Frontend Presentation & Visualization Architecture (`frontend/`)

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Cytoscape.js**.

```
frontend/
├── app/
│   ├── layout.tsx                 # Root application wrapper & font injection
│   ├── page.tsx                   # Main investigation console & state manager
│   └── globals.css                # Custom scrollbars & glassmorphic styling
├── components/
│   ├── Navbar.tsx                 # Header with chain indicators & VASP explorer trigger
│   ├── WalletSearch.tsx           # Search input, chain auto-detection & quick-test pills
│   ├── LiveProgress.tsx           # Real-time animated pipeline stage tracker
│   ├── GraphCanvas.tsx            # Interactive physics-based Cytoscape.js graph canvas
│   ├── AttributionCard.tsx        # Ranked VASP attribution results & score breakdowns
│   ├── RiskCard.tsx               # Structural risk level badge & indicator alerts
│   ├── EvidenceFeed.tsx           # Tamper-evident transaction & proximity audit trail
│   ├── TransactionLedger.tsx      # Filterable on-chain transaction ledger table
│   ├── NCRPTriageView.tsx         # Bulk cybercrime complaint triage dashboard
│   ├── VASPRegistryModal.tsx      # Searchable directory of 170+ verified exchange clusters
│   ├── FreezeNoticeModal.tsx      # Section 91 CrPC / BNSS legal requisition editor & exporter
│   └── ReportModal.tsx            # Investigation dossier exporter (JSON & Markdown)
└── lib/
    ├── api.ts                     # Axios API client & REST endpoint bindings
    └── types.ts                   # TypeScript interfaces matching backend Pydantic schemas
```

### State Management & Interactive Capabilities
1. **Live Status Polling**: `LiveProgress` polls `/api/v1/analysis/{id}` every 1,500ms during `QUEUED`, `FETCHING_DATA`, `BUILDING_GRAPH`, and `ANALYZING` states, transitioning smoothly to results rendering upon `COMPLETED`.
2. **Graph Visualization (`GraphCanvas.tsx`)**:
   - Renders directional flow with edge arrows and transaction labels.
   - Node Color Scheme:
     - `INPUT_WALLET`: Amber `#f59e0b`
     - `KNOWN_VASP`: Emerald `#10b981`
     - `INTERMEDIARY_HOP_1`: Blue `#3b82f6`
     - `INTERMEDIARY_HOP_2`: Purple `#8b5cf6`
     - `INTERMEDIARY_HOP_3`: Indigo `#6366f1`
   - Physics Layout Options: Breadthfirst (hierarchical DAG), CoSE (compound spring embedder), and Concentric.
   - Interactive Node Drawer: Clicking any node slides open address statistics, inflow/outflow, and VASP tag verification data.
3. **NCRP Cyber Crime Triage (`NCRPTriageView.tsx`)**: Allows law enforcement officers to view incoming complaint streams, filter by loss amount, and trigger automated 1-click VASP attributions.
4. **Legal Notice Generation (`FreezeNoticeModal.tsx`)**: Pre-fills official Section 91 CrPC legal notices with verified transaction hashes, amounts, and destination VASP compliance emails with 1-click clipboard copy and PDF/text export.

---

## 15. Security, Robustness & Compliance

1. **Deterministic Reproducibility**: All scoring weights are configured in `attribution_config.yaml` with explicit math formulas; zero black-box "hallucinated" attributions.
2. **API Resiliency**: Thread-safe locks, token bucket rate limiting, and exponential retry backoff protect against explorer rate limiting.
3. **Data Provenance**: Every VASP address in the database contains source citations (e.g. Etherscan Verified Label, DefiLlama Proof of Reserves, Arkham Intelligence) and verification timestamps.
4. **EIP-55 & Base58 Checksum Verification**: Malformed or fraudulent wallet addresses are rejected at the API boundary prior to any network or database execution.

---

## 16. Machine Learning Candidate Attribution & Offline Evaluation Layer

> [!NOTE]
> **The ML model is an auxiliary ranking mechanism. The system's primary investigative evidence remains based on observable blockchain transactions, graph relationships and independently sourced VASP intelligence.**

The system includes a dedicated, modular tabular machine learning framework (`backend/app/ml/`):

1. **Structured Feature Extraction (`ml/features.py`)**: Generates 22 structured graph and flow metrics per candidate VASP pair without neural black-boxes (topological distance, path counts, flow ratios, burst density, and registry confidence).
2. **Zero-Leakage Wallet-Level Partitions (`ml/dataset.py`)**: Partitions genuine labelled records (1,595 addresses across 14 VASP entities) into 70% Train (1,109 wallets), 15% Validation (233 wallets), and 15% Held-Out Test (253 wallets).
3. **Pointwise Gradient Boosting Ranker (`ml/train.py` & `ml/inference.py`)**: Lightweight `GradientBoostingClassifier` with standardized feature preprocessing (`StandardScaler`) outputting learned association likelihoods and top feature contribution signals.
4. **Offline Evaluation Benchmark Suite (`ml/evaluate.py`)**: Runs tri-way comparative validation:
   - **Baseline 1 (Deterministic 5-Pillar Rule Engine)**: 100.0% Top-1 Accuracy, 100.0% Macro F1
   - **Baseline 2 (ML Model Alone)**: 100.0% Top-1 Accuracy, 100.0% Macro F1
   - **Baseline 3 (Hybrid Ensemble 0.70 Rule + 0.30 ML)**: 100.0% Top-1 Accuracy, +0.0% Lift over Baseline
5. **Deployment Gate & Diagnostic Exposure**: Because the deterministic baseline achieves 100.0% Top-1 accuracy on clean graph topologies, the ML layer is maintained in **"EXPERIMENTAL_EVALUATION_ONLY"** status and exposed via `GET /api/v1/ml/evaluation`, `GET /api/v1/ml/status`, and the UI **ML Evaluation** diagnostics modal, keeping the deterministic rule engine as the primary production attribution method.

