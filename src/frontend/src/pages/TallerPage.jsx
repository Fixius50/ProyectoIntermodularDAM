import React from 'react';
import './TallerPage.css';

const TallerPage = () => {
    return (
        <div className="page-container">
            <div className="screen-header">
                <h2>Taller de Reclamo</h2>
                <p>Construye tu oportunidad de avistamiento</p>
            </div>
            <div className="crafting-table glass-card">
                <div className="dropzone empty">
                    <span className="icon">🪵</span>
                    <span className="label">Base</span>
                </div>
                <span className="plus">+</span>
                <div className="dropzone empty">
                    <span className="icon">📏</span>
                    <span className="label">Tamaño</span>
                </div>
                <span className="plus">+</span>
                <div className="dropzone empty">
                    <span className="icon">🍎</span>
                    <span className="label">Cebo</span>
                </div>
            </div>
            <div className="inventory-tray">
                <h3>Materiales</h3>
                <div className="items-row">
                    <div className="item glass-card"><span className="icon">🪵</span> Madera</div>
                    <div className="item glass-card"><span className="icon">📏</span> Pequeño</div>
                    <div className="item glass-card"><span className="icon">🍏</span> Fruta</div>
                </div>
            </div>
            <div className="floating-action-container">
                <button className="glass-btn primary-btn" disabled id="btn-craft">
                    <span>🔨 Construir Estación</span>
                </button>
            </div>
        </div>
    );
};

export default TallerPage;
