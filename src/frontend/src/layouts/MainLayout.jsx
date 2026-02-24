import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomBar from '../components/BottomBar';

const MainLayout = () => {
    return (
        <div className="app-container">
            {/* Fondo Dinámico */}
            <div className="weather-background" id="weather-bg">
                <video autoPlay muted loop id="bg-video">
                    <source src="https://videos.pexels.com/video-files/5533362/5533362-hd_1920_1080_30fps.mp4" type="video/mp4" />
                </video>
                <div className="overlay-gradiente"></div>
            </div>

            <header className="top-nav">
                <div className="glass-card status-card">
                    <span className="icon">🌤️</span>
                    <span className="text">Madrid: Despejado | 18ºC</span>
                </div>
                <div className="glass-card inventory-card">
                    <div class="resource-pill">
                        <span className="icon">🌰</span>
                        <span className="text font-nunito">150</span>
                    </div>
                    <div className="resource-pill">
                        <span className="icon">📝</span>
                        <span className="text font-nunito">12</span>
                    </div>
                </div>
            </header>

            <main className="main-area">
                <Outlet />
            </main>

            <BottomBar />
        </div>
    );
};

export default MainLayout;
