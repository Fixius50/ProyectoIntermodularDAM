import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SantuarioPage from './pages/SantuarioPage';
import ExpedicionPage from './pages/ExpedicionPage';
import TallerPage from './pages/TallerPage';
import CertamenPage from './pages/CertamenPage';
import AlbumPage from './pages/AlbumPage';
import './styles/design-system.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<SantuarioPage />} />
          <Route path="expedicion" element={<ExpedicionPage />} />
          <Route path="taller" element={<TallerPage />} />
          <Route path="certamen" element={<CertamenPage />} />
          <Route path="album" element={<AlbumPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
