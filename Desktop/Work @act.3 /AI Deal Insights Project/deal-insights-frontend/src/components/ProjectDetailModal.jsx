import React from 'react';
import { X, Target, Lightbulb, TrendingUp, Link2, FileText, ExternalLink, BarChart3, BookOpen } from 'lucide-react';

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

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

  const strategyColors = [
    'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl my-8 animate-slide-up transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: project.clientColor }}
            >
              {project.clientInitial}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.client}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-sm px-3 py-1 rounded-full ${industryColors[project.industry]}`}>
                  {project.industry}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{project.year}</span>
                <span className={`text-sm px-3 py-1 rounded-full border font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              {project.productOwner && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Project Owner: <span className="font-semibold text-gray-900 dark:text-white">{project.productOwner.name}</span>
                    {project.productOwner.email && (
                      <span className="text-gray-500 dark:text-gray-400"> • </span>
                    )}
                    {project.productOwner.email && (
                      <a
                        href={`mailto:${project.productOwner.email}`}
                        className="text-primary hover:underline transition-colors duration-200"
                      >
                        {project.productOwner.email}
                      </a>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objectives */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Objectives</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.objectives}
            </p>
          </div>

          {/* Strategies Implemented */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strategies Implemented</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.strategies.map((strategy, index) => (
                <span
                  key={index}
                  className={`text-sm px-4 py-2 rounded-full font-medium ${
                    strategyColors[index % strategyColors.length]
                  }`}
                >
                  {strategy}
                </span>
              ))}
            </div>
          </div>

          {/* Outcomes & KPIs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Outcomes & KPIs</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {project.keyOutcomes}
            </p>
            {project.metrics && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {project.metrics.costEfficiency}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cost Efficiency</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {project.metrics.timeSaved}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {project.metrics.satisfaction}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="#"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out group hover:shadow-md hover:scale-[1.02]"
              >
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">View Presentation</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Full deck & insights</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out group hover:shadow-md hover:scale-[1.02]"
              >
                <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Client Portal</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Access resources</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out group hover:shadow-md hover:scale-[1.02]"
              >
                <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Analytics Dashboard</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Real-time metrics</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out group hover:shadow-md hover:scale-[1.02]"
              >
                <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Case Study</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Detailed report</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;

