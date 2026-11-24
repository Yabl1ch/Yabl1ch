import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/** Injects preload tags for above-the-fold woff2 subsets with their hashed asset filenames. */
function preloadCriticalFonts(): Plugin {
  const criticalFontPrefixes = [
    'unbounded-latin-wght-normal',
    'manrope-cyrillic-wght-normal',
    'manrope-latin-wght-normal',
  ]

  return {
    name: 'preload-critical-fonts',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html
      const preloadTags = Object.keys(ctx.bundle)
        .filter(
          (fileName) =>
            fileName.endsWith('.woff2') &&
            criticalFontPrefixes.some((prefix) => fileName.includes(prefix))
        )
        .map((fileName) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            crossorigin: '',
            href: `./${fileName}`,
          },
          injectTo: 'head' as const,
        }))

      return { html, tags: preloadTags }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preloadCriticalFonts()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor';
            }
          }
        },
      },
    },
  },
})
