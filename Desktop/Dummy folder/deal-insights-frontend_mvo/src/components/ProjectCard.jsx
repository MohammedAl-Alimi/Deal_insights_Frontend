import React from 'react';
import { ExternalLink, Target, Lightbulb, TrendingUp } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  const statusColors = {
    Won: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    Lost: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  const industryColors = {
    Technology: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Finance: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    Retail: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    Healthcare: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
      onClick={() => onClick && onClick(project)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: project.clientColor }}
          >
            {project.clientInitial}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.client}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${industryColors[project.industry]}`}>
                {project.industry}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{project.year}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
          <button
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(project);
            }}
          >
            <ExternalLink className="w-4 h-4 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Objectives */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Objectives</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {project.objectives}
        </p>
      </div>

      {/* Strategies */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strategies</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.strategies.map((strategy, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full transition-all duration-200 hover:scale-105"
            >
              {strategy}
            </span>
          ))}
        </div>
      </div>

      {/* Key Outcomes */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Outcomes</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{project.keyOutcomes}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
