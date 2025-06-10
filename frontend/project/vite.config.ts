import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:8080/api'),
    },
  };
});

function loadEnv(mode: string, envDir: string, prefix: string) {
  const envFile = path.join(envDir, `.env.${mode}`);
  
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
  
  return process.env;
}
