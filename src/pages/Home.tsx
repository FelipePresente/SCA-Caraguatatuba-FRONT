import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FoodCard from '../components/FoodCard';

export const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <main className='flex-1 p-4 space-y-6 max-w-md mx-auto w-full'>
        <FoodCard />
      </main>
    </>
  );
};
