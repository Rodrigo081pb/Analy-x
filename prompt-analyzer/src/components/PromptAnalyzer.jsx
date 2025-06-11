// Componente principal de análise de prompts
// Organizado para máxima clareza, responsividade e experiência do usuário
import React, { useState, useCallback } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import PromptInput from './PromptInput';
import PromptResult from './PromptResult';
import SuggestionsBox from './ui/SuggestionsBox';
import { performAnalysis } from '../utils/analysis';

export default function PromptAnalyzer() {
  const [promptText, setPromptText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePrompt = async () => {
    if (!promptText.trim()) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = performAnalysis(promptText);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  // Sugestões inteligentes
  function gerarSugestoesPersonalizadas(analysis) {
    if (!analysis || !analysis.metrics) return [
      'Envie um prompt para receber sugestões inteligentes! 😊'
    ];
    const { clarity = {}, context = {}, length = {}, focus = {}, sentiment = {}, readability = {}, structure = {}, keywords = {} } = analysis.metrics;
    const sugestoes = [];
    if ((clarity.score ?? 0) < 70) sugestoes.push('Que tal tornar seu prompt mais claro? Experimente explicar o objetivo principal em uma frase.');
    else sugestoes.push('Ótima clareza! Seu prompt está fácil de entender. 👏');
    if ((context.score ?? 0) < 70) sugestoes.push('Adicione mais contexto para ajudar a IA a entender melhor sua intenção.');
    else sugestoes.push('O contexto está bem definido, continue assim!');
    if ((length.score ?? 0) < 50) sugestoes.push('Seu prompt está um pouco curto. Tente detalhar mais para obter respostas mais completas.');
    else if ((length.score ?? 0) > 90) sugestoes.push('O prompt está longo, tente resumir para facilitar a compreensão.');
    else sugestoes.push('O comprimento do prompt está ideal!');
    if ((focus.score ?? 0) < 60) sugestoes.push('Foque em um único objetivo para obter respostas mais precisas.');
    else sugestoes.push('Seu prompt está bem focado!');
    if ((sentiment.score ?? 0) < 50) sugestoes.push('Considere usar um tom mais positivo para incentivar respostas construtivas.');
    else sugestoes.push('O tom do seu prompt está excelente!');
    if ((readability.score ?? 0) < 60) sugestoes.push('Simplifique a linguagem para tornar o prompt mais acessível.');
    else sugestoes.push('A legibilidade está ótima!');
    if ((structure.score ?? 0) < 60) sugestoes.push('Organize seu prompt em tópicos ou perguntas para facilitar a análise.');
    else sugestoes.push('A estrutura do prompt está muito boa!');
    if ((keywords.score ?? 0) < 60) sugestoes.push('Inclua palavras-chave relevantes para direcionar melhor a resposta da IA.');
    else sugestoes.push('As palavras-chave estão bem escolhidas!');
    sugestoes.push('🔄 Experimente reformular seu prompt e veja como a pontuação muda!');
    sugestoes.push('💡 Dica: Use exemplos no seu prompt para obter respostas mais específicas.');
    sugestoes.push('🎯 Precisa de inspiração? Clique em "Analisar" novamente após ajustar seu texto!');
    return sugestoes;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full flex flex-col">
      {/* Fundo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-10 px-2 sm:px-4 py-6 lg:px-12 lg:py-12 flex-1 flex flex-col justify-center">
        {/* Header apenas branding */}
        <header className="flex flex-col lg:flex-row items-center justify-between mb-8 pt-4 bg-transparent w-full z-40 px-2 sm:px-4 lg:px-12 py-4" style={{boxShadow: '0 2px 24px 0 rgba(80,0,120,0.08)'}}>
          <div className="flex items-center gap-4 mb-6 lg:mb-0 min-w-0">
            <div className="relative flex-shrink-0">
              <Brain className="w-12 h-12 text-pink-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
            </div>
            <div className="truncate">
              <h1 className="text-4xl lg:text-5xl text-white font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight" style={{letterSpacing: '-0.01em'}}>
                AI Prompt
              </h1>
              <p className="text-gray-300 text-lg truncate max-w-xs sm:max-w-md md:max-w-lg">Análise avançada de prompts com IA</p>
            </div>
          </div>
        </header>
        {/* Tela única de análise, cards alinhados e responsivos */}
        <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-8 px-2 w-full max-w-4xl mx-auto">
          <section className="w-full flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Card do Prompt */}
              <div className="flex-1 min-w-0">
                <PromptInput
                  promptText={promptText}
                  setPromptText={setPromptText}
                  analyzePrompt={analyzePrompt}
                  isAnalyzing={isAnalyzing}
                  analysis={analysis}
                  downloadJSON={() => {}}
                  hideStats
                />
              </div>
              {/* Card de análise geral */}
              <div className="flex-1 min-w-0">
                <PromptResult analysis={analysis} exibirPorcentagem compact />
              </div>
            </div>
            {/* Sugestões inteligentes embaixo, ocupando toda a largura */}
            <div className="w-full">
              <SuggestionsBox
                suggestions={gerarSugestoesPersonalizadas(analysis, promptText)}
                onSuggestionClick={s => setPromptText(prev => prev + (prev ? '\n' : '') + s)}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
