export interface TimeEntry {
  id: string;
  projectId: string;
  startTime: string;
  endTime: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface Database {
  timeEntries: TimeEntry[];
  projects: Project[];
} 