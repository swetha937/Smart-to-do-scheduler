export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
}

export interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  description?: string;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every N days/weeks/months/years
  endDate?: Date;
  count?: number; // number of occurrences
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: number; // 1-5, higher number = higher priority
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  // Advanced features
  subtasks?: Subtask[];
  dependencies?: string[]; // IDs of tasks this task depends on
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  timeEntries?: TimeEntry[];
  recurring?: RecurrenceRule;
  template?: string; // template name if created from template
  category?: string;
  assignee?: string;
  progress?: number; // 0-100 percentage
}