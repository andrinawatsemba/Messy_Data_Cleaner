import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle } from 'lucide-react';

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
        <div className="mb-4 p-4 bg-caddy-light border-2 border-caddy/30 rounded-2xl flex items-center gap-3 text-caddy text-sm font-semibold shadow-sm animate-fadeIn">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-3 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 shadow-md ${
          isDragOver
            ? 'border-spruce bg-spruce-light/50 scale-[1.02] shadow-lg'
            : 'border-warmborder-strong bg-parchment-card hover:border-spruce hover:shadow-lg hover:bg-parchment-light/80'
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
          {/* Big, Warm Study Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-wood-light text-wood flex items-center justify-center mb-5 border-2 border-warmborder shadow-inner group-hover:scale-110 transition-transform">
            {isScanning ? (
              <div className="w-10 h-10 border-4 border-spruce border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet className="w-12 h-12 text-wood" />
            )}
          </div>

          <span className="px-3.5 py-1 bg-parchment text-muted font-bold rounded-full text-xs uppercase tracking-wider mb-2 border border-warmborder">
            {isScanning ? 'Reading Workbook...' : 'Ready For Messy Data'}
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-ink">
            {isScanning ? 'Scanning your spreadsheet...' : 'Drop your messy Excel file here'}
          </h3>
          <p className="mt-2 text-sm text-muted max-w-md font-medium">
            Drag in your <code className="px-2 py-0.5 bg-parchment-light rounded-md text-ink font-mono font-bold text-xs border border-warmborder">.xlsx</code> or <code className="px-2 py-0.5 bg-parchment-light rounded-md text-ink font-mono font-bold text-xs border border-warmborder">.xls</code> workbook, or click anywhere to browse.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-spruce hover:bg-spruce-hover text-white font-bold rounded-xl text-sm shadow-sm transition-colors">
            <UploadCloud className="w-4 h-4" />
            <span>Select File From Computer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
