// Componente migrado para ./PromptInput/index.jsx
// Responsivo, com comentários e foco em UX
import React, { useState } from 'react';
import { FileText, Eye, BookOpen, Zap, RefreshCw, Target } from 'lucide-react';

const BAD_WORDS = [
  'burro', 'idiota', 'merda', 'bosta', 'otário', 'fdp', 'porra', 'caralho', 'desgraça', 'imbecil', 'lixo', 'palhaço', 'babaca', 'corno', 'puta', 'vagabundo', 'arrombado', 'macaco', 'viado', 'racista', 'preconceito', 'preconceituoso', 'xingar', 'xingamento', 'palavrão', 'palavrões'
];
function hasBadWords(text) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(w => lower.includes(w));
}
function isPromptValid(text) {
  const wordsArr = text.trim().split(/\s+/);
  if (wordsArr.length < 4) return false;
  if (hasBadWords(text)) return false;
  return true;
}

export default function PromptInput({ promptText, setPromptText, analyzePrompt, isAnalyzing }) {
  const [touched, setTouched] = useState(false);
  const valid = isPromptValid(promptText);
  let errorMsg = '';
  if (touched && !valid) {
    if (hasBadWords(promptText)) errorMsg = 'Seu prompt contém palavras inadequadas. Reformule sem xingamentos.';
    else errorMsg = 'Digite pelo menos 4 palavras/frases completas para receber análise.';
  }
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl min-h-[420px] flex flex-col justify-center">
      {/* Título e ícone */}
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-7 h-7 text-pink-400" />
        <h2 className="text-2xl text-white font-bold">Seu Prompt</h2>
      </div>
      {/* Área de texto responsiva */}
      <textarea
        value={promptText}
        onChange={e => { setPromptText(e.target.value); setTouched(true); }}
        rows={8}
        className="w-full bg-white/5 border border-white/30 rounded-2xl p-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg resize-none"
        placeholder="Cole aqui seu prompt para análise detalhada..."
      />
      {errorMsg && (
        <div className="text-red-400 text-sm mt-2">{errorMsg}</div>
      )}
      {/* Botões de ação */}
      <div className="flex justify-center mt-6">
        <button
          onClick={analyzePrompt}
          disabled={!promptText.trim() || isAnalyzing || !valid}
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
