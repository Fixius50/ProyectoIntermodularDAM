import React from 'react';
import './SantuarioPage.css';

const SantuarioPage = () => {
    const triggerExplore = () => {
        alert("Iniciando exploración...");
    };

    return (
        <div className="santuario-container">
            <div className="tree-container">
                <img src="https://cdn.pixabay.com/photo/2016/10/26/19/00/tree-1772421_1280.png" alt="Árbol Santuario" className="tree-img" />

                <div className="bird-node" style={{ top: '20%', left: '30%' }}>
                    <div className="bird-avatar">
                        <img src="https://images.unsplash.com/photo-1552728089-5716912389d3?q=80&w=200&h=200&auto=format&fit=crop" alt="Pájaro 1" />
                    </div>
                </div>
                <div className="bird-node" style={{ top: '40%', right: '25%' }}>
                    <div className="bird-avatar">
                        <img src="https://images.unsplash.com/photo-1444464666168-49b659f49c01?q=80&w=200&h=200&auto=format&fit=crop" alt="Pájaro 2" />
                    </div>
                </div>
            </div>

            <div className="floating-action-container">
                <button className="glass-btn primary-btn" onClick={triggerExplore}>
                    <span>📸 Enviar Observador</span>
                </button>
            </div>
        </div>
    );
};

export default SantuarioPage;
