import React from 'react';
import { Filter, X } from 'lucide-react';

const Sidebar = ({ filters, setFilters, clients, industries, years, statuses }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    client: true,
    industry: true,
    year: true,
    status: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key]?.length > 0);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>

        {/* Client Filter */}
        <FilterSection
          title="Client"
          expanded={expandedSections.client}
          onToggle={() => toggleSection('client')}
        >
          {clients.map(client => (
            <FilterCheckbox
              key={client}
              label={client}
              checked={filters.client?.includes(client) || false}
              onChange={() => handleFilterChange('client', client)}
            />
          ))}
        </FilterSection>

        {/* Industry Filter */}
        <FilterSection
          title="Industry"
          expanded={expandedSections.industry}
          onToggle={() => toggleSection('industry')}
        >
          {industries.map(industry => (
            <FilterCheckbox
              key={industry}
              label={industry}
              checked={filters.industry?.includes(industry) || false}
              onChange={() => handleFilterChange('industry', industry)}
            />
          ))}
        </FilterSection>

        {/* Year Filter */}
        <FilterSection
          title="Year"
          expanded={expandedSections.year}
          onToggle={() => toggleSection('year')}
        >
          {years.map(year => (
            <FilterCheckbox
              key={year}
              label={year.toString()}
              checked={filters.year?.includes(year) || false}
              onChange={() => handleFilterChange('year', year)}
            />
          ))}
        </FilterSection>

        {/* Status Filter */}
        <FilterSection
          title="Status"
          expanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
        >
          {statuses.map(status => (
            <FilterCheckbox
              key={status}
              label={status}
              checked={filters.status?.includes(status) || false}
              onChange={() => handleFilterChange('status', status)}
            />
          ))}
        </FilterSection>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full mt-6 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <X className="w-4 h-4 transition-transform duration-200" />
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

const FilterSection = ({ title, expanded, onToggle, children }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out px-2"
      >
        {title}
        <span className="text-gray-400 transition-transform duration-200">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="mt-2 space-y-2 animate-slide-up" style={{ animation: 'slideUp 0.2s ease-out' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const FilterCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 ease-in-out">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all duration-200"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
        {label}
      </span>
    </label>
  );
};

export default Sidebar;
