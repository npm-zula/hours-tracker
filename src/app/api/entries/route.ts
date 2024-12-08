import { readDB, writeDB } from '@/lib/db';
import { TimeEntry } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(db.timeEntries);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch time entries: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newEntry: TimeEntry = await request.json();
    const db = await readDB();

    // Validate entry data
    if (!newEntry.projectId || !newEntry.startTime || !newEntry.endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate project exists
    const projectExists = db.projects.some((p) => p.id === newEntry.projectId);
    if (!projectExists) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Add the new entry
    db.timeEntries.push(newEntry);
    await writeDB(db);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create time entry: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const db = await readDB();
    const entryIndex = db.timeEntries.findIndex((e: TimeEntry) => e.id === id);

    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    // Remove the entry
    db.timeEntries.splice(entryIndex, 1);
    await writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete time entry: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 