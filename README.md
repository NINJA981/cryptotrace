# SIH Cryptocurrency Wallet-to-VASP Attribution Platform

> **Problem Statement**: Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs.

[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg)](https://nextjs.org)
[![Graph](https://img.shields.io/badge/Graph-Cytoscape.js%20%2B%20NetworkX-blue.svg)](https://networkx.org)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-336791.svg)](https://www.sqlalchemy.org)

---

## 📌 Executive Summary

This platform is a **working, deterministic blockchain intelligence engine** built for Smart India Hackathon (SIH). It traces Ethereum transaction flows up to **3 hops**, identifies the nearest **Virtual Asset Service Providers (VASPs)** using a curated registry of publicly verified exchange clusters, calculates explainable attribution scores, classifies structural risk indicators, and provides investigators with an interactive Cytoscape.js graph and legal dossier generator.

### 🛡️ Core Guarantees:
- **100% Real Blockchain Data**: Queries real Ethereum explorer APIs (Etherscan / compatible providers). No synthetic or mock data is ever presented as real analysis.
- **Explainable Attribution**: Attribution scores (0–100) are computed mathematically via a configurable heuristic weighting system (`attribution_config.yaml`). No fake AI/LLM hallucinations.
- **Curated VASP Provenance**: Seeded with verified addresses from Etherscan verified labels, DefiLlama reserve proofs, and Arkham verified entities.
- **Zero-Setup Local Run**: Defaults to SQLite for instant out-of-the-box local execution, while fully supporting PostgreSQL in production.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph UI ["Investigator UI (Next.js 14 + Tailwind + Cytoscape)"]
        Dashboard["Investigator Dashboard"]
        GraphUI["Interactive Cytoscape.js Graph Canvas"]
        EvidenceUI["Verifiable Audit Evidence Feed"]
        ReportUI["Dossier & Report Generator"]
    end

    subgraph Backend ["FastAPI Intelligence Backend"]
        API["REST API Router (/api/v1)"]
        Worker["Async Background Pipeline Worker"]
        Validator["Address Format & EIP-55 Validator"]
        Provider["EVM Blockchain Provider (Etherscan / Alchemy)"]
        GraphEngine["NetworkX 3-Hop Traversal Engine"]
        VASPMatcher["VASP Registry Matcher"]
        AttrEngine["Explainable Attribution Engine"]
        RiskEngine["On-Chain Risk Classifier"]
        EvidenceGen["Evidence Generator"]
        ReportGen["Markdown / PDF Dossier Generator"]
    end

    subgraph Data ["Data Layer"]
        DB[(Database: SQLite / PostgreSQL)]
        CSV["Curated VASP Seed Dataset (data/vasp/)"]
        YAML["Heuristic Config (attribution_config.yaml)"]
    end

    Dashboard -->|POST /analyze| API
    API --> Worker
    Worker --> Validator
    Validator --> Provider
    Provider -->|Real ETH / ERC-20 TXs| GraphEngine
    GraphEngine --> VASPMatcher
    VASPMatcher --> CSV
    VASPMatcher --> AttrEngine
    AttrEngine --> YAML
    AttrEngine --> EvidenceGen
    AttrEngine --> RiskEngine
    EvidenceGen --> DB
    RiskEngine --> DB
    Worker -->|Status Polling| Dashboard
    DB --> GraphUI
    EvidenceGen --> EvidenceUI
    ReportGen --> ReportUI
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Environment Setup
```bash
# Clone the repository and navigate to root
cd "sih retry"

# Copy example environment file
cp .env.example .env
```

*(Optional)* Add your free [Etherscan API Key](https://etherscan.io/apis) into `.env`:
```env
BLOCKCHAIN_API_KEY=your_api_key_here
BLOCKCHAIN_API_URL=https://api.etherscan.io/api
DATABASE_URL=sqlite+aiosqlite:///./crypto_trace.db
MAX_HOPS=3
```

---

### 2. Start the Backend API
```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Run FastAPI server
python -m uvicorn backend.app.main:app --port 8000 --reload
```
- API Swagger Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/v1/health`

---

### 3. Start the Investigator Frontend
```bash
cd frontend

# Install dependencies (already installed if performed earlier)
npm install

# Start Next.js dev server
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 🧪 Running Automated Tests
```bash
# Run unit & integration test suite
python -m pytest tests/ -v
```

---

## 📚 Technical Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md): Component breakdown & pipeline flow
- [DATA_SOURCES.md](docs/DATA_SOURCES.md): Provenance of blockchain data & VASP seed dataset
- [METHODOLOGY.md](docs/METHODOLOGY.md): Graph traversal algorithms, scoring equations, and risk heuristics
- [LIMITATIONS.md](docs/LIMITATIONS.md): Technical boundaries, non-claims, and future cross-chain roadmap
- [API.md](docs/API.md): API documentation with request/response schemas
