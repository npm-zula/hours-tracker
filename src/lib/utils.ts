import { TimeEntry, Project, WeeklyTotal } from '@/types';
import { startOfWeek, endOfWeek, differenceInHours } from 'date-fns';

export const calculateWeeklyTotals = (
  timeEntries: TimeEntry[],
  projects: Project[],
  weekStartDate: Date
): WeeklyTotal[] => {
  console.log('Calculating totals for:', { timeEntries, projects, weekStartDate });
    
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });
  
  console.log('Week range:', { weekStart, weekEnd });

  // Initialize totals for all projects
  const projectTotals = new Map<string, { hours: number; rate: number }>();
  projects.forEach(project => {
    projectTotals.set(project.id, { hours: 0, rate: project.hourlyRate });
  });

  // Calculate hours for entries within the week
  timeEntries.forEach(entry => {
    const entryStart = new Date(entry.startTime);
    const entryEnd = new Date(entry.endTime);
    const project = projects.find(p => p.id === entry.projectId);

    if (!project) {
      console.log('Project not found for entry:', entry);
      return;
    }

    console.log('Checking entry:', {
      entry,
      entryStart,
      entryEnd,
      isWithinWeek: entryStart >= weekStart && entryEnd <= weekEnd
    });

    // Check if entry falls within the week
    if (entryStart >= weekStart && entryEnd <= weekEnd) {
      const hours = differenceInHours(entryEnd, entryStart);
      const current = projectTotals.get(entry.projectId)!;
      
      console.log('Adding hours:', { projectId: entry.projectId, hours, current });
      
      projectTotals.set(entry.projectId, {
        hours: current.hours + hours,
        rate: current.rate,
      });
    }
  });

  console.log('Project totals:', Array.from(projectTotals.entries()));

  // Convert to array format and include all projects with hours
  const result = Array.from(projectTotals.entries()).map(([projectId, { hours, rate }]) => ({
    projectId,
    totalHours: hours,
    totalEarnings: hours * rate,
    weekStartDate: weekStart.toISOString(),
  }));

  console.log('Final result:', result);
  return result;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
}; 