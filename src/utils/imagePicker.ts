import { RecipePhoto } from '../types';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB por foto, igual criterio que el body limit del backend (8MB totales)
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/** Convierte un File elegido por <input type="file"> a RecipePhoto (base64), igual forma que espera el backend. */
export function fileToPhoto(file: File): Promise<RecipePhoto> {
  return new Promise((resolve, reject) => {
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      reject(new Error('Formato no soportado. Usa JPG, PNG o WEBP.'));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      reject(new Error('La imagen supera los 5MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] ?? '';
      resolve({ base64Data, extension: extension === 'jpg' ? 'jpeg' : extension, sizeBytes: file.size });
    };
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}
