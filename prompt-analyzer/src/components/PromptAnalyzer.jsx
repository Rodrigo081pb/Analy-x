// src/components/PromptAnalyzer.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { FileText, TrendingUp, Clock, Brain, RefreshCw, Target, Download, Trash2, MessageSquare } from 'lucide-react';

import {
  performAnalysis,
  calculateClarity,
  calculateContext,
  calculateLengthScore,
  calculateFocus,
  analyzeSentiment,
  calculateReadability,
  calculateKeywordDensity,
  generateSuggestions
} from '../utils/analysis';

const formatPercent = score => `${score.toFixed(1)}%`;

const PromptAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [promptText, setPromptText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  // Carrega histórico
  useEffect(() => {
    const saved = localStorage.getItem('promptAnalyzerHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = item => {
    const updated = [item, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('promptAnalyzerHistory', JSON.stringify(updated));
  };

  const analyzePrompt = async () => {
    if (!promptText.trim()) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = performAnalysis(promptText);
    setAnalysis(result);
    saveToHistory(result);
    setIsAnalyzing(false);
  };

  // Dados para gráficos
  const radarData = analysis
    ? [
        { subject: 'Clareza', A: analysis.metrics.clarity.score },
        { subject: 'Contexto', A: analysis.metrics.context.score },
        { subject: 'Comprimento', A: analysis.metrics.length.score },
        { subject: 'Foco', A: analysis.metrics.focus.score },
        { subject: 'Tom', A: analysis.metrics.sentiment.score }
      ]
    : [];
  const barData = history.map((item, i) => ({ name: `${i + 1}`, score: item.overallScore })).reverse();
  const pieData = analysis
    ? Object.entries(analysis.metrics).map(([_, m]) => ({ name: m.label, value: m.score }))
    : [];
  const lineData = history
    .filter(i => i.metrics?.readability)
    .map((item, idx) => ({ index: idx + 1, legibilidade: item.metrics.readability.score }))
    .reverse();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#2a076e,#03001e)] w-full px-6 py-8 lg:px-20 lg:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-10 h-10 text-pink-500 animate-pulse" />
          <h1 className="text-3xl md:text-4xl text-white font-extrabold">Prompt Analyzer</h1>
        </div>
        <nav className="flex gap-2 mt-4 md:mt-0">
          {[
            { id: 'analyzer', label: 'Analisar', icon: MessageSquare },
            { id: 'history', label: 'Histórico', icon: Clock },
            { id: 'charts', label: 'Gráficos', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900'
                  : 'text-gray-300 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Full-width container */}
      <div className="max-w-screen-3xl mx-auto w-full">
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Analyzer Tab */}
          {activeTab === 'analyzer' && (
            <section className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 flex flex-col">
                <label className="flex items-center gap-2 text-white font-semibold mb-2">
                  <FileText className="w-6 h-6" /> Cole seu prompt
                </label>
                <textarea
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  rows={6}
                  className="flex-1 bg-white/5 border border-white/30 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  placeholder="Escreva aqui..."
                />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                  <span className="text-gray-200 text-sm">
                    {promptText.length} chars • {Math.ceil(promptText.split(/\s+/).length * 1.3)} tokens
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={analyzePrompt}
                      disabled={!promptText.trim() || isAnalyzing}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
                    >
                      {isAnalyzing
                        ? <RefreshCw className="animate-spin w-5 h-5" />
                        : <Target className="w-5 h-5" />}
                      <span>{isAnalyzing ? 'Analisando...' : 'Analisar'}</span>
                    </button>
                    <button
                      onClick={() => analysis && downloadJSON(analysis)}
                      disabled={!analysis}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition"
                    >
                      <Download className="w-5 h-5" />
                      <span>Exportar</span>
                    </button>
                  </div>
                </div>
              </div>

              {analysis && (
                <div className="bg-purple-800/50 p-4 rounded-xl">
                  <h3 className="text-white font-bold mb-2">💡 Dicas Rápidas</h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-1">
                    {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Result / History / Charts */}
          <section className="space-y-6">
            {/* Resultado */}
            {activeTab === 'analyzer' && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-6">
                {!analysis ? (
                  <div className="flex flex-col items-center text-gray-400 py-20">
                    <Brain className="w-16 h-16 mb-4" />
                    <p>Faça uma análise pra ver os resultados aqui.</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <span className={`text-6xl font-bold ${
                        analysis.overallScore >= 80 ? 'text-green-400' :
                        analysis.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {analysis.overallScore}
                      </span>
                      <p className="text-gray-200">Pontuação Geral</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(analysis.metrics).map(([k, m]) => (
                        <div key={k} className="bg-white/5 p-4 rounded-lg flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{m.label}</span>
                            <span className={`font-bold ${
                              m.score >= 80 ? 'text-green-400' :
                              m.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {formatPercent(m.score)}
                            </span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                m.score >= 80 ? 'bg-green-400' :
                                m.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${m.score}%` }}
                            />
                          </div>
                          {k === 'sentiment' && m.tone && (
                            <p className="text-gray-300 text-sm mt-1">Tom: {m.tone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Histórico */}
            {activeTab === 'history' && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-white font-semibold flex items-center gap-2">
                    <Clock className="w-6 h-6" /> Histórico
                  </h2>
                  <button
                    onClick={() => { setHistory([]); localStorage.removeItem('promptAnalyzerHistory'); }}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {history.length === 0 ? (
                  <p className="text-gray-400">Sem análises ainda.</p>
                ) : (
                  <ul className="space-y-3 max-h-96 overflow-auto">
                    {history.map(item => (
                      <li key={item.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-white truncate">{item.text}</p>
                          <small className="text-gray-300">{item.timestamp}</small>
                        </div>
                        <span className={`font-bold ${
                          item.overallScore >= 80 ? 'text-green-400' :
                          item.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {item.overallScore}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Gráficos */}
            {activeTab === 'charts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 auto-rows-fr">

                {/* 1. Radar de Métricas */}
                {analysis && (
                  <article
                    role="region"
                    aria-label="Radar de métricas"
                    className="bg-white/10 backdrop-blur rounded-3xl p-12 flex flex-col w-full h-[450px]">
                    <h2 className="text-white font-semibold text-2xl mb-4">Radar de Métricas</h2>
                    <p className="text-gray-300 text-base mb-6">
                      Radar mostra 5 dimensões do prompt (Clareza, Contexto, Comprimento, Foco e Tom).
                    </p>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                          <PolarGrid stroke="#ffffff30" />
                          <PolarAngleAxis tick={{ fill: '#e0e7ff', fontSize: 18 }} tickMargin={24} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#e0e7ff' }} />
                          <Legend verticalAlign="bottom" iconType="circle" />
                          <Radar dataKey="A" stroke="#ff0080" fill="#ff0080" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                )}

                {/* 2. Histórico de Scores */}
                {history.length > 0 && (
                  <article
                    role="region"
                    aria-label="Histórico de pontuações"
                    className="bg-white/10 backdrop-blur rounded-3xl p-12 flex flex-col w-full h-[450px]">
                    <h2 className="text-white font-semibold text-2xl mb-4">Histórico de Scores</h2>
                    <p className="text-gray-300 text-base mb-6">
                      Evolução da pontuação geral nas últimas análises.
                    </p>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                          <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fill: '#e0e7ff', fontSize: 16 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#e0e7ff', fontSize: 16 }} />
                          <Tooltip wrapperStyle={{ outline: 'none' }} />
                          <Legend verticalAlign="bottom" />
                          <Bar dataKey="score" fill="url(#grad)" radius={[4, 4, 0, 0]} barSize={48} />
                          <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ff0080" />
                              <stop offset="100%" stopColor="#7900d1" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                )}

                {/* 3. Distribuição de Métricas */}
                {analysis && (
                  <article
                    role="region"
                    aria-label="Distribuição de métricas"
                    className="bg-white/10 backdrop-blur rounded-3xl p-12 flex flex-col w-full h-[450px]">
                    <h2 className="text-white font-semibold text-2xl mb-4">Distribuição de Métricas</h2>
                    <p className="text-gray-300 text-base mb-6">
                      Percentual de cada dimensão avaliada.
                    </p>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="50%"
                            outerRadius="70%"
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((_, idx) => (
                              <Cell key={idx} fill={['#FF0080', '#7900D1', '#00C49F', '#FFBB28', '#FF8042'][idx % 5]} />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                )}

                {/* 4. Evolução da Legibilidade */}
                {lineData.length > 0 && (
                  <article
                    role="region"
                    aria-label="Evolução da legibilidade"
                    className="bg-white/10 backdrop-blur rounded-3xl p-12 flex flex-col w-full h-[450px]">
                    <h2 className="text-white font-semibold text-2xl mb-4">Evolução da Legibilidade</h2>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                          <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
                          <XAxis dataKey="index" tick={{ fill: '#e0e7ff', fontSize: 16 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#e0e7ff', fontSize: 16 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="legibilidade" stroke="#00C49F" dot />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

const downloadJSON = data => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis-${Date.now()}.json`;
  a.click();
};

export default PromptAnalyzer;
