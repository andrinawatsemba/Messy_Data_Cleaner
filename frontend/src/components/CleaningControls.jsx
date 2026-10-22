import React from 'react';
import { Sparkles, CheckSquare, Square, SlidersHorizontal, Wand2 } from 'lucide-react';

export default function CleaningControls({
  options,
  onOptionsChange,
  customInstruction,
  onCustomInstructionChange,
  onClean,
  isCleaning
}) {
  const toggleOption = (key) => {
    onOptionsChange({
      ...options,
      [key]: !options[key]
    });
  };

  const optionItems = [
    {
      key: 'remove_empty_rows',
      title: 'Remove completely empty rows',
      desc: 'Purges blank separator rows and accidental empty spaces.',
      badge: 'Recommended',
      badgeColor: 'bg-spruce-light text-spruce border-spruce/30',
    },
    {
      key: 'remove_empty_cols',
      title: 'Remove completely empty columns',
      desc: 'Drops unnamed or blank columns that hold zero data.',
      badge: 'Recommended',
      badgeColor: 'bg-spruce-light text-spruce border-spruce/30',
    },
    {
      key: 'trim_whitespace',
      title: 'Trim leading & trailing whitespace in text cells',
      desc: 'Fixes accidental spaces like " Alice " -> "Alice" across all columns.',
      badge: 'Recommended',
      badgeColor: 'bg-wood-light text-wood border-wood/30',
    },
    {
      key: 'standardize_headers',
      title: 'Standardize column headers',
      desc: 'Converts strange symbols and spaces to clean, readable snake_case.',
      badge: 'Tidy Headers',
      badgeColor: 'bg-wood-light text-wood border-wood/30',
    },
    {
      key: 'fill_missing_numbers',
      title: 'Fill missing numeric cells with 0',
      desc: 'Replaces blank numbers with 0. Keep unchecked to preserve as empty.',
      badge: 'Optional',
      badgeColor: 'bg-sponge-light text-sponge border-sponge/30',
    },
  ];

  return (
    <div className="bg-parchment-card border-2 border-warmborder rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex items-center justify-between pb-4 border-b-2 border-warmborder/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-spruce-light text-spruce rounded-xl border border-spruce/20">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-ink">Choose Cleaning Rules</h3>
            <p className="text-xs text-muted font-medium">Select which chores you want the cleaner to handle</p>
          </div>
        </div>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-3">
        {optionItems.map((item) => {
          const isChecked = !!options[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleOption(item.key)}
              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isChecked
                  ? 'border-spruce bg-spruce-light/30 shadow-sm'
                  : 'border-warmborder/60 bg-parchment hover:border-warmborder-strong hover:bg-parchment-light'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  className={`mt-0.5 flex-shrink-0 transition-colors ${
                    isChecked ? 'text-spruce' : 'text-slate-400'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-6 h-6 fill-spruce-light" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                </button>
                <div>
                  <div className="text-sm font-bold text-ink">{item.title}</div>
                  <div className="text-xs text-muted mt-0.5 font-medium">{item.desc}</div>
                </div>
              </div>

              <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider flex-shrink-0 border ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Custom Instruction Box */}
      <div className="pt-5 border-t-2 border-warmborder/60">
        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-1.5">
          <Wand2 className="w-4 h-4 text-sponge" />
          <span>Custom Instructions (Optional AI Prompt)</span>
        </div>
        <p className="text-xs text-muted mb-3 font-medium">
          Have a specific rule in mind? Type it here and our Gemini AI assistant will handle it.
        </p>
        <textarea
          value={customInstruction}
          onChange={(e) => onCustomInstructionChange(e.target.value)}
          placeholder="e.g. 'delete rows where status is draft' or 'standardize date formats'"
          rows={2}
          className="w-full text-sm p-3.5 border-2 border-warmborder rounded-2xl focus:outline-none focus:ring-2 focus:ring-spruce/30 focus:border-spruce bg-parchment font-medium"
        />
      </div>

      {/* Big Action Button */}
      <div className="pt-2">
        <button
          onClick={onClean}
          disabled={isCleaning}
          className="w-full py-4 px-8 bg-spruce hover:bg-spruce-hover text-white font-black text-base rounded-2xl shadow-lg shadow-spruce/20 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Clean My Spreadsheet Now</span>
        </button>
      </div>
    </div>
  );
}
