import { createProject, getProjects, deleteProject } from '@/lib/db-supabase';
import { Project } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: `Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newProject: Omit<Project, 'id' | 'createdAt'> = await request.json();
    console.log('Received project data:', newProject);

    // Validate project data
    if (!newProject.name || !newProject.hourlyRate || !newProject.color) {
      const missingFields = [];
      if (!newProject.name) missingFields.push('name');
      if (!newProject.hourlyRate) missingFields.push('hourlyRate');
      if (!newProject.color) missingFields.push('color');

      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }

    // Validate hourlyRate is a positive number
    if (typeof newProject.hourlyRate !== 'number' || newProject.hourlyRate <= 0) {
      console.error('Invalid hourly rate:', newProject.hourlyRate);
      return NextResponse.json(
        { error: 'Hourly rate must be a positive number' },
        { status: 400 }
      );
    }

    const project = await createProject(newProject);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { 
        error: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error instanceof Error ? error.stack : undefined
      },
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

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: `Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 