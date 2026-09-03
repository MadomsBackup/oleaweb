import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { authApi } from '../../api/auth';
import { describeApiError } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { loginSchema, validateForm } from '../../validation/schemas';

export default function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async () => {
    const formErrors = await validateForm(loginSchema, { email, password });
    setErrors(formErrors ?? {});
    setFormError(null);
    if (formErrors) return;

    setLoading(true);
    try {
      const { data } = await authApi.login(email.trim().toLowerCase(), password);
      setTokens(data);
      navigate('/');
    } catch (err) {
      setFormError(describeApiError(err, 'No pudimos iniciar sesión. Revisa tu correo y contraseña.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-oliva-dark flex items-center justify-center p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="w-full max-w-sm"
      >
        <h1 className="font-serif-bold text-[38px] text-oliva dark:text-cream text-center">OLEA</h1>
        <p className="font-serif-italic text-terracota text-center mt-1 mb-10">
          recetas que sazonan recuerdos
        </p>

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
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        {formError ? <p className="text-red-600 text-[12px] font-sans-medium mb-3 text-center">{formError}</p> : null}

        <div className="mt-2">
          <PrimaryButton label="Iniciar sesión" loading={loading} type="submit" />
        </div>

        <Link
          to="/auth/olvide-password"
          className="block text-center text-terracota font-sans-medium text-[12px] mt-4"
        >
          Olvidé mi contraseña
        </Link>

        <p className="text-center text-oliva dark:text-cream font-sans text-[12px] mt-8">
          ¿No tienes cuenta?{' '}
          <Link to="/auth/registro" className="font-sans-bold">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
