// Componente migrado para ./ToolbarMobile/index.jsx
import React from 'react';
import { MessageSquare, Clock, TrendingUp } from 'lucide-react';

const tabs = [
	{ id: 'analyzer', label: 'Analisar', icon: MessageSquare },
	{ id: 'history', label: 'Histórico', icon: Clock },
	{ id: 'charts', label: 'Gráficos', icon: TrendingUp },
];

export default function ToolbarMobile({ activeTab, setActiveTab }) {
	return (
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
	);
}
