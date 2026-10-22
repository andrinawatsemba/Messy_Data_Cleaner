import React from 'react';
import mascotSvg from '../assets/mascot.svg';

export default function MascotLoader({ statusText = "Tidying up your rows and sweeping nulls..." }) {
  return (
    <div className="bg-white border border-cardborder rounded-2xl p-10 text-center shadow-sm animate-fadeIn">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 mx-auto p-3 bg-spruce-light/40 rounded-3xl border border-spruce/20 animate-bounce duration-1000 flex items-center justify-center">
          <img
            src={mascotSvg}
            alt="Cleaning mascot at work"
            className="w-16 h-16"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-sponge rounded-full text-white text-xs flex items-center justify-center animate-ping opacity-75">
          ✨
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-ink tracking-tight">
        Cleaning in Progress
      </h3>
      <p className="mt-1.5 text-sm text-muted max-w-sm mx-auto">
        {statusText}
      </p>

      {/* Animated progress bar */}
      <div className="mt-6 w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div className="bg-spruce h-full rounded-full animate-pulse w-3/4 duration-700" />
      </div>

      <div className="mt-4 text-xs font-semibold text-spruce uppercase tracking-wider">
        Almost done...
      </div>
    </div>
  );
}
