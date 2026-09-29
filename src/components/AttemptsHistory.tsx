import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, Trash2, Filter, ShieldCheck, Sparkles } from 'lucide-react';
import { AttemptLog } from '../types';

interface AttemptsHistoryProps {
  logs: AttemptLog[];
  onClearHistory: () => void;
}

export const AttemptsHistory: React.FC<AttemptsHistoryProps> = ({
  logs,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'fail'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'success') return log.success;
    if (filter === 'fail') return !log.success;
    return true;
  });

  const totalAttempts = logs.length;
  const successAttempts = logs.filter((l) => l.success).length;
  const failedAttempts = logs.filter((l) => !l.success).length;
  const successRate = totalAttempts > 0 ? Math.round((successAttempts / totalAttempts) * 100) : 0;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200 text-slate-800">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <History className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-fredoka text-slate-900">Histórico da Porta</h2>
            <p className="text-xs text-slate-500">Registro de quem tentou abrir e se acertou o código</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            title="Limpar histórico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Tentativas</p>
          <p className="text-xl font-extrabold text-slate-800 font-mono tabular-nums">{totalAttempts}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl text-center">
          <p className="text-[11px] font-bold text-emerald-700 uppercase">Acertos</p>
          <p className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">{successAttempts}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-2xl text-center">
          <p className="text-[11px] font-bold text-rose-700 uppercase">Erros</p>
          <p className="text-xl font-extrabold text-rose-700 font-mono tabular-nums">{failedAttempts}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({totalAttempts})
          </button>
          <button
            type="button"
            onClick={() => setFilter('success')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'success' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Acertos ({successAttempts})
          </button>
          <button
            type="button"
            onClick={() => setFilter('fail')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'fail' ? 'bg-white text-rose-700 shadow-sm font-bold' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Erros ({failedAttempts})
          </button>
        </div>

        {totalAttempts > 0 && (
          <span className="text-xs text-slate-500 font-medium">
            Taxa: <strong className="text-slate-800 font-mono">{successRate}%</strong>
          </span>
        )}
      </div>

      {/* Attempts List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 font-fredoka">Nenhuma tentativa registrada</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Volte para a tela da porta e digite uma senha para ver o histórico aqui!
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                log.success
                  ? 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50'
                  : 'bg-rose-50/50 border-rose-200/80 hover:bg-rose-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    log.success ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  {log.success ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <XCircle className="w-5 h-5 stroke-[2.5]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 font-mono tracking-wider">
                      {log.attemptedCode || '(vazio)'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.success
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.success ? 'PORTA ABERTA' : 'SENHA ERRADA'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {log.doorName} · {formatDate(log.timestamp)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                  {formatTime(log.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
