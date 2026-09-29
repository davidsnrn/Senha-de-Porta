/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Key, 
  Volume2, 
  VolumeX, 
  History, 
  Settings, 
  Sparkles, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { Keypad } from './components/Keypad';
import { DoorAnimation } from './components/DoorAnimation';
import { PasscodeSettings } from './components/PasscodeSettings';
import { AttemptsHistory } from './components/AttemptsHistory';
import { OriginalDrawingModal } from './components/OriginalDrawingModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';

import { PasscodeConfig, AttemptLog } from './types';
import { 
  playKeySound, 
  playUnlockFanfare, 
  playErrorBuzzer, 
  playEraseSound, 
  playLockSound, 
  speakMessage 
} from './utils/audio';

const STORAGE_KEY_CONFIG = 'porta_secreta_config_v1';
const STORAGE_KEY_LOGS = 'porta_secreta_logs_v1';

const DEFAULT_CONFIG: PasscodeConfig = {
  pin: '1234',
  doorName: 'Quarto Secreto',
  hint: 'São 4 números em ordem: 1, 2...',
  unlockMessage: 'Acesso liberado à Base Secreta! Pode entrar! 🚀',
  theme: 'paper',
  keypadLayout: 'drawing',
  soundEnabled: true,
  voiceEnabled: true,
  autoLockSeconds: 6,
};

export default function App() {
  // App navigation tabs
  const [activeTab, setActiveTab] = useState<'door' | 'settings' | 'history'>('door');

  // Config & Logs with localStorage persistence
  const [config, setConfig] = useState<PasscodeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_CONFIG;
  });

  const [logs, setLogs] = useState<AttemptLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Door & keypad state
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showDigits, setShowDigits] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showDrawingModal, setShowDrawingModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  const { isInstalled } = usePWAInstall();

  // Sync config & logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignore
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch {
      // Ignore
    }
  }, [logs]);

  // Handle digit press
  const handleDigitPress = (digit: string) => {
    if (isDoorOpen) return;
    if (currentInput.length >= 10) return;

    if (config.soundEnabled) {
      playKeySound(digit, config.theme);
    }

    setFeedbackStatus('idle');
    setCurrentInput((prev) => prev + digit);
  };

  // Handle clear/erase
  const handleClear = () => {
    if (currentInput.length === 0) return;
    if (config.soundEnabled) {
      playEraseSound();
    }
    setCurrentInput('');
    setFeedbackStatus('idle');
  };

  // Handle door unlock attempt
  const handleSubmit = () => {
    if (isDoorOpen) return;

    if (!currentInput) {
      if (config.soundEnabled) playErrorBuzzer();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const isMatch = currentInput === config.pin;

    // Log the attempt
    const newLog: AttemptLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      attemptedCode: currentInput,
      success: isMatch,
      doorName: config.doorName,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]); // Keep latest 100

    if (isMatch) {
      // SUCCESS!
      setIsDoorOpen(true);
      setFeedbackStatus('success');

      if (config.soundEnabled) {
        playUnlockFanfare();
      }

      if (config.voiceEnabled) {
        setTimeout(() => {
          speakMessage('Acesso permitido! A porta secreta está aberta!');
        }, 300);
      }
    } else {
      // INCORRECT CODE
      setFeedbackStatus('error');
      setIsShaking(true);

      if (config.soundEnabled) {
        playErrorBuzzer();
      }

      if (config.voiceEnabled) {
        setTimeout(() => {
          speakMessage('Senha incorreta! Tente novamente!');
        }, 200);
      }

      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  // Manual door lock
  const handleManualLock = () => {
    setIsDoorOpen(false);
    setCurrentInput('');
    setFeedbackStatus('idle');
    if (config.soundEnabled) {
      playLockSound();
    }
  };

  // Clear attempts history
  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja apagar o histórico de tentativas?')) {
      setLogs([]);
    }
  };

  // Quick sound toggle
  const toggleSound = () => {
    setConfig((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  // Helper for Theme Background
  const getAppBackground = () => {
    switch (config.theme) {
      case 'vault':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100';
      case 'cyber':
        return 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-cyan-200';
      case 'castle':
        return 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-amber-100';
      case 'paper':
      default:
        return 'bg-amber-100/50 text-slate-800';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-fredoka antialiased transition-colors ${getAppBackground()}`}>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/10 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-sm">
              🚪
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {config.doorName}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {isDoorOpen ? '🟢 Porta Aberta' : '🔴 Trancada'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            {!isInstalled && (
              <button
                type="button"
                onClick={() => setShowInstallModal(true)}
                className="px-2 py-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-transform active:scale-95 flex items-center gap-1 shadow-xs"
                title="Como instalar no celular Android"
              >
                <span>📱</span>
                <span className="text-[11px]">Instalar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDrawingModal(true)}
              className="px-2 py-1 text-xs font-bold bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-xl transition-transform active:scale-95 flex items-center gap-1 shadow-xs"
              title="Ver o desenho original feito à mão"
            >
              <span>🖍️</span>
              <span className="hidden sm:inline">Desenho</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                config.soundEnabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-500'
              }`}
              title={config.soundEnabled ? 'Silenciar sons' : 'Ativar sons'}
            >
              {config.soundEnabled ? (
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <VolumeX className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-3 sm:p-4 pb-24 flex flex-col justify-start">
        {activeTab === 'door' && (
          <div className="space-y-3 sm:space-y-4">
            {/* Animated Door Card */}
            <DoorAnimation
              isOpen={isDoorOpen}
              theme={config.theme}
              doorName={config.doorName}
              unlockMessage={config.unlockMessage}
              onManualLock={handleManualLock}
              autoLockSeconds={config.autoLockSeconds}
            />

            {/* KEYPAD CONTAINER */}
            <div
              className={`relative rounded-3xl p-4 sm:p-5 shadow-xl transition-all ${
                config.theme === 'paper'
                  ? 'notebook-paper sketch-border border-slate-700/80'
                  : config.theme === 'cyber'
                  ? 'bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                  : config.theme === 'vault'
                  ? 'bg-slate-800/95 border-2 border-slate-600 shadow-2xl'
                  : 'bg-amber-950/80 border-2 border-amber-800/80'
              }`}
            >
              {/* Notebook tape graphics for the child drawing mode */}
              {config.theme === 'paper' && (
                <>
                  <div className="tape-top-left" />
                  <div className="tape-top-right" />
                </>
              )}

              {/* Password Display / Status Screen */}
              <div
                className={`mb-3 p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isShaking ? 'animate-shake' : ''
                } ${
                  feedbackStatus === 'success'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    : feedbackStatus === 'error'
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : config.theme === 'paper'
                    ? 'bg-white/95 border-slate-300 sketch-border-sm'
                    : config.theme === 'cyber'
                    ? 'bg-slate-950 border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-900/90 border-slate-700 text-white'
                }`}
              >
                <div className="w-full flex items-center justify-between text-xs px-1 mb-1">
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      feedbackStatus === 'success'
                        ? 'text-emerald-700'
                        : feedbackStatus === 'error'
                        ? 'text-rose-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {feedbackStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>SENHA CORRETA!</span>
                      </>
                    ) : feedbackStatus === 'error' ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>SENHA ERRADA!</span>
                      </>
                    ) : (
                      <span>DIGITE A SENHA</span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowDigits(!showDigits)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title={showDigits ? 'Ocultar números' : 'Mostrar números'}
                  >
                    {showDigits ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Display dots or numbers */}
                <div className="h-10 flex items-center justify-center gap-2">
                  {currentInput.length === 0 ? (
                    <span className="text-slate-400 text-sm font-hand italic tracking-wider">
                      Toque nos números abaixo...
                    </span>
                  ) : showDigits ? (
                    <span className="font-mono text-2xl font-bold tracking-widest text-slate-800 dark:text-white">
                      {currentInput}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {currentInput.split('').map((_, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full bg-slate-800 dark:bg-white animate-scale-in"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* The Actual Touch Keypad */}
              <Keypad
                onDigitPress={handleDigitPress}
                onClear={handleClear}
                onSubmit={handleSubmit}
                layout={config.keypadLayout}
                theme={config.theme}
                disabled={isDoorOpen}
              />

              {/* Hint button below keypad */}
              {config.hint && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setShowHintModal(!showHintModal)}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-amber-600 font-bold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Esqueceu a senha? Ver dica</span>
                  </button>

                  {showHintModal && (
                    <div className="mt-2 p-2.5 bg-amber-100/90 text-amber-900 border border-amber-300 rounded-xl text-xs font-medium animate-fade-in shadow-sm">
                      💡 <strong>Dica Secreta:</strong> {config.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Settings */}
        {activeTab === 'settings' && (
          <PasscodeSettings
            config={config}
            onOpenInstall={() => setShowInstallModal(true)}
            onSaveConfig={(newConfig) => {
              setConfig(newConfig);
              setActiveTab('door');
            }}
          />
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <AttemptsHistory
            logs={logs}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Tab Bar (Mobile Ergonomics) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-3 h-16 items-center px-4">
          <button
            type="button"
            onClick={() => setActiveTab('door')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'door'
                ? 'text-amber-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'door' ? 'bg-amber-100 text-amber-700' : ''}`}>
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] tracking-tight mt-0.5">Fechadura</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'settings'
                ? 'text-amber-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'settings' ? 'bg-amber-100 text-amber-700' : ''}`}>
              <Key className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] tracking-tight mt-0.5">Mudar Senha</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'history'
                ? 'text-amber-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'history' ? 'bg-amber-100 text-amber-700' : ''}`}>
              <History className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] tracking-tight mt-0.5">
              Histórico {logs.length > 0 && `(${logs.length})`}
            </span>
          </button>
        </div>
      </nav>

      {/* Kid Drawing Homage Modal */}
      <OriginalDrawingModal
        isOpen={showDrawingModal}
        onClose={() => setShowDrawingModal(false)}
      />

      {/* Android / Mobile PWA Installation Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
