'use client';

import { ClockIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Invalid password or server error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 animate-fade-in-up">
        <div className="card text-center">
          <div className="flex justify-center mb-6">
            <ClockIcon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to Chronoly</h1>
          <p className="text-foreground/60 mb-8">
            Enter the password to access your time tracking dashboard
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input w-full"
              required
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 