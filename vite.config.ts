import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Use esbuild minifier (faster and more compatible than terser)
    minify: 'esbuild',
    // CSS code splitting
    cssCodeSplit: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Report compressed size
    reportCompressedSize: true,
    // Target modern browsers for better optimization
    target: 'es2015',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings during build
        if (warning.code === 'PLUGIN_WARNING') return;
        warn(warning);
      },
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React vendor chunk
          'react-vendor': ['react', 'react-dom'],
          // Icons vendor chunk
          'icons-vendor': ['lucide-react'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Source map disabled for production (reduces build size)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'axios'],
  },
  // Enable compression
  esbuild: {
    drop: ['debugger'],
    legalComments: 'none',
  },
});
