import { useForm } from 'react-hook-form';
import { useAuth } from './useAuth';
import type { LoginCredentials } from '../services/types';
import { useState } from 'react';

export const useLoginForm = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<LoginCredentials>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao autenticar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...formMethods,
    submit: formMethods.handleSubmit(onSubmit),
    error,
    isSubmitting,
  };
};
