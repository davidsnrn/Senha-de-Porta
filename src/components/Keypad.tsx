import React from 'react';
import { Delete, KeyRound, Sparkles } from 'lucide-react';
import { KeypadLayoutType, ThemeType } from '../types';

interface KeypadProps {
  onDigitPress: (digit: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  layout: KeypadLayoutType;
  theme: ThemeType;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigitPress,
  onClear,
  onSubmit,
  layout,
  theme,
  disabled = false,
}) => {
  // Digit definitions
  // 5x2 layout: Row 1 = 1, 2, 3, 4, 5. Row 2 = 6, 7, 8, 9, 0. (Exact replica of kid's drawing!)
  const row1 = ['1', '2', '3', '4', '5'];
  const row2 = ['6', '7', '8', '9', '0'];

  // Classic 3x4 layout
  const classicRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  // Button styling based on theme
  const getDigitButtonClasses = () => {
    switch (theme) {
      case 'paper':
        return 'bg-white/90 hover:bg-white text-slate-800 border-2 border-slate-700/80 sketch-border shadow-sm active:translate-y-0.5 active:bg-amber-50 font-hand text-3xl font-bold';
      case 'vault':
        return 'bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-amber-300 border-2 border-amber-500/40 rounded-xl shadow-md active:translate-y-0.5 font-fredoka text-2xl font-bold tracking-wider';
      case 'cyber':
        return 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] rounded-lg active:scale-95 font-mono text-2xl font-bold';
      case 'castle':
        return 'bg-amber-900/80 hover:bg-amber-800 text-amber-100 border-2 border-amber-600/70 rounded-2xl shadow-sm active:translate-y-0.5 font-fredoka text-2xl font-semibold';
      default:
        return 'bg-white hover:bg-slate-100 text-slate-900 border rounded-xl text-2xl font-bold';
    }
  };

  const getRedButtonClasses = () => {
    switch (theme) {
      case 'paper':
        return 'crayon-red text-white border-2 border-red-800/90 sketch-border shadow-md active:scale-98 font-hand text-xl font-bold flex items-center justify-center gap-1.5 py-3';
      case 'vault':
        return 'bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border-2 border-red-500/60 rounded-xl shadow-md active:scale-98 font-fredoka text-lg font-bold flex items-center justify-center gap-2 py-3';
      case 'cyber':
        return 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] rounded-lg active:scale-98 font-mono text-base font-bold flex items-center justify-center gap-2 py-3';
      case 'castle':
        return 'bg-red-900 hover:bg-red-800 text-red-100 border-2 border-red-700/60 rounded-2xl shadow-sm active:scale-98 font-fredoka text-base font-bold flex items-center justify-center gap-2 py-3';
      default:
        return 'bg-red-600 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2';
    }
  };

  const getGreenButtonClasses = () => {
    switch (theme) {
      case 'paper':
        return 'crayon-green text-white border-2 border-green-800/90 sketch-border shadow-md active:scale-98 font-hand text-xl font-bold flex items-center justify-center gap-1.5 py-3';
      case 'vault':
        return 'bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white border-2 border-emerald-400/60 rounded-xl shadow-md active:scale-98 font-fredoka text-lg font-bold flex items-center justify-center gap-2 py-3';
      case 'cyber':
        return 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.35)] rounded-lg active:scale-98 font-mono text-base font-bold flex items-center justify-center gap-2 py-3';
      case 'castle':
        return 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border-2 border-emerald-600/60 rounded-2xl shadow-sm active:scale-98 font-fredoka text-base font-bold flex items-center justify-center gap-2 py-3';
      default:
        return 'bg-emerald-600 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2';
    }
  };

  if (layout === 'drawing') {
    // 5x2 Layout (Matching the child's drawing directly)
    return (
      <div className="w-full select-none">
        {/* Row 1: 1, 2, 3, 4, 5 */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          {row1.map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={disabled}
              onClick={() => onDigitPress(digit)}
              className={`h-14 sm:h-16 flex items-center justify-center transition-all ${getDigitButtonClasses()} disabled:opacity-50`}
              aria-label={`Dígito ${digit}`}
            >
              {digit}
            </button>
          ))}
        </div>

        {/* Row 2: 6, 7, 8, 9, 0 */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {row2.map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={disabled}
              onClick={() => onDigitPress(digit)}
              className={`h-14 sm:h-16 flex items-center justify-center transition-all ${getDigitButtonClasses()} disabled:opacity-50`}
              aria-label={`Dígito ${digit}`}
            >
              {digit}
            </button>
          ))}
        </div>

        {/* Row 3: Action Buttons (Red on Left, Green on Right, exactly like the drawing) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className={`${getRedButtonClasses()} transition-all disabled:opacity-50 min-h-[50px]`}
            aria-label="Apagar ou limpar senha"
          >
            <Delete className="w-5 h-5 shrink-0 stroke-[2.5]" />
            <span>APAGAR</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={onSubmit}
            className={`${getGreenButtonClasses()} transition-all disabled:opacity-50 min-h-[50px]`}
            aria-label="Abrir porta"
          >
            <KeyRound className="w-5 h-5 shrink-0 stroke-[2.5]" />
            <span>ABRIR</span>
          </button>
        </div>
      </div>
    );
  }

  // Classic 3x4 Layout
  return (
    <div className="w-full select-none max-w-xs mx-auto">
      {classicRows.map((row, idx) => (
        <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
          {row.map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={disabled}
              onClick={() => onDigitPress(digit)}
              className={`h-14 sm:h-16 flex items-center justify-center transition-all ${getDigitButtonClasses()} disabled:opacity-50`}
              aria-label={`Dígito ${digit}`}
            >
              {digit}
            </button>
          ))}
        </div>
      ))}

      {/* Bottom row: Clear, 0, Submit */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          className={`${getRedButtonClasses()} transition-all disabled:opacity-50 h-14 sm:h-16 text-sm`}
          aria-label="Apagar dígitos"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onDigitPress('0')}
          className={`h-14 sm:h-16 flex items-center justify-center transition-all ${getDigitButtonClasses()} disabled:opacity-50`}
          aria-label="Dígito 0"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className={`${getGreenButtonClasses()} transition-all disabled:opacity-50 h-14 sm:h-16 text-sm`}
          aria-label="Abrir porta"
        >
          <KeyRound className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
