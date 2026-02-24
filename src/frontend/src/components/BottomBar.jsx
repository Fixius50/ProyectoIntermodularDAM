import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, Map, Hammer, Swords, BookOpen } from 'lucide-react';
import './BottomBar.css';

const BottomBar = () => {
    return (
        <nav className="bottom-bar glass-card">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Leaf className="icon" size={24} />
                <span className="label">Santuario</span>
            </NavLink>
            <NavLink to="/expedicion" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Map className="icon" size={24} />
                <span className="label">Expedición</span>
            </NavLink>
            <NavLink to="/taller" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Hammer className="icon" size={24} />
                <span className="label">Taller</span>
            </NavLink>
            <NavLink to="/certamen" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Swords className="icon" size={24} />
                <span className="label">Certamen</span>
            </NavLink>
            <NavLink to="/album" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <BookOpen className="icon" size={24} />
                <span className="label">Álbum</span>
            </NavLink>
        </nav>
    );
};

export default BottomBar;
