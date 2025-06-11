// Componente migrado para ./PromptResult/index.jsx
// Componente de resultado da análise
// Responsivo, com comentários e foco em UX
import React from 'react';
import { Brain, Activity, BarChart3, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import ScoreBar from './ui/ScoreBar';

export const formatPercent = score => `${score.toFixed(1)}%`;
export const ScoreIcon = ({ score }) => {
  if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
};

export default function PromptResult({ analysis }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center text-gray-400 py-16">
        <div className="relative mb-6">
          <Brain className="w-20 h-20 text-gray-500" />
          <Activity className="w-8 h-8 text-pink-400 absolute -top-2 -right-2 animate-bounce" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Pronto para analisar!</h3>
        <p className="text-center">Cole seu prompt e descubra como melhorá-lo com nossa IA avançada.</p>
      </div>
    );
  }
  return (
    <>
      {/* Score geral */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className={`text-7xl font-bold mb-2 ${
            analysis.overallScore >= 80 ? 'text-green-400' :
            analysis.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {analysis.overallScore}
          </div>
          <div className="absolute -top-2 -right-2">
            <ScoreIcon score={analysis.overallScore} />
          </div>
        </div>
        <p className="text-gray-200 text-lg font-medium">Pontuação Geral</p>
        <div className="mt-4 max-w-md mx-auto">
          <ScoreBar score={analysis.overallScore} />
        </div>
      </div>
      {/* Métricas detalhadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(analysis.metrics).map(([key, metric]) => (
          <div key={key} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold text-lg">{metric.label}</span>
              <div className="flex items-center gap-2">
                <ScoreIcon score={metric.score} />
                <span className={`font-bold text-lg ${
                  metric.score >= 80 ? 'text-green-400' :
                  metric.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {formatPercent(metric.score)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  metric.score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  metric.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                  'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
            {/* Exibir detalhes se houver */}
            {metric.details && (
              <div className="text-gray-300 text-sm">
                {typeof metric.details === 'object' ? 
                  Object.entries(metric.details).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="capitalize">
                      {k.replace(/([A-Z])/g, ' $1').toLowerCase()}: {String(v)}
                    </div>
                  )) : 
                  <div>{metric.details}</div>
                }
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Insights detalhados, se existirem */}
      {analysis.insights && (
        <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-5 border border-blue-300/30">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Insights Detalhados
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-200">
            <div>Palavras: {analysis.insights.wordCount ?? '-'}</div>
            <div>Frases: {analysis.insights.sentenceCount ?? '-'}</div>
            <div>Tokens: ~{analysis.insights.estimatedTokens ?? analysis.tokenCount ?? '-'}</div>
            <div>Leitura: {analysis.insights.readingTime ?? '-'}</div>
            <div>Complexidade: {analysis.insights.complexity?.level ?? '-'}</div>
            <div>Palavras/Frase: {analysis.insights.avgWordsPerSentence ?? '-'}</div>
          </div>
        </div>
      )}
    </>
  );
}
