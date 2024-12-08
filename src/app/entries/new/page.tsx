'use client';

import { Project, TimeEntry } from '@/types';
import { generateId } from '@/lib/utils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';

const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDefaultEndTime = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 3);
  return formatDateTimeLocal(endDate);
};

export default function NewEntryPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [startTime, setStartTime] = useState(formatDateTimeLocal(new Date()));
  const [endTime, setEndTime] = useState(getDefaultEndTime(new Date()));

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setError('Failed to load projects'));
  }, []);

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    const newStartDate = new Date(newStartTime);
    setEndTime(getDefaultEndTime(newStartDate));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const projectId = formData.get('projectId') as string;
    const description = formData.get('description') as string;

    if (!projectId || !startTime || !endTime) {
      setError('Please fill in all required fields');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError('End time must be after start time');
      return;
    }

    const newEntry: TimeEntry = {
      id: generateId(),
      projectId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      description: description || '',
      isAutomatic,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to create time entry');
      }

      router.push('/entries');
    } catch {
      setError('Failed to create time entry. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/entries"
          className="btn btn-secondary p-2"
          aria-label="Back to entries"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">New Time Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="projectId" className="block text-sm font-medium">
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            className="input w-full"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="startTime" className="block text-sm font-medium">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endTime" className="block text-sm font-medium">
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="input w-full"
            placeholder="What did you work on?"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isAutomatic"
            checked={isAutomatic}
            onChange={(e) => setIsAutomatic(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="isAutomatic" className="text-sm">
            This is an automatic entry
          </label>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="pt-4">
          <button type="submit" className="btn btn-primary w-full">
            Create Time Entry
          </button>
        </div>
      </form>
    </div>
  );
} 