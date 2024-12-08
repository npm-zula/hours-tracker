import { createTimeEntry, getTimeEntries, deleteTimeEntry } from '@/lib/db-supabase';
import { TimeEntry } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const entries = await getTimeEntries();
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch time entries: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newEntry: Omit<TimeEntry, 'id' | 'createdAt'> = await request.json();

    // Validate entry data
    if (!newEntry.projectId || !newEntry.startTime || !newEntry.endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const entry = await createTimeEntry(newEntry);
    return NextResponse.json(entry, { status: 201 });
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

    await deleteTimeEntry(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete time entry: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 