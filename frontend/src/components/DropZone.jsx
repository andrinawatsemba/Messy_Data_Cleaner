import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

export default function DropZone({ onFileSelect, isScanning }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndHandle = (file) => {
    setErrorMessage(null);
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
      setErrorMessage('Please upload an Excel file (.xlsx or .xls), this format is not supported.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-4 p-4 bg-caddy-light border border-caddy/30 rounded-xl flex items-center gap-3 text-caddy text-sm font-medium animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
          isDragOver
            ? 'border-spruce bg-spruce-light/40 scale-[1.01]'
            : 'border-cardborder hover:border-spray hover:bg-slate-50/50'
        } ${isScanning ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndHandle(e.target.files[0]);
            }
          }}
          accept=".xlsx, .xls"
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-spray-light text-spray flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            {isScanning ? (
              <div className="w-8 h-8 border-3 border-spray border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-lg font-bold text-ink">
            {isScanning ? 'Scanning spreadsheet...' : 'Drop your Excel file here or browse'}
          </h3>
          <p className="mt-1 text-sm text-muted">
            Supports Microsoft Excel workbooks (<code className="px-1.5 py-0.5 bg-slate-100 rounded text-ink font-mono text-xs">.xlsx</code>, <code className="px-1.5 py-0.5 bg-slate-100 rounded text-ink font-mono text-xs">.xls</code>)
          </p>
        </div>
      </div>
    </div>
  );
}
