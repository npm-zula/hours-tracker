'use client';

import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface AnimatedLayoutProps {
  children: ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50 animate-fade-in">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <ClockIcon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-semibold text-lg">Chronoly</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/" className="nav-link">
              Dashboard
            </Link>
            <Link href="/projects" className="nav-link">
              Projects
            </Link>
            <Link href="/entries" className="nav-link">
              Time Entries
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      <footer className="border-t border-border py-4 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-foreground/60">
          © {new Date().getFullYear()} Chronoly
        </div>
      </footer>
    </div>
  );
} 