import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Unlock, Sparkles, ShieldCheck, DoorOpen, RotateCcw } from 'lucide-react';
import { ThemeType } from '../types';

// Image references
import secretRoomImg from '../assets/images/kids_secret_room_1790722929028.jpg';
import vaultDoorImg from '../assets/images/secret_vault_door_1790722910812.jpg';
import castleDoorImg from '../assets/images/magic_castle_door_1790722920577.jpg';

interface DoorAnimationProps {
  isOpen: boolean;
  theme: ThemeType;
  doorName: string;
  unlockMessage: string;
  onManualLock: () => void;
  autoLockSeconds: number;
}

export const DoorAnimation: React.FC<DoorAnimationProps> = ({
  isOpen,
  theme,
  doorName,
  unlockMessage,
  onManualLock,
  autoLockSeconds,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(autoLockSeconds);

  // Trigger confetti burst on unlock
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
        });
      } catch {
        // Safe fallback
      }

      setSecondsRemaining(autoLockSeconds);
    }
  }, [isOpen, autoLockSeconds]);

  // Countdown auto-lock ticker
  useEffect(() => {
    if (!isOpen || autoLockSeconds <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onManualLock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, autoLockSeconds, onManualLock]);

  // Door appearance based on theme
  const getDoorFrontStyle = () => {
    switch (theme) {
      case 'vault':
        return {
          backgroundImage: `url(${vaultDoorImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'castle':
        return {
          backgroundImage: `url(${castleDoorImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'cyber':
        return {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%)',
        };
      case 'paper':
      default:
        return {
          backgroundColor: '#fef3c7',
        };
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-2 border-slate-700/20 shadow-lg bg-slate-900 aspect-[4/3] flex flex-col items-center justify-center">
      {/* 3D Container */}
      <div className="absolute inset-0 perspective-[1000px] overflow-hidden">
        {/* ROOM INTERIOR (Revealed when door opens) */}
        <div className="absolute inset-0 w-full h-full flex flex-col justify-end p-4 z-0">
          <img
            src={secretRoomImg}
            alt="Interior da sala secreta"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Secret Message & Celebration */}
          <div className="relative z-10 text-center animate-fade-in text-white mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-lg mb-1.5 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACESSO PERMITIDO!</span>
            </div>
            <p className="text-base font-bold text-amber-200 drop-shadow-md">
              {doorName}
            </p>
            <p className="text-xs text-white/90 line-clamp-2 px-2 mt-0.5">
              {unlockMessage || 'A porta secreta está aberta! Pode entrar! 🚀'}
            </p>

            {/* Timer & manual lock button */}
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {autoLockSeconds > 0 && (
                <span className="text-[11px] text-amber-300 font-mono font-medium">
                  Fecha em {secondsRemaining}s
                </span>
              )}
              <button
                type="button"
                onClick={onManualLock}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Trancar Agora</span>
              </button>
            </div>
          </div>
        </div>

        {/* SWINGING DOOR PANEL */}
        <div
          style={{
            ...getDoorFrontStyle(),
            transformOrigin: 'left center',
            transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transform: isOpen ? 'rotateY(-95deg)' : 'rotateY(0deg)',
          }}
          className={`absolute inset-0 w-full h-full z-10 flex flex-col items-center justify-between p-4 cursor-pointer select-none ${
            theme === 'paper' ? 'border-4 border-amber-800/40 bg-amber-100/95' : ''
          }`}
          onClick={() => {
            if (isOpen) onManualLock();
          }}
        >
          {/* Header on the closed door */}
          <div className="w-full flex items-center justify-between px-2 pt-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                theme === 'paper'
                  ? 'bg-amber-800/20 text-amber-950 font-hand text-sm'
                  : 'bg-black/40 text-white/90 backdrop-blur-sm'
              }`}
            >
              {doorName}
            </span>

            {/* Lock Status LED */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-500 animate-pulse'
                }`}
              />
              <span className="text-[10px] font-bold text-white font-mono">
                {isOpen ? 'ABERTA' : 'TRANCADA'}
              </span>
            </div>
          </div>

          {/* Door Handle & Lock Core */}
          <div className="flex flex-col items-center my-auto">
            {theme === 'paper' ? (
              <div className="w-20 h-20 rounded-full border-4 border-slate-700 bg-white/90 sketch-border flex flex-col items-center justify-center shadow-md">
                <Lock className="w-8 h-8 text-slate-700 stroke-[2.5]" />
                <span className="text-[10px] font-bold text-slate-600 font-hand">FECHADURA</span>
              </div>
            ) : theme === 'cyber' ? (
              <div className="w-20 h-20 rounded-xl border-2 border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex flex-col items-center justify-center">
                <Lock className="w-8 h-8 text-cyan-300 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-cyan-400 mt-1">SISTEMA ATIVO</span>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-amber-400/80 bg-slate-900/80 shadow-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                <Lock className="w-8 h-8 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-200 mt-0.5">SEGREDO</span>
              </div>
            )}

            {/* Instruction under handle */}
            <div
              className={`mt-3 text-center px-3 py-1 rounded-md text-xs font-semibold ${
                theme === 'paper'
                  ? 'text-slate-700 font-hand text-sm'
                  : 'text-white/80 bg-black/40 backdrop-blur-sm'
              }`}
            >
              🔒 Digite a senha no teclado abaixo para abrir!
            </div>
          </div>

          {/* Door bottom bolts / styling */}
          <div className="w-full flex justify-between px-3 pb-1 opacity-60">
            <div className="w-3 h-3 rounded-full bg-slate-700/60" />
            <div className="w-3 h-3 rounded-full bg-slate-700/60" />
          </div>
        </div>
      </div>
    </div>
  );
};
