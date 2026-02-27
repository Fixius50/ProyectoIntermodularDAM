import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Navbar from './components/Navbar';
import ElSantuario from './screens/home/ElSantuario';
import Login from './screens/auth/Login';
import BottomNav from './components/BottomNav';
import LaExpedicion from './screens/expedition/LaExpedicion';
import ElCertamen from './screens/arena/ElCertamen';
import ElSocial from './screens/social/ElSocial';
import ElTienda from './screens/store/ElTienda';
import MiPerfil from './screens/profile/MiPerfil';
import './App.css';

function App() {
  const { currentScreen, currentUser, updateTime, updateWeather, hydrateBirdMedia } = useAppStore();

  useEffect(() => {
    if (currentUser) {
      updateTime();
      updateWeather();
      hydrateBirdMedia();

      const tInterval = setInterval(updateTime, 60000);
      const wInterval = setInterval(updateWeather, 600000);

      return () => {
        clearInterval(tInterval);
        clearInterval(wInterval);
      };
    }
  }, [currentUser, updateTime, updateWeather]);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentScreen) {
      case 'home':
        return <ElSantuario />;
      case 'arena':
        return <ElCertamen />;
      case 'expedition':
        return <LaExpedicion />;
      case 'social':
        return <ElSocial />;
      case 'store':
        return <ElTienda />;
      case 'profile':
        return <MiPerfil />;
      default:
        return <ElSantuario />;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] font-sans bg-cream dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-y-auto w-full" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}>
        {renderContent()}
      </main>
      <BottomNav />

      {/* Background decoration elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-sage-200/20 dark:bg-sage-800/10 rounded-full blur-[120px] animate-pulse" />
      </div>
    </div>
  );
}

export default App;
