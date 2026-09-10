import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El sitio se publica en https://madomsbackup.github.io/oleaweb/ (repo de
// proyecto, no un user-page en la raíz), así que todos los assets deben
// resolverse relativos a "/oleaweb/", no a "/". Si alguna vez se cambia
// el nombre del repo, actualizar este valor (y public/404.html, que no
// puede leerlo dinámicamente porque es un archivo estático).
export default defineConfig({
  base: '/oleaweb/',
  plugins: [react()],
  server: {
    port: 5173,
  },
});