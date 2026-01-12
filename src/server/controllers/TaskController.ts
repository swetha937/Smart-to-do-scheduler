import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { Task } from '../../shared/Task';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getAllTasks();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const task = this.taskService.getTaskById(taskId);
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch task' });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = req.body;
      const task = this.taskService.createTask(taskData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create task' });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const updates: Partial<Omit<Task, 'id' | 'createdAt'>> = req.body;
      const task = this.taskService.updateTask(taskId, updates);
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update task' });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const deleted = this.taskService.deleteTask(taskId);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete task' });
    }
  }

  async getTasksByPriority(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getTasksByPriority();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch tasks by priority' });
    }
  }

  async getRecentTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getRecentTasks();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch recent tasks' });
    }
  }

  async getCompletedTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getCompletedTasks();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch completed tasks' });
    }
  }

  async getPendingTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getPendingTasks();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch pending tasks' });
    }
  }

  // Advanced Features Endpoints

  async createTaskFromTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { templateName, ...overrides } = req.body;
      const task = this.taskService.createTaskFromTemplate(templateName, overrides);
      if (!task) {
        res.status(400).json({ success: false, error: 'Template not found' });
        return;
      }
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create task from template' });
    }
  }

  async addSubtask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const subtaskData = req.body;
      const success = this.taskService.addSubtask(taskId, subtaskData);
      if (!success) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.json({ success: true, message: 'Subtask added successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to add subtask' });
    }
  }

  async updateSubtask(req: Request, res: Response): Promise<void> {
    try {
      const { id, subtaskId } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const subtaskIdStr = Array.isArray(subtaskId) ? subtaskId[0] : subtaskId;
      const updates = req.body;
      const success = this.taskService.updateSubtask(taskId, subtaskIdStr, updates);
      if (!success) {
        res.status(404).json({ success: false, error: 'Task or subtask not found' });
        return;
      }
      res.json({ success: true, message: 'Subtask updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update subtask' });
    }
  }

  async addDependency(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const { dependencyId } = req.body;
      const success = this.taskService.addDependency(taskId, dependencyId);
      if (!success) {
        res.status(400).json({ success: false, error: 'Cannot add dependency (cycle detected or invalid)' });
        return;
      }
      res.json({ success: true, message: 'Dependency added successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to add dependency' });
    }
  }

  async startTimeTracking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const { description } = req.body;
      const timeEntryId = this.taskService.startTimeTracking(taskId, description);
      if (!timeEntryId) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.json({ success: true, data: { timeEntryId } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to start time tracking' });
    }
  }

  async stopTimeTracking(req: Request, res: Response): Promise<void> {
    try {
      const { id, timeEntryId } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const timeEntryIdStr = Array.isArray(timeEntryId) ? timeEntryId[0] : timeEntryId;
      const success = this.taskService.stopTimeTracking(taskId, timeEntryIdStr);
      if (!success) {
        res.status(404).json({ success: false, error: 'Task or time entry not found' });
        return;
      }
      res.json({ success: true, message: 'Time tracking stopped successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to stop time tracking' });
    }
  }

  async searchTasks(req: Request, res: Response): Promise<void> {
    try {
      const { q: query, fuzzy, category, tags, priority, completed } = req.query;
      const options: any = {};
      if (fuzzy === 'true') options.fuzzy = true;
      if (category) options.category = category as string;
      if (tags) options.tags = (tags as string).split(',');
      if (priority) options.priority = parseInt(priority as string);
      if (completed) options.completed = completed === 'true';

      const tasks = this.taskService.searchTasks(query as string, options);
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to search tasks' });
    }
  }

  async getTaskAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = this.taskService.getTaskAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
  }

  async getTasksByDependencyOrder(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getTasksByDependencyOrder();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch tasks by dependency order' });
    }
  }

  async getBlockedTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = this.taskService.getBlockedTasks();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch blocked tasks' });
    }
  }
}