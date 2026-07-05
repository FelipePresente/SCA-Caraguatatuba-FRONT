import { useLoginForm } from '../hooks/useLoginForm';
import { Link } from 'react-router-dom';

export const Login = () => {
  const { register, submit, error, isSubmitting } = useLoginForm();

  return (
    <div>
      <h2>Login</h2>

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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p>
        Não tem uma conta?{' '}
        <Link to="/signup">Cadastre-se</Link>
      </p>
    </div>
  );
};
