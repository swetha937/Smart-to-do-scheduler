import React, { useState } from 'react';
import { Task } from '../../shared/Task';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
    };

    onAddTask(taskData);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(3);
    setDueDate('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <h2>Add New Task</h2>
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
        />
      </div>

      <div className="form-group">
        <label>Priority (1-5)</label>
        <select
          value={priority}
          onChange={(e) => setPriority(Number((e.target as HTMLSelectElement).value))}
        >
          <option value={1}>1 - Low</option>
          <option value={2}>2 - Low-Medium</option>
          <option value={3}>3 - Medium</option>
          <option value={4}>4 - High-Medium</option>
          <option value={5}>5 - High</option>
        </select>
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate((e.target as HTMLInputElement).value)}
        />
      </div>

      <div className="form-group">
        <label>Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags((e.target as HTMLInputElement).value)}
          placeholder="work, urgent, personal"
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;