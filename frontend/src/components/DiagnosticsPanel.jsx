import React from 'react';
import { Layers, Columns, AlertTriangle, FileSpreadsheet, RotateCcw } from 'lucide-react';

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
    <div className="bg-white border-2 border-cardborder rounded-3xl p-6 sm:p-8 shadow-md">
      {/* File Info Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-slate-100 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-spray-light text-spray rounded-2xl border border-spray/20 shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-ink">{filename}</h3>
              <span className="px-2 py-0.5 bg-spruce-light text-spruce text-xs font-bold rounded-md">
                Scanned ✓
              </span>
            </div>
            <p className="text-xs text-muted font-medium mt-0.5">
              Sheet: <span className="font-bold text-ink">{sheet_name || 'Sheet1'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-ink px-3.5 py-2 border-2 border-slate-200 hover:bg-slate-50 rounded-xl transition-all self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Upload Different File</span>
        </button>
      </div>

      {/* Colorful Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {/* Total Rows Card */}
        <div className="p-5 bg-gradient-to-br from-white to-spruce-light/30 border-2 border-spruce/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-spruce">
              Total Rows
            </span>
            <div className="p-2 bg-spruce-light rounded-xl text-spruce">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink">
            {total_rows?.toLocaleString() ?? 0}
          </div>
          <p className="text-xs text-muted mt-1 font-medium">Data entries found</p>
        </div>

        {/* Total Columns Card */}
        <div className="p-5 bg-gradient-to-br from-white to-spray-light/30 border-2 border-spray/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-spray">
              Columns
            </span>
            <div className="p-2 bg-spray-light rounded-xl text-spray">
              <Columns className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink">
            {total_columns ?? 0}
          </div>
          <p className="text-xs text-muted mt-1 font-medium">Fields detected</p>
        </div>

        {/* Missing Values Card */}
        <div className="p-5 bg-gradient-to-br from-white to-sponge-light/30 border-2 border-sponge/40 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-sponge">
              Missing Values
            </span>
            <div className="p-2 bg-sponge-light rounded-xl text-sponge">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-ink">
              {missing_cells?.toLocaleString() ?? 0}
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-sponge-light text-sponge rounded-md">
              {missing_percentage ?? 0}% null
            </span>
          </div>
          <p className="text-xs text-muted mt-1 font-medium">Empty cells to tidy up</p>
        </div>
      </div>

      {/* Column Tags */}
      {columns.length > 0 && (
        <div className="mt-6 pt-5 border-t-2 border-slate-100">
          <h4 className="text-xs font-black text-muted uppercase tracking-wider mb-3">
            Detected Columns ({columns.length}):
          </h4>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            {columns.map((col, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 bg-slate-50 border border-slate-200 text-ink font-semibold text-xs rounded-lg font-mono shadow-2xs"
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
