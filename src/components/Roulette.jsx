import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { WeatherCard } from './WeatherCard';

export const Roulette = ({ items, onComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // We duplicate items to create an infinite scroll illusion or just a long strip
    // A simple roulette usually just iterates rapidly.
    // For a visual "strip" roulette (like CS:GO cases), we need a horizontal list.

    // Let's implement a "Cycling" roulette where the center card changes rapidly
    // This is easier to implement responsively than a horizontal sliding tape for date selection.

    const spinDuration = 3000; // ms

    const startSpin = () => {
        if (spinning || items.length === 0) return;
        setSpinning(true);

        // Simple interval based mock-spin
        let currentIter = 0;
        const totalIters = 50; // How many ticks
        const baseInterval = 50; // ms

        const spinLogic = (i) => {
            // Easing: slower at the end
            const progress = i / totalIters;
            // Exponential ease out for delay
            const delay = baseInterval + (Math.pow(progress, 3) * 300);

            setTimeout(() => {
                const nextIndex = Math.floor(Math.random() * items.length);
                setSelectedIndex(nextIndex);

                if (i < totalIters) {
                    spinLogic(i + 1);
                } else {
                    setSpinning(false);
                    onComplete(items[nextIndex]);
                }
            }, delay);
        };

        spinLogic(0);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="relative">
                {/* Pointer Indicator */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-lmu-accent">
                    ▼
                </div>

                <div className="flex justify-center items-center h-64 overflow-hidden relative w-full max-w-md">
                    <WeatherCard weather={items[selectedIndex]} isSelected={true} />
                </div>
            </div>

            <button
                onClick={startSpin}
                disabled={spinning || items.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transform transition active:scale-95 text-lg uppercase tracking-widest border border-cyan-400/30"
            >
                {spinning ? 'GENERATING REALIY...' : 'SPIN WEATHER'}
            </button>
        </div>
    );
};
