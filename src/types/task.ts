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
}

export interface TaskTemplate {
  id: string;
  trigger: string; // The task title that triggers this template
  subtasks: string[];
}