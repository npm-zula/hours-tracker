import { formatDuration } from '@/lib/utils';
import { ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import { differenceInHours } from 'date-fns';
import Link from 'next/link';
import type { TimeEntry, Project } from '@/types';
import { getTimeEntries, getProjects } from '@/lib/db-supabase';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EntriesPage() {
  headers(); // opt out of caching
  const [timeEntries, projects]: [TimeEntry[], Project[]] = await Promise.all([
    getTimeEntries(),
    getProjects()
  ]);

  const sortedEntries = [...timeEntries].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Time Entries</h1>
        <Link
          href="/entries/new"
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Entry</span>
        </Link>
      </div>

      <div className="space-y-6">
        {sortedEntries.map((entry) => {
          const project = projects.find((p) => p.id === entry.projectId);
          if (!project) return null;

          const hours = differenceInHours(
            new Date(entry.endTime),
            new Date(entry.startTime)
          );

          return (
            <div
              key={entry.id}
              className="bg-secondary p-6 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <h3 className="text-lg font-medium">{project.name}</h3>
                </div>
                <div className="flex items-center space-x-2 text-foreground/60">
                  {entry.isAutomatic && (
                    <ClockIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {new Date(entry.startTime).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-foreground/60">Duration</div>
                <div className="font-medium">{formatDuration(hours)}</div>
              </div>

              {entry.description && (
                <div>
                  <div className="text-sm text-foreground/60">Description</div>
                  <div className="text-foreground/80">{entry.description}</div>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href={`/entries/${entry.id}`}
                  className="btn btn-secondary w-full justify-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}

        {timeEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-secondary rounded-lg">
            <ClockIcon className="h-12 w-12 text-foreground/40 mb-4" />
            <h3 className="text-lg font-medium mb-2">No time entries yet</h3>
            <p className="text-foreground/60 text-center mb-6">
              Start tracking your time by creating a new entry
            </p>
            <Link href="/entries/new" className="btn btn-primary">
              Create Time Entry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 