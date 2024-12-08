import { formatCurrency } from '@/lib/utils';
import { BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Project } from '@/types';
import { getProjects } from '@/lib/db-supabase';

export default async function ProjectsPage() {
  const projects: Project[] = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/projects/new"
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Project</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-secondary p-6 rounded-lg space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <h3 className="text-lg font-medium">{project.name}</h3>
            </div>
            <div>
              <div className="text-sm text-foreground/60">Hourly Rate</div>
              <div className="font-medium">{formatCurrency(project.hourlyRate)}/hr</div>
            </div>
            <div className="pt-4">
              <Link
                href={`/projects/${project.id}`}
                className="btn btn-secondary w-full justify-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-secondary rounded-lg">
            <BriefcaseIcon className="h-12 w-12 text-foreground/40 mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-foreground/60 text-center mb-6">
              Create your first project to start tracking time
            </p>
            <Link href="/projects/new" className="btn btn-primary">
              Create Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 