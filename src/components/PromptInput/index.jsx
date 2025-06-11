// Componente de entrada de prompt
import React from 'react';
import { FileText, RefreshCw, Target } from 'lucide-react';

export default function PromptInput({ promptText, setPromptText, analyzePrompt, isAnalyzing }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 flex flex-col h-full border border-white/20 shadow-2xl">
      {/* Título e ícone */}
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-7 h-7 text-pink-400" />
        <h2 className="text-xl md:text-2xl text-white font-bold">Seu Prompt</h2>
      </div>
      {/* Área de texto responsiva */}
      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        rows={8}
        className="w-full bg-white/5 border border-white/30 rounded-xl p-4 md:p-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-base md:text-lg resize-none min-h-[120px] max-h-[320px]"
        placeholder="Cole aqui seu prompt para análise detalhada..."
        disabled={isAnalyzing}
        spellCheck={true}
        autoFocus
      />
      {/* Botões de ação */}
      <div className="flex justify-center mt-6 flex-1">
        <button
          onClick={analyzePrompt}
          disabled={!promptText.trim() || isAnalyzing}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto text-lg"
        >
          {isAnalyzing ? (
            <RefreshCw className="animate-spin w-5 h-5" />
          ) : (
            <Target className="w-5 h-5" />
          )}
          <span>{isAnalyzing ? 'Analisando...' : 'Analisar'}</span>
        </button>
      </div>
    </div>
  );
}
