import React, { useState } from 'react';
import './AlbumPage.css';

const AlbumPage = () => {
    const [filter, setFilter] = useState('Todos');

    return (
        <div className="page-container">
            <div className="screen-header">
                <h2>Tu Cuaderno de Campo</h2>
                <div className="filters">
                    <span
                        className={`filter ${filter === 'Todos' ? 'active' : ''}`}
                        onClick={() => setFilter('Todos')}
                    >Todos</span>
                    <span
                        className={`filter ${filter === 'Bosque' ? 'active' : ''}`}
                        onClick={() => setFilter('Bosque')}
                    >Bosque</span>
                    <span
                        className={`filter ${filter === 'Agua' ? 'active' : ''}`}
                        onClick={() => setFilter('Agua')}
                    >Agua</span>
                </div>
            </div>
            <div className="album-grid">
                <div className="bird-card glass-card">
                    <img src="https://images.unsplash.com/photo-1552728089-5716912389d3?q=80&w=150&h=150&auto=format&fit=crop" alt="Petirrojo" />
                    <h4>Petirrojo</h4>
                </div>
                <div className="bird-card glass-card locked">
                    <span className="icon">❓</span>
                </div>
                <div className="bird-card glass-card locked">
                    <span className="icon">❓</span>
                </div>
                <div className="bird-card glass-card locked">
                    <span className="icon">❓</span>
                </div>
                <div className="bird-card glass-card locked">
                    <span className="icon">❓</span>
                </div>
                <div className="bird-card glass-card locked">
                    <span className="icon">❓</span>
                </div>
            </div>
        </div>
    );
};

export default AlbumPage;
