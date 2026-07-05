import { useForm } from 'react-hook-form';
import { useAuth } from './useAuth';
import type { SignUpCredentials } from '../services/types';
import { useState } from 'react';

export interface SignUpFormFields extends SignUpCredentials {
  confirmPassword: string;
}

export const useSignUpForm = () => {
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<SignUpFormFields>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormFields) => {
    if (data.password !== data.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signUp({
        username: data.username,
        password: data.password,
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao criar conta');
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
