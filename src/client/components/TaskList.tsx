import React from 'react';
import { Task } from '../../shared/Task';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick?: (task: Task) => void;
  isSearchResults?: boolean;
  onClearSearch?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onTaskClick,
  isSearchResults = false,
  onClearSearch
}) => {
  const toggleComplete = (task: Task) => {
    onUpdateTask(task.id, { completed: !task.completed });
  };

  const getPriorityClass = (priority: number) => `priority-${priority}`;

  const calculateProgress = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>
          {isSearchResults ? `🔍 Search Results (${tasks.length})` : `📋 Tasks (${tasks.length})`}
        </h2>
        {isSearchResults && onClearSearch && (
          <button onClick={onClearSearch} className="clear-search-btn">
            🗑️ Clear Search
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="task-list-empty">
          <p>{isSearchResults ? 'No tasks found matching your search.' : 'No tasks yet. Add one above!'}</p>
          {isSearchResults && (
            <div className="empty-search-hint">
              💡 Try adjusting your search terms or filters
            </div>
          )}
        </div>
      ) : (
        <ul className="task-items">
          {tasks.map((task) => {
            const progress = calculateProgress(task);
            const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

            return (
              <li
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${onTaskClick ? 'clickable' : ''}`}
                onClick={() => onTaskClick && onTaskClick(task)}
              >
                <div className="task-item-row">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleComplete(task);
                    }}
                    className="task-checkbox"
                  />
                  <div className="task-content">
                    <div className="task-title-row">
                      <h3 className="task-title">{task.title}</h3>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="subtask-indicator">
                          📝 {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                        </div>
                      )}
                    </div>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    {/* Progress Bar for subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="task-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </div>
                    )}

                    <div className="task-meta">
                      <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                        P{task.priority}
                      </span>
                      {task.category && (
                        <span className="category-badge">{task.category}</span>
                      )}
                      {task.dueDate && (
                        <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.estimatedTime && (
                        <span className="time-estimate">
                          ⏱️ {task.estimatedTime}min
                        </span>
                      )}
                      {task.actualTime && (
                        <span className="time-actual">
                          ✅ {task.actualTime}min
                        </span>
                      )}
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="task-tags">
                        {task.tags.map((tag) => (
                          <span key={tag} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="task-dependencies">
                        <span className="dependency-label">Depends on:</span>
                        {task.dependencies.map((depId) => (
                          <span key={depId} className="dependency-tag">
                            Task {depId.slice(-6)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="task-actions">
                    {onTaskClick && (
                      <button
                        className="details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                      >
                        📋 Details
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TaskList;