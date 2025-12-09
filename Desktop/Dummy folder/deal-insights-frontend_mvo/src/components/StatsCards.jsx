import React from 'react';
import { Target, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      icon: Target,
      label: 'Total Projects',
      value: stats.totalProjects,
      subtext: 'All engagements',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: CheckCircle,
      label: 'Won Projects',
      value: stats.wonProjects,
      subtext: 'Successfully closed',
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: XCircle,
      label: 'Lost Projects',
      value: stats.lostProjects,
      subtext: 'Not secured',
      color: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      icon: TrendingUp,
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      subtext: `${stats.wonProjects} of ${stats.totalProjects} won`,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Users,
      label: 'Active Clients',
      value: stats.activeClients,
      subtext: 'Unique clients',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105`}
        >
          <div className="flex items-start justify-between mb-3">
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
            <p className={`text-xs ${card.textColor}`}>{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
