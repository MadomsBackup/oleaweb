import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { authApi } from '../../api/auth';
import { describeApiError } from '../../api/client';
import { forgotPasswordSchema, validateForm } from '../../validation/schemas';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSend = async () => {
    const formErrors = await validateForm(forgotPasswordSchema, { email });
    setErrors(formErrors ?? {});
    setFormError(null);
    if (formErrors) return;

    setLoading(true);
    try {
      const normalized = email.trim().toLowerCase();
      await authApi.forgotPassword(normalized);
      navigate('/auth/resetear-password', { state: { email: normalized } });
    } catch (err) {
      setFormError(describeApiError(err, 'No pudimos enviar el código. Intenta nuevamente en unos minutos.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-oliva-dark flex items-center justify-center p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="w-full max-w-sm"
      >
        <h1 className="font-serif-bold text-[22px] text-oliva dark:text-cream text-center mb-2">
          Recuperar contraseña
        </h1>
        <p className="font-sans text-[12px] text-muted text-center mb-8">
          Te enviaremos un código de 6 dígitos, válido por 10 minutos.
        </p>

        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        {formError ? <p className="text-red-600 text-[12px] font-sans-medium mb-3 text-center">{formError}</p> : null}

        <div className="mt-2">
          <PrimaryButton label="Enviar código" loading={loading} type="submit" />
        </div>

        <button
          type="button"
          onClick={() => navigate('/auth/login')}
          className="block w-full text-center text-oliva dark:text-cream font-sans text-[12px] mt-8"
        >
          Volver a iniciar sesión
        </button>
      </form>
    </div>
  );
}
