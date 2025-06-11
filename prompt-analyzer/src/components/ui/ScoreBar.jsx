// src/components/ui/ScoreBar/index.jsx
// Componente migrado para ./ScoreBar/index.jsx
// Barra de pontuação animada e responsiva
import React from 'react';

export default function ScoreBar({ score }) {
  let color = 'bg-gradient-to-r from-red-400 to-red-500';
  if (score >= 80) color = 'bg-gradient-to-r from-green-400 to-green-500';
  else if (score >= 60) color = 'bg-gradient-to-r from-yellow-400 to-yellow-500';
  return (
    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
