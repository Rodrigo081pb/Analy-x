// src/components/ui/SuggestionsBox.jsx
// Componente migrado para ./SuggestionsBox/index.jsx
// Componente para sugestões inteligentes, interativas e responsivas
import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function SuggestionsBox({ suggestions, onSuggestionClick }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/30 mt-4">
      {/* Título e ícone */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h3 className="text-white font-bold text-xl">Sugestões Inteligentes</h3>
      </div>
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
