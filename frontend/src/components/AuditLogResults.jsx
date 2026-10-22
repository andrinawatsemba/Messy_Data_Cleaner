import React from 'react';
import { CheckCircle2, ShieldCheck, Download, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';

export default function AuditLogResults({ results, onDownload, onReset }) {
  if (!results) return null;

  const {
    filename = 'cleaned_data.xlsx',
    original_rows = 0,
    original_cols = 0,
    new_rows = 0,
    new_cols = 0,
    what_changed = [],
    what_didnt_change = []
  } = results;

  return (
    <div className="bg-parchment-card border-2 border-spruce/30 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
      {/* Celebration & Before/After Overview */}
      <div className="p-6 bg-gradient-to-r from-parchment-light via-white to-parchment-light rounded-2xl border-2 border-warmborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-spruce text-white rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cleaned & Verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink">
            Your Spreadsheet Is Tidied!
          </h2>
          <p className="text-sm text-muted font-medium mt-1">
            Review the transparent change log below before taking your file.
          </p>
        </div>

        {/* Dimension comparison badge */}
        <div className="flex items-center gap-3 bg-parchment px-4 py-3 rounded-xl border-2 border-warmborder shadow-sm self-start sm:self-auto font-mono text-sm">
          <div className="text-center">
            <div className="text-xs text-muted font-sans font-bold uppercase">Before</div>
            <div className="font-bold text-slate-700">{original_rows}r × {original_cols}c</div>
          </div>
          <ArrowRight className="w-4 h-4 text-spruce flex-shrink-0" />
          <div className="text-center">
            <div className="text-xs text-spruce font-sans font-bold uppercase">Cleaned</div>
            <div className="font-black text-spruce">{new_rows}r × {new_cols}c</div>
          </div>
        </div>
      </div>

      {/* Trust Audit Log: Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Changed Column */}
        <div className="p-6 bg-parchment border-2 border-spruce/30 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-spruce/20">
            <div className="p-2 bg-spruce-light rounded-xl text-spruce">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-ink">What Changed ({what_changed.length})</h3>
              <p className="text-xs text-muted font-medium">Explicit modifications applied</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {what_changed.length > 0 ? (
              what_changed.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-ink font-medium">
                  <span className="text-spruce font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted italic">No changes were necessary; data was already clean.</li>
            )}
          </ul>
        </div>

        {/* What Didn't Change Column */}
        <div className="p-6 bg-parchment border-2 border-wood/30 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-wood/20">
            <div className="p-2 bg-wood-light rounded-xl text-wood">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-ink">What Didn't Change ({what_didnt_change.length})</h3>
              <p className="text-xs text-muted font-medium">Integrity safeguards maintained</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {what_didnt_change.length > 0 ? (
              what_didnt_change.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-ink font-medium">
                  <span className="text-wood font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted italic">All intended safety checks verified.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Bar: Download & Reset */}
      <div className="pt-4 border-t-2 border-warmborder/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 border-2 border-warmborder hover:border-warmborder-strong hover:bg-parchment-light text-ink font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <RotateCcw className="w-4 h-4 text-muted" />
          <span>Clean Another File</span>
        </button>

        <button
          onClick={onDownload}
          className="w-full sm:w-auto px-8 py-4 bg-spruce hover:bg-spruce-hover text-white font-black text-base rounded-2xl shadow-lg shadow-spruce/20 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99] group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download Cleaned Excel File (.xlsx)</span>
        </button>
      </div>
    </div>
  );
}
