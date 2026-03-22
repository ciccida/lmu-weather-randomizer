import React, { useState } from 'react';
import { clsx } from 'clsx';
import { generateWeatherSlots } from '../utils/lmuConverter';
import { CloudRain, Sun, Copy } from 'lucide-react';

export const ServerConfig = ({ weather, trackName, hourlyData }) => {
    if (!weather || !hourlyData) return null;

    const sessionData = generateWeatherSlots(weather.time, hourlyData);

    if (!sessionData) return <div className="text-red-400">Error generating weather slots.</div>;

    const copyToClipboard = () => {
        const json = JSON.stringify(sessionData, null, 2);
        navigator.clipboard.writeText(json);
        alert("Full Server Config (15 slots) copied!");
    };

    const renderSession = (sessionName, slots) => (
        <div key={sessionName} className="mb-8 last:mb-0">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2 mb-4 border-b border-primary/30 pb-2 uppercase tracking-wide">
                <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(255,0,60,0.8)]"></span>
                {sessionName}
                <span className="text-xs text-slate-400 font-mono font-normal ml-auto">5 Slots</span>
            </h3>

            <div className="grid grid-cols-5 gap-3">
                {slots.map((slot) => (
                    <div key={slot.slot} className="bg-bg border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center relative overflow-hidden group hover:border-primary/50 transition-colors shadow-lg">
                        {/* Visual Hint Background */}
                        <div className="absolute -right-4 -top-4 opacity-5 text-slate-200 pointer-events-none group-hover:opacity-10 transition-opacity">
                            {slot.Sky.includes("Rain") || slot.Sky.includes("Drizzle") || slot.Sky.includes("Storm")
                                ? <CloudRain size={70} className="text-secondary" />
                                : <Sun size={70} className="text-orange-500" />}
                        </div>

                        <div className="text-[10px] uppercase text-primary font-bold mb-1 tracking-widest">Slot {slot.slot}</div>
                        <div className="text-xs text-slate-300 mb-2 font-mono bg-surface/80 px-2 py-0.5 rounded border border-slate-800">{slot.timeLabel}</div>

                        <div className="flex-1 flex flex-col justify-center w-full mb-3 mt-1">
                            <div className="text-sm font-bold text-white leading-tight h-10 flex items-center justify-center">
                                {slot.Sky.replace("Overcast", "Ovc.").replace("Partially", "Part.").replace("Mostly", "Most.")}
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-1 text-[10px] border-t border-slate-800 pt-2 mt-auto">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Rain %</span>
                                {!slot.allowRainChance ? (
                                    <span className="text-slate-600 font-bold select-none" title="Locked">N/A</span>
                                ) : (
                                    <span className="text-secondary font-bold text-sm shadow-secondary/50 drop-shadow-md">{slot.ChanceOfRain}%</span>
                                )}
                            </div>
                            <div className="flex flex-col border-l border-slate-800">
                                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Temp</span>
                                <span className="text-orange-400 font-bold text-sm">{slot.Temp}°</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-slate-800 w-full max-w-6xl mt-8 text-left shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Weather Schedule</h2>
                    <p className="text-xs text-slate-400 mt-2 font-mono">Full 15-slot configuration for all sessions</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-secondary font-bold font-mono bg-bg px-4 py-2 rounded-lg border border-secondary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                        {weather.time}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {renderSession('Practice', sessionData.Practice)}
                {renderSession('Qualify', sessionData.Qualify)}
                {renderSession('Race', sessionData.Race)}
            </div>

            {/* JSON Output */}
            <div className="mt-10 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-xs text-primary uppercase font-bold tracking-wider">Server CONFIG (JSON)</label>
                    <button
                        onClick={copyToClipboard}
                        className="text-xs text-white bg-primary/20 hover:bg-primary/40 border border-primary/50 px-3 py-1.5 rounded-lg transition flex items-center gap-2 font-bold"
                    >
                        <Copy size={14} /> COPY JSON
                    </button>
                </div>
                <pre className="bg-bg p-5 rounded-xl text-[11px] text-slate-300 overflow-x-auto font-mono border border-slate-800 max-h-64 shadow-inner">
                    {JSON.stringify(sessionData, null, 2)}
                </pre>
            </div>
        </div>
    );
};
