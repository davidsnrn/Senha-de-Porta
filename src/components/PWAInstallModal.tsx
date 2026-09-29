import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Check, 
  Copy, 
  Share2, 
  Sparkles, 
  Package, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeInstall = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative border-4 border-amber-400 text-slate-800 my-auto animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-1 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-2 shadow-inner">
            <Smartphone className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold font-fredoka text-slate-900">
            Instalar no Android 📱
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Escolha como prefere colocar o app no seu celular:
          </p>
        </div>

        {/* Navigation Tabs between WebAPK and Direct APK */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Pelo Navegador (Fácil)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>Gerar Arquivo APK</span>
          </button>
        </div>

        {/* TAB 1: PWA / WebAPK (Recommended) */}
        {activeTab === 'pwa' && (
          <div className="space-y-3">
            {/* 1-Click Install Button if supported by browser */}
            {isInstallable && !isInstalled && (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-400/80 text-center">
                <p className="text-xs font-bold text-emerald-800 mb-2">
                  ✨ Seu navegador suporta instalação com 1 toque!
                </p>
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  disabled={installing}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-fredoka font-bold rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{installing ? 'Instalando...' : 'Instalar no Celular Agora'}</span>
                </button>
              </div>
            )}

            {isInstalled && (
              <div className="p-3 bg-emerald-100/80 rounded-2xl border border-emerald-300 text-center">
                <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>O app já está instalado no seu celular!</span>
                </p>
              </div>
            )}

            {/* Step-by-Step for Android Chrome */}
            <div className="space-y-2.5 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/90 text-xs">
              <h3 className="font-bold text-slate-900 font-fredoka text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Passo a passo no Google Chrome:</span>
              </h3>

              {/* Step 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Toque nos 3 pontinhos (<span className="inline-flex items-center px-1 bg-white border rounded font-mono font-bold">⋮</span>)
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    No canto superior direito da tela do seu Chrome no celular.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Toque em <span className="bg-white px-1.5 py-0.5 border rounded font-semibold text-slate-900">"Instalar aplicativo"</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    O próprio Android cria o pacote APK nativo no seu celular!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Confirme em <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Instalar</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Direct APK Generation with PWABuilder */}
        {activeTab === 'apk' && (
          <div className="space-y-3 text-xs">
            <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200">
              <div className="flex items-center gap-2 mb-1.5">
                <Package className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold font-fredoka text-slate-900 text-sm">
                  Gerador Automático de APK (PWABuilder)
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                O <strong>PWABuilder</strong> (da Microsoft) transforma qualquer PWA como este em um arquivo <strong>.APK</strong> para instalar direto no Android:
              </p>

              <ol className="list-decimal pl-4 mt-2 space-y-1.5 text-[11px] text-slate-700">
                <li>
                  Copie o link deste aplicativo pelo botão abaixo.
                </li>
                <li>
                  Acesse <strong>pwabuilder.com</strong> no seu navegador.
                </li>
                <li>
                  Cole o link e clique em <strong>"Start"</strong>.
                </li>
                <li>
                  Clique em <strong>"Package for Android"</strong> para baixar o seu APK!
                </li>
              </ol>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
              <div className="truncate text-[11px] text-slate-600 font-mono">
                {currentUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Link'}</span>
              </button>
            </div>

            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <span>Abrir PWABuilder.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Benefits of Installing */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <span className="text-base">📺</span>
            <div>
              <p className="font-bold text-slate-800">Tela Cheia</p>
              <p className="text-[10px] text-slate-500">Sem barra de navegador</p>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <span className="text-base">⚡</span>
            <div>
              <p className="font-bold text-slate-800">Funciona Offline</p>
              <p className="text-[10px] text-slate-500">Mesmo sem internet</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs active:scale-98 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
