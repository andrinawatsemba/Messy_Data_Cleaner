import React from 'react';
import { CheckCircle2, ShieldCheck, Download, RotateCcw, Sparkles, ArrowRight, Layers, Columns, AlertTriangle, Copy } from 'lucide-react';

function ExampleTable({ examples, type }) {
  if (!examples || examples.length === 0) return null;

  if (type === 'rows') {
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-warmborder/60 text-xs">
        <div className="px-3 py-1.5 bg-parchment-light text-muted font-bold uppercase tracking-wider">
          Example rows removed
        </div>
        {examples.map((ex, i) => (
          <div key={i} className="px-3 py-1.5 border-t border-warmborder/40 font-mono text-ink">
            Row {ex.row}: {Object.entries(ex.preview || {}).map(([k, v]) => `${k}="${v}"`).join(', ')}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'headers') {
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-warmborder/60 text-xs">
        <div className="grid grid-cols-2 px-3 py-1.5 bg-parchment-light text-muted font-bold uppercase tracking-wider">
          <span>Before</span><span>After</span>
        </div>
        {examples.map((ex, i) => (
          <div key={i} className="grid grid-cols-2 px-3 py-1.5 border-t border-warmborder/40 font-mono">
            <span className="text-caddy">{ex.old}</span>
            <span className="text-spruce">{ex.new}</span>
          </div>
        ))}
      </div>
    );
  }

  // Default: cell-level old→new
  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-warmborder/60 text-xs">
      <div className="grid grid-cols-3 px-3 py-1.5 bg-parchment-light text-muted font-bold uppercase tracking-wider">
        <span>Column</span><span>Before</span><span>After</span>
      </div>
      {examples.map((ex, i) => (
        <div key={i} className="grid grid-cols-3 px-3 py-1.5 border-t border-warmborder/40 font-mono">
          <span className="text-muted">{ex.col}</span>
          <span className="text-caddy truncate">{ex.old}</span>
          <span className="text-spruce truncate">{ex.new}</span>
        </div>
      ))}
    </div>
  );
}

export default function AuditLogResults({ results, onDownload, onReset }) {
  if (!results) return null;

  const {
    filename = 'cleaned_data.xlsx',
    original_rows = 0,
    original_cols = 0,
    new_rows = 0,
    new_cols = 0,
    duplicate_rows_removed = 0,
    empty_rows_removed = 0,
    empty_cols_removed = 0,
    missing_cells_before = 0,
    missing_cells_after = 0,
    what_changed = [],
    what_didnt_change = []
  } = results;

  const summaryStats = [
    { label: 'Rows In', value: original_rows.toLocaleString(), color: 'text-ink', icon: <Layers className="w-4 h-4" /> },
    { label: 'Duplicate Rows Removed', value: duplicate_rows_removed.toLocaleString(), color: 'text-caddy', icon: <Copy className="w-4 h-4" /> },
    { label: 'Empty Rows Removed', value: empty_rows_removed.toLocaleString(), color: 'text-sponge', icon: <Layers className="w-4 h-4" /> },
    { label: 'Empty Cols Removed', value: empty_cols_removed.toLocaleString(), color: 'text-sponge', icon: <Columns className="w-4 h-4" /> },
    { label: 'Missing Cells Remaining', value: missing_cells_after.toLocaleString(), color: 'text-sponge', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Rows Out', value: new_rows.toLocaleString(), color: 'text-spruce', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-parchment-card border-2 border-spruce/30 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-spruce text-white rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cleaned &amp; Verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink">Your Spreadsheet Is Tidied!</h2>
          <p className="text-sm text-muted font-medium mt-1">
            Review the full change log and before/after summary below.
          </p>
        </div>
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

      {/* Before/After Summary Bar */}
      <div className="p-5 bg-parchment border-2 border-warmborder rounded-2xl shadow-sm">
        <h3 className="text-sm font-black text-ink uppercase tracking-wider mb-4">Before / After Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {summaryStats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`${stat.color} opacity-60`}>{stat.icon}</div>
              <div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-muted font-semibold leading-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enriched Change Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* What Changed */}
        <div className="p-6 bg-parchment border-2 border-spruce/30 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-spruce/20">
            <div className="p-2 bg-spruce-light rounded-xl text-spruce">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-ink">What Changed ({what_changed.length} rules)</h3>
              <p className="text-xs text-muted font-medium">Each rule: cells affected + sample before→after values</p>
            </div>
          </div>

          <div className="space-y-4">
            {what_changed.length > 0 ? (
              what_changed.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-bold text-ink flex items-start gap-1.5">
                      <span className="text-spruce mt-0.5">•</span>
                      <span>{item.summary || item}</span>
                    </div>
                    {item.cells_changed != null && (
                      <span className="flex-shrink-0 text-[11px] font-black px-2 py-0.5 bg-spruce-light text-spruce rounded-md border border-spruce/20">
                        {item.cells_changed.toLocaleString()} cells
                      </span>
                    )}
                  </div>
                  {item.examples && <ExampleTable examples={item.examples} type={item.example_type} />}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted italic">No changes were necessary; data was already clean.</p>
            )}
          </div>
        </div>

        {/* What Didn't Change */}
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
            {what_didnt_change.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-ink font-medium">
                <span className="text-wood font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Bar */}
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
