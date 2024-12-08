'use server';

import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import { DatabaseStructure } from '@/types';

// Use /tmp in production, local data directory in development
const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp'
  : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'timetracker.db');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

const initializeDB = (): DatabaseStructure => ({
  timeEntries: [],
  projects: [],
  weeklyTotals: [],
  lastUpdated: new Date().toISOString(),
});

export async function readDB(): Promise<DatabaseStructure> {
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData = initializeDB();
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(initialData),
        ENCRYPTION_KEY
      ).toString();
      await fs.promises.writeFile(DB_FILE, encrypted);
      return initialData;
    }

    const encrypted = await fs.promises.readFile(DB_FILE, 'utf-8');
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error reading database:', error);
    return initializeDB();
  }
}

export async function writeDB(data: DatabaseStructure): Promise<void> {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEY
    ).toString();
    await fs.promises.writeFile(DB_FILE, encrypted);
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

export async function updateDB(
  updater: (currentData: DatabaseStructure) => DatabaseStructure
): Promise<void> {
  const currentData = await readDB();
  const newData = updater(currentData);
  await writeDB(newData);
} 