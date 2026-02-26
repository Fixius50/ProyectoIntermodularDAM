import { useAppStore } from './store/useAppStore';
import Navbar from './components/Navbar';
import ElSantuario from './screens/home/ElSantuario';
import './App.css';

function App() {
  const { currentScreen, currentUser } = useAppStore();

  const renderContent = () => {
    // If not logged in, we could redirect to login, but for now we'll just show home
    // logic simplified as per request to focus on front end implementation
    switch (currentScreen) {
      case 'home':
        return <ElSantuario />;
      case 'arena':
        return <div className="p-12"><h2>El Certamen (Próximamente)</h2></div>;
      case 'expedition':
        return <div className="p-12"><h2>La Expedición (Próximamente)</h2></div>;
      case 'social':
        return <div className="p-12"><h2>Social (Próximamente)</h2></div>;
      case 'store':
        return <div className="p-12"><h2>Tienda (Próximamente)</h2></div>;
      case 'profile':
        return <div className="p-12"><h2>Mi Perfil (Próximamente)</h2></div>;
      default:
        return <ElSantuario />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Background decoration elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-sage-200/20 dark:bg-sage-800/10 rounded-full blur-[120px] animate-pulse" />
      </div>
    </div>
  );
}

export default App;
