import { DatabaseStructure, Project, TimeEntry } from '@/types';
import { supabase } from './supabase';
import { generateId } from './utils';

export async function readDB(): Promise<DatabaseStructure> {
  try {
    const [projectsResult, timeEntriesResult] = await Promise.all([
      supabase.from('projects').select('*'),
      supabase.from('time_entries').select('*')
    ]);

    if (projectsResult.error) throw projectsResult.error;
    if (timeEntriesResult.error) throw timeEntriesResult.error;

    // Convert from snake_case to camelCase
    const projects: Project[] = projectsResult.data.map(p => ({
      id: p.id,
      name: p.name,
      hourlyRate: p.hourly_rate,
      color: p.color,
      createdAt: p.created_at
    }));

    const timeEntries: TimeEntry[] = timeEntriesResult.data.map(t => ({
      id: t.id,
      projectId: t.project_id,
      startTime: t.start_time,
      endTime: t.end_time,
      description: t.description,
      isAutomatic: t.is_automatic,
      createdAt: t.created_at
    }));

    return {
      projects,
      timeEntries,
      weeklyTotals: [], // This is computed on the fly now
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading from Supabase:', error);
    throw error;
  }
}

export async function writeDB(data: DatabaseStructure): Promise<void> {
  try {
    // We don't actually write the entire DB at once anymore
    // This is kept for compatibility with the old API
    console.warn('writeDB is deprecated with Supabase. Use specific operations instead.');
  } catch (error) {
    console.error('Error writing to Supabase:', error);
    throw error;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const newProject = {
    id: generateId(),
    ...project,
    created_at: new Date().toISOString(),
    hourly_rate: project.hourlyRate
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([newProject])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    hourlyRate: data.hourly_rate,
    color: data.color,
    createdAt: data.created_at
  };
}

export async function createTimeEntry(entry: Omit<TimeEntry, 'id' | 'createdAt'>): Promise<TimeEntry> {
  const newEntry = {
    id: generateId(),
    ...entry,
    created_at: new Date().toISOString(),
    project_id: entry.projectId,
    start_time: entry.startTime,
    end_time: entry.endTime,
    is_automatic: entry.isAutomatic
  };

  const { data, error } = await supabase
    .from('time_entries')
    .insert([newEntry])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    projectId: data.project_id,
    startTime: data.start_time,
    endTime: data.end_time,
    description: data.description,
    isAutomatic: data.is_automatic,
    createdAt: data.created_at
  };
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTimeEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 