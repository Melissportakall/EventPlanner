
import React from 'react';
import './AppBar.css';

const AppBar = () => {
    return (
        <div className="appbar">
            <div className="appbar-title">Event Planner</div>
            <div className="appbar-links">
                <a href="#home">Ana Sayfa</a>
                <a href="#about">Hakkında</a>
                <a href="#events">Etkinlikler</a>
                <a href="#contact">İletişim</a>
            </div>
        </div>
    );
};

export default AppBar;