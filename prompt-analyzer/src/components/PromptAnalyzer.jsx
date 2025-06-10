import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  FileText, TrendingUp, Clock, Target, MessageSquare,
  Brain, Upload, Download, Trash2
} from 'lucide-react';

const PromptAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [promptText, setPromptText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptAnalyzerHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Salvar no localStorage
  const saveToHistory = (newAnalysis) => {
    const newHistory = [newAnalysis, ...history].slice(0, 10); // Máximo 10 análises
    setHistory(newHistory);
    localStorage.setItem('promptAnalyzerHistory', JSON.stringify(newHistory));
  };

  // Função principal de análise
  const analyzePrompt = async () => {
    if (!promptText.trim()) return;
    
    setIsAnalyzing(true);
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis = performAnalysis(promptText);
    setAnalysis(analysis);
    saveToHistory(analysis);
    setIsAnalyzing(false);
  };

  // Algoritmo de análise de prompts
  const performAnalysis = (text) => {
    const words = text.trim().split(/\\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const tokens = Math.ceil(words.length * 1.3); // Aproximação de tokens
    
    // Análise de Clareza
    const clarityScore = calculateClarity(text, sentences);
    
    // Análise de Contexto
    const contextScore = calculateContext(text, words);
    
    // Análise de Comprimento
    const lengthScore = calculateLengthScore(words.length, tokens);
    
    // Análise de Foco/Objetivo
    const focusScore = calculateFocus(text, words);
    
    // Análise de Sentimento/Tom
    const sentimentAnalysis = analyzeSentiment(text, words);
    
    const overallScore = Math.round((clarityScore + contextScore + lengthScore + focusScore + sentimentAnalysis.score) / 5);
    
    return {
      id: Date.now(),
      timestamp: new Date().toLocaleString('pt-BR'),
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      fullText: text,
      wordCount: words.length,
      tokenCount: tokens,
      overallScore,
      metrics: {
        clarity: { score: clarityScore, label: 'Clareza' },
        context: { score: contextScore, label: 'Contexto' },
        length: { score: lengthScore, label: 'Comprimento' },
        focus: { score: focusScore, label: 'Foco' },
        sentiment: { score: sentimentAnalysis.score, label: 'Tom', tone: sentimentAnalysis.tone }
      },
      suggestions: generateSuggestions(clarityScore, contextScore, lengthScore, focusScore, sentimentAnalysis)
    };
  };

  const calculateClarity = (text, sentences) => {
    let score = 70; // Base score
    const punctuationMarks = (text.match(/[.!?;,]/g) || []).length;
    const punctuationRatio = punctuationMarks / text.length * 100;
    if (punctuationRatio > 2 && punctuationRatio < 8) score += 15;
    const avgSentenceLength = text.length / sentences.length;
    if (avgSentenceLength > 20 && avgSentenceLength < 150) score += 10;
    const connectives = ['então', 'portanto', 'assim', 'além disso', 'por exemplo', 'ou seja', 'isto é'];
    if (connectives.some(conn => text.toLowerCase().includes(conn))) score += 5;
    return Math.min(100, Math.max(0, score));
  };

  const calculateContext = (text, words) => {
    let score = 50;
    const contextWords = ['contexto', 'situação', 'cenário', 'público', 'objetivo', 'meta', 'propósito', 'audiência', 'para', 'sobre', 'quando', 'onde', 'como', 'porque'];
    score += contextWords.filter(word => text.toLowerCase().includes(word)).length * 5;
    const specificWords = ['específico', 'detalhado', 'preciso', 'exato', 'particular'];
    if (specificWords.some(word => text.toLowerCase().includes(word))) score += 15;
    const exampleWords = ['exemplo', 'como', 'tipo', 'similar', 'igual'];
    if (exampleWords.some(word => text.toLowerCase().includes(word))) score += 10;
    return Math.min(100, Math.max(0, score));
  };

  const calculateLengthScore = (wordCount, tokenCount) => {
    let score = 50;
    if (wordCount >= 20 && wordCount <= 200) score += 30;
    else if (wordCount < 20) score -= (20 - wordCount) * 2;
    else if (wordCount > 200) score -= (wordCount - 200) * 0.5;
    if (tokenCount >= 25 && tokenCount <= 250) score += 20;
    return Math.min(100, Math.max(0, score));
  };

  const calculateFocus = (text, words) => {
    let score = 40;
    const actionVerbs = ['crie', 'faça', 'desenvolva', 'escreva', 'analise', 'explique', 'descreva', 'liste', 'compare', 'avalie', 'calcule', 'determine', 'identifique', 'gere', 'produza'];
    score += actionVerbs.filter(verb => text.toLowerCase().includes(verb)).length * 10;
    const goalWords = ['quero', 'preciso', 'objetivo', 'meta', 'resultado', 'output', 'entregar'];
    if (goalWords.some(word => text.toLowerCase().includes(word))) score += 20;
    const directWords = ['por favor', 'você deve', 'é necessário', 'faça isso', 'execute'];
    if (directWords.some(word => text.toLowerCase().includes(word))) score += 15;
    return Math.min(100, Math.max(0, score));
  };

  const analyzeSentiment = (text, words) => {
    let score = 70;
    let tone = 'neutro';
    const positiveWords = ['bom', 'ótimo', 'excelente', 'perfeito', 'incrível', 'fantástico', 'por favor'];
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'falha'];
    const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;
    if (positiveCount > negativeCount) { tone = 'positivo'; score += 15; }
    else if (negativeCount > positiveCount) { tone = 'negativo'; score -= 10; }
    if (text.includes('?')) { tone = 'interrogativo'; score += 10; }
    const persuasiveWords = ['convença', 'persuada', 'argumente', 'justifique'];
    if (persuasiveWords.some(word => text.toLowerCase().includes(word))) { tone = 'persuasivo'; score += 5; }
    const technicalWords = ['análise', 'método', 'processo', 'sistema', 'função', 'algoritmo'];
    if (technicalWords.some(word => text.toLowerCase().includes(word))) { tone = 'técnico'; score += 10; }
    return { score: Math.min(100, Math.max(0, score)), tone };
  };

  const generateSuggestions = (clarity, context, length, focus, sentiment) => {
    const suggestions = [];
    if (clarity < 70) suggestions.push('Melhore a clareza: Use pontuação adequada e frases bem estruturadas');
    if (context < 60) suggestions.push('Adicione mais contexto: Especifique o público-alvo, situação ou cenário');
    if (length < 60) suggestions.push('Ajuste o comprimento: Prompts muito curtos ou longos podem ser ineficazes');
    if (focus < 60) suggestions.push('Defina objetivos claros: Use verbos imperativos e especifique o resultado desejado');
    if (sentiment.score < 60) suggestions.push('Melhore o tom: Use linguagem mais positiva e direta');
    if (suggestions.length === 0) suggestions.push('Excelente prompt! Continue refinando para melhores resultados');
    return suggestions;
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('promptAnalyzerHistory');
  };

  const exportAnalysis = () => {
    if (!analysis) return;
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-analysis-${Date.now()}.json`;
    link.click();
  };

  const radarData = analysis ? [
    { subject: 'Clareza', A: analysis.metrics.clarity.score, fullMark: 100 },
    { subject: 'Contexto', A: analysis.metrics.context.score, fullMark: 100 },
    { subject: 'Comprimento', A: analysis.metrics.length.score, fullMark: 100 },
    { subject: 'Foco', A: analysis.metrics.focus.score, fullMark: 100 },
    { subject: 'Tom', A: analysis.metrics.sentiment.score, fullMark: 100 }
  ] : [];

  const barData = history.map((item, index) => ({
    name: `Análise ${history.length - index}`,
    score: item.overallScore,
    timestamp: item.timestamp
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-purple-400" />
            Prompt Analyzer
          </h1>
          <p className="text-purple-200">Analise e otimize seus prompts com IA</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 flex gap-1">
            {[{ id: 'analyzer', label: 'Analisador', icon: MessageSquare },
              { id: 'history', label: 'Histórico', icon: Clock },
              { id: 'charts', label: 'Gráficos', icon: TrendingUp }]
              .map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
          </div>
        </div>

        {/* Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Insira seu Prompt
              </h2>
              
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Cole seu prompt aqui para análise completa..."
                className="w-full h-64 p-4 bg-white/5 border border-white/30 rounded-lg text-white placeholder-purple-200 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-purple-200 text-sm">
                  {promptText.length} caracteres, ~{Math.ceil(promptText.split(/\s+/).length * 1.3)} tokens
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={exportAnalysis}
                    disabled={!analysis}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                  <button
                    onClick={analyzePrompt}
                    disabled={!promptText.trim() || isAnalyzing}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all transform hover:scale-105"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        Analisar Prompt
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Resultado da Análise
              </h2>
              
              {!analysis ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-purple-200">Insira um prompt e clique em "Analisar" para ver os resultados</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${
                      analysis.overallScore >= 80 ? 'text-green-400' :
                      analysis.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {analysis.overallScore}
                    </div>
                    <p className="text-purple-200">Pontuação Geral</p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4">
                    {Object.entries(analysis.metrics).map(([key, metric]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{metric.label}</span>
                          <span className={`font-bold ${
                            metric.score >= 80 ? 'text-green-400' :
                            metric.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {metric.score}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              metric.score >= 80 ? 'bg-green-400' :
                              metric.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{width: `${metric.score}%`}}
                          />
                        </div>
                        {key === 'sentiment' && metric.tone && (
                          <p className="text-purple-200 text-sm mt-1">Tom: {metric.tone}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2">💡 Sugestões de Melhoria</h3>
                    <ul className="text-blue-100 text-sm space-y-1">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">{analysis.wordCount}</div>
                      <div className="text-purple-200 text-sm">Palavras</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">{analysis.tokenCount}</div>
                      <div className="text-purple-200 text-sm">Tokens</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Histórico de Análises
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Histórico
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200">Nenhuma análise no histórico ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium truncate">{item.text}</p>
                        <p className="text-purple-200 text-sm">{item.timestamp}</p>
                      </div>
                      <div className={`text-2xl font-bold ml-4 ${
                        item.overallScore >= 80 ? 'text-green-400' :
                        item.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {item.overallScore}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {Object.entries(item.metrics).map(([key, metric]) => (
                        <div key={key} className="text-center">
                          <div className={`text-sm font-bold ${
                            metric.score >= 80 ? 'text-green-400' :
                            metric.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {metric.score}
                          </div>
                          <div className="text-purple-200 text-xs">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-8">
            {/* Radar Chart */}
            {analysis && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Análise Atual - Visão Radar</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#ffffff30" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#e0e7ff', fontSize: 12 }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: '#e0e7ff', fontSize: 10 }} 
                      />
                      <Radar 
                        name="Score" 
                        dataKey="A" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Bar Chart */}
            {history.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Histórico de Pontuações</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#e0e7ff', fontSize: 12 }} 
                        stroke="#ffffff30"
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fill: '#e0e7ff', fontSize: 12 }} 
                        stroke="#ffffff30"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e1b4b', 
                          border: '1px solid #8b5cf6',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                        formatter={(value, name) => [value + ' pontos', 'Pontuação']}
                        labelFormatter={(label) => {
                          const item = barData.find(d => d.name === label);
                          return item ? `${label} - ${item.timestamp}` : label;
                        }}
                      />
                      <Bar 
                        dataKey="score" 
                        fill="url(#gradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {!analysis && history.length === 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center py-12">
                <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200">Realize algumas análises para ver os gráficos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptAnalyzer;
