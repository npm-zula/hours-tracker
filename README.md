# Hours Tracker

A minimal and modern time tracking application built with Astro.js, Supabase, and Tailwind CSS.

## Features

- Clean and modern UI with a light, retro color palette
- Simple time entry management
- Project-based time tracking
- Real-time duration calculations
- Responsive design

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hours-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and set up the following tables:

```sql
-- Create projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  rate_per_hour numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create time_entries table
create table time_entries (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) not null,
  description text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

4. Copy the environment variables:
```bash
cp .env.example .env
```

5. Update the `.env` file with your Supabase project credentials:
```
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

6. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- [Astro.js](https://astro.build) - Web framework
- [Supabase](https://supabase.io) - Backend and database
- [Tailwind CSS](https://tailwindcss.com) - Styling
