// Componente principal de análise de prompts
// Organizado para máxima clareza, responsividade e experiência do usuário
import React, { useState, useCallback, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import PromptInput from './PromptInput';
import PromptResult from './PromptResult';
import SuggestionsBox from './ui/SuggestionsBox';
import { performAnalysis } from '../utils/analysis';

export default function PromptAnalyzer() {
  const [promptText, setPromptText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userIp, setUserIp] = useState('');

  // Busca IP do usuário ao carregar
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(() => setUserIp('desconhecido'));
  }, []);

  // Função para armazenar prompt + IP + user
  function savePromptData(prompt, analysis) {
    const prompts = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    const user = navigator.userAgent || 'desconhecido';
    prompts.push({
      prompt,
      analysis,
      ip: userIp,
      user,
      date: new Date().toISOString()
    });
    localStorage.setItem('promptHistory', JSON.stringify(prompts));
  }

  const analyzePrompt = async () => {
    if (!promptText.trim()) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = performAnalysis(promptText);
    setAnalysis(result);
    savePromptData(promptText, result);
    setIsAnalyzing(false);
  };

  // Sugestões inteligentes dinâmicas
  function gerarSugestoesPersonalizadas(analysis, promptText) {
    if (!analysis || !analysis.metrics) return [
      'Envie um prompt para receber sugestões inteligentes! 😊'
    ];
    // Se prompt inválido, só sugere como melhorar
    if (analysis.overallScore === 0) return analysis.suggestions;

    // Sugestões baseadas no histórico local
    let sugestoes = [...(analysis.suggestions || [])];
    try {
      const prompts = JSON.parse(localStorage.getItem('promptHistory') || '[]');
      // Exemplo: se o usuário já usou palavras similares, sugerir variações
      const palavrasPrompt = promptText.toLowerCase().split(/\s+/);
      const promptsSemelhantes = prompts.filter(p =>
        p.prompt && palavrasPrompt.some(w => p.prompt.toLowerCase().includes(w))
      );
      if (promptsSemelhantes.length > 2) {
        sugestoes.unshift('Você já usou prompts parecidos. Experimente variar o contexto ou objetivo para respostas mais ricas!');
      }
      // Sugestão dinâmica baseada em palavras-chave do histórico
      const palavrasMaisUsadas = {};
      prompts.forEach(p => {
        (p.prompt || '').toLowerCase().split(/\s+/).forEach(w => {
          if (w.length > 3) palavrasMaisUsadas[w] = (palavrasMaisUsadas[w] || 0) + 1;
        });
      });
      const topPalavra = Object.entries(palavrasMaisUsadas).sort((a,b)=>b[1]-a[1])[0];
      if (topPalavra && !palavrasPrompt.includes(topPalavra[0])) {
        sugestoes.push(`Inclua a palavra "${topPalavra[0]}" para explorar temas populares!`);
      }
    } catch {}
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
        {/* Header centralizado e limpo */}
        <header className="flex flex-col items-center justify-center mb-8 w-full">
          <div className="relative flex-shrink-0 mb-2">
            <Brain className="w-14 h-14 text-pink-500 animate-pulse" />
            <Sparkles className="w-7 h-7 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
          </div>
          <h1 className="text-4xl lg:text-5xl text-white font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight text-center" style={{letterSpacing: '-0.01em'}}>
            AI Prompt
          </h1>
          <p className="text-gray-300 text-lg text-center max-w-xs sm:max-w-md md:max-w-lg">Análise avançada de prompts com IA</p>
        </header>
        {/* Tela única de análise, cards alinhados e responsivos */}
        <main className="flex-1 flex flex-col items-center justify-start pt-4 pb-8 px-2 w-full max-w-5xl mx-auto">
          <section className="w-full flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Card do Prompt */}
              <div className="flex-1 min-w-0 flex">
                <div className="w-full flex flex-col justify-stretch h-full">
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
              </div>
              {/* Card de análise geral */}
              <div className="flex-1 min-w-0 flex">
                <div className="w-full flex flex-col justify-stretch h-full">
                  <PromptResult analysis={analysis} exibirPorcentagem compact />
                </div>
              </div>
            </div>
            {/* Sugestões inteligentes embaixo, ocupando toda a largura */}
            <div className="w-full">
              <SuggestionsBox
                suggestions={gerarSugestoesPersonalizadas(analysis, promptText)}
                onSuggestionClick={s => setPromptText(prev => prev + (prev ? '\n' : '') + s)}
                promptText={promptText}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
