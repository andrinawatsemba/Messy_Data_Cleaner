import React from 'react';
import { Layers, Columns, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

export default function DiagnosticsPanel({ diagnostics, onReset }) {
  if (!diagnostics) return null;

  const {
    filename,
    sheet_name,
    total_rows,
    total_columns,
    missing_cells,
    missing_percentage,
    columns = []
  } = diagnostics;

  return (
    <div className="bg-white border border-cardborder rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-cardborder gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-spruce-light text-spruce rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">{filename}</h3>
            <p className="text-xs text-muted">
              Active Sheet: <span className="font-semibold text-ink">{sheet_name || 'Sheet1'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 border border-cardborder hover:bg-slate-50 rounded-lg transition-colors self-start sm:self-auto"
        >
          Change File
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-slate-50 border border-cardborder/60 rounded-xl">
          <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-spruce" />
            <span>Total Rows</span>
          </div>
          <div className="text-2xl font-extrabold text-ink">
            {total_rows?.toLocaleString() ?? 0}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-cardborder/60 rounded-xl">
          <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-1">
            <Columns className="w-4 h-4 text-spray" />
            <span>Columns</span>
          </div>
          <div className="text-2xl font-extrabold text-ink">
            {total_columns ?? 0}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-cardborder/60 rounded-xl">
          <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-sponge" />
            <span>Missing Cells</span>
          </div>
          <div className="text-2xl font-extrabold text-ink">
            {missing_cells?.toLocaleString() ?? 0}
            <span className="text-xs font-medium text-muted ml-2">
              ({missing_percentage ?? 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Column Tags */}
      {columns.length > 0 && (
        <div className="mt-6 pt-5 border-t border-cardborder/60">
          <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
            Identified Columns ({columns.length}):
          </h4>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {columns.map((col, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-md font-mono"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
