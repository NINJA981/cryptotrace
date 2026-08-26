import datetime
from typing import Dict, Any, List, Optional
from backend.app.schemas.analysis import (
    InvestigationReportSchema,
    AttributionSchema,
    EvidenceSchema,
    RiskAssessmentSchema
)


class ReportGenerator:
    """
    Generates standardized, court/investigation-ready intelligence reports
    with explicit analytical boundaries, provenance citations, and disclaimers.
    """

    @staticmethod
    def generate_report(
        case_id: str,
        wallet_address: str,
        attributions: List[AttributionSchema],
        evidence: List[EvidenceSchema],
        risk_assessment: Optional[RiskAssessmentSchema],
        summary_stats: Dict[str, Any],
        critical_txs: List[Dict[str, Any]]
    ) -> InvestigationReportSchema:
        top_attr = attributions[0] if attributions else None

        data_sources = [
            "Ethereum Mainnet Blockchain Explorer / JSON-RPC",
            "Curated VASP Cluster Registry (Etherscan Verified Labels, DefiLlama Proof of Reserves, Arkham Intelligence)",
            "NetworkX Graph Traversal & Heuristic Attribution Engine v1.0"
        ]

        methodology = (
            "The investigation engine executed a bounded 3-hop Breadth-First Search (BFS) starting "
            f"from target wallet {wallet_address}. All observed native ETH transactions and ERC-20 token transfers "
            "were extracted, normalized, and mapped into a directed multi-edge transaction graph. Identified nodes "
            "were cross-referenced against a curated registry of verified Virtual Asset Service Provider (VASP) "
            "addresses. Heuristic attribution scores were computed considering shortest path proximity, flow volume, "
            "interaction count, and velocity, governed by transparent configuration weights."
        )

        limitations = [
            "Analytical Inference: VASP attribution represents probabilistic graph proximity and observable fund flow associations; it does NOT constitute definitive legal proof of beneficial wallet ownership.",
            "Bounded Scope: Traversal is bounded to 3 hops and 150 local graph nodes to prevent state explosion; unobserved deeper paths may exist.",
            "Off-Chain Activities: Private internal exchange transfers, off-chain book balances, and zero-knowledge mixer internal transitions cannot be tracked on-chain.",
            "Public Explorer Latency: Blockchain transaction data reflects publicly indexed blocks up to the execution timestamp."
        ]

        disclaimer = (
            "DISCLAIMER: This automated cryptocurrency intelligence report is generated for preliminary investigatory "
            "and analytical research purposes. Attribution scores and risk indicators are derived from deterministic "
            "on-chain heuristics and publicly available entity tags. Investigators must verify all findings with "
            "official judicial subpoenas or Mutual Legal Assistance Treaty (MLAT) requests to relevant VASPs."
        )

        return InvestigationReportSchema(
            case_id=case_id,
            input_wallet=wallet_address,
            chain="Ethereum Mainnet",
            analysis_timestamp=datetime.datetime.utcnow(),
            data_sources=data_sources,
            summary_metrics=summary_stats,
            top_attribution=top_attr,
            all_attributions=attributions,
            key_evidence=evidence,
            risk_assessment=risk_assessment,
            critical_transactions=critical_txs,
            methodology_summary=methodology,
            limitations=limitations,
            legal_disclaimer=disclaimer
        )

    @staticmethod
    def format_as_markdown(report: InvestigationReportSchema) -> str:
        """Formats the report as clean GitHub Markdown for investigator export."""
        lines = [
            f"# CRYPTO ASSET INVESTIGATION DOSSIER",
            f"**Case / Analysis ID**: `{report.case_id}`",
            f"**Target Wallet**: `{report.input_wallet}`",
            f"**Network**: `{report.chain}`",
            f"**Date Generated**: `{report.analysis_timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}`",
            f"",
            f"---",
            f"",
            f"## 1. EXECUTIVE SUMMARY & ATTRIBUTION",
        ]

        if report.top_attribution:
            lines.extend([
                f"- **Likely Associated VASP**: **{report.top_attribution.vasp_name}**",
                f"- **Attribution Score**: **{report.top_attribution.score} / 100**",
                f"- **Evidence Strength**: **{report.top_attribution.evidence_strength}**",
                f"- **Summary**: {report.top_attribution.summary}",
            ])
        else:
            lines.append("- **Attribution Result**: No known VASP cluster identified within 3 hops of observable activity.")

        if report.risk_assessment:
            lines.extend([
                f"",
                f"## 2. RISK CLASSIFICATION",
                f"- **Overall Risk Level**: **{report.risk_assessment.risk_level}** (Score: {report.risk_assessment.score}/100)",
                f"- **Assessment**: {report.risk_assessment.explanation}",
                f"- **Observed Indicators**:"
            ])
            for ind in report.risk_assessment.indicators:
                lines.append(f"  - {ind}")

        lines.extend([
            f"",
            f"## 3. GRAPH & ACTIVITY METRICS",
            f"- **Transactions Analyzed**: {report.summary_metrics.get('total_edges', 0)}",
            f"- **Unique Counterparty Nodes**: {report.summary_metrics.get('total_nodes', 0)}",
            f"- **VASP Clusters Reached**: {report.summary_metrics.get('vasp_nodes_found', 0)}",
            f"- **Maximum Hop Traversed**: {report.summary_metrics.get('max_hop_reached', 0)}",
            f"",
            f"## 4. KEY AUDIT EVIDENCE",
        ])

        for i, ev in enumerate(report.key_evidence[:10], 1):
            lines.append(f"### Evidence #{i}: {ev.evidence_type} [{ev.strength}]")
            lines.append(f"- **Details**: {ev.explanation}")
            if ev.tx_hash:
                lines.append(f"- **Tx Hash**: `{ev.tx_hash}`")
            if ev.source_address:
                lines.append(f"- **Source**: `{ev.source_address}`")
            if ev.target_address:
                lines.append(f"- **Target**: `{ev.target_address}`")
            lines.append("")

        lines.extend([
            f"## 5. METHODOLOGY & PROVENANCE",
            report.methodology_summary,
            f"",
            f"## 6. ANALYTICAL LIMITATIONS",
        ])
        for lim in report.limitations:
            lines.append(f"- {lim}")

        lines.extend([
            f"",
            f"## 7. LEGAL & COMPLIANCE DISCLAIMER",
            report.legal_disclaimer
        ])

        return "\n".join(lines)
