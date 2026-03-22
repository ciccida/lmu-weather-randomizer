import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const MAIN_SITE = "https://wec-sprint-series.vercel.app";
    const base = import.meta.env.BASE_URL;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="w-full max-w-7xl mx-auto px-6 navbar-content">
                <a href={MAIN_SITE} className="logo">
                    <img src={`${base}assets/logo.png`} alt="WEC Sprint Series" />
                </a>
                <ul className="nav-links">
                    <li><a href={`${MAIN_SITE}/#news`}>最新ニュース</a></li>
                    <li><a href={`${MAIN_SITE}/#latest`}>最新の配信</a></li>
                    <li><a href={`${MAIN_SITE}/#schedule`}>スケジュール</a></li>
                    <li><a href={`${MAIN_SITE}/#results`}>レース結果</a></li>

                    {/* Active Tool */}
                    <li>
                        <a href="#" className="nav-tool-link" style={{ color: 'var(--color-primary)' }}>
                            WEATHER RANDOMIZER
                        </a>
                    </li>
                    <li>
                        <a href={`${MAIN_SITE}/calculator`} className="accent" style={{ fontWeight: 'bold' }}>
                            PIT CALC (TRIAL)
                        </a>
                    </li>

                    <li className="header-sponsors">
                        <span className="supported-by">SUPPORTED BY:</span>
                        <a href="https://www.endless-sport.co.jp/" target="_blank" rel="noopener noreferrer">
                            <img src={`${base}assets/sponsor-endless.png`} alt="ENDLESS" />
                        </a>
                        <a href="https://jp.pimax.com/" target="_blank" rel="noopener noreferrer">
                            <img src={`${base}assets/sponsor-partner.png`} alt="Pimax" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/@WECSS81" target="_blank" rel="noopener noreferrer" className="btn-social">
                            YouTube
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
