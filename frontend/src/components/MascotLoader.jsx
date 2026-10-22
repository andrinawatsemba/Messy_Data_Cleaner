import React from 'react';
import mascotSvg from '../assets/mascot.svg';
import { Sparkles, BookOpen } from 'lucide-react';

export default function MascotLoader({ statusText = "Tidying up your rows and sweeping nulls..." }) {
  return (
    <div className="bg-parchment-card border-2 border-spruce/30 rounded-3xl p-10 sm:p-14 text-center shadow-xl animate-fadeIn">
      {/* Animated Mascot Hero */}
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto p-4 bg-gradient-to-b from-parchment-light to-white rounded-full border-3 border-warmborder shadow-md flex items-center justify-center animate-bob">
          <img
            src={mascotSvg}
            alt="Cleaning mascot at work"
            className="w-24 h-24 sm:w-28 sm:h-28"
          />
        </div>
        
        {/* Floating Bubble Badges */}
        <div className="absolute -top-1 -right-2 px-3 py-1 bg-sponge text-white text-xs font-black rounded-full shadow-md flex items-center gap-1 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sweeping!</span>
        </div>
        <div className="absolute bottom-1 -left-2 px-2.5 py-0.5 bg-wood text-white text-xs font-black rounded-full shadow-md flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>Studying</span>
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
        Cleaning In Progress...
      </h3>
      <p className="mt-2 text-base text-muted font-medium max-w-md mx-auto">
        {statusText}
      </p>

      {/* Animated Progress Bar */}
      <div className="mt-8 w-full max-w-sm mx-auto bg-parchment-light rounded-full h-3.5 overflow-hidden border-2 border-warmborder shadow-inner">
        <div className="bg-gradient-to-r from-wood via-spruce to-sponge h-full rounded-full animate-pulse w-full duration-1000" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-spruce uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-spruce animate-ping" />
        <span>Organizing cells and preparing change log</span>
      </div>
    </div>
  );
}
