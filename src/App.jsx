import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TRACKS, MONTHS } from './data/tracks';
import { fetchHistoricalWeather } from './services/weatherService';
import { Roulette } from './components/Roulette';
import { ServerConfig } from './components/ServerConfig';
import { CloudRain } from 'lucide-react';

function App() {
  const [selectedTrackId, setSelectedTrackId] = useState(TRACKS[0].id);
  // Month is now derived from track, no state needed
  const [weatherData, setWeatherData] = useState([]);
  const [hourlyData, setHourlyData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedTrack = TRACKS.find(t => t.id === selectedTrackId);

  // Fetch weather when track or month changes
  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      setResult(null); // Reset result on change

      try {
        const year = 2025; // Previous season
        const monthToUse = selectedTrack.defaultMonth;
        const monthStr = monthToUse.toString().padStart(2, '0');
        const startDate = `${year}-${monthStr}-01`;
        const lastDay = new Date(year, monthToUse, 0).getDate();
        const endDate = `${year}-${monthStr}-${lastDay}`;

        const responseData = await fetchHistoricalWeather(selectedTrack.lat, selectedTrack.lon, startDate, endDate);

        // Store full hourly data for slot generation
        if (responseData && responseData.hourly) {
          setHourlyData(responseData.hourly);
        }

        // Transform OpenMeteo column-based arrays to row-based objects
        if (responseData && responseData.daily && responseData.daily.time) {
          const {
            time,
            temperature_2m_max,
            temperature_2m_min,
            precipitation_sum,
            rain_sum,
            cloudcover_mean
          } = responseData.daily;

          const rowData = time.map((t, index) => ({
            time: t,
            temperature_2m_max: temperature_2m_max[index],
            temperature_2m_min: temperature_2m_min[index],
            precipitation_sum: precipitation_sum[index],
            rain_sum: rain_sum ? rain_sum[index] : 0,
            cloudcover_mean: cloudcover_mean[index],
          }));
          setWeatherData(rowData);
        } else {
          // Fallback or empty handle
          setWeatherData([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch weather data. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedTrack) {
      loadWeather();
    }
  }, [selectedTrackId]); // Re-fetch only when track changes (month is implied)

  // Roulette onComplete handler
  const handleRouletteComplete = (winner) => {
    setResult(winner);
  };

  return (
    <div className="min-h-screen bg-lmu-dark text-white flex flex-col items-center py-10 px-4 font-sans">
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CloudRain size={32} className="text-lmu-accent" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            LMU Weather Randomizer
          </h1>
        </div>
        <p className="text-slate-500">Generate realistic weather for your private server</p>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col items-center min-h-[400px]">

        {/* Track Selector */}
        <div className="flex flex-col items-center gap-2 mb-10 z-10">
          <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Select Circuit</label>
          <div className="relative group">
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-600 text-white px-8 py-3 rounded-xl font-bold text-lg focus:ring-2 focus:ring-lmu-accent w-80 text-center hover:border-slate-500 transition shadow-lg cursor-pointer"
            >
              {TRACKS.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {/* Display the fixed month for information */}
          <div className="text-xs text-slate-500 font-mono">
            Running in: <span className="text-lmu-accent">{MONTHS.find(m => m.value === selectedTrack.defaultMonth)?.label}</span> (Fixed)
          </div>
        </div>
        {loading ? (
          <div className="animate-pulse flex flex-col items-center gap-4 mt-20">
            <div className="w-12 h-12 border-4 border-lmu-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lmu-accent font-bold tracking-widest text-sm">LOADING HISTORICAL DATA...</div>
          </div>
        ) : error ? (
          <div className="text-red-400 bg-red-900/20 p-6 rounded-xl border border-red-900 flex flex-col items-center gap-2">
            <div className="font-bold">Error Loading Data</div>
            <div className="text-sm opacity-80">{error}</div>
          </div>
        ) : (
          <>
            <Roulette
              items={weatherData}
              onComplete={handleRouletteComplete}
              // Force re-mount of Roulette when data changes to reset its state
              key={`${selectedTrackId}-${weatherData.length}`}
            />

            {result && hourlyData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex justify-center w-full"
              >
                <ServerConfig weather={result} trackName={selectedTrack?.name} hourlyData={hourlyData} />
              </motion.div>
            )}
          </>
        )}
      </div>

      <footer className="mt-20 text-slate-600 text-xs text-center">
        Powered by Open-Meteo API • LMU Weather Randomizer v1.0
      </footer>
    </div>
  );
}

export default App;
