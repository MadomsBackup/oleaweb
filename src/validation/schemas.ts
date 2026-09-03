import * as yup from 'yup';

/**
 * Esquemas espejados 1:1 con los límites de los DTOs del backend y con
 * la app mobile (mobile/src/validation/schemas.ts). Mantenerlos
 * sincronizados si cambian los límites de algún lado.
 */

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const URL_REGEX = /^https?:\/\/.+/i;

export const emailSchema = yup
  .string()
  .trim()
  .required('El correo es obligatorio.')
  .max(255, 'El correo es demasiado largo.')
  .email('Ingresa un correo válido.');

export const passwordSchema = yup
  .string()
  .required('La contraseña es obligatoria.')
  .min(8, 'Debe tener al menos 8 caracteres.')
  .max(72, 'No puede superar 72 caracteres.')
  .matches(PASSWORD_REGEX, 'Debe incluir al menos una letra y un número.');

export const loginSchema = yup.object({
  email: emailSchema,
  password: yup.string().required('La contraseña es obligatoria.'),
});

export const registerSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña.')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden.'),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});

export const resetPasswordSchema = yup.object({
  code: yup
    .string()
    .required('El código es obligatorio.')
    .matches(/^\d{6}$/, 'El código debe tener 6 dígitos.'),
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña.')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden.'),
});

export const recipeFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('El nombre es obligatorio.')
    .min(2, 'Debe tener al menos 2 caracteres.')
    .max(120, 'No puede superar 120 caracteres.'),
  servings: yup
    .number()
    .typeError('Debe ser un número.')
    .required('Las porciones son obligatorias.')
    .integer('Debe ser un número entero.')
    .min(1, 'Debe ser al menos 1.')
    .max(100, 'No puede superar 100.'),
  prepTimeMinutes: yup
    .number()
    .typeError('Debe ser un número.')
    .nullable()
    .transform((v, orig) => (orig === '' ? null : v))
    .integer('Debe ser un número entero.')
    .min(0, 'No puede ser negativo.')
    .max(1440, 'Máximo 1440 (24 h).'),
  cookTimeMinutes: yup
    .number()
    .typeError('Debe ser un número.')
    .nullable()
    .transform((v, orig) => (orig === '' ? null : v))
    .integer('Debe ser un número entero.')
    .min(0, 'No puede ser negativo.')
    .max(1440, 'Máximo 1440 (24 h).'),
  videoUrl: yup
    .string()
    .nullable()
    .transform((v, orig) => (orig === '' ? null : v))
    .max(500, 'El enlace es demasiado largo.')
    .matches(URL_REGEX, { message: 'Debe ser un enlace http(s) válido.', excludeEmptyString: true }),
});

export const ingredientRowSchema = yup.object({
  quantity: yup
    .number()
    .typeError('Cantidad inválida.')
    .required('Cantidad inválida.')
    .positive('Cantidad inválida.')
    .max(100_000, 'Cantidad demasiado grande.'),
});

export const stepRowSchema = yup.object({
  content: yup
    .string()
    .trim()
    .required('El paso no puede estar vacío.')
    .max(4000, 'Máximo 4000 caracteres.'),
});

export const catalogNameSchema = (max = 80) =>
  yup
    .string()
    .trim()
    .required('El nombre es obligatorio.')
    .min(2, 'Debe tener al menos 2 caracteres.')
    .max(max, `Máximo ${max} caracteres.`);

/**
 * Corre un esquema de Yup y devuelve un mapa `{ campo: mensaje }` en vez
 * de lanzar, para poder pintar cada campo en rojo individualmente.
 * `null` cuando todo es válido.
 */
export async function validateForm<T extends Record<string, unknown>>(
  schema: yup.ObjectSchema<any>,
  values: T,
): Promise<Record<string, string> | null> {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      for (const inner of err.inner) {
        if (inner.path && !errors[inner.path]) errors[inner.path] = inner.message;
      }
      return errors;
    }
    throw err;
  }
}
