import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

export const Roulette = ({ items, onComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const controls = useAnimation();
    const wheelRotation = useMotionValue(0); 

    const N = items && items.length > 0 ? items.length : 1;
    const angle = 360 / N;
    
    // Alternating colors with a special Gold for the race day (index 14)
    const colors = ['#e53935', '#1e88e5'];
    
    const gradientStops = items ? items.map((_, i) => {
        const c = i === 14 ? '#ffca28' : colors[i % 2];
        return `${c} ${i * angle}deg ${(i + 1) * angle}deg`;
    }).join(', ') : 'transparent 0deg 360deg';

    const startSpin = () => {
        if (spinning || !items || items.length === 0) return;
        setSpinning(true);
        controls.start({
            rotate: wheelRotation.get() + 360 * 20,
            transition: { ease: "linear", duration: 10, repeat: Infinity }
        });
    };

    const stopSpin = () => {
        if (!spinning || !items || items.length === 0) return;
        
        controls.stop();
        setSpinning(false);
        
        const currentAbsolute = wheelRotation.get();
        const currentRot = currentAbsolute % 360; 
        const normalizedRot = ((currentRot % 360) + 360) % 360;
        
        // Find which slice is at 0 degrees
        let pointerLocal = (360 - normalizedRot) % 360;
        const winnerIndex = Math.floor(pointerLocal / angle) % N;
        
        // Find center of winner slice to snap precisely
        const winnerCenter = winnerIndex * angle + angle / 2;
        const targetNormalizedRot = (360 - winnerCenter) % 360;
        
        let diff = targetNormalizedRot - normalizedRot;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        // 数回転分「滑る」演出を追加（ランダムで3〜5周）
        const extraSpins = 3 + Math.floor(Math.random() * 3);
        const finalRot = currentAbsolute + diff + (360 * extraSpins);
        
        // easingを利用して徐々に速度が落ちる（滑る）ようにアニメーション
        controls.start({
            rotate: finalRot,
            transition: { type: "tween", ease: "circOut", duration: 4.0 }
        });
        
        // アニメーション完了後に結果を反映（4.0秒のdurationに合わせて4.1秒待機）
        setTimeout(() => {
            onComplete(items[winnerIndex]);
        }, 4100);
    };

    useEffect(() => {
        controls.stop();
        setSpinning(false);
        controls.set({ rotate: 0 });
    }, [items, controls]);

    const formatDateText = (timeStr) => {
        const d = new Date(timeStr);
        return `${d.getMonth()+1}/${d.getDate()}`;
    };

    const getWeatherEmoji = (cloudcover, rain) => {
        if (rain > 2) return '🌧️';
        if (rain > 0.1) return '🌦️';
        if (cloudcover > 80) return '☁️';
        if (cloudcover > 40) return '⛅';
        return '☀️';
    };

    return (
        <div className="flex flex-col items-center gap-10 w-full">
            <div className="relative mt-8">
                {/* Pointer Arrow */}
                <div 
                    className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-12 bg-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                    style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                ></div>
                
                {/* Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-slate-800 rounded-full border-4 border-white drop-shadow-lg"></div>

                {/* The Wheel */}
                <motion.div 
                    style={{ 
                        rotate: wheelRotation,
                        background: `conic-gradient(${gradientStops})`,
                        width: '440px', 
                        height: '440px', 
                        borderRadius: '50%',
                        position: 'relative',
                        boxShadow: '0 0 0 10px #1e293b, 0 10px 40px rgba(0,0,0,0.6)',
                        overflow: 'hidden'
                    }}
                    animate={controls}
                >
                    {items && items.map((item, i) => {
                        const rotation = i * angle + angle / 2;
                        const dateText = formatDateText(item.time);
                        const emoji = getWeatherEmoji(item.cloudcover_mean, item.rain_sum);
                        const temp = Math.round(item.temperature_2m_max) + '°';
                        
                        return (
                            <div 
                                key={i}
                                className="absolute top-1/2 left-1/2 flex items-center justify-between font-bold text-white whitespace-nowrap px-2"
                                style={{
                                    // Move to position and rotate outward
                                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-135px) rotate(-90deg)`,
                                    transformOrigin: '50% 50%',
                                    width: '130px',
                                    fontSize: '11px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                    color: i === 14 ? '#000' : '#fff'
                                }}
                            >
                                <span className={i === 14 ? "text-red-700 bg-white/90 px-1 rounded -ml-1" : "opacity-90"}>
                                    {i === 14 ? '開催日' : dateText}
                                </span>
                                <span className="text-[13px] drop-shadow-md mx-1">{emoji}</span>
                                <span className="font-mono">{temp}</span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={startSpin}
                    disabled={spinning || !items || items.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transform transition active:scale-95 text-xl tracking-widest border border-cyan-400/30 w-40"
                    title="SPIN THE WHEEL"
                >
                    START
                </button>
                <button
                    onClick={stopSpin}
                    disabled={!spinning}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transform transition active:scale-95 text-xl tracking-widest border border-red-400/30 w-40"
                    title="STOP"
                >
                    STOP
                </button>
            </div>
        </div>
    );
};
