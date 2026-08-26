'use client';

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, ArrowRight, Radar } from 'lucide-react';
import { api } from '../lib/api';
import { CandidateWallet } from '../lib/types';

interface WalletSearchProps {
  onAnalyze: (address: string, maxHops: number) => void;
  isLoading: boolean;
}

export const WalletSearch: React.FC<WalletSearchProps> = ({ onAnalyze, isLoading }) => {
  const [address, setAddress] = useState('');
  const [maxHops, setMaxHops] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);
  const [dynamicCandidates, setDynamicCandidates] = useState<CandidateWallet[]>([]);

  useEffect(() => {
    // Load top discovered candidates dynamically from database
    const fetchTopCandidates = async () => {
      try {
        const res = await api.getCandidates({ limit: 6, min_score: 40, sort_by: 'quality' });
        if (res?.candidates && res.candidates.length > 0) {
          setDynamicCandidates(res.candidates);
        }
      } catch (err) {
        console.warn('Failed to load top candidates for search presets:', err);
      }
    };
    fetchTopCandidates();
  }, []);

  const detectedChain = address.startsWith('0x')
    ? 'Ethereum Mainnet'
    : address.startsWith('T')
    ? 'Tron Network (TRC-20)'
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = address.trim();
    if (!clean) {
      setError('Please input a valid target Ethereum (0x...) or Tron (T...) wallet address.');
      return;
    }

    const isEth = /^0x[0-9a-fA-F]{40}$/.test(clean);
    const isTron = /^T[1-9A-HJ-NP-za-km-z]{33}$/.test(clean);

    if (!isEth && !isTron) {
      setError('Invalid format: Target must be a 40-character Ethereum hex address (0x...) or 34-character Tron Base58 address (T...).');
      return;
    }

    onAnalyze(clean, maxHops);
  };

  const handleSelectPreset = (addr: string) => {
    setAddress(addr);
    setError(null);
  };

  return (
    <div className="bg-forensic-surface border border-forensic-border rounded shadow-sm text-xs transition-colors">
      <div className="px-4 py-2 border-b border-forensic-border bg-forensic-bg flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-forensic-textDim font-semibold">
          Target Wallet Acquisition & Depth Parameters
        </span>
        {detectedChain && (
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30">
            Detected: {detectedChain}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forensic-textDim">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter suspect target wallet address (0x... for ETH or T... for Tron TRC-20 USDT)"
              className="w-full pl-9 pr-3 py-2 bg-forensic-bg border border-forensic-border rounded text-forensic-text placeholder-forensic-textDim font-mono text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-forensic-surfaceRaised px-2 py-1.5 border border-forensic-border rounded">
              <span className="text-[10px] text-forensic-textMuted uppercase font-semibold">Depth:</span>
              <select
                value={maxHops}
                onChange={(e) => setMaxHops(Number(e.target.value))}
                className="bg-transparent text-forensic-text font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-forensic-surface text-forensic-text">1 Hop (Direct Interaction)</option>
                <option value={2} className="bg-forensic-surface text-forensic-text">2 Hops (Intermediary Layering)</option>
                <option value={3} className="bg-forensic-surface text-forensic-text">3 Hops (Full Audit Traversal)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Tracing...</span>
                </>
              ) : (
                <>
                  <span>Trace Target</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-mono text-xs p-2 bg-red-500/10 border border-red-500/20 rounded">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Real On-Chain Candidate Leads */}
        <div className="pt-2 border-t border-forensic-border space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-forensic-textDim uppercase font-mono">
            <span className="flex items-center space-x-1">
              <Radar className="h-3 w-3 text-blue-400" />
              <span>Auto-Discovered High-Quality Target Leads ({dynamicCandidates.length}):</span>
            </span>
            <span className="text-[9px] text-forensic-teal font-semibold">Real Blockchain Counterparties</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono">
            {dynamicCandidates.length > 0 ? (
              dynamicCandidates.map((cand, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(cand.address)}
                  className="p-2 text-left bg-forensic-bg hover:bg-forensic-surfaceRaised border border-forensic-border rounded transition-colors group flex flex-col justify-between space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-forensic-text group-hover:text-blue-400 transition-colors truncate max-w-[160px]">
                      {cand.address.slice(0, 8)}...{cand.address.slice(-6)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      Score: {cand.candidate_quality_score.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-forensic-textDim">
                    <span>{cand.chain.toUpperCase()} • {cand.transaction_count} Tx</span>
                    <span className="text-forensic-textMuted group-hover:text-forensic-text">
                      → {cand.discovery_vasp_name}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-3 text-[11px] text-forensic-textDim py-1 italic">
                Discovery pipeline populating candidates from VASP transaction history...
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
