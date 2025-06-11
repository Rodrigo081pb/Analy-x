// src/components/ui/SuggestionsBox.jsx
// Componente migrado para ./SuggestionsBox/index.jsx
// Componente para sugestões inteligentes, interativas e responsivas
import React, { useState } from 'react';
import { Lightbulb, ExternalLink, Send } from 'lucide-react';

export default function SuggestionsBox({ suggestions, onSuggestionClick, promptText }) {
  const [showExport, setShowExport] = useState(false);
  // Só mostra o botão se houver sugestões E prompt
  const podeExportar = suggestions && suggestions.length > 0 && promptText && promptText.trim().length > 0;

  // Função para exportar para ChatGPT e tentar enviar automaticamente
  function exportToChatGPT() {
    const texto =
      `Prompt original:\n${promptText}\n\nSugestões para melhorar:\n- ${suggestions.join('\n- ')}`;
    const prompt = encodeURIComponent(texto);
    // Script para colar e enviar automaticamente no ChatGPT
    const script = encodeURIComponent(`
      (function() {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.value = decodeURIComponent('${prompt}');
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          setTimeout(function() {
            const sendBtn = document.evaluate("/html/body/div[1]/div[2]/div[1]/main/div[2]/form/div/div[2]/div/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (sendBtn) sendBtn.click();
          }, 500);
        }
      })();
    `);
    window.open(`https://chat.openai.com/?prompt=${prompt}#inject-script=${script}`, '_blank');
  }

  if (!podeExportar) {
    return (
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/30 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-white font-bold text-xl flex-1">Sugestões Inteligentes</h3>
        </div>
        <p className="text-gray-200 text-sm mb-2">Envie um prompt para receber sugestões inteligentes! 😊</p>
        <p className="text-gray-400 text-xs mb-2">O botão de exportar só aparece quando houver sugestões e um prompt preenchido.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/30 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h3 className="text-white font-bold text-xl flex-1">Sugestões Inteligentes</h3>
        {/* Botão de exportar no topo direito */}
        <div className="relative">
          <button
            className="ml-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-semibold shadow hover:from-pink-600 hover:to-purple-700 focus:outline-none"
            onClick={exportToChatGPT}
            title="Exportar sugestões para ChatGPT"
          >
            <Send className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-xs mb-2">Clique em <b>Exportar</b> para enviar seu prompt e as sugestões diretamente para o ChatGPT. O envio será feito automaticamente!</p>
      {/* Lista de sugestões interativas */}
      <ul className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-200">
            <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-base cursor-pointer hover:underline" onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
