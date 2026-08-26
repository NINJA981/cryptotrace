'use client';

import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, Printer, X, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface ReportModalProps {
  analysisId: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ analysisId, onClose }) => {
  const [reportText, setReportText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const data = await api.getAnalysisReport(analysisId, 'markdown');
        if ('report_markdown' in data) {
          setReportText(data.report_markdown);
        }
      } catch (err) {
        console.error('Failed to load dossier:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [analysisId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `case_dossier_${analysisId.slice(0, 8)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="print-document-container bg-forensic-surface border border-forensic-border rounded w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs transition-colors">
        {/* Header (Hidden in Print) */}
        <div className="no-print p-4 border-b border-forensic-border flex items-center justify-between bg-forensic-bg">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <div>
              <h2 className="text-xs font-bold text-forensic-text uppercase tracking-wider">
                Case Investigation Dossier & Audit Report
              </h2>
              <p className="text-[10px] text-forensic-textDim font-sans">
                Official forensic blockchain intelligence summary for legal proceedings
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-forensic-surfaceRaised hover:bg-forensic-border border border-forensic-border text-forensic-text font-medium text-[11px]"
            >
              {copied ? <Check className="h-3 w-3 text-forensic-teal" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-forensic-surfaceRaised hover:bg-forensic-border border border-forensic-border text-forensic-text font-medium text-[11px]"
            >
              <Download className="h-3 w-3 text-forensic-textMuted" />
              <span>Download MD</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white font-semibold text-[11px] cursor-pointer"
            >
              <Printer className="h-3 w-3" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-forensic-textDim hover:text-forensic-text hover:bg-forensic-surfaceRaised"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dossier Body Printable Content */}
        <div className="print-content p-6 overflow-y-auto flex-1 bg-forensic-bg font-mono text-[11px] text-forensic-text leading-relaxed">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-forensic-textDim font-sans">
              <span>Compiling case dossier...</span>
            </div>
          ) : (
            reportText
          )}
        </div>
      </div>
    </div>
  );
};
