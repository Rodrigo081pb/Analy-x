// Componente migrado para ./HistoryList/index.jsx
import React from 'react';
import { Copy, Download } from 'lucide-react';

export default function HistoryList({ filteredHistory, copyToClipboard, downloadJSON, formatPercent, ScoreIcon }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma análise encontrada</p>
        </div>
      ) : (
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {filteredHistory.map((item, index) => (
            <div key={item.id} className="bg-gradient-to-r from-purple-900/40 to-pink-900/30 rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col gap-2">
              <div className="flex justify-between items-center gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-lg">#{filteredHistory.length - index}</span>
                  <span className="text-gray-400 text-xs whitespace-nowrap">{item.timestamp.split(',')[0]}</span>
                  <div className="flex items-center gap-1">
                    <ScoreIcon score={item.overallScore} />
                    <span className={`font-bold text-base ${
                      item.overallScore >= 80 ? 'text-green-400' :
                      item.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {item.overallScore}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyToClipboard(item.fullText)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                    title="Copiar prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadJSON(item)}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                    title="Baixar análise"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-200 mb-2 line-clamp-2 italic">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.metrics).slice(0, 4).map(([key, metric]) => (
                  <span key={key} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 font-medium">
                    {metric.label}: {formatPercent(metric.score)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
