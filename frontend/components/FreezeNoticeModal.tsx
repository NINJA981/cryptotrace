'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Copy, Check, Printer, X, Mail, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface FreezeNoticeModalProps {
  analysisId: string;
  onClose?: () => void;
  isFullPageView?: boolean;
}

export const FreezeNoticeModal: React.FC<FreezeNoticeModalProps> = ({
  analysisId,
  onClose,
  isFullPageView = false,
}) => {
  const [officerName, setOfficerName] = useState('Inspector R. K. Sharma');
  const [policeStation, setPoliceStation] = useState('Cyber Crime Police Station, CID');
  const [crimeNumber, setCrimeNumber] = useState('NCRP/2026/CYBER-FIN/8842');

  const [noticeData, setNoticeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchNotice = async () => {
    if (!analysisId) return;
    try {
      setLoading(true);
      const data = await api.getFreezeNotice(analysisId, officerName, policeStation, crimeNumber);
      setNoticeData(data);
    } catch (err) {
      console.error('Failed to fetch freeze notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysisId) {
      fetchNotice();
    }
  }, [analysisId]);

  const handleCopy = () => {
    if (noticeData?.notice_markdown) {
      navigator.clipboard.writeText(noticeData.notice_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const content = (
    <div className={`print-document-container bg-forensic-surface border border-forensic-border rounded w-full flex flex-col font-mono text-xs overflow-hidden transition-colors ${
      isFullPageView ? 'shadow-sm' : 'max-w-4xl max-h-[92vh] shadow-2xl'
    }`}>
      {/* On-Screen Action Header (Hidden during Print) */}
      <div className="no-print p-4 border-b border-forensic-border flex items-center justify-between bg-forensic-bg">
        <div className="flex items-center space-x-2.5">
          <Scale className="h-4 w-4 text-forensic-rose" />
          <div>
            <h2 className="text-xs font-bold text-forensic-text uppercase tracking-wider">
              Section 91 CrPC / Section 94 BNSS Legal Asset Freeze Notice
            </h2>
            <p className="text-[10px] text-forensic-textDim font-sans">
              Statutory requisition for immediate asset freezing and beneficial KYC disclosure
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-forensic-surfaceRaised hover:bg-forensic-border border border-forensic-border text-forensic-text font-medium text-[11px]"
          >
            {copied ? <Check className="h-3 w-3 text-forensic-teal" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy Notice Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-semibold text-[11px] shadow-sm cursor-pointer"
          >
            <Printer className="h-3 w-3" />
            <span>Print Official Order</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-forensic-textDim hover:text-forensic-text hover:bg-forensic-surfaceRaised"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Input Parameters Bar (Hidden during Print) */}
      <div className="no-print p-3 bg-forensic-surfaceRaised border-b border-forensic-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-[10px] uppercase text-forensic-textDim font-semibold block mb-1">
            Investigating Officer
          </label>
          <input
            type="text"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            onBlur={fetchNotice}
            className="w-full bg-forensic-bg border border-forensic-border rounded px-2 py-1 text-forensic-text font-mono text-[11px]"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-forensic-textDim font-semibold block mb-1">
            Police Unit / Station
          </label>
          <input
            type="text"
            value={policeStation}
            onChange={(e) => setPoliceStation(e.target.value)}
            onBlur={fetchNotice}
            className="w-full bg-forensic-bg border border-forensic-border rounded px-2 py-1 text-forensic-text font-mono text-[11px]"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-forensic-textDim font-semibold block mb-1">
            NCRP Ack / Crime Reference
          </label>
          <input
            type="text"
            value={crimeNumber}
            onChange={(e) => setCrimeNumber(e.target.value)}
            onBlur={fetchNotice}
            className="w-full bg-forensic-bg border border-forensic-border rounded px-2 py-1 text-forensic-text font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Target VASP Direct Contact Bar (Hidden during Print) */}
      {noticeData && (
        <div className="no-print px-4 py-2 bg-forensic-bg border-b border-forensic-border flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-forensic-textDim uppercase text-[10px]">Target VASP:</span>
            <strong className="text-blue-500 font-bold">{noticeData.vasp_name}</strong>
          </div>
          <div className="flex items-center space-x-3 text-forensic-textMuted">
            <span className="flex items-center space-x-1">
              <Mail className="h-3 w-3 text-forensic-teal" />
              <span>{noticeData.compliance_email}</span>
            </span>
            <span>•</span>
            <span>{noticeData.ref_number}</span>
          </div>
        </div>
      )}

      {/* Official Legal Order Printable Content */}
      <div className={`print-content p-6 overflow-y-auto bg-forensic-bg font-mono text-[11px] text-forensic-text leading-relaxed ${
        isFullPageView ? 'min-h-[450px]' : 'flex-1'
      }`}>
        {!analysisId ? (
          <div className="flex items-center justify-center py-20 text-forensic-textDim text-center font-sans">
            <span>Please execute a wallet trace in the Target Workspace first to generate a Section 91 statutory requisition.</span>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20 text-forensic-textDim font-sans">
            <span>Generating formal statutory notice...</span>
          </div>
        ) : (
          noticeData?.notice_markdown
        )}
      </div>
    </div>
  );

  if (isFullPageView) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {content}
    </div>
  );
};
