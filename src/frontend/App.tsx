import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { GameProvider } from './src/context/GameContext';
import { FlockProvider } from './src/context/FlockContext';
import { MarketProvider } from './src/context/MarketContext';
import { CoopProvider } from './src/context/CoopContext';
import { SantuarioScreen } from './src/screens/SantuarioScreen';
import { ExpedicionScreen } from './src/screens/ExpedicionScreen';
import { TallerScreen } from './src/screens/TallerScreen';
import { CertamenScreen } from './src/screens/CertamenScreen';
import { AlbumScreen } from './src/screens/AlbumScreen';
import { FlockScreen } from './src/screens/FlockScreen';
import { MarketScreen } from './src/screens/MarketScreen';
import { CoopScreen } from './src/screens/CoopScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { BottomBar } from './src/components/BottomBar';
import { MoreMenu } from './src/components/MoreMenu';
import { colors, typography, spacing } from './src/theme/theme';

// Placeholder screens para secciones aún no implementadas
const PlaceholderScreen = ({ title, emoji }: { title: string; emoji: string }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderEmoji}>{emoji}</Text>
    <Text style={styles.placeholderTitle}>{title}</Text>
    <Text style={styles.placeholderSubtitle}>Próximamente...</Text>
  </View>
);

/**
 * Contenido principal del juego (requiere autenticación).
 */
function GameContent() {
  const [currentTab, setCurrentTab] = useState('santuario');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === '_more') {
      setIsMoreOpen((prev: boolean) => !prev);
    } else {
      setCurrentTab(tab);
      setIsMoreOpen(false);
    }
  };

  const handleMoreSelect = (id: string) => {
    setCurrentTab(id);
    setIsMoreOpen(false);
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'santuario':
        return <SantuarioScreen />;
      case 'expedicion':
        return <ExpedicionScreen />;
      case 'taller':
        return <TallerScreen />;
      case 'certamen':
        return <CertamenScreen />;
      case 'album':
        return <AlbumScreen />;
      case 'bandada':
        return <FlockScreen />;
      case 'mercado':
        return <MarketScreen />;
      case 'coop':
        return <CoopScreen />;
      case 'perfil':
        return <ProfileScreen />;
      case 'avisos':
        return <NotificationsScreen />;
      default:
        return <SantuarioScreen />;
    }
  };

  return (
    <GameProvider>
      <FlockProvider>
        <MarketProvider>
          <CoopProvider>
            <View style={styles.container}>
              <View style={styles.screenContainer}>
                {renderScreen()}
              </View>
              {isMoreOpen && (
                <MoreMenu
                  onSelect={handleMoreSelect}
                  onClose={() => setIsMoreOpen(false)}
                />
              )}
              <BottomBar
                currentTab={currentTab}
                onTabChange={handleTabChange}
                isMoreOpen={isMoreOpen}
              />
            </View>
          </CoopProvider>
        </MarketProvider>
      </FlockProvider>
    </GameProvider>
  );
}

/**
 * Gate de autenticación: muestra Login/Register si no autenticado,
 * o el juego si autenticado.
 */
function AuthGate() {
  const { isAuthenticated, isLoading, state } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  // Pantalla de carga mientras restauramos sesión
  if (state.status === 'IDLE' || (isLoading && !state.error)) {
    console.log('AuthGate: Loading state...', { status: state.status, isLoading });
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#ffeb3b' }]}>
        <Text style={styles.loadingEmoji}>🐦</Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Preparando tu cuaderno (Loading Gate)...</Text>
      </View>
    );
  }

  console.log('AuthGate: Final state', { status: state.status, isAuthenticated });

  // Si no autenticado, mostrar Login o Register
  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return <RegisterScreen onNavigateToLogin={() => setAuthScreen('login')} />;
    }
    return <LoginScreen onNavigateToRegister={() => setAuthScreen('register')} />;
  }

  // Autenticado → mostrar juego
  return <GameContent />;
}

/**
 * App raíz: AuthProvider envuelve todo.
 */
function App() {
  console.log('App: Rendering root');
  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  loadingText: {
    fontSize: typography.sizeBody,
    color: colors.text,
    opacity: 0.6,
    fontFamily: typography.fontBody,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    gap: spacing.md,
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  placeholderTitle: {
    fontSize: typography.sizeTitle,
    fontWeight: typography.weightBold,
    color: colors.background,
    fontFamily: typography.fontTitle,
  },
  placeholderSubtitle: {
    fontSize: typography.sizeBody,
    color: 'rgba(253, 251, 247, 0.8)',
    fontFamily: typography.fontBody,
  },
});

export default App;
