export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subtasks: Subtask[];
  createdAt: Date;
  timeSpent: number; // in seconds
  isTimerRunning?: boolean;
  lastTimerStart?: number; // timestamp
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  isAiSuggested: boolean;
  date: string; // YYYY-MM-DD
}

export interface TaskTemplate {
  id: string;
  trigger: string;
  subtasks: string[];
}