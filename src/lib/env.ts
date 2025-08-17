// Environment configuration utility
export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'LearnPilot',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL || '',
  
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Helper methods
  isDevelopment: () => import.meta.env.DEV,
  isProduction: () => import.meta.env.PROD,
} as const;

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

// Validate required environment variables
if (env.isProduction() && !env.APP_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set in production');
}