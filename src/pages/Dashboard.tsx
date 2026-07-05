import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { reportsService } from '../services/reports';
import { foodService } from '../services/food';
import { userService } from '../services/users';
import type { Summary } from '../interfaces/Summary';
import type { Food } from '../interfaces/Food';
import type { SchoolFoodSummary } from '../interfaces/SchoolFoodSummary';
import type { UserResponse } from '../services/types';
import FoodCard from '../components/FoodCard';
import logoImg from '../assets/logo.png';
import { Footer } from '../components/Footer';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  LogOut,
  User,
  Menu,
  Check,
  ArrowRight,
  Send,
  Trash2,
  X,
  Plus,
  Pencil
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Role Detection
  const roleObj = user?.role as { name?: string } | string | undefined;
  const roleName = (typeof roleObj === 'string' ? roleObj : roleObj?.name ?? '').toLowerCase();
  const isAdmin = roleName === 'admin';
  const isSchool = roleName === 'school';

  // Navigation / Views states
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // States
  const [foods, setFoods] = useState<Summary[]>([]);
  const [schoolFoods, setSchoolFoods] = useState<Food[]>([]);
  const [selectedSchoolFood, setSelectedSchoolFood] = useState<Food | null>(null);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Seduc Detailed Food Summary Chart States
  const [selectedFoodDetails, setSelectedFoodDetails] = useState<Summary | null>(null);
  const [schoolFoodSummary, setSchoolFoodSummary] = useState<SchoolFoodSummary[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Admin Panel states
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Edit user states
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Overlay/Modal/Form states for creation
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewFoodForm, setShowNewFoodForm] = useState(false);

  // Creation form values
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('school');
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  // School Dashboard form inputs
  const [receivedKg, setReceivedKg] = useState<string>('');
  const [wastedKg, setWastedKg] = useState<string>('');
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load basic data based on role
  const loadData = async () => {
    setLoadingFoods(true);
    setFetchError(null);
    try {
      if (isSchool) {
        const data = await foodService.getFoods();
        setSchoolFoods(data);
        if (data && data.length > 0) {
          setSelectedSchoolFood(data[0]);
        }
      } else {
        const data = await reportsService.getSummary();
        setFoods(data);
      }
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr?.response?.data?.message || axiosErr?.message || 'Erro ao buscar dados.';
      setFetchError(msg);
      console.error('Error fetching data:', error);
    } finally {
      setLoadingFoods(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isSchool]);

  // Load admin list of users/foods
  const loadAdminData = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    setAdminError(null);
    try {
      const [uData, fData] = await Promise.all([
        userService.getUsers(),
        foodService.getFoods()
      ]);
      setUsers(uData);
      setSchoolFoods(fData);
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr?.response?.data?.message || axiosErr?.message || 'Erro ao buscar dados da administração.';
      setAdminError(msg);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (showAdminPanel) {
      loadAdminData();
    }
  }, [showAdminPanel]);

  // Handle food card click to fetch school-level charts
  const handleFoodCardClick = async (food: Summary) => {
    setSelectedFoodDetails(food);
    setLoadingDetails(true);
    setDetailsError(null);
    try {
      const details = await reportsService.getSummaryByFood(food.foodId);
      setSchoolFoodSummary(details);
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr?.response?.data?.message || axiosErr?.message || 'Erro ao buscar detalhamento por escola.';
      setDetailsError(msg);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectSchoolFood = (food: Food) => {
    setSelectedSchoolFood(food);
    setReceivedKg('');
    setWastedKg('');
    setSubmitStatus(null);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolFood) return;

    const hasReceived = receivedKg.trim() !== '';
    const hasWasted = wastedKg.trim() !== '';

    if (!hasReceived && !hasWasted) {
      setSubmitStatus({ type: 'error', message: 'Deve ser fornecida a quantidade recebida ou a quantidade desperdiçada (ou ambas).' });
      return;
    }

    let rKg: number | undefined = undefined;
    if (hasReceived) {
      rKg = parseFloat(receivedKg);
      if (isNaN(rKg) || rKg <= 0) {
        setSubmitStatus({ type: 'error', message: 'A quantidade recebida (kg) deve ser positiva.' });
        return;
      }
    }

    let wKg: number | undefined = undefined;
    if (hasWasted) {
      wKg = parseFloat(wastedKg);
      if (isNaN(wKg) || wKg <= 0) {
        setSubmitStatus({ type: 'error', message: 'A quantidade desperdiçada (kg) deve ser positiva.' });
        return;
      }
    }

    setSubmittingReport(true);
    setSubmitStatus(null);

    try {
      await reportsService.createReport({
        foodId: selectedSchoolFood.id,
        receivedKg: rKg,
        wastedKg: wKg
      });
      setSubmitStatus({ type: 'success', message: `Dados de ${selectedSchoolFood.name} enviados com sucesso!` });
      setReceivedKg('');
      setWastedKg('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr?.response?.data?.message || axiosErr?.message || 'Erro ao enviar dados para o servidor.';
      setSubmitStatus({ type: 'error', message: msg });
    } finally {
      setSubmittingReport(false);
    }
  };

  // Admin creations
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newRole) return;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^\S+$/;

    if (newUsername.length < 4 || newUsername.length > 16) {
      setAdminError('O nome de usuário deve ter entre 4 e 16 caracteres.');
      return;
    }
    if (!usernameRegex.test(newUsername)) {
      setAdminError('O nome de usuário deve conter apenas letras e números, sem espaços.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 64) {
      setAdminError('A senha deve ter entre 8 e 64 caracteres.');
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setAdminError('A senha não deve conter espaços.');
      return;
    }

    setActionSubmitting(true);
    setAdminError(null);
    try {
      await userService.createUser({
        username: newUsername,
        password: newPassword,
        role: newRole
      });
      setNewUsername('');
      setNewPassword('');
      setShowNewUserForm(false);
      await loadAdminData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setAdminError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao criar usuário.');
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleEditUser = (u: UserResponse) => {
    setEditingUser(u);
    setEditUsername(u.username);
    setEditPassword('');
    setShowNewUserForm(false);
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^\S+$/;

    const trimmedUsername = editUsername.trim();
    const isUsernameChanged = trimmedUsername !== editingUser.username;

    if (isUsernameChanged && trimmedUsername !== '') {
      if (trimmedUsername.length < 4 || trimmedUsername.length > 16) {
        setAdminError('O nome de usuário deve ter entre 4 e 16 caracteres.');
        return;
      }
      if (!usernameRegex.test(trimmedUsername)) {
        setAdminError('O nome de usuário deve conter apenas letras e números, sem espaços.');
        return;
      }
    }

    if (editPassword !== '') {
      if (editPassword.length < 8 || editPassword.length > 64) {
        setAdminError('A senha deve ter entre 8 e 64 caracteres.');
        return;
      }
      if (!passwordRegex.test(editPassword)) {
        setAdminError('A senha não deve conter espaços.');
        return;
      }
    }

    setActionSubmitting(true);
    setAdminError(null);
    try {
      await userService.updateUser({
        id: editingUser.id,
        newUsername: isUsernameChanged ? trimmedUsername : undefined,
        newPassword: editPassword ? editPassword : undefined
      });
      setEditingUser(null);
      setEditUsername('');
      setEditPassword('');
      await loadAdminData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setAdminError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao atualizar usuário.');
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newFoodPrice);
    if (!newFoodName || isNaN(priceNum) || priceNum <= 0) return;
    setActionSubmitting(true);
    setAdminError(null);
    try {
      await foodService.createFood({
        name: newFoodName,
        price: priceNum
      });
      setNewFoodName('');
      setNewFoodPrice('');
      setShowNewFoodForm(false);
      await loadAdminData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setAdminError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao criar alimento.');
    } finally {
      setActionSubmitting(false);
    }
  };

  // Admin deletions
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este usuário?')) return;
    setAdminError(null);
    try {
      await userService.deleteUser(id);
      await loadAdminData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setAdminError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao apagar usuário.');
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este alimento?')) return;
    setAdminError(null);
    try {
      await foodService.deleteFood(id);
      await loadAdminData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setAdminError(axiosErr?.response?.data?.message || axiosErr?.message || 'Falha ao apagar alimento.');
    }
  };

  // --- SCHOOL DASHBOARD RENDER ---
  if (isSchool) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">

        {/* Header matching mobile/desktop designs */}
        <header className="bg-[#4180ab] text-white sticky top-0 z-10 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo" className="w-[42px] h-[42px] object-contain bg-white/10 rounded-full p-0.5" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Sistema de Contabilidade Alimentícia</h1>
                <p className="text-[10px] text-sky-100 uppercase tracking-widest font-semibold">Escola</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Admin Area Button */}
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
                >
                  Área Administrativa
                </button>
              )}

              {/* User Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-sky-100" />
                <span className="text-sm font-medium text-white">{user?.username}</span>
                {isAdmin && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Admin
                  </span>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-[#346b91] hover:bg-[#2d6e9c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Grid Area */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex items-center">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-12 w-full">

            {/* Left Pane - ALIMENTOS List */}
            <div className="flex-1 max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-md p-6 flex flex-col">
              <h2 className="text-[#3b759e] font-extrabold text-lg text-center tracking-wider uppercase mb-6 pb-2 border-b border-gray-100">
                Alimentos
              </h2>

              {loadingFoods ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4180ab]"></div>
                </div>
              ) : fetchError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700 text-sm font-semibold">
                  {fetchError}
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {schoolFoods.map((food) => {
                    const isSelected = selectedSchoolFood?.id === food.id;
                    return (
                      <button
                        key={food.id}
                        onClick={() => handleSelectSchoolFood(food)}
                        className={`w-full flex items-center justify-between border-2 rounded-xl py-3 px-4 transition-all duration-200 text-left font-bold ${isSelected
                          ? 'border-[#4180ab] bg-[#4180ab] text-white shadow-md scale-[1.01]'
                          : 'border-[#4180ab] text-[#4180ab] hover:bg-sky-50'
                          }`}
                      >
                        <span className="uppercase text-sm tracking-wide">{food.name}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'border-white bg-white text-[#4180ab]' : 'border-[#4180ab] bg-white'
                          }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Middle Indicator Arrow (Desktop Only) */}
            <div className="hidden md:flex flex-col items-center justify-center text-[#4180ab] gap-2 px-2">
              <span className="text-xs font-black uppercase tracking-wider text-center">Informe os dados</span>
              <div className="flex gap-1">
                <ArrowRight className="w-10 h-10 stroke-[2]" />
              </div>
            </div>

            {/* Right Pane - Form Details Card */}
            <div className="flex-1 max-w-md w-full bg-[#d9d9d9] rounded-3xl overflow-hidden shadow-md border border-gray-300 flex flex-col">

              {/* Form title header */}
              <div className="bg-[#4180ab] text-white text-center py-4 font-bold text-lg tracking-widest uppercase">
                Registrar Dados
              </div>

              {selectedSchoolFood ? (
                <form onSubmit={handleReportSubmit} className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Selected Food Badge */}
                    <div className="bg-[#3b759e] text-white font-bold text-center py-2.5 rounded-lg text-sm tracking-wider uppercase shadow-sm">
                      {selectedSchoolFood.name}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#3b759e] font-extrabold text-xs tracking-wider uppercase mb-1.5">
                          Kgs Recebidos
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={receivedKg}
                          onChange={(e) => setReceivedKg(e.target.value)}
                          placeholder="Ex: 150.00"
                          className="w-full bg-white px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4180ab]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#3b759e] font-extrabold text-xs tracking-wider uppercase mb-1.5">
                          Kgs Desperdiçados
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={wastedKg}
                          onChange={(e) => setWastedKg(e.target.value)}
                          placeholder="Ex: 12.50"
                          className="w-full bg-white px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4180ab]"
                        />
                      </div>
                    </div>

                    {/* Submit Status Notification */}
                    {submitStatus && (
                      <div className={`p-3 rounded-xl text-center text-xs font-bold border ${submitStatus.type === 'success'
                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                        : 'bg-red-50 border-red-250 text-red-700'
                        }`}>
                        {submitStatus.message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="w-full mt-8 bg-[#4180ab] hover:bg-[#346b91] text-white py-3 rounded-lg font-bold text-sm sm:text-base tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReport ? 'ENVIANDO...' : 'ENVIAR RELATÓRIO'}
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center text-gray-500 font-semibold flex-1 flex items-center justify-center">
                  Selecione um alimento ao lado para informar os dados.
                </div>
              )}
            </div>

          </div>
        </main>

        {/* Detailed Premium Footer */}
        <Footer />

      </div>
    );
  }

  // --- ADMIN CRUD PANEL VIEW ---
  if (isAdmin && showAdminPanel) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">

        {/* Admin Header matching Mockup Menu */}
        <header className="bg-[#4180ab] text-white sticky top-0 z-10 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo" className="w-[42px] h-[42px] object-contain bg-white/10 rounded-full p-0.5" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Sistema de Contabilidade Alimentícia</h1>
                <p className="text-[10px] text-sky-100 uppercase tracking-widest font-semibold">Seduc Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAdminPanel(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
              >
                Alimentação
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-sm">
                <User className="w-4 h-4 text-sky-100" />
                <span>{user?.username}</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-[#346b91] hover:bg-[#2d6e9c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Admin CRUD Dashboard */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#3b759e] uppercase tracking-wider">
              Área Administrativa
            </h2>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              Controle de usuários, cargos e banco de alimentos municipal.
            </p>
          </div>

          {adminError && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 p-4 rounded-2xl text-center text-red-700 text-sm font-semibold">
              {adminError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-4 max-w-5xl mx-auto">

            {/* Left Box - USUÁRIOS */}
            <div className="bg-[#d9d9d9] rounded-[2rem] p-6 shadow-md border border-gray-300 flex flex-col min-h-[450px] justify-between">
              <div>
                <h3 className="text-[#3b759e] font-extrabold text-lg text-center tracking-wider uppercase mb-6">
                  Usuários Seduc / Escolas
                </h3>

                {loadingUsers ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4180ab]"></div>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {[...users].sort((a, b) => a.username.localeCompare(b.username)).map((u) => (
                      <div
                        key={u.id}
                        className="w-full bg-[#4180ab] text-white flex items-center justify-between rounded-xl py-3 px-4 shadow-sm font-bold uppercase text-xs sm:text-sm tracking-wide"
                      >
                        <div className="flex flex-col text-left">
                          <span>{u.username}</span>
                          <span className="text-[10px] text-sky-100 lowercase">cargo: {u.role}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditUser(u)}
                            className="hover:text-amber-200 p-1.5 focus:outline-none transition-colors"
                            title="Editar usuário"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {u.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="hover:text-red-200 p-1.5 focus:outline-none transition-colors"
                              title="Apagar usuário"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button & New User Form Toggle */}
              <div className="mt-6 border-t border-gray-300 pt-4">
                {editingUser ? (
                  <form onSubmit={handleUpdateUserSubmit} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-amber-350">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-xs font-black uppercase text-amber-600">Editar Usuário ({editingUser.username})</span>
                      <button type="button" onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="NOVO USERNAME (opcional)"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
                    />

                    <input
                      type="password"
                      placeholder="NOVA SENHA (opcional)"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={actionSubmitting}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {actionSubmitting ? 'SALVANDO...' : 'SALVAR'}
                    </button>
                  </form>
                ) : showNewUserForm ? (
                  <form onSubmit={handleCreateUser} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-xs font-black uppercase text-[#3b759e]">Novo Usuário</span>
                      <button type="button" onClick={() => setShowNewUserForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="USERNAME (min 4 letras/números)"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
                    />

                    <input
                      type="password"
                      required
                      placeholder="PASSWORD (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
                    />

                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none"
                    >
                      <option value="school">SCHOOL (Escola)</option>
                      <option value="seduc_user">SEDUC_USER (Secretaria)</option>
                      <option value="admin">ADMIN (Administrador)</option>
                    </select>

                    <button
                      type="submit"
                      disabled={actionSubmitting}
                      className="w-full bg-[#4180ab] hover:bg-[#346b91] text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {actionSubmitting ? 'CONFIRMANDO...' : 'CONFIRMAR'}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => { setShowNewUserForm(true); setEditingUser(null); setAdminError(null); }}
                    className="w-full bg-[#3b759e] hover:bg-[#2d6e9c] text-white py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    Novo Admin / Escola
                  </button>
                )}
              </div>
            </div>

            {/* Right Box - ALIMENTOS */}
            <div className="bg-[#d9d9d9] rounded-[2rem] p-6 shadow-md border border-gray-300 flex flex-col min-h-[450px] justify-between">
              <div>
                <h3 className="text-[#3b759e] font-extrabold text-lg text-center tracking-wider uppercase mb-6">
                  Alimentos Municipais
                </h3>

                {loadingFoods ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4180ab]"></div>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {[...schoolFoods].sort((a, b) => a.name.localeCompare(b.name)).map((f) => (
                      <div
                        key={f.id}
                        className="w-full bg-[#4180ab] text-white flex items-center justify-between rounded-xl py-3 px-4 shadow-sm font-bold uppercase text-xs sm:text-sm tracking-wide"
                      >
                        <div className="flex flex-col text-left">
                          <span>{f.name}</span>
                          <span className="text-[10px] text-sky-100 lowercase">preço base: R$ {f.price.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteFood(f.id)}
                          className="hover:text-red-200 p-1.5 focus:outline-none transition-colors"
                          title="Apagar alimento"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button & New Food Form Toggle */}
              <div className="mt-6 border-t border-gray-300 pt-4">
                {showNewFoodForm ? (
                  <form onSubmit={handleCreateFood} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-xs font-black uppercase text-[#3b759e]">Novo Alimento</span>
                      <button type="button" onClick={() => setShowNewFoodForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="NOME (min 4 letras/números)"
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
                    />

                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="PREÇO BASE (Ex: 5.77)"
                      value={newFoodPrice}
                      onChange={(e) => setNewFoodPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={actionSubmitting}
                      className="w-full bg-[#4180ab] hover:bg-[#346b91] text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {actionSubmitting ? 'CONFIRMANDO...' : 'CONFIRMAR'}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => { setShowNewFoodForm(true); setAdminError(null); }}
                    className="w-full bg-[#3b759e] hover:bg-[#2d6e9c] text-white py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    Novo Alimento
                  </button>
                )}
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    );
  }

  // --- SEDUC USER / ADMIN MAIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#4180ab] text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="w-[42px] h-[42px] object-contain bg-white/10 rounded-full p-0.5" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sistema de Contabilidade Alimentícia</h1>
              <p className="text-[10px] text-sky-100 uppercase tracking-widest font-semibold">Seduc Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Area Button */}
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
              >
                Área Administrativa
              </button>
            )}

            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-sky-100" />
              <span className="text-sm font-medium text-white">{user?.username}</span>
              {isAdmin && (
                <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  Admin
                </span>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-[#346b91] hover:bg-[#2d6e9c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/20"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {selectedFoodDetails ? (

          // --- DETAILED VIEW BY SCHOOL (IMAGE 2) ---
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-350">
            {/* Title Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#3b759e] uppercase tracking-wide">
                  {selectedFoodDetails.foodName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wider uppercase mt-1">
                  Resumo detalhado por escola municipal
                </p>
              </div>
              <button
                onClick={() => { setSelectedFoodDetails(null); setSchoolFoodSummary([]); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-650 p-2.5 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4180ab]"></div>
                <p className="mt-4 text-gray-500 font-medium">Carregando métricas por escola...</p>
              </div>
            ) : detailsError ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 font-semibold">
                {detailsError}
              </div>
            ) : schoolFoodSummary.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-12 text-center text-gray-500 font-bold uppercase tracking-wider">
                Nenhum relatório escolar enviado para este alimento.
              </div>
            ) : (

              // --- CAROUSEL OF CHARTS WITH NETFLIX-STYLE SHOWCASE ---
              <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                {/* Chart Card 1: Kg Enviado */}
                <div className="w-[85vw] md:w-[480px] flex-shrink-0 snap-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[360px]">
                  <h4 className="text-center font-black text-[#4180ab] uppercase text-sm tracking-wider mb-4">
                    Kg enviado
                  </h4>
                  <div className="w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[...schoolFoodSummary].sort((a, b) => a.schoolUsername.localeCompare(b.schoolUsername))} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="schoolUsername" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(value: any) => [`${(+value).toFixed(1)} kg`, 'Total enviado']}
                          labelFormatter={(label: any) => `Escola: ${label}`}
                          contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="totalSentKg" fill="#4180ab" radius={[6, 6, 0, 0]} name="Kg Enviado" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart Card 2: Kg Desperdiçado */}
                <div className="w-[85vw] md:w-[480px] flex-shrink-0 snap-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[360px]">
                  <h4 className="text-center font-black text-[#4180ab] uppercase text-sm tracking-wider mb-4">
                    Kg desperdiçado
                  </h4>
                  <div className="w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[...schoolFoodSummary].sort((a, b) => a.schoolUsername.localeCompare(b.schoolUsername))} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="schoolUsername" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(value: any) => [`${(+value).toFixed(1)} kg`, 'Total desperdiçado']}
                          labelFormatter={(label: any) => `Escola: ${label}`}
                          contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="totalWastedKg" fill="#e11d48" radius={[6, 6, 0, 0]} name="Kg Desperdiçado" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart Card 3: Dinheiro Gasto */}
                <div className="w-[85vw] md:w-[480px] flex-shrink-0 snap-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[360px]">
                  <h4 className="text-center font-black text-[#4180ab] uppercase text-sm tracking-wider mb-4">
                    Dinheiro gasto
                  </h4>
                  <div className="w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[...schoolFoodSummary].sort((a, b) => a.schoolUsername.localeCompare(b.schoolUsername))} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="schoolUsername" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(value: any) => [`R$ ${(+value).toFixed(2)}`, 'Valor total gasto']}
                          labelFormatter={(label: any) => `Escola: ${label}`}
                          contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="moneySpent" fill="#000000" radius={[6, 6, 0, 0]} name="Dinheiro Gasto" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart Card 4: Dinheiro Perdido */}
                <div className="w-[85vw] md:w-[480px] flex-shrink-0 snap-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[360px]">
                  <h4 className="text-center font-black text-[#4180ab] uppercase text-sm tracking-wider mb-4">
                    Dinheiro perdido
                  </h4>
                  <div className="w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[...schoolFoodSummary].sort((a, b) => a.schoolUsername.localeCompare(b.schoolUsername))} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="schoolUsername" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(value: any) => [`R$ ${(+value).toFixed(2)}`, 'Valor total perdido']}
                          labelFormatter={(label: any) => `Escola: ${label}`}
                          contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="moneyLost" fill="#ea580c" radius={[6, 6, 0, 0]} name="Dinheiro Perdido" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart Card 5: Desperdício (%) */}
                <div className="w-[85vw] md:w-[480px] flex-shrink-0 snap-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[360px]">
                  <h4 className="text-center font-black text-[#4180ab] uppercase text-sm tracking-wider mb-4">
                    Desperdício (%)
                  </h4>
                  <div className="w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[...schoolFoodSummary].sort((a, b) => a.schoolUsername.localeCompare(b.schoolUsername))} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="schoolUsername" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v: number) => `${Math.round(v)}%`} />
                        <Tooltip
                          formatter={(value: any) => [`${Math.round(+value)}%`, 'Percentual de desperdício']}
                          labelFormatter={(label: any) => `Escola: ${label}`}
                          contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="wastePercentage" fill="#dc2626" radius={[6, 6, 0, 0]} name="Desperdício" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => { setSelectedFoodDetails(null); setSchoolFoodSummary([]); }}
                className="bg-[#4180ab] hover:bg-[#346b91] text-white py-3 px-8 rounded-xl font-bold tracking-wider uppercase transition-colors shadow-md"
              >
                Voltar ao Resumo
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#4180ab] to-[#5194c2] rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-white opacity-5 rounded-full pointer-events-none" />
              <h2 className="text-2xl sm:text-3xl font-extrabold">Olá, {user?.username || 'Usuário'}!</h2>
              <p className="mt-2 text-sky-100 max-w-xl text-sm sm:text-base">
                Bem-vindo ao painel de controle da Secretaria de Educação. Veja abaixo o resumo geral de consumo e desperdício de alimentos. Clique em qualquer card para ver o detalhamento escolar.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-sky-50">
                <div className="bg-black/10 px-3 py-1.5 rounded-lg">ID: {user?.id}</div>
                <div className="bg-black/10 px-3 py-1.5 rounded-lg">Função: {user?.role ?? 'Seduc'}</div>
              </div>
            </div>

            {/* Foods Summary Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Resumo Geral de Alimentos</h3>
              </div>

              {loadingFoods ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4180ab]"></div>
                  <p className="mt-4 text-gray-500 font-medium">Carregando dados dos alimentos...</p>
                </div>
              ) : fetchError ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-red-700 font-semibold">{fetchError}</p>
                </div>
              ) : foods.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                  <p className="text-gray-500 font-medium">Nenhum dado de alimento encontrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                  {[...foods].sort((a, b) => a.foodName.localeCompare(b.foodName)).map((food) => (
                    <div
                      key={food.foodId}
                      onClick={() => handleFoodCardClick(food)}
                      className="cursor-pointer flex flex-col"
                    >
                      <FoodCard summary={food} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};
