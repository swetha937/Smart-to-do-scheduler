import { Task as TaskInterface } from '../../shared/Task';

export interface Task extends TaskInterface {}

export class TaskModel {
  private tasks: Task[] = [];
  private idCounter = 1;

  create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task: Task = {
      id: this.idCounter.toString(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(task);
    this.idCounter++;
    return task;
  }

  findAll(): Task[] {
    return [...this.tasks];
  }

  findById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return this.tasks[taskIndex];
  }

  delete(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  findByPriority(priority: number): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  findCompleted(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  findPending(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }
}