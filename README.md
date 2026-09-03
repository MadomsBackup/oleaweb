# OLEA — Web

Versión web de la app OLEA ("recetas que sazonan recuerdos"), construida con
**React + TypeScript + Vite + Tailwind CSS**, replicando el diseño y las
funcionalidades de la app mobile (misma paleta de colores, tipografías Lora/
Poppins, y la misma lógica de negocio: auth, recetas, favoritos, modo
cocina y panel de administración).

Es totalmente **responsive**: barra lateral de navegación en pantallas
medianas/grandes (≥768px) y barra de pestañas inferior en mobile, igual que
la app nativa.

## Requisitos

- Node.js 18+
- El backend de OLEA corriendo en local (`npm run start:dev` en el proyecto
  del backend), escuchando por defecto en `http://localhost:3000/api`.

## Puesta en marcha

```bash
npm install
npm run dev
```

Esto levanta la web en `http://localhost:5173`, apuntando por defecto a
`http://localhost:3000/api`. El backend en modo desarrollo ya acepta
peticiones desde cualquier origen (CORS abierto salvo que definas
`CORS_ALLOWED_ORIGINS`), así que no necesitás configurar nada extra ahí.

Si tu backend corre en otra URL o puerto, copiá `.env.example` a `.env` y
ajustá `VITE_API_BASE_URL`.

## Scripts

- `npm run dev` — servidor de desarrollo con hot reload
- `npm run build` — build de producción (`tsc -b && vite build`) en `dist/`
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — solo chequea tipos (`tsc --noEmit`)

## Estructura

```
src/
  api/          cliente axios (con refresh de token automático), auth, recetas, catálogos
  components/   UI reutilizable (TextField, PrimaryButton, RecipeCard, CatalogAdminScreen…)
  pages/        una carpeta por sección: auth/, recipe/, admin/, + Home/Search/Favorites/Profile
  store/        estado global con Zustand (auth, cache de recetas, tema claro/oscuro)
  validation/   esquemas de Yup espejados con los límites del backend
  types/        tipos compartidos, idénticos al backend/mobile
  assets/fonts/ Lora y Poppins (las mismas fuentes que usa la app mobile)
```

## Funcionalidad cubierta

- **Auth**: login, registro, recuperar/resetear contraseña (código de 6
  dígitos), sesión persistida en `localStorage` con refresh de token
  transparente ante un 401.
- **Recetas**: listado propio, búsqueda con filtros, favoritos, detalle con
  escalado de porciones, compartir (enlace público vía `/compartida/:token`,
  usando `Web Share API` si está disponible o copiando el enlace),
  exportar a PDF (descarga el blob que genera el backend), deshabilitar.
- **Formulario de receta**: fotos (convertidas a base64 igual que en
  mobile), ingredientes con autocompletado y alérgenos, pasos con
  formato **negrita**/*cursiva*/~~tachado~~ y temporizador opcional,
  reordenar pasos.
- **Modo cocina**: pantalla paso a paso a pantalla completa, con barra de
  progreso y temporizador.
- **Perfil**: modo oscuro, cerrar sesión, acceso al panel admin (solo rol
  `admin`).
- **Administración**: CRUD + habilitar/deshabilitar de categorías,
  ingredientes, medidas y alérgenos.
- **Extra propio de la web**: página pública `/compartida/:token` para ver
  una receta compartida sin necesidad de iniciar sesión (usa el endpoint
  `GET /public/recipes/:token` que ya expone el backend).

## Notas de diseño

La paleta y tipografías están definidas en `tailwind.config.js` con los
mismos nombres que `mobile/src/theme/colors.ts` (`cream`, `oliva`,
`oliva-dark`, `terracota`, `salvia`, `rose`, `bege`), así que cualquier
clase de la app mobile (`bg-terracota`, `text-oliva`, `font-serif-bold`…)
se traduce 1:1 a esta web.
