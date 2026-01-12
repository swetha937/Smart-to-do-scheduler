import React, { useState } from 'react';
import { Task } from '../../shared/Task';
import './Search.css';

interface SearchProps {
  onSearchResults: (tasks: Task[]) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    fuzzy: false,
    category: '',
    tags: '',
    priority: '',
    completed: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        q: query,
        ...(filters.fuzzy && { fuzzy: 'true' }),
        ...(filters.category && { category: filters.category }),
        ...(filters.tags && { tags: filters.tags }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.completed && { completed: filters.completed })
      });

      const response = await fetch(`http://localhost:3001/api/tasks/search?${params}`);
      const result = await response.json() as { success: boolean; data: Task[] };

      if (result.success) {
        onSearchResults(result.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({
      fuzzy: false,
      category: '',
      tags: '',
      priority: '',
      completed: ''
    });
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>🔍 Advanced Task Search</h2>
        <p>Find tasks with powerful search and filtering options</p>
      </div>

      <div className="search-input-section">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search tasks by title, description, or tags..."
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="search-btn"
          >
            {isSearching ? '🔄' : '🔍'} Search
          </button>
        </div>
      </div>

      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.fuzzy}
                onChange={(e) => setFilters({...filters, fuzzy: (e.target as HTMLInputElement).checked})}
              />
              Fuzzy Search
            </label>
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: (e.target as HTMLSelectElement).value})}
            >
              <option value="">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Development">Development</option>
              <option value="Meeting">Meeting</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tags (comma-separated):</label>
            <input
              type="text"
              placeholder="e.g., urgent, frontend"
              value={filters.tags}
              onChange={(e) => setFilters({...filters, tags: (e.target as HTMLInputElement).value})}
            />
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: (e.target as HTMLSelectElement).value})}
            >
              <option value="">Any Priority</option>
              <option value="5">5 - Critical</option>
              <option value="4">4 - High</option>
              <option value="3">3 - Medium</option>
              <option value="2">2 - Low</option>
              <option value="1">1 - Trivial</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.completed}
              onChange={(e) => setFilters({...filters, completed: (e.target as HTMLSelectElement).value})}
            >
              <option value="">All Tasks</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="search-tips">
        <h4>💡 Search Tips:</h4>
        <ul>
          <li><strong>Fuzzy Search:</strong> Find tasks even with typos or partial matches</li>
          <li><strong>Tags:</strong> Separate multiple tags with commas (e.g., "urgent, frontend")</li>
          <li><strong>Priority:</strong> 5 is highest priority, 1 is lowest</li>
          <li><strong>Categories:</strong> Common categories include Work, Personal, Development, Meeting</li>
        </ul>
      </div>
    </div>
  );
};

export default Search;