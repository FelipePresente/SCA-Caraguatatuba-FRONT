import { useSignUpForm } from '../hooks/useSignUpForm';
import { Link } from 'react-router-dom';

export const SignUp = () => {
  const { register, submit, error, isSubmitting } = useSignUpForm();

  return (
    <div>
      <h2>Cadastre-se</h2>

      {error && (
        <div style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            {...register('username', { required: 'Username é obrigatório' })}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            {...register('password', { required: 'Senha é obrigatória' })}
          />
        </div>

        <div>
          <label>Confirm Password: </label>
          <input
            type="password"
            {...register('confirmPassword', { required: 'Confirmação de senha é obrigatória' })}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p>
        Já tem uma conta?{' '}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
