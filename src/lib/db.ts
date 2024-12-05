import { kv } from '@vercel/kv';
import type { Database, Project, TimeEntry } from './types';

const defaultDb: Database = {
  timeEntries: [],
  projects: []
};

// Helper to check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Local storage fallback for development
function getLocalDb(): Database {
  if (typeof window === 'undefined') return defaultDb;
  const data = localStorage.getItem('hours-tracker-db');
  if (!data) {
    setLocalDb(defaultDb);
    return defaultDb;
  }
  return JSON.parse(data);
}

function setLocalDb(db: Database): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hours-tracker-db', JSON.stringify(db));
}

// Main database functions
export async function getDb(): Promise<Database> {
  try {
    if (isDev) return getLocalDb();
    
    const db = await kv.get<Database>('db');
    if (!db) {
      await setDb(defaultDb);
      return defaultDb;
    }
    return db;
  } catch (error) {
    console.error('Error getting database:', error);
    return defaultDb;
  }
}

export async function setDb(db: Database): Promise<void> {
  try {
    if (isDev) {
      setLocalDb(db);
      return;
    }
    
    await kv.set('db', db);
  } catch (error) {
    console.error('Error setting database:', error);
  }
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const db = await getDb();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.projects.push(newProject);
  await setDb(db);
  return newProject;
}

export async function addTimeEntry(entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeEntry> {
  const db = await getDb();
  const newEntry: TimeEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.timeEntries.push(newEntry);
  await setDb(db);
  return newEntry;
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.projects;
}

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const db = await getDb();
  return db.timeEntries;
}

export async function updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> {
  const db = await getDb();
  const index = db.timeEntries.findIndex(entry => entry.id === id);
  
  if (index === -1) return null;
  
  db.timeEntries[index] = {
    ...db.timeEntries[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await setDb(db);
  return db.timeEntries[index];
}

export async function deleteTimeEntry(id: string): Promise<boolean> {
  const db = await getDb();
  const index = db.timeEntries.findIndex(entry => entry.id === id);
  
  if (index === -1) return false;
  
  db.timeEntries.splice(index, 1);
  await setDb(db);
  return true;
}

export function calculateTotalHours(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => {
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + hours;
  }, 0);
} 