import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { authApi } from '../../api/auth';
import { describeApiError } from '../../api/client';
import { resetPasswordSchema, validateForm } from '../../validation/schemas';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!email) {
    return (
      <div className="min-h-screen bg-cream dark:bg-oliva-dark flex items-center justify-center p-7">
        <div className="w-full max-w-sm text-center">
          <p className="font-sans text-[13px] text-oliva dark:text-cream mb-6">
            Primero solicita un código de recuperación.
          </p>
          <PrimaryButton label="Ir a recuperar contraseña" onClick={() => navigate('/auth/olvide-password')} />
        </div>
      </div>
    );
  }

  const handleReset = async () => {
    const formErrors = await validateForm(resetPasswordSchema, { code, newPassword, confirmPassword });
    setErrors(formErrors ?? {});
    setFormError(null);
    if (formErrors) return;

    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, newPassword, confirmPassword });
      setDone(true);
    } catch (err) {
      setFormError(describeApiError(err, 'Código inválido o expirado. Solicita un nuevo código e inténtalo de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cream dark:bg-oliva-dark flex items-center justify-center p-7">
        <div className="w-full max-w-sm text-center">
          <p className="font-serif-bold text-[18px] text-oliva dark:text-cream mb-2">Contraseña actualizada</p>
          <p className="font-sans text-[12px] text-muted mb-6">Ya puedes iniciar sesión.</p>
          <PrimaryButton label="Iniciar sesión" onClick={() => navigate('/auth/login')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-oliva-dark flex items-center justify-center p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReset();
        }}
        className="w-full max-w-sm"
      >
        <h1 className="font-serif-bold text-[22px] text-oliva dark:text-cream text-center mb-2">
          Ingresa el código
        </h1>
        <p className="font-sans text-[12px] text-muted text-center mb-8">Enviado a {email}</p>

        <TextField
          label="Código de 6 dígitos"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          error={errors.code}
        />
        <TextField
          label="Contraseña nueva"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChangeText={setNewPassword}
          error={errors.newPassword}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
        />

        {formError ? <p className="text-red-600 text-[12px] font-sans-medium mb-3 text-center">{formError}</p> : null}

        <div className="mt-2">
          <PrimaryButton label="Cambiar contraseña" loading={loading} type="submit" />
        </div>
      </form>
    </div>
  );
}
