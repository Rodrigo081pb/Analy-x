import React from 'react';
import { TrendingUp, Target, Activity, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Line, PieChart, Pie, Cell, Bar, BarChart } from 'recharts';

const COLORS = ['#FF0080', '#7900D1', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export default function ChartsPanel({ analysis, radarData, trendData, pieData, history }) {
  if (!analysis && (!history || history.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <TrendingUp className="w-16 h-16 mb-4 text-pink-400" />
        <p className="text-lg">Nenhum dado para exibir gráficos ainda.<br/>Faça uma análise para visualizar os gráficos!</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Radar Chart */}
      {analysis && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-pink-400" />
            Radar de Métricas
          </h3>
          <p className="text-gray-300 mb-6">
            Visualização completa das 8 dimensões avaliadas no seu prompt.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis tick={{ fill: '#e0e7ff', fontSize: 12 }} tickMargin={10} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#e0e7ff', fontSize: 10 }} tickCount={5} />
                <Radar dataKey="A" stroke="#ff0080" fill="#ff0080" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Trend Analysis */}
      {trendData.length > 1 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            Evolução das Métricas
          </h3>
          <p className="text-gray-300 mb-6">
            Acompanhe a evolução das principais métricas ao longo do tempo.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#e0e7ff', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#e0e7ff', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="score" fill="#ff008030" stroke="#ff0080" name="Score Geral" />
                <Line type="monotone" dataKey="clarity" stroke="#00C49F" name="Clareza" strokeWidth={2} />
                <Line type="monotone" dataKey="context" stroke="#FFBB28" name="Contexto" strokeWidth={2} />
                <Line type="monotone" dataKey="focus" stroke="#FF8042" name="Foco" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Distribution Chart */}
      {analysis && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Distribuição das Métricas
          </h3>
          <p className="text-gray-300 mb-6">
            Proporção relativa de cada métrica na análise atual.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Performance Bar Chart */}
      {history.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Histórico de Performance
          </h3>
          <p className="text-gray-300 mb-6">
            Comparação das pontuações gerais das últimas análises.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.slice(-10)}>
                <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#e0e7ff', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#e0e7ff', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="url(#colorGradient)" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff0080" />
                    <stop offset="100%" stopColor="#7900d1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente migrado para ./ChartsPanel/index.jsx
