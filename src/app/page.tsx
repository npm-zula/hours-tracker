import { getProjects, getTimeEntries } from '@/lib/db-supabase';
import { calculateWeeklyTotals, formatCurrency, formatDuration } from '@/lib/utils';
import { ClockIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { differenceInHours } from 'date-fns';
import Link from 'next/link';
import { TimeEntry } from '@/types';

export default async function Home() {
  const [projects, timeEntries] = await Promise.all([
    getProjects(),
    getTimeEntries()
  ]);
  console.log('Time Entries:', timeEntries); // Debug log
  console.log('Projects:', projects); // Debug log
  
  const currentWeekTotals = calculateWeeklyTotals(
    timeEntries,
    projects,
    new Date()
  );
  console.log('Weekly Totals:', currentWeekTotals); // Debug log

  const totalEarnings = currentWeekTotals.reduce(
    (sum, total) => sum + total.totalEarnings,
    0
  );

  const totalHours = currentWeekTotals.reduce(
    (sum, total) => sum + total.totalHours,
    0
  );

  const sortedEntries = [...timeEntries]
    .sort((a: TimeEntry, b: TimeEntry) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            href="/entries/new"
            className="btn btn-primary flex items-center space-x-2"
          >
            <ClockIcon className="h-5 w-5" />
            <span>New Time Entry</span>
          </Link>
          <Link
            href="/projects/new"
            className="btn btn-secondary flex items-center space-x-2"
          >
            <BriefcaseIcon className="h-5 w-5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">This Week</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-foreground/60">Total Hours</div>
              <div className="text-2xl font-semibold">{formatDuration(totalHours)}</div>
            </div>
            <div>
              <div className="text-sm text-foreground/60">Total Earnings</div>
              <div className="text-2xl font-semibold">{formatCurrency(totalEarnings)}</div>
            </div>
          </div>
        </div>

        <div className="bg-secondary p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Projects Overview</h2>
          <div className="space-y-4">
            {currentWeekTotals.map((total) => {
              const project = projects.find((p) => p.id === total.projectId);
              if (!project) return null;

              return (
                <div key={total.projectId} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-foreground/60">
                      {formatDuration(total.totalHours)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(total.totalEarnings)}</div>
                    <div className="text-sm text-foreground/60">
                      {formatCurrency(project.hourlyRate)}/hr
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-secondary p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-4">Recent Time Entries</h2>
        <div className="space-y-4">
          {sortedEntries.map((entry) => {
            const project = projects.find((p) => p.id === entry.projectId);
            if (!project) return null;

            return (
              <div key={entry.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-foreground/60">{entry.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatDuration(
                      differenceInHours(new Date(entry.endTime), new Date(entry.startTime))
                    )}
                  </div>
                  <div className="text-sm text-foreground/60">
                    {new Date(entry.startTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
