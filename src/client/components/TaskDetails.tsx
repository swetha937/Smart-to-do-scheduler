import React, { useState } from 'react';
import { Task, Subtask } from '../../shared/Task';
import './TaskDetails.css';

interface TaskDetailsProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddSubtask: (taskId: string, subtask: Omit<Subtask, 'id'>) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onStartTimeTracking: (taskId: string) => void;
  onStopTimeTracking: (taskId: string, timeEntryId: string) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onUpdateTask,
  onAddSubtask,
  onUpdateSubtask,
  onStartTimeTracking,
  onStopTimeTracking
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTimeEntryId, setCurrentTimeEntryId] = useState<string | null>(null);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(task.id, { title: newSubtaskTitle.trim(), completed: false });
      setNewSubtaskTitle('');
    }
  };

  const handleStartTracking = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${task.id}/time/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: `Working on ${task.title}` })
      });
      const result = await response.json() as { success: boolean; data: { timeEntryId: string } };
      if (result.success) {
        setIsTracking(true);
        setCurrentTimeEntryId(result.data.timeEntryId);
        onStartTimeTracking(task.id);
      }
    } catch (error) {
      console.error('Failed to start time tracking:', error);
    }
  };

  const handleStopTracking = async () => {
    if (currentTimeEntryId) {
      try {
        await fetch(`http://localhost:3001/api/tasks/${task.id}/time/${currentTimeEntryId}/stop`, {
          method: 'PUT'
        });
        setIsTracking(false);
        setCurrentTimeEntryId(null);
        onStopTimeTracking(task.id, currentTimeEntryId);
      } catch (error) {
        console.error('Failed to stop time tracking:', error);
      }
    }
  };

  const calculateProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="task-details">
      <div className="task-details-header">
        <h3>{task.title}</h3>
        <div className="task-meta">
          <span className="priority">Priority: {task.priority}/5</span>
          {task.category && <span className="category">{task.category}</span>}
          {task.dueDate && (
            <span className={`due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {task.description && (
        <div className="task-description">
          <p>{task.description}</p>
        </div>
      )}

      {/* Progress Bar */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="progress-section">
          <div className="progress-label">
            Progress: {progress}%
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Time Tracking */}
      <div className="time-tracking-section">
        <div className="time-info">
          {task.estimatedTime && <span>Estimated: {task.estimatedTime}min</span>}
          {task.actualTime && <span>Actual: {task.actualTime}min</span>}
        </div>
        <button
          className={`time-btn ${isTracking ? 'stop' : 'start'}`}
          onClick={isTracking ? handleStopTracking : handleStartTracking}
        >
          {isTracking ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
        </button>
      </div>

      {/* Subtasks */}
      <div className="subtasks-section">
        <h4>Subtasks</h4>
        <div className="add-subtask">
          <input
            type="text"
            placeholder="Add a subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle((e.target as HTMLInputElement).value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
          />
          <button onClick={handleAddSubtask}>Add</button>
        </div>
        <div className="subtasks-list">
          {task.subtasks?.map((subtask) => (
            <div key={subtask.id} className={`subtask ${subtask.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(e) => onUpdateSubtask(task.id, subtask.id, { completed: (e.target as HTMLInputElement).checked })}
              />
              <span>{subtask.title}</span>
              {subtask.estimatedTime && <span className="subtask-time">{subtask.estimatedTime}min</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies */}
      {task.dependencies && task.dependencies.length > 0 && (
        <div className="dependencies-section">
          <h4>Dependencies</h4>
          <div className="dependencies-list">
            {task.dependencies.map((depId) => (
              <span key={depId} className="dependency-tag">
                Task {depId.slice(-6)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="tags-section">
          <h4>Tags</h4>
          <div className="tags-list">
            {task.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;