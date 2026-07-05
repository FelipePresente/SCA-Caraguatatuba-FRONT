import React, { useState } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import logoImg from '../assets/logo.png';
import { Eye, EyeOff } from 'lucide-react';
import { Footer } from '../components/Footer';

export const Login: React.FC = () => {
  const { register, submit, error, isSubmitting } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-800 font-sans">
      
      {/* HEADER */}
      <header className="bg-[#4180ab] text-white py-3 px-4 sm:px-6 shadow-md flex items-center justify-between h-16">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-[42px] h-[42px] object-contain bg-white/10 rounded-full p-0.5 flex-shrink-0" />
          {/* Mobile: abbreviation; Desktop: full name */}
          <span className="font-bold tracking-wider select-none text-lg sm:hidden">SCA</span>
          <span className="font-bold tracking-wider select-none text-xl hidden sm:inline">
            Sistema de Contabilidade Alimentícia
          </span>
        </div>

        {/* Site da Prefeitura link */}
        <div>
          <a
            href="https://www.caraguatatuba.sp.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-black tracking-widest uppercase p-1.5 rounded-lg transition-colors text-sm"
          >
            Site da Prefeitura
          </a>
        </div>
      </header>

      {/* BODY CONTENT - Centered Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative bg-[#d9d9d9] w-full max-w-sm sm:max-w-md rounded-[2rem] pt-16 pb-8 px-6 sm:px-10 shadow-lg text-center mt-12 mb-12">
          
          {/* Overlapping Crest Logo on top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md">
            <img src={logoImg} alt="Logo" className="w-[100px] h-[100px] object-contain" />
          </div>

          <h2 className="text-[#3b759e] font-extrabold text-sm sm:text-base tracking-widest uppercase mb-8 mt-2">
            Acesso ao Sistema
          </h2>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            
            {/* Institution / Username Input */}
            <div className="text-left">
              <div className="relative bg-white rounded-lg shadow-sm">
                <input
                  type="text"
                  placeholder="USUÁRIO"
                  {...register('username', { required: 'Nome de usuário é obrigatório' })}
                  className="w-full bg-transparent px-4 py-3 text-center sm:text-left text-sm font-semibold text-gray-700 placeholder-[#799db6] focus:outline-none focus:ring-2 focus:ring-[#4180ab] rounded-lg uppercase"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="text-left">
              <div className="relative bg-white rounded-lg shadow-sm flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="SENHA"
                  {...register('password', { required: 'Senha é obrigatória' })}
                  className="w-full bg-transparent px-4 py-3 text-center sm:text-left text-sm font-semibold text-gray-700 placeholder-[#799db6] focus:outline-none focus:ring-2 focus:ring-[#4180ab] rounded-lg"
                />
                
                {/* Visibility Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#4180ab] hover:text-[#2d6e9c] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-red-150 animate-pulse text-center">
                {error}
              </div>
            )}

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4180ab] hover:bg-[#346b91] text-white py-3 rounded-lg font-bold text-sm sm:text-base tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'CARREGANDO...' : 'CONFIRMAR'}
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};
