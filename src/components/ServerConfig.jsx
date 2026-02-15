import React, { useState } from 'react';
import { clsx } from 'clsx';
import { generateWeatherSlots } from '../utils/lmuConverter';
import { CloudRain, Sun, Copy } from 'lucide-react';

export const ServerConfig = ({ weather, trackName, hourlyData }) => {
    if (!weather || !hourlyData) return null;

    // generateWeatherSlots now returns { Practice, Qualify, Race }
    const sessionData = generateWeatherSlots(weather.time, hourlyData);

    if (!sessionData) return <div className="text-red-400">Error generating weather slots.</div>;

    const copyToClipboard = () => {
        const json = JSON.stringify(sessionData, null, 2);
        navigator.clipboard.writeText(json);
        alert("Full Server Config (15 slots) copied!");
    };

    const renderSession = (sessionName, slots) => (
        <div key={sessionName} className="mb-8 last:mb-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <span className="w-1.5 h-5 bg-lmu-accent rounded-full"></span>
                {sessionName}
                <span className="text-xs text-slate-500 font-normal ml-auto">5 Slots</span>
            </h3>

            <div className="grid grid-cols-5 gap-2">
                {slots.map((slot) => (
                    <div key={slot.slot} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center text-center relative overflow-hidden group hover:border-lmu-accent/50 transition-colors">
                        {/* Visual Hint Background */}
                        <div className="absolute -right-4 -top-4 opacity-5 text-slate-200 pointer-events-none group-hover:opacity-10 transition-opacity">
                            {slot.Sky.includes("Rain") || slot.Sky.includes("Drizzle") || slot.Sky.includes("Storm")
                                ? <CloudRain size={60} />
                                : <Sun size={60} />}
                        </div>

                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Slot {slot.slot}</div>
                        <div className="text-xs text-slate-400 mb-2 font-mono">{slot.timeLabel}</div>

                        <div className="flex-1 flex flex-col justify-center w-full mb-2">
                            <div className="text-sm font-bold text-white leading-tight h-10 flex items-center justify-center">
                                {slot.Sky.replace("Overcast", "Ovc.").replace("Partially", "Part.").replace("Mostly", "Most.")}
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-1 text-[10px] border-t border-slate-700/50 pt-2 mt-auto">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[9px] uppercase">Rain %</span>
                                {!slot.allowRainChance ? (
                                    <span className="text-slate-600 font-bold select-none" title="Locked">N/A</span>
                                ) : (
                                    <span className="text-cyan-400 font-bold">{slot.ChanceOfRain}%</span>
                                )}
                            </div>
                            <div className="flex flex-col border-l border-slate-700/50">
                                <span className="text-slate-500 text-[9px] uppercase">Temp</span>
                                <span className="text-orange-400 font-bold">{slot.Temp}°</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-lmu-card p-6 rounded-xl border border-slate-700 w-full max-w-6xl mt-8 text-left shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Weather Schedule</h2>
                    <p className="text-xs text-slate-400 mt-1">Full 15-slot configuration for all sessions</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded">
                        {weather.time}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {renderSession('Practice', sessionData.Practice)}
                {renderSession('Qualify', sessionData.Qualify)}
                {renderSession('Race', sessionData.Race)}
            </div>

            {/* JSON Output */}
            <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-slate-500 uppercase font-bold">Server CONFIG (JSON)</label>
                    <button
                        onClick={copyToClipboard}
                        className="text-xs text-lmu-accent hover:underline flex items-center gap-1"
                    >
                        <Copy size={12} /> Copy JSON
                    </button>
                </div>
                <pre className="bg-black/50 p-4 rounded-lg text-[10px] text-slate-400 overflow-x-auto font-mono border border-slate-800/50 max-h-48">
                    {JSON.stringify(sessionData, null, 2)}
                </pre>
            </div>
        </div>
    );
};
