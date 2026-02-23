import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SantuarioScreen } from './src/screens/SantuarioScreen';
import { BottomBar } from './src/components/BottomBar';

// Placeholder screens for navigation
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>{title}</Text>
    <Text style={styles.placeholderSubtitle}>Próximamente...</Text>
  </View>
);

function App() {
  const [currentTab, setCurrentTab] = useState('santuario');

  const renderScreen = () => {
    switch (currentTab) {
      case 'santuario':
        return <SantuarioScreen />;
      case 'expedicion':
        return <PlaceholderScreen title="Expedición" />;
      case 'taller':
        return <PlaceholderScreen title="Taller del Naturalista" />;
      case 'certamen':
        return <PlaceholderScreen title="El Certamen" />;
      default:
        return <SantuarioScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Contenedor principal para la pantalla */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Barra Infeior de Navegación */}
      <BottomBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7', // Naturaleza Soft Background
  },
  screenContainer: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7C9A92', // Base sage green background
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDFBF7',
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: 'rgba(253, 251, 247, 0.8)',
  }
});

export default App;
