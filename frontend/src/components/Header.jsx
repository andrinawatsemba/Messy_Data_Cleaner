import React from 'react';
import mascotSvg from '../assets/mascot.svg';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="pt-6 pb-4 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative p-4 bg-white/90 backdrop-blur-sm rounded-3xl shadow-md border-2 border-spruce/30 hover:border-spruce transition-all duration-300 group">
          <img
            src={mascotSvg}
            alt="Messy Data Cleaner Mascot"
            className="w-24 h-24 sm:w-28 sm:h-28 transition-transform group-hover:scale-105 duration-300 animate-bob"
          />
          <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-sponge text-white text-xs font-black rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tidy Bot</span>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-spruce-light text-spruce rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-spruce/20 shadow-sm">
        <span>✨ The human-in-the-loop spreadsheet cleaner</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight mt-1">
        Welcome to <span className="text-spruce underline decoration-sponge decoration-wavy decoration-2">Messy Data Cleaner</span>
      </h1>

      <p className="mt-2.5 text-muted text-base sm:text-lg max-w-xl mx-auto font-medium">
        Tame chaotic Excel sheets before you analyze. See what's broken, choose what to clean, and download your tidied data with a transparent change log.
      </p>
    </header>
  );
}
