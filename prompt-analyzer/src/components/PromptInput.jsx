// Componente migrado para ./PromptInput/index.jsx
// Responsivo, com comentários e foco em UX
import React from 'react';
import { FileText, Eye, BookOpen, Zap, RefreshCw, Target, Download } from 'lucide-react';

export default function PromptInput({ promptText, setPromptText, analyzePrompt, isAnalyzing, analysis, downloadJSON }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
      {/* Título e ícone */}
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-7 h-7 text-pink-400" />
        <h2 className="text-2xl text-white font-bold">Seu Prompt</h2>
      </div>
      {/* Área de texto responsiva */}
      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        rows={8}
        className="w-full bg-white/5 border border-white/30 rounded-2xl p-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg resize-none"
        placeholder="Cole aqui seu prompt para análise detalhada..."
      />
      {/* Métricas rápidas e botões de ação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {promptText.length} chars
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {promptText.trim().split(/\s+/).filter(w => w).length} palavras
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              ~{Math.ceil(promptText.trim().split(/\s+/).filter(w => w).length * 1.3)} tokens
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={analyzePrompt}
            disabled={!promptText.trim() || isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isAnalyzing ? (
              <RefreshCw className="animate-spin w-5 h-5" />
            ) : (
              <Target className="w-5 h-5" />
            )}
            <span>{isAnalyzing ? 'Analisando...' : 'Analisar'}</span>
          </button>
          {analysis && (
            <button
              onClick={() => downloadJSON(analysis)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Exportar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
