# CRYPTOTRACE: Multi-Chain Cryptocurrency VASP Attribution & Forensic Intelligence Platform

> **Smart India Hackathon (SIH)**: Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Multi-Chain Blockchain Intelligence APIs.

[![Frontend](https://img.shields.io/badge/Frontend-Vercel%20Live-black.svg?style=flat&logo=vercel)](https://cryptotrace-sand.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render%20Live-46E3B7.svg?style=flat&logo=render)](https://cryptotrace-backend.onrender.com/api/v1/health)
[![GitHub](https://img.shields.io/badge/GitHub-NINJA981%2Fcryptotrace-181717.svg?style=flat&logo=github)](https://github.com/NINJA981/cryptotrace)
[![Framework](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-000000.svg?logo=next.js)](https://nextjs.org)

---

## 🌐 Live Deployments

- 🖥️ **Live Workstation & Landing Page**: **[https://cryptotrace-sand.vercel.app](https://cryptotrace-sand.vercel.app)**
- ⚙️ **Production REST API**: **[https://cryptotrace-backend.onrender.com/api/v1](https://cryptotrace-backend.onrender.com/api/v1)**
- 📊 **Health Check & Diagnostics**: **[`/api/v1/health`](https://cryptotrace-backend.onrender.com/api/v1/health)** *(1,595+ verified VASP clusters indexed)*

---

## 📌 Executive Summary & Capabilities

**CRYPTOTRACE** is an institutional multi-chain cryptocurrency forensic intelligence platform designed for law enforcement agencies (LEAs), cybercrime investigation cells, and Financial Intelligence Units (FIUs). 

It traces fund flows originating from suspect cryptocurrency wallets across **Ethereum (ETH / ERC-20)** and **Tron (TRX / TRC-20 USDT)** networks, determines probabilistic and deterministic associations to custodial **Virtual Asset Service Providers (VASPs)**, evaluates topological risks, and automates **Section 91 CrPC / Section 94 BNSS Asset Preservation & Freeze Notices**.

### 🛡️ Core Capabilities:
1. **Multi-Chain Deep Tracing**: Native support for Ethereum (Etherscan v2 API) and Tron Network (TronGrid Pro API Key with TRC-20 USDT parsing).
2. **Automated Unknown Candidate Discovery & Quality Ranking**: Mined directly from verified VASP cluster counterparties without hardcoded demo addresses, scored via a 5-factor quality formulation ($0 - 100$).
3. **Deterministic 5-Pillar Attribution Scoring**: Explainable mathematical attribution ($S_{\text{prox}}, S_{\text{flow}}, S_{\text{freq}}, S_{\text{behav}}, S_{\text{rec}}$) with zero hallucination.
4. **Interactive Graph Studio**: Physics-based Cytoscape.js canvas with directional volumetric flow, node role classification, and address drawers.
5. **Court-Admissible Legal Notice Generator**: Pre-populates official Section 91 CrPC / Section 94 BNSS freeze notices with verified cryptographic hashes and compliance emails.
6. **National Cyber Crime (NCRP) Triage**: Bulk incident intake queue with loss triage prioritization and 1-click attribution launching.

---

## 🏗️ Project Structure

```
cryptotrace/
├── .env.example                   # Environment configuration template
├── .gitignore                     # Secrets and build cache exclusions
├── docker-compose.yml             # Containerized multi-service orchestration
├── render.yaml                    # Infrastructure-as-code blueprint for Render
├── package.json                   # Root workspace scripts
├── landing_page.html              # High-impact landing page asset
│
├── backend/
│   ├── Dockerfile                 # Python 3.11 production container
│   ├── requirements.txt           # Backend dependencies
│   ├── attribution_config.yaml    # Configurable scoring weights & thresholds
│   ├── scripts/
│   │   ├── benchmark_accuracy.py  # Offline validation benchmark suite
│   │   └── run_candidate_discovery.py # Script to sweep VASP seeds & discover candidates
│   └── app/
│       ├── core/                  # Address validation & Pydantic settings
│       ├── models/                # SQLAlchemy database models (AnalysisRun, CandidateWallet, etc.)
│       ├── schemas/               # Pydantic validation & response DTOs
│       ├── services/
│       │   ├── blockchain/        # EtherscanProvider, TronProvider, BlockchainProviderFactory
│       │   ├── vasp/              # In-memory O(1) VASP registry matcher
│       │   ├── graph/             # NetworkX MultiDiGraph traversal & Cytoscape exporter
│       │   ├── attribution/       # 5-pillar heuristic scoring & risk classifier
│       │   ├── discovery/         # Candidate miner & 5-factor quality scorer
│       │   └── reporting/         # Section 91 CrPC notice & dossier generator
│       ├── workers/               # AnalysisWorker, CandidateDiscoveryWorker, IngestionWorker
│       └── api/v1/router.py       # FastAPI REST endpoints
│
├── frontend/
│   ├── Dockerfile                 # Node 20 Alpine production container
│   ├── vercel.json                # Vercel deployment configuration
│   ├── package.json               # Next.js 14, Tailwind, Cytoscape dependencies
│   ├── app/                       # Next.js App Router (Landing `/`, Workstation `/app`)
│   ├── components/                # Modular UI components (Canvas, Candidate Discovery, NCRP, Legal)
│   └── lib/                       # Typed API client (`api.ts`) & data models (`types.ts`)
│
├── data/
│   ├── vasp/                      # 1,595+ verified VASP master registry (Binance, OKX, CoinDCX, etc.)
│   └── ppt_assets/                # Visual assets and presentation diagrams
│
└── docs/
    ├── ARCHITECTURE.md            # Low-level architectural specification
    ├── API.md                     # Complete REST API reference
    ├── DATA_SOURCES.md            # Data provenance & verification sources
    ├── DEPLOYMENT.md              # Production deployment guide
    ├── METHODOLOGY.md             # Forensic mathematical scoring formulas
    ├── MODEL_CARD.md              # Model card for auxiliary ML ranker
    ├── LIMITATIONS.md             # Technical and operational boundaries
    └── VASP_REGISTRY.md           # VASP curation & verification methodology
```

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Clone & Configure
```bash
git clone https://github.com/NINJA981/cryptotrace.git
cd cryptotrace
cp .env.example .env
```

Add your API Keys in `.env`:
```env
BLOCKCHAIN_API_KEY=your_etherscan_key
BLOCKCHAIN_API_URL=https://api.etherscan.io/v2/api
TRONGRID_API_KEY=66e9b9ff-d1b8-41a2-8f0d-2d9b555bc17a
DATABASE_URL=sqlite+aiosqlite:///./crypto_trace.db
MAX_HOPS=3
```

### 2. Start Backend API
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --port 8000 --reload
```

### 3. Start Frontend UI
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:3000`** in your browser!

---

## 🐳 Docker Deployment

To launch the complete multi-chain platform with Docker Compose:
```bash
docker-compose up -d --build
```
- **Frontend Console**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/api/v1`

---

## 📚 Forensic & Architectural Documentation

- [Low-Level System Architecture](docs/ARCHITECTURE.md)
- [REST API Reference](docs/API.md)
- [Data Sources & Provenance](docs/DATA_SOURCES.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Mathematical Attribution Methodology](docs/METHODOLOGY.md)
- [VASP Registry Curation Methodology](docs/VASP_REGISTRY.md)
