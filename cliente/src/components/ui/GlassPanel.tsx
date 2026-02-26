import React from 'react';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
                glass-panel 
                bg-white/80 dark:bg-slate-900/80 
                backdrop-blur-md 
                border border-white/20 dark:border-slate-800/50 
                rounded-2xl 
                shadow-sm 
                transition-all 
                duration-300 
                ${onClick ? 'cursor-pointer hover:shadow-md hover:translate-y-[-2px]' : ''} 
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default GlassPanel;
