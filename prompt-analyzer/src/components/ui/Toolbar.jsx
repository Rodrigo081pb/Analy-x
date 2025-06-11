// Componente migrado para ./Toolbar/index.jsx
// src/components/ui/Toolbar.jsx
// Toolbar responsiva para navegação entre abas
import React from 'react';
import { MessageSquare, Clock, TrendingUp } from 'lucide-react';

const tabs = [
	{ id: 'analyzer', label: 'Analisar', icon: MessageSquare },
	{ id: 'history', label: 'Histórico', icon: Clock },
	{ id: 'charts', label: 'Gráficos', icon: TrendingUp },
];

export default function Toolbar({ activeTab, setActiveTab }) {
	return (
		<>
			{/* Toolbar para desktop */}
			<nav className="hidden lg:flex gap-3">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
							activeTab === tab.id
								? 'bg-white text-purple-900 shadow-lg transform scale-105'
								: 'text-gray-300 hover:bg-white/10 hover:text-white'
						}`}
					>
						<tab.icon className="w-5 h-5" />
						<span className="hidden sm:inline font-medium">{tab.label}</span>
					</button>
				))}
			</nav>
			{/* Toolbar para mobile */}
			<nav className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 border-t border-slate-800 flex justify-around items-center py-2 shadow-2xl lg:hidden">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
							activeTab === tab.id
								? 'text-pink-400 font-bold scale-110'
								: 'text-gray-300 hover:text-pink-300'
						}`}
					>
						<tab.icon className="w-6 h-6" />
						<span className="text-xs">{tab.label}</span>
					</button>
				))}
			</nav>
		</>
	);
}
