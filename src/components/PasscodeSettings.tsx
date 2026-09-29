import React, { useState } from 'react';
import { 
  Key, 
  Volume2, 
  VolumeX, 
  Mic, 
  Clock, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Palette, 
  Grid, 
  HelpCircle, 
  ShieldAlert 
} from 'lucide-react';
import { KeypadLayoutType, PasscodeConfig, ThemeType } from '../types';
import { playUnlockFanfare, playErrorBuzzer } from '../utils/audio';

interface PasscodeSettingsProps {
  config: PasscodeConfig;
  onSaveConfig: (newConfig: PasscodeConfig) => void;
  onClose?: () => void;
  onOpenInstall?: () => void;
}

export const PasscodeSettings: React.FC<PasscodeSettingsProps> = ({
  config,
  onSaveConfig,
  onClose,
  onOpenInstall,
}) => {
  const [pin, setPin] = useState(config.pin);
  const [doorName, setDoorName] = useState(config.doorName);
  const [hint, setHint] = useState(config.hint);
  const [unlockMessage, setUnlockMessage] = useState(config.unlockMessage);
  const [theme, setTheme] = useState<ThemeType>(config.theme);
  const [keypadLayout, setKeypadLayout] = useState<KeypadLayoutType>(config.keypadLayout);
  const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled);
  const [voiceEnabled, setVoiceEnabled] = useState(config.voiceEnabled);
  const [autoLockSeconds, setAutoLockSeconds] = useState(config.autoLockSeconds);
  const [testPinInput, setTestPinInput] = useState('');
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'fail'>('idle');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!pin.trim() || pin.length < 2) {
      alert('A senha deve ter pelo menos 2 números!');
      return;
    }

    const newConfig: PasscodeConfig = {
      pin: pin.trim(),
      doorName: doorName.trim() || 'Porta Secreta',
      hint: hint.trim(),
      unlockMessage: unlockMessage.trim(),
      theme,
      keypadLayout,
      soundEnabled,
      voiceEnabled,
      autoLockSeconds,
    };

    onSaveConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    if (onClose) {
      setTimeout(onClose, 600);
    }
  };

  const handleTestPin = () => {
    if (testPinInput === pin) {
      setTestResult('success');
      if (soundEnabled) playUnlockFanfare();
    } else {
      setTestResult('fail');
      if (soundEnabled) playErrorBuzzer();
    }
    setTimeout(() => setTestResult('idle'), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200 text-slate-800">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Key className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-fredoka text-slate-900">Configurar Segredo</h2>
            <p className="text-xs text-slate-500">Mude a senha da porta e personalize para as brincadeiras</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Passcode Input */}
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
          <label className="block text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5 font-fredoka">
            <Key className="w-4 h-4 text-amber-600" />
            <span>Código Secreto da Porta</span>
          </label>
          <p className="text-xs text-slate-500 mb-2.5">
            Digite de 2 a 8 números para ser a senha da porta (ex: 1234):
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 1234"
              className="w-full bg-white text-2xl font-mono font-bold tracking-widest text-center px-4 py-2.5 rounded-xl border-2 border-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>

          {/* Quick numbers picker for kids */}
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => {
                  if (pin.length < 8) setPin((p) => p + digit);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-amber-200 text-slate-800 font-bold hover:bg-amber-100 active:scale-95 text-sm shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="px-2 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold hover:bg-rose-100 active:scale-95 text-xs shadow-sm"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Door Name & Hint */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nome da Porta / Sala
            </label>
            <input
              type="text"
              value={doorName}
              onChange={(e) => setDoorName(e.target.value)}
              placeholder="Ex: Quarto Secreto"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Dica da Senha (Opcional)</span>
            </label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Ex: Começa com 1..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Secret Unlock Message */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Mensagem Secreta ao Abrir</span>
          </label>
          <input
            type="text"
            value={unlockMessage}
            onChange={(e) => setUnlockMessage(e.target.value)}
            placeholder="Ex: Bem-vindo à base secreta dos agentes! 🚀"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Theme Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 font-fredoka">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Tema Visual do Teclado</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTheme('paper')}
              className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                theme === 'paper'
                  ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="text-xl">📝</span>
              <div>
                <p className="font-bold">Desenho de Papel</p>
                <p className="text-[10px] text-slate-500">Igual ao caderno da foto!</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('vault')}
              className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                theme === 'vault'
                  ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold">Cofre de Espião</p>
                <p className="text-[10px] text-slate-500">Metálico & Seguro</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('castle')}
              className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                theme === 'castle'
                  ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="text-xl">🏰</span>
              <div>
                <p className="font-bold">Castelo Mágico</p>
                <p className="text-[10px] text-slate-500">Madeira & Magia</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('cyber')}
              className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                theme === 'cyber'
                  ? 'border-cyan-500 bg-cyan-50 font-bold text-cyan-950 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-bold">Base Futurista</p>
                <p className="text-[10px] text-slate-500">Neon Sci-Fi</p>
              </div>
            </button>
          </div>
        </div>

        {/* Keypad Layout Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 font-fredoka">
            <Grid className="w-4 h-4 text-blue-500" />
            <span>Formato dos Botões</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setKeypadLayout('drawing')}
              className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                keypadLayout === 'drawing'
                  ? 'border-blue-500 bg-blue-50 font-bold text-blue-900 shadow-sm'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-lg">📋</span>
              <div>
                <p className="font-bold">Como no Desenho (5 x 2)</p>
                <p className="text-[10px] text-slate-500">1 a 5 em cima, 6 a 0 embaixo</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setKeypadLayout('classic')}
              className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                keypadLayout === 'classic'
                  ? 'border-blue-500 bg-blue-50 font-bold text-blue-900 shadow-sm'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-lg">🔢</span>
              <div>
                <p className="font-bold">Teclado Clássico (3 x 4)</p>
                <p className="text-[10px] text-slate-500">Como no telefone</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sound, Voice & AutoLock Settings */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <p className="text-xs font-bold text-slate-800">Sons Divertidos de Desbloqueio</p>
                <p className="text-[10px] text-slate-500">Músicas de vitória e beeps ao tocar</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Voz Narradora da Porta</p>
                <p className="text-[10px] text-slate-500">Fala em voz alta "Acesso Permitido!"</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                voiceEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Tempo para Trancar Sozinha</p>
                <p className="text-[10px] text-slate-500">A porta fecha automaticamente</p>
              </div>
            </div>
            <select
              value={autoLockSeconds}
              onChange={(e) => setAutoLockSeconds(Number(e.target.value))}
              className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value={3}>3 segundos</option>
              <option value={6}>6 segundos</option>
              <option value={10}>10 segundos</option>
              <option value={15}>15 segundos</option>
              <option value={0}>Apenas manual</option>
            </select>
          </div>
        </div>

        {/* Test Passcode Area */}
        <div className="bg-slate-100 p-3.5 rounded-2xl">
          <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
            <span>🧪 Testar a Senha Nova:</span>
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testPinInput}
              onChange={(e) => setTestPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Digite para testar"
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-mono font-bold flex-1"
            />
            <button
              type="button"
              onClick={handleTestPin}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl active:scale-95"
            >
              Testar
            </button>
          </div>
          {testResult === 'success' && (
            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1 animate-bounce">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Senha Correta! Porta destrancaria com sucesso! 🎉</span>
            </p>
          )}
          {testResult === 'fail' && (
            <p className="text-xs font-bold text-rose-600 mt-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Ops! Senha errada. Tente digitar {pin}</span>
            </p>
          )}
        </div>

        {/* Save button */}
        <div className="pt-2 space-y-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-fredoka font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Salvar e Usar Esta Senha</span>
              </>
            )}
          </button>

          {onOpenInstall && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <span>📱</span>
              <span>Como Instalar no Celular Android</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
