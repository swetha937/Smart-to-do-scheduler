import { PriorityQueue } from '../../data-structures/PriorityQueue';
import { HashTable } from '../../data-structures/HashTable';
import { CircularQueue } from '../../data-structures/CircularQueue';
import { Graph } from '../../data-structures/Graph';
import { Trie } from '../../data-structures/Trie';
import { Task, Subtask, TimeEntry, RecurrenceRule } from '../../shared/Task';
import { TaskModel } from '../models/Task';

export class TaskService {
  private priorityQueue: PriorityQueue<Task>;
  private taskMap: HashTable<string, Task>;
  private recentTasks: CircularQueue<Task>;
  private taskModel: TaskModel;
  private dependencyGraph: Graph<string>; // Task ID dependencies
  private searchTrie: Trie;
  private templates: Map<string, Partial<Task>> = new Map();

  constructor(taskModel: TaskModel) {
    this.taskModel = taskModel;
    // Priority queue for tasks by priority (higher priority first)
    this.priorityQueue = new PriorityQueue<Task>((a, b) => b.priority - a.priority);
    // Hash table for fast lookups by ID
    this.taskMap = new HashTable<string, Task>();
    // Circular queue for recent tasks (capacity 10)
    this.recentTasks = new CircularQueue<Task>(10);
    // Graph for task dependencies
    this.dependencyGraph = new Graph<string>();
    // Trie for advanced search
    this.searchTrie = new Trie();

    this.initializeTemplates();
    this.loadTasks();
  }

  private initializeTemplates(): void {
    // Predefined task templates
    this.templates.set('meeting', {
      title: 'Meeting',
      category: 'Work',
      estimatedTime: 60,
      tags: ['meeting', 'work']
    });

    this.templates.set('development', {
      title: 'Development Task',
      category: 'Development',
      estimatedTime: 120,
      tags: ['development', 'coding']
    });

    this.templates.set('review', {
      title: 'Code Review',
      category: 'Development',
      estimatedTime: 30,
      tags: ['review', 'development']
    });
  }

  private loadTasks(): void {
    const tasks = this.taskModel.findAll();
    tasks.forEach(task => {
      this.priorityQueue.enqueue(task);
      this.taskMap.put(task.id, task);
      if (!this.recentTasks.isFull()) {
        this.recentTasks.enqueue(task);
      }

      // Build dependency graph
      this.dependencyGraph.addVertex(task.id);
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          this.dependencyGraph.addEdge(task.id, depId);
        });
      }

      // Build search index
      this.indexTaskForSearch(task);
    });
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task = this.taskModel.create(taskData);
    this.priorityQueue.enqueue(task);
    this.taskMap.put(task.id, task);
    this.recentTasks.enqueue(task);
    return task;
  }

  getAllTasks(): Task[] {
    return this.taskModel.findAll();
  }

  getTaskById(id: string): Task | undefined {
    return this.taskMap.get(id);
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const updatedTask = this.taskModel.update(id, updates);
    if (updatedTask) {
      this.taskMap.put(id, updatedTask);
      // Re-enqueue with new priority if priority changed
      if (updates.priority !== undefined) {
        // For simplicity, we'll rebuild the priority queue
        this.rebuildPriorityQueue();
      }
      this.recentTasks.enqueue(updatedTask);
    }
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const deleted = this.taskModel.delete(id);
    if (deleted) {
      this.taskMap.remove(id);
      // Note: Removing from priority queue and circular queue would require more complex logic
      // For now, we'll rebuild them periodically or accept some staleness
    }
    return deleted;
  }

  getTasksByPriority(): Task[] {
    return this.priorityQueue.toSortedArray();
  }

  getRecentTasks(): Task[] {
    return this.recentTasks.toArray();
  }

  getCompletedTasks(): Task[] {
    return this.taskModel.findCompleted();
  }

  getPendingTasks(): Task[] {
    return this.taskModel.findPending();
  }

  private indexTaskForSearch(task: Task): void {
    // Index title, description, and tags for search
    if (task.title) this.searchTrie.insert(task.title, task.id);
    if (task.description) this.searchTrie.insert(task.description, task.id);
    if (task.tags) {
      task.tags.forEach(tag => this.searchTrie.insert(tag, task.id));
    }
    if (task.category) this.searchTrie.insert(task.category, task.id);
  }

  // Advanced Features Methods

  createTaskFromTemplate(templateName: string, overrides: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | null {
    const template = this.templates.get(templateName);
    if (!template) return null;

    const taskData = { ...template, ...overrides, template: templateName };
    return this.createTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
  }

  addSubtask(taskId: string, subtaskData: Omit<Subtask, 'id'>): boolean {
    const task = this.taskMap.get(taskId);
    if (!task) return false;

    const subtask: Subtask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...subtaskData
    };

    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push(subtask);

    this.updateTask(taskId, { subtasks: task.subtasks });
    return true;
  }

  updateSubtask(taskId: string, subtaskId: string, updates: Partial<Omit<Subtask, 'id'>>): boolean {
    const task = this.taskMap.get(taskId);
    if (!task || !task.subtasks) return false;

    const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
    if (subtaskIndex === -1) return false;

    task.subtasks[subtaskIndex] = { ...task.subtasks[subtaskIndex], ...updates };
    this.updateTask(taskId, { subtasks: task.subtasks });
    return true;
  }

  addDependency(taskId: string, dependencyId: string): boolean {
    if (taskId === dependencyId) return false;

    const task = this.taskMap.get(taskId);
    const dependency = this.taskMap.get(dependencyId);
    if (!task || !dependency) return false;

    // Check for cycles
    this.dependencyGraph.addEdge(taskId, dependencyId);
    if (this.dependencyGraph.hasCycle()) {
      // Remove the edge if it creates a cycle
      this.dependencyGraph = new Graph<string>();
      this.loadTasks(); // Rebuild graph
      return false;
    }

    if (!task.dependencies) task.dependencies = [];
    if (!task.dependencies.includes(dependencyId)) {
      task.dependencies.push(dependencyId);
      this.updateTask(taskId, { dependencies: task.dependencies });
    }
    return true;
  }

  startTimeTracking(taskId: string, description?: string): string | null {
    const task = this.taskMap.get(taskId);
    if (!task) return null;

    const timeEntry: TimeEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      duration: 0,
      description
    };

    if (!task.timeEntries) task.timeEntries = [];
    task.timeEntries.push(timeEntry);

    this.updateTask(taskId, { timeEntries: task.timeEntries });
    return timeEntry.id;
  }

  stopTimeTracking(taskId: string, timeEntryId: string): boolean {
    const task = this.taskMap.get(taskId);
    if (!task || !task.timeEntries) return false;

    const timeEntry = task.timeEntries.find(te => te.id === timeEntryId);
    if (!timeEntry || timeEntry.endTime) return false;

    timeEntry.endTime = new Date();
    timeEntry.duration = Math.round((timeEntry.endTime.getTime() - timeEntry.startTime.getTime()) / (1000 * 60));

    // Update total actual time
    const totalActualTime = (task.actualTime || 0) + timeEntry.duration;
    this.updateTask(taskId, { timeEntries: task.timeEntries, actualTime: totalActualTime });
    return true;
  }

  searchTasks(query: string, options?: {
    fuzzy?: boolean;
    category?: string;
    tags?: string[];
    priority?: number;
    completed?: boolean;
  }): Task[] {
    let taskIds: string[] = [];

    if (options?.fuzzy) {
      taskIds = this.searchTrie.fuzzySearch(query);
    } else {
      taskIds = this.searchTrie.startsWith(query);
    }

    let tasks = taskIds.map(id => this.taskMap.get(id)).filter(task => task !== undefined) as Task[];

    // Apply filters
    if (options?.category) {
      tasks = tasks.filter(task => task.category === options.category);
    }
    if (options?.tags && options.tags.length > 0) {
      tasks = tasks.filter(task =>
        task.tags && options.tags!.some(tag => task.tags!.includes(tag))
      );
    }
    if (options?.priority !== undefined) {
      tasks = tasks.filter(task => task.priority === options.priority);
    }
    if (options?.completed !== undefined) {
      tasks = tasks.filter(task => task.completed === options.completed);
    }

    return tasks;
  }

  getTaskAnalytics(): {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averagePriority: number;
    totalEstimatedTime: number;
    totalActualTime: number;
    overdueTasks: number;
    tasksByCategory: Record<string, number>;
    tasksByPriority: Record<number, number>;
  } {
    const tasks = this.getAllTasks();
    const now = new Date();

    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < now);

    const totalEstimatedTime = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
    const totalActualTime = tasks.reduce((sum, t) => sum + (t.actualTime || 0), 0);

    const tasksByCategory: Record<string, number> = {};
    const tasksByPriority: Record<number, number> = {};

    tasks.forEach(task => {
      if (task.category) {
        tasksByCategory[task.category] = (tasksByCategory[task.category] || 0) + 1;
      }
      tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
    });

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      averagePriority: tasks.length > 0 ? tasks.reduce((sum, t) => sum + t.priority, 0) / tasks.length : 0,
      totalEstimatedTime,
      totalActualTime,
      overdueTasks: overdueTasks.length,
      tasksByCategory,
      tasksByPriority
    };
  }

  getTasksByDependencyOrder(): Task[] {
    const sortedIds = this.dependencyGraph.topologicalSort();
    return sortedIds.map(id => this.taskMap.get(id)).filter(task => task !== undefined) as Task[];
  }

  getBlockedTasks(): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter(task => {
      if (!task.dependencies || task.completed) return false;
      return task.dependencies.some(depId => {
        const depTask = this.taskMap.get(depId);
        return !depTask || !depTask.completed;
      });
    });
  }

  private rebuildPriorityQueue(): void {
    this.priorityQueue = new PriorityQueue<Task>((a, b) => b.priority - a.priority);
    const tasks = this.taskModel.findAll();
    tasks.forEach(task => this.priorityQueue.enqueue(task));
  }
}