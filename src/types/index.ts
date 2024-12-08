export interface TimeEntry {
  id: string;
  projectId: string;
  startTime: string;
  endTime: string;
  description: string;
  isAutomatic: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  hourlyRate: number;
  color: string;
  createdAt: string;
}

export interface WeeklyTotal {
  projectId: string;
  totalHours: number;
  totalEarnings: number;
  weekStartDate: string;
}

export interface DatabaseStructure {
  timeEntries: TimeEntry[];
  projects: Project[];
  weeklyTotals: WeeklyTotal[];
  lastUpdated: string;
} 