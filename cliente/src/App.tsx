import React, { useEffect } from 'react';
import AvisCore from './services/avisCore';
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
  const { currentScreen, currentUser, theme, updateTime, updateWeather, hydrateBirdMedia } = useAppStore();

  useEffect(() => {
    const initApp = async () => {
      // Solicitud de permisos nativa (Android) al arrancar
      await AvisCore.ensurePermissions().catch(err => console.error("Error solicitando permisos:", err));

      if (currentUser) {
        updateTime();
        updateWeather();
        hydrateBirdMedia();
      }
    };

    initApp();

    // Sincronizar tema con el DOM (para darkMode: 'class')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    let tInterval: number;
    let wInterval: number;

    if (currentUser) {
      tInterval = window.setInterval(updateTime, 60000);
      wInterval = window.setInterval(updateWeather, 600000);
    }

    return () => {
      if (tInterval) clearInterval(tInterval);
      if (wInterval) clearInterval(wInterval);
    };
  }, [currentUser, theme, updateTime, updateWeather, hydrateBirdMedia]);

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
    <div className="flex flex-col flex-1 font-display bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col w-full" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}>
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
