import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <button onClick={logout}>
          Logout
        </button>
      </div>

      <div>
        <p>
          Hello, <span>{user?.username || 'User'}</span>!
        </p>

        <div>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Role:</strong> {user?.role?.name ?? (user?.role as unknown as string) ?? '—'}</p>
          <p><strong>Created At:</strong> {user?.createdAt}</p>
        </div>

        <div>
          {isAdmin && (
            <button onClick={() => alert('Analytics clicked')}>
              Analytics
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
