import React from 'react';
import { X, Heart, Award, Sparkles } from 'lucide-react';

interface OriginalDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalDrawingModal: React.FC<OriginalDrawingModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative border-4 border-amber-300 animate-scale-in text-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-2 shadow-inner">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-fredoka text-slate-900">
            Invenção das Crianças! 🖍️
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Este aplicativo foi criado a partir do desenho real feito à mão!
          </p>
        </div>

        {/* Paper replica illustration preview */}
        <div className="my-4 p-3.5 bg-amber-50/80 rounded-2xl border-2 border-dashed border-amber-300 relative">
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full font-hand">
              Fechadura de Papel na Porta
            </span>
          </div>

          {/* Mini diagram resembling the drawing */}
          <div className="bg-white p-2.5 rounded-lg border-2 border-slate-700 sketch-border shadow-sm">
            <div className="grid grid-cols-5 gap-1 mb-1 text-center font-hand font-bold text-slate-800 text-lg">
              <div className="border border-slate-400 py-0.5">1</div>
              <div className="border border-slate-400 py-0.5">2</div>
              <div className="border border-slate-400 py-0.5">3</div>
              <div className="border border-slate-400 py-0.5">4</div>
              <div className="border border-slate-400 py-0.5">5</div>
            </div>
            <div className="grid grid-cols-5 gap-1 mb-2 text-center font-hand font-bold text-slate-800 text-lg">
              <div className="border border-slate-400 py-0.5">6</div>
              <div className="border border-slate-400 py-0.5">7</div>
              <div className="border border-slate-400 py-0.5">8</div>
              <div className="border border-slate-400 py-0.5">9</div>
              <div className="border border-slate-400 py-0.5">0</div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-center font-hand font-bold text-white text-xs">
              <div className="bg-red-500 py-1.5 rounded-sm">VERMELHO</div>
              <div className="bg-emerald-600 py-1.5 rounded-sm">VERDE</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="flex items-center gap-1.5 font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Como funciona no celular:</span>
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Você digita o código secreto nos números de 1 a 0.</li>
            <li>O botão <strong>Vermelho</strong> apaga se você errar algum número.</li>
            <li>O botão <strong>Verde</strong> confirma a senha e abre a porta com sons divertidos!</li>
            <li>Você pode trocar a senha a qualquer hora na aba Configurar!</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-fredoka font-bold rounded-xl text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Voltar para a Brincadeira</span>
        </button>
      </div>
    </div>
  );
};
