// Componente de resultado da análise
import React from 'react';
import { Brain, Activity, BarChart3, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import ScoreBar from '../ui/ScoreBar';

export const formatPercent = score => `${score.toFixed(1)}%`;
export const ScoreIcon = ({ score }) => {
  if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
};

export default function PromptResult({ analysis, exibirPorcentagem, compact }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center text-gray-400 py-12">
        <div className="relative mb-6">
          <Brain className="w-20 h-20 text-gray-500" />
          <Activity className="w-8 h-8 text-pink-400 absolute -top-2 -right-2 animate-bounce" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Pronto para analisar!</h3>
        <p className="text-center">Cole seu prompt e descubra como melhorá-lo com nossa IA avançada.</p>
      </div>
    );
  }

  // Definir cor do score geral
  let scoreColor = 'text-red-400';
  if (analysis.overallScore >= 80) scoreColor = 'text-green-400';
  else if (analysis.overallScore >= 60) scoreColor = 'text-yellow-400';

  return (
    <section className={`w-full flex flex-col gap-6 ${compact ? 'max-h-[520px] overflow-y-auto custom-scrollbar min-h-[420px]' : ''}`}> 
      {/* Score geral */}
      <div className="flex flex-col items-center bg-transparent p-0 min-h-[220px] justify-center">
        <div className="relative flex items-center justify-center mb-2">
          <span className={`text-6xl font-bold ${scoreColor}`}>
            {exibirPorcentagem ? `${analysis.overallScore}%` : analysis.overallScore}
          </span>
          <span className="absolute -top-2 -right-8">
            <ScoreIcon score={analysis.overallScore} />
          </span>
        </div>
        <p className="text-gray-200 text-base font-medium">Pontuação Geral</p>
        <div className="mt-2 w-full max-w-xs">
          <ScoreBar score={analysis.overallScore} />
        </div>
      </div>
      {/* Métricas detalhadas - só as principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(analysis.metrics).map(([key, metric]) => {
          // Geração de resumo textual objetivo para cada métrica
          let resumo = '';
          if (key === 'clarity') {
            resumo = metric.score >= 80 ? 'Muito claro' : metric.score >= 60 ? 'Frase simples' : 'Pouca clareza';
          } else if (key === 'context') {
            resumo = metric.score >= 80 ? 'Contexto bem definido' : metric.score >= 60 ? 'Contexto razoável' : 'Falta objetivo claro';
          } else if (key === 'readability') {
            resumo = metric.score >= 90 ? 'Muito fácil' : metric.score >= 70 ? 'Fácil' : 'Difícil de ler';
          }
          return (
            <div key={key} className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-1 min-h-[120px] justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-semibold text-base">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <ScoreIcon score={metric.score} />
                  <span className={`font-bold text-base ${
                    metric.score >= 80 ? 'text-green-400' :
                    metric.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{formatPercent(metric.score)}</span>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    metric.score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    metric.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
              <div className="text-xs text-gray-300 mt-1">{resumo}</div>
            </div>
          );
        })}
      </div>
      {/* Insights detalhados, se existirem */}
      {analysis.insights && (
        <div className="mt-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-300/30">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5" />
            Insights Detalhados
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-200">
            <div>Palavras: {analysis.insights.wordCount ?? '-'}</div>
            <div>Frases: {analysis.insights.sentenceCount ?? '-'}</div>
            <div>Tokens: ~{analysis.insights.estimatedTokens ?? analysis.tokenCount ?? '-'}</div>
            <div>Leitura: {analysis.insights.readingTime ?? '-'}</div>
          </div>
        </div>
      )}
    </section>
  );
}
