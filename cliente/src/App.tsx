import { useAppStore } from './store/useAppStore';
import Navbar from './components/Navbar';
import ElSantuario from './screens/home/ElSantuario';
import Login from './screens/auth/Login';
import BottomNav from './components/BottomNav';
import LaExpedicion from './screens/expedition/LaExpedicion';
import ElCertamen from './screens/arena/ElCertamen';
import './App.css';

function App() {
  const { currentScreen, currentUser } = useAppStore();

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
        return <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse">group</span>
          <h2 className="text-3xl font-black">Social</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Bandadas y mercado próximamente disponible</p>
        </div>;
      case 'store':
        return <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse">shopping_cart</span>
          <h2 className="text-3xl font-black">Tienda</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Suministros próximamente disponible</p>
        </div>;
      case 'profile':
        return <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse">account_circle</span>
          <h2 className="text-3xl font-black">Mi Perfil</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Estadísticas de explorador próximamente disponible</p>
        </div>;
      default:
        return <ElSantuario />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans pb-24 md:pb-0">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
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
