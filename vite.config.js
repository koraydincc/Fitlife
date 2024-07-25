import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['some-big-lib'], // Dışa bağımlı olarak işaretle
    },
    chunkSizeWarningLimit: 1000,
  },
});
