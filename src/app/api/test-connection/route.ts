import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to fetch a single row from projects table
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Supabase',
        error: error.message,
        hint: 'Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      data: {
        projectCount: data.length,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        // Don't expose the full anon key
        anonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to test connection',
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure your environment variables are set correctly'
    }, { status: 500 });
  }
} 