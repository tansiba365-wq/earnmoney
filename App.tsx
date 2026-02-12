
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Home, 
  Play, 
  CheckSquare, 
  RotateCw, 
  Trophy, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  TrendingUp,
  CreditCard,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { View, User, PlanType, TransactionStatus } from './types';
import { getDB, saveDB, resetDailyAds } from './store/database';
import { getDeviceFingerprint } from './utils/fingerprint';
import { AD_REWARD, MULTIPLIERS, PLANS, MIN_WITHDRAWAL, SIGNUP_BONUS, REFERRAL_BONUS, REFERRAL_COMMISSION } from './constants';

// --- Views ---
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import AdsView from './views/AdsView';
import SpinView from './views/SpinView';
import LeaderboardView from './views/LeaderboardView';
import TasksView from './views/TasksView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('AUTH');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [db, setDb] = useState(getDB());

  // Global Multiplier logic
  const activeMultiplier = useMemo(() => {
    const hour = new Date().getHours();
    return MULTIPLIERS.find(m => hour >= m.start && hour < m.end) || { value: 1, label: 'Standard (1x)' };
  }, []);

  // Sync user from DB on change
  useEffect(() => {
    if (currentUser) {
      const freshUser = db.users.find(u => u.id === currentUser.id);
      if (freshUser) {
        const resetUser = resetDailyAds(freshUser);
        if (resetUser.dailyAdsWatched !== freshUser.dailyAdsWatched) {
           const newUsers = db.users.map(u => u.id === resetUser.id ? resetUser : u);
           const updatedDb = { ...db, users: newUsers };
           setDb(updatedDb);
           saveDB(updatedDb);
        }
        setCurrentUser(resetUser);
      }
    }
  }, [db.users.length, currentView]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('AUTH');
    setIsSidebarOpen(false);
  };

  const updateDB = (updater: (prev: typeof db) => typeof db) => {
    const newDb = updater(db);
    setDb(newDb);
    saveDB(newDb);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsSidebarOpen(false); }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 text-slate-400'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (currentView === 'AUTH') {
    return <AuthView setView={setCurrentView} setUser={setCurrentUser} db={db} setDb={updateDB} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-slate-800 p-6 space-y-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <TrendingUp size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">AdQuest Pro</span>
        </div>

        <nav className="flex-1 flex flex-col space-y-2">
          <NavItem view="HOME" icon={Home} label="Dashboard" />
          <NavItem view="ADS" icon={Play} label="Watch Ads" />
          <NavItem view="TASKS" icon={CheckSquare} label="Marketplace" />
          <NavItem view="SPIN" icon={RotateCw} label="Lucky Spin" />
          <NavItem view="LEADERBOARD" icon={Trophy} label="Rankings" />
          <NavItem view="PROFILE" icon={UserIcon} label="Account" />
          {currentUser?.email === 'admin@adquest.com' && (
            <NavItem view="ADMIN" icon={ShieldCheck} label="Admin Panel" />
          )}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <TrendingUp size={24} className="text-indigo-500" />
          <span className="text-lg font-bold">AdQuest</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 p-6 flex flex-col space-y-4 pt-20" onClick={e => e.stopPropagation()}>
            <NavItem view="HOME" icon={Home} label="Dashboard" />
            <NavItem view="ADS" icon={Play} label="Watch Ads" />
            <NavItem view="TASKS" icon={CheckSquare} label="Tasks" />
            <NavItem view="SPIN" icon={RotateCw} label="Spin" />
            <NavItem view="LEADERBOARD" icon={Trophy} label="Rankings" />
            <NavItem view="PROFILE" icon={UserIcon} label="Account" />
            {currentUser?.email === 'admin@adquest.com' && (
              <NavItem view="ADMIN" icon={ShieldCheck} label="Admin" />
            )}
            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-400">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-8 px-4 md:px-10 pb-24 md:pb-8">
        {/* Dynamic View Injection */}
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentView === 'HOME' && <DashboardView user={currentUser!} db={db} setDb={updateDB} multiplier={activeMultiplier} />}
          {currentView === 'ADS' && <AdsView user={currentUser!} db={db} setDb={updateDB} multiplier={activeMultiplier} />}
          {currentView === 'TASKS' && <TasksView user={currentUser!} db={db} setDb={updateDB} />}
          {currentView === 'SPIN' && <SpinView user={currentUser!} db={db} setDb={updateDB} />}
          {currentView === 'LEADERBOARD' && <LeaderboardView db={db} />}
          {currentView === 'PROFILE' && <ProfileView user={currentUser!} db={db} setDb={updateDB} />}
          {currentView === 'ADMIN' && <AdminView db={db} setDb={updateDB} />}
        </div>
      </main>

      {/* Floating Multiplier Badge */}
      {activeMultiplier.value > 1 && (
        <div className="fixed bottom-20 md:bottom-10 right-6 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-pulse">
          <Clock size={16} />
          <span className="text-sm font-bold">{activeMultiplier.label} ACTIVE</span>
        </div>
      )}

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-slate-800 flex justify-around items-center px-2 z-50">
        <button onClick={() => setCurrentView('HOME')} className={`flex flex-col items-center ${currentView === 'HOME' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => setCurrentView('ADS')} className={`flex flex-col items-center ${currentView === 'ADS' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <Play size={20} />
          <span className="text-[10px] mt-1">Earn</span>
        </button>
        <button onClick={() => setCurrentView('SPIN')} className={`flex flex-col items-center ${currentView === 'SPIN' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <RotateCw size={20} />
          <span className="text-[10px] mt-1">Spin</span>
        </button>
        <button onClick={() => setCurrentView('LEADERBOARD')} className={`flex flex-col items-center ${currentView === 'LEADERBOARD' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <Trophy size={20} />
          <span className="text-[10px] mt-1">Best</span>
        </button>
        <button onClick={() => setCurrentView('PROFILE')} className={`flex flex-col items-center ${currentView === 'PROFILE' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <UserIcon size={20} />
          <span className="text-[10px] mt-1">Me</span>
        </button>
      </nav>
    </div>
  );
}
