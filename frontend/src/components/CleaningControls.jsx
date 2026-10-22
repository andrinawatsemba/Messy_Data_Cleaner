import React from 'react';
import { Sparkles, CheckSquare, Square, Sliders, MessageSquare } from 'lucide-react';

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
      desc: 'Drops rows where every single cell is blank.',
    },
    {
      key: 'remove_empty_cols',
      title: 'Remove completely empty columns',
      desc: 'Drops blank columns that carry no information.',
    },
    {
      key: 'trim_whitespace',
      title: 'Trim leading & trailing whitespace in text cells',
      desc: 'Cleans up accidental spaces in names, categories, and codes.',
    },
    {
      key: 'standardize_headers',
      title: 'Standardize column headers',
      desc: 'Cleans odd characters and converts to clean, readable format.',
    },
    {
      key: 'fill_missing_numbers',
      title: 'Fill missing numeric cells with 0',
      desc: 'Leave unchecked to preserve missing numbers as blank.',
    },
  ];

  return (
    <div className="bg-white border border-cardborder rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-cardborder">
        <Sliders className="w-5 h-5 text-spruce" />
        <h3 className="text-lg font-bold text-ink">Choose Cleaning Actions</h3>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-3">
        {optionItems.map((item) => {
          const isChecked = !!options[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleOption(item.key)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                isChecked
                  ? 'border-spruce/40 bg-spruce-light/20'
                  : 'border-cardborder/60 hover:bg-slate-50'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 flex-shrink-0 transition-colors ${
                  isChecked ? 'text-spruce' : 'text-slate-400'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 fill-spruce-light" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div>
                <div className="text-sm font-semibold text-ink">{item.title}</div>
                <div className="text-xs text-muted mt-0.5">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Prompt Box */}
      <div className="pt-4 border-t border-cardborder">
        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-2">
          <MessageSquare className="w-4 h-4 text-spray" />
          <span>Optional Custom Instructions</span>
        </div>
        <p className="text-xs text-muted mb-2.5">
          Have special rules? Powered by Google Gemini AI, or leave blank for default cleaning.
        </p>
        <textarea
          value={customInstruction}
          onChange={(e) => onCustomInstructionChange(e.target.value)}
          placeholder="e.g. 'delete rows where status is draft' or 'standardize date formats'"
          rows={2}
          className="w-full text-sm p-3 border border-cardborder rounded-xl focus:outline-none focus:ring-2 focus:ring-spruce/30 focus:border-spruce bg-slate-50/50"
        />
      </div>

      {/* Trigger Button */}
      <div className="pt-2">
        <button
          onClick={onClean}
          disabled={isCleaning}
          className="w-full py-3.5 px-6 bg-spruce hover:bg-spruce-hover text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          <span>Clean My Spreadsheet</span>
        </button>
      </div>
    </div>
  );
}
