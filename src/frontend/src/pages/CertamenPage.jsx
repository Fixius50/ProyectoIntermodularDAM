import React from 'react';
import './CertamenPage.css';

const CertamenPage = () => {
    const playTurn = (postura) => {
        alert(`Has usado la postura: ${postura}. ¡Calculando daño según el Triángulo de Poder!`);
    };

    return (
        <div className="page-container">
            <div className="screen-header">
                <h2>La Arena</h2>
                <p>Prepara a tu ave para el duelo</p>
            </div>
            <div className="battle-arena">
                <div className="opponent-side glass-card">
                    <div className="bird-avatar opponent">
                        <img src="https://images.unsplash.com/photo-1444464666168-49b659f49c01?q=80&w=200&h=200&auto=format&fit=crop" alt="Pájaro Rival" />
                    </div>
                    <div className="stats">
                        <h3>Halcón Peregrino</h3>
                        <p>Rival: @Naturalista_88</p>
                        <p><strong>Mana:</strong> 1 🌰</p>
                    </div>
                </div>

                <div className="vs-badge">VS</div>

                <div className="player-side glass-card">
                    <div className="bird-avatar player">
                        <img src="https://images.unsplash.com/photo-1552728089-5716912389d3?q=80&w=200&h=200&auto=format&fit=crop" alt="Tu Pájaro" />
                    </div>
                    <div className="stats">
                        <h3>Petirrojo Europeo</h3>
                        <p>En el campo</p>
                        <p><strong>Mana:</strong> 3 🌰</p>
                    </div>
                </div>
            </div>
            <div className="action-buttons">
                <button className="battle-btn canto" onClick={() => playTurn('Canto')}>🎤 Canto</button>
                <button className="battle-btn plumaje" onClick={() => playTurn('Plumaje')}>🪶 Plumaje</button>
                <button className="battle-btn vuelo" onClick={() => playTurn('Vuelo')}>💨 Vuelo</button>
            </div>
        </div>
    );
};

export default CertamenPage;
