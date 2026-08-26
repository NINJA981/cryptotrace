# REST API Specification

Base URL: `http://localhost:8000/api/v1`

---

## 1. `POST /api/v1/analyze`
Starts an asynchronous 3-hop investigation pipeline for an Ethereum address.

### Request Body:
```json
{
  "wallet_address": "0x28C6c06298d514Db089934071355E5743bf21d60",
  "max_hops": 3
}
```

### Response (`200 OK`):
```json
{
  "analysis_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "wallet_address": "0x28c6c06298d514db089934071355e5743bf21d60",
  "status": "QUEUED",
  "started_at": "2026-08-25T22:00:00Z",
  "num_transactions": 0,
  "num_nodes": 1,
  "num_edges": 0
}
```

---

## 2. `GET /api/v1/analysis/{id}`
Polls current execution status and metrics.

### Status Enum:
- `QUEUED`
- `FETCHING_DATA`
- `BUILDING_GRAPH`
- `ANALYZING`
- `COMPLETED`
- `FAILED`

---

## 3. `GET /api/v1/analysis/{id}/graph`
Retrieves Cytoscape-formatted nodes and edges for visualization.

---

## 4. `GET /api/v1/analysis/{id}/attributions`
Retrieves ranked VASP attributions and score breakdown.

---

## 5. `GET /api/v1/analysis/{id}/evidence`
Retrieves auditable evidence items linking transactions and hops.

---

## 6. `GET /api/v1/analysis/{id}/report?format=markdown`
Generates full investigation dossier in JSON or GitHub Markdown format.

---

## 7. `GET /api/v1/vasps`
Returns the list of supported VASPs with verified address counts and source citations.
