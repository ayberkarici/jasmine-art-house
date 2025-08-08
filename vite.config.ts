import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'index.html',
        about: 'about.html',
        gallery: 'gallery.html',
        studio: 'studio.html',
        contact: 'contact.html'
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'art-house-optimized', dest: '.' },
        { src: 'cizimler-optimized', dest: '.' },
        { src: 'robots.txt', dest: '.' },
        { src: 'sitemap.xml', dest: '.' },
        { src: 'styles.css', dest: '.' }
      ]
    })
  ],
  server: {
    port: 5173,
    open: '/index.html'
  }
});


