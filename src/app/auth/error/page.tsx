'use client';

import { XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 animate-fade-in-up">
        <div className="card text-center">
          <div className="flex justify-center mb-6">
            <XCircleIcon className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-foreground/60 mb-8">
            You are not authorized to access this application. Please contact the administrator
            if you believe this is a mistake.
          </p>
          <Link
            href="/auth"
            className="btn btn-primary w-full block"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 