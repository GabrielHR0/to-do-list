export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: string;
  dueDate?: string;
  description?: string;
  steps: Step[];
}

export interface Step {
  id: string;
  title: string;
  status: string;
}

export interface TodoList {
  id: string;
  name: string;
  tasks: Task[];
}