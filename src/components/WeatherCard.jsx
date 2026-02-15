import React from 'react';
import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react';
import { clsx } from 'clsx';

export const WeatherCard = ({ weather, isSelected = false }) => {
    if (!weather) return null;

    const date = new Date(weather.time);
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const isRaining = weather.precipitation_sum > 0.5;
    const isCloudy = weather.cloudcover_mean > 50;

    return (
        <div className={clsx(
            "p-4 rounded-xl border transition-all duration-300 w-64 flex-shrink-0 flex flex-col items-center justify-center gap-2",
            isSelected
                ? "bg-lmu-accent/10 border-lmu-accent shadow-[0_0_20px_rgba(56,189,248,0.3)] scale-105"
                : "bg-lmu-card border-slate-700 opacity-70 scale-95"
        )}>
            <div className="text-lg font-bold tracking-wider text-slate-200">{dateStr}</div>

            <div className="my-2">
                {isRaining ? (
                    <CloudRain size={48} className="text-blue-400" />
                ) : isCloudy ? (
                    <Cloud size={48} className="text-gray-400" />
                ) : (
                    <Sun size={48} className="text-yellow-400" />
                )}
            </div>

            <div className="flex items-center gap-4 text-sm w-full justification-between px-2">
                <div className="flex items-center gap-1">
                    <Thermometer size={16} className="text-rose-400" />
                    <span>{weather.temperature_2m_max}°C</span>
                </div>
                <div className="flex items-center gap-1">
                    <CloudRain size={16} className="text-blue-400" />
                    <span>{weather.precipitation_sum}mm</span>
                </div>
            </div>
            {/* Debug/Meta info */}
            <div className="text-xs text-slate-500 mt-1">
                Cloud: {weather.cloudcover_mean}%
            </div>
        </div>
    );
};
