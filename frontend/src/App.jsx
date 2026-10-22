import React, { useState } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import DiagnosticsPanel from './components/DiagnosticsPanel';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnostics, setDiagnostics] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setIsScanning(true);
    setErrorMessage(null);
    setDiagnostics(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to scan the Excel file.');
      }

      if (data.status === 'empty') {
        setErrorMessage(data.message || 'This Excel workbook contains no data rows or columns.');
        setSelectedFile(null);
      } else {
        setDiagnostics(data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while scanning the file.');
      setSelectedFile(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setDiagnostics(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      <Header />

      <main className="mt-8 space-y-6">
        {errorMessage && (
          <div className="p-4 bg-caddy-light border border-caddy/30 rounded-2xl flex items-center justify-between text-caddy text-sm font-medium">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs uppercase font-bold underline ml-4 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {!diagnostics ? (
          <DropZone onFileSelect={handleFileSelect} isScanning={isScanning} />
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <DiagnosticsPanel diagnostics={diagnostics} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-xs text-muted">
        Messy Data Cleaner • Devpost Build With AI Basics Proof-of-Concept
      </footer>
    </div>
  );
}
