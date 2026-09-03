import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { authApi } from '../../api/auth';
import { describeApiError } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { registerSchema, validateForm } from '../../validation/schemas';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async () => {
    const formErrors = await validateForm(registerSchema, { email, password, confirmPassword });
    setErrors(formErrors ?? {});
    setFormError(null);
    if (formErrors) return;

    setLoading(true);
    try {
      const { data } = await authApi.register(email.trim().toLowerCase(), password);
      setTokens(data);
      navigate('/');
    } catch (err) {
      setFormError(describeApiError(err, 'No pudimos crear tu cuenta. Puede que ese correo ya esté registrado.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-oliva-dark flex items-center justify-center p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        className="w-full max-w-sm"
      >
        <h1 className="font-serif-bold text-[26px] text-oliva dark:text-cream text-center mb-8">
          Crear cuenta
        </h1>

        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
        />
        <p className="text-[10.5px] text-muted font-sans -mt-2 mb-4">
          Mínimo 8 caracteres, con al menos una letra y un número.
        </p>

        {formError ? <p className="text-red-600 text-[12px] font-sans-medium mb-3 text-center">{formError}</p> : null}

        <div className="mt-2">
          <PrimaryButton label="Registrarme" loading={loading} type="submit" />
        </div>

        <p className="text-center text-oliva dark:text-cream font-sans text-[12px] mt-8">
          Ya tengo cuenta,{' '}
          <Link to="/auth/login" className="font-sans-bold">
            iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
