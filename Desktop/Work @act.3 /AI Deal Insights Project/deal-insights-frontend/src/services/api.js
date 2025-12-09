// API Service for backend integration
// This file is ready to use when your backend is deployed

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API client for Deal Insights backend
 */
export const api = {
  /**
   * Fetch projects with optional filters
   * @param {Object} filters - Filter parameters (client, industry, year, status)
   * @returns {Promise<Array>} Array of project objects
   */
  async getProjects(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.client?.length) {
        params.append('client', filters.client.join(','));
      }
      if (filters.industry?.length) {
        params.append('industry', filters.industry.join(','));
      }
      if (filters.year?.length) {
        params.append('year', filters.year.join(','));
      }
      if (filters.status?.length) {
        params.append('status', filters.status.join(','));
      }
      
      const response = await fetch(`${API_BASE_URL}/api/projects?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Get a single project by ID
   * @param {string|number} projectId - Project identifier
   * @returns {Promise<Object>} Project object with full details
   */
  async getProjectById(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  /**
   * Chat with AI Copilot
   * @param {string} message - User's question/message
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise<Object>} AI response with answer and citations
   */
  async chat(message, conversationHistory = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: conversationHistory,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        answer: data.answer,
        citations: data.citations || [], // Array of source references
        confidence: data.confidence || null,
      };
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   * @param {Object} filters - Optional filters to calculate stats for subset
   * @returns {Promise<Object>} Statistics object
   */
  async getStats(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/api/stats?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  /**
   * Search projects using natural language
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching projects
   */
  async search(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  /**
   * Get similar projects based on a project ID
   * @param {string|number} projectId - Reference project ID
   * @param {number} limit - Number of similar projects to return
   * @returns {Promise<Array>} Array of similar projects
   */
  async getSimilarProjects(projectId, limit = 5) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/similar?limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar projects:', error);
      throw error;
    }
  },

  /**
   * Get available filter options (clients, industries, etc.)
   * @returns {Promise<Object>} Object with arrays of filter options
   */
  async getFilterOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/filters`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },
};

export default api;
