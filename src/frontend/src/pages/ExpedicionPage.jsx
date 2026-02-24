import React, { useState } from 'react';
import './ExpedicionPage.css';

const ExpedicionPage = () => {
    const [activeBiome, setActiveBiome] = useState('Bosque');

    const handleSearch = () => {
        alert(`Buscando en ${activeBiome}...`);
    };

    return (
        <div className="page-container">
            <div className="screen-header">
                <h2>Expedición</h2>
                <p>Elige un bioma para explorar</p>
            </div>
            <div className="biome-carousel">
                <div
                    className={`biome-card glass-card ${activeBiome === 'Bosque' ? 'active' : ''}`}
                    onClick={() => setActiveBiome('Bosque')}
                >
                    <span className="icon">🌲</span>
                    <div>
                        <h3>Bosque</h3>
                        {activeBiome === 'Bosque' && <p className="chance">Probabilidad: Normal</p>}
                    </div>
                </div>
                <div
                    className={`biome-card glass-card ${activeBiome === 'Costa' ? 'active' : ''}`}
                    onClick={() => setActiveBiome('Costa')}
                >
                    <span className="icon">🌊</span>
                    <div>
                        <h3>Costa</h3>
                        {activeBiome === 'Costa' && <p className="chance">Probabilidad: Baja</p>}
                    </div>
                </div>
                <div
                    className={`biome-card glass-card ${activeBiome === 'Montaña' ? 'active' : ''}`}
                    onClick={() => setActiveBiome('Montaña')}
                >
                    <span className="icon">⛰️</span>
                    <div>
                        <h3>Montaña</h3>
                        {activeBiome === 'Montaña' && <p className="chance">Probabilidad: Alta</p>}
                    </div>
                </div>
            </div>
            <div className="floating-action-container">
                <button className="glass-btn primary-btn" onClick={handleSearch}>
                    <span>🔍 Iniciar Búsqueda</span>
                </button>
            </div>
        </div>
    );
};

export default ExpedicionPage;
