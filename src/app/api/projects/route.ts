import { readDB, writeDB } from '@/lib/db';
import { Project } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(db.projects);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newProject: Project = await request.json();
    const db = await readDB();

    // Validate project data
    if (!newProject.name || !newProject.hourlyRate || !newProject.color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add the new project
    db.projects.push(newProject);
    await writeDB(db);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}` },
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const db = await readDB();
    const projectIndex = db.projects.findIndex((p: Project) => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Remove the project
    db.projects.splice(projectIndex, 1);
    
    // Remove associated time entries
    db.timeEntries = db.timeEntries.filter((entry) => entry.projectId !== id);
    
    await writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 