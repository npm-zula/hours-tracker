'use client';

import { generateId } from '@/lib/utils';
import { Project } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const hourlyRate = parseFloat(formData.get('hourlyRate') as string);
    const color = formData.get('color') as string;

    if (!name || !hourlyRate || !color) {
      setError('Please fill in all fields');
      return;
    }

    const newProject: Project = {
      id: generateId(),
      name,
      hourlyRate,
      color,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      router.push('/projects');
    } catch {
      setError('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/projects"
          className="btn btn-secondary p-2"
          aria-label="Back to projects"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="hourlyRate" className="block text-sm font-medium">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            min="0"
            step="0.01"
            className="input w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="color" className="block text-sm font-medium">
            Project Color
          </label>
          <input
            type="color"
            id="color"
            name="color"
            className="h-12 w-full rounded-lg cursor-pointer border border-border"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="pt-4">
          <button type="submit" className="btn btn-primary w-full">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
} 