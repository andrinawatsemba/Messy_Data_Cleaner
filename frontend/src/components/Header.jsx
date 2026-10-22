import React from 'react';
import mascotSvg from '../assets/mascot.svg';

export default function Header() {
  return (
    <header className="pt-8 pb-4 text-center">
      <div className="flex justify-center mb-3">
        <div className="relative p-2 bg-white rounded-2xl shadow-sm border border-cardborder">
          <img
            src={mascotSvg}
            alt="Messy Data Cleaner Mascot"
            className="w-16 h-16 transition-transform hover:scale-105 duration-200"
          />
        </div>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-spruce-light text-spruce rounded-full text-xs font-bold uppercase tracking-wider mb-2">
        <span>✨ Tidy spreadsheets with trust</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
        Welcome to Messy Data Cleaner
      </h1>
      <p className="mt-2 text-muted text-base max-w-xl mx-auto">
        Tame your messy spreadsheets before you analyze. See what’s broken, decide what to fix, and get back a clean file with an itemized change log.
      </p>
    </header>
  );
}
