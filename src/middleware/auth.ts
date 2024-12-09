import { defineMiddleware } from 'astro/middleware';
import { supabase } from '../lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const { data: { session } } = await supabase.auth.getSession();

  // Allow access to auth-related pages
  if (context.url.pathname.startsWith('/auth')) {
    return next();
  }

  // Redirect to login if no session
  if (!session) {
    return context.redirect('/auth/login');
  }

  // Continue to the requested page if authenticated
  return next();
}); 