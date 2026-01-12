import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import TaskDetails from './components/TaskDetails';
import Analytics from './components/Analytics';
import Search from './components/Search';
import { Task, Subtask } from '../shared/Task';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

type TabType = 'tasks' | 'analytics' | 'search';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchResults, setSearchResults] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);  
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json() as { success: boolean; data: Task[] };
      setTasks(data.data);
      setError(null);
      console.log('Fetched tasks:', data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error('Failed to add task');
      await fetchTasks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const addTaskFromTemplate = async (templateName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName }),
      });
      if (!response.ok) throw new Error('Failed to create task from template');
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task from template');
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      await fetchTasks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks(); // Refresh the list
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const addSubtask = async (taskId: string, subtask: Omit<Subtask, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtask),
      });
      if (!response.ok) throw new Error('Failed to add subtask');
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subtask');
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update subtask');
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subtask');
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setActiveTab('tasks');
  };

  const handleSearchResults = (results: Task[]) => {
    setSearchResults(results);
    setActiveTab('tasks'); // Switch to tasks tab to show results
  };

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Loading your smart tasks...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <h2>🚨 Error</h2>
      <p>{error}</p>
      <button onClick={fetchTasks} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Advanced Smart To-Do App</h1>
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Tasks
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'tasks' && (
          <div className="tasks-view">
            <div className="tasks-controls">
              <AddTaskForm onAddTask={addTask} />
              <div className="quick-templates">
                <h3>Quick Templates:</h3>
                <div className="template-buttons">
                  <button onClick={() => addTaskFromTemplate('meeting')} className="template-btn">
                    📅 Meeting
                  </button>
                  <button onClick={() => addTaskFromTemplate('development')} className="template-btn">
                    💻 Development
                  </button>
                  <button onClick={() => addTaskFromTemplate('review')} className="template-btn">
                    👁️ Review
                  </button>
                </div>
              </div>
            </div>

            <div className="tasks-content">
              <div className="tasks-list-section">
                <TaskList
                  tasks={searchResults.length > 0 ? searchResults : tasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onTaskClick={handleTaskClick}
                  isSearchResults={searchResults.length > 0}
                  onClearSearch={() => setSearchResults([])}
                />
              </div>

              {selectedTask && (
                <div className="task-details-section">
                  <TaskDetails
                    task={selectedTask}
                    onUpdateTask={updateTask}
                    onAddSubtask={addSubtask}
                    onUpdateSubtask={updateSubtask}
                    onStartTimeTracking={() => {}}
                    onStopTimeTracking={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <Analytics />}

        {activeTab === 'search' && (
          <Search onSearchResults={handleSearchResults} />
        )}
      </main>
    </div>
  );
};

export default App;