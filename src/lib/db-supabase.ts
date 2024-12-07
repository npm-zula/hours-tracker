import { Project, TimeEntry } from '@/types';
import { supabase } from './supabase';
import { generateId } from './utils';

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .abortSignal(new AbortController().signal);

  if (error) throw error;

  return data.map(p => ({
    id: p.id,
    name: p.name,
    hourlyRate: p.hourly_rate,
    color: p.color,
    createdAt: p.created_at
  }));
}

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .abortSignal(new AbortController().signal);

  if (error) throw error;

  return data.map(t => ({
    id: t.id,
    projectId: t.project_id,
    startTime: t.start_time,
    endTime: t.end_time,
    description: t.description,
    isAutomatic: t.is_automatic,
    createdAt: t.created_at
  }));
}

export async function writeDB(): Promise<void> {
  console.warn('writeDB is deprecated with Supabase. Use specific operations instead.');
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const newProject = {
    id: generateId(),
    name: project.name,
    hourly_rate: project.hourlyRate,
    color: project.color,
    created_at: new Date().toISOString()
  };

  console.log('Attempting to create project:', newProject);

  const { data, error } = await supabase
    .from('projects')
    .insert([newProject])
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating project:', {
      error,
      project: newProject
    });
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from Supabase after project creation');
  }

  console.log('Project created successfully:', data);

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
    project_id: entry.projectId,
    start_time: entry.startTime,
    end_time: entry.endTime,
    description: entry.description || '',
    is_automatic: entry.isAutomatic || false,
    created_at: new Date().toISOString()
  };

  console.log('Attempting to create time entry:', newEntry);

  const { data, error } = await supabase
    .from('time_entries')
    .insert([newEntry])
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating time entry:', {
      error,
      entry: newEntry
    });
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from Supabase after time entry creation');
  }

  console.log('Time entry created successfully:', data);

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