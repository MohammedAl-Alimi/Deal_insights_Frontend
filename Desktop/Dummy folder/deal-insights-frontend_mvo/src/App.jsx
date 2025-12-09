import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import ProjectCard from './components/ProjectCard';
import ProjectsTable from './components/ProjectsTable';
import ProjectDetailModal from './components/ProjectDetailModal';
import AICopilot from './components/AICopilot';
import { mockProjects, mockStats, mockClients, mockIndustries, mockYears, mockStatuses } from './data/mockData';
import { LayoutGrid, List } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter projects based on search and filters
  const filteredProjects = mockProjects.filter(project => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.objectives.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.strategies.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Client filter
    const matchesClient =
      !filters.client?.length || filters.client.includes(project.client);

    // Industry filter
    const matchesIndustry =
      !filters.industry?.length || filters.industry.includes(project.industry);

    // Year filter
    const matchesYear =
      !filters.year?.length || filters.year.includes(project.year);

    // Status filter
    const matchesStatus =
      !filters.status?.length || filters.status.includes(project.status);

    return matchesSearch && matchesClient && matchesIndustry && matchesYear && matchesStatus;
  });

  // Calculate filtered stats
  const filteredStats = {
    totalProjects: filteredProjects.length,
    wonProjects: filteredProjects.filter(p => p.status === 'Won').length,
    lostProjects: filteredProjects.filter(p => p.status === 'Lost').length,
    winRate: filteredProjects.length > 0
      ? Math.round((filteredProjects.filter(p => p.status === 'Won').length / filteredProjects.length) * 100)
      : 0,
    activeClients: new Set(filteredProjects.map(p => p.client)).size,
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        filters={filters}
        setFilters={setFilters}
        clients={mockClients}
        industries={mockIndustries}
        years={mockYears}
        statuses={mockStatuses}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Projects Section */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Project Portfolio
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive insights from past engagements
              </p>
            </div>

            <StatsCards stats={filteredStats} />

            {/* View Toggle and Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all duration-200 ease-in-out ${
                    viewMode === 'table'
                      ? 'bg-primary text-white shadow-sm scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all duration-200 ease-in-out ${
                    viewMode === 'cards'
                      ? 'bg-primary text-white shadow-sm scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Projects View */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No projects found matching your criteria.
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <ProjectsTable projects={filteredProjects} onProjectClick={setSelectedProject} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Copilot - Floating Panel */}
        <AICopilot 
          isOpen={isCopilotOpen} 
          onOpen={() => setIsCopilotOpen(true)} 
          onClose={() => setIsCopilotOpen(false)} 
        />

        {/* Project Detail Modal */}
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
