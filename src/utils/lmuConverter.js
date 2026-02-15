/**
 * LMU Sky Conditions
 */
export const SKY_CONDITIONS = {
    CLEAR: "Clear",
    LIGHT_CLOUDS: "Light Clouds",
    PARTIALLY_CLOUDY: "Partially Cloudy",
    MOSTLY_CLOUDY: "Mostly Cloudy",
    OVERCAST: "Overcast",
    CLOUDY_DRIZZLE: "Cloudy & Drizzle",
    CLOUDY_LIGHT_RAIN: "Cloudy & Light Rain",
    OVERCAST_LIGHT_RAIN: "Overcast & Light Rain",
    OVERCAST_RAIN: "Overcast & Rain",
    OVERCAST_HEAVY_RAIN: "Overcast & Heavy Rain",
    OVERCAST_STORM: "Overcast & Storm"
};

/**
 * Maps Open-Meteo data to LMU Sky Condition
 */
const getSkyCondition = (cloudCover, rainMm, weatherCode) => {
    if (weatherCode >= 95) return SKY_CONDITIONS.OVERCAST_STORM;

    // Heavy Rain
    if ((weatherCode >= 65 || weatherCode === 82) || rainMm >= 4.0) {
        return SKY_CONDITIONS.OVERCAST_HEAVY_RAIN;
    }

    // Moderate Rain
    if ((weatherCode === 63 || weatherCode === 81) || (rainMm >= 1.5 && rainMm < 4.0)) {
        return SKY_CONDITIONS.OVERCAST_RAIN;
    }

    // Light Rain
    if ((weatherCode === 61 || weatherCode === 80 || weatherCode >= 51) || (rainMm > 0 && rainMm < 1.5)) {
        if (cloudCover > 80) return SKY_CONDITIONS.OVERCAST_LIGHT_RAIN;
        return SKY_CONDITIONS.CLOUDY_LIGHT_RAIN;
    }

    // No Rain
    if (cloudCover >= 90) return SKY_CONDITIONS.OVERCAST;
    if (cloudCover >= 60) return SKY_CONDITIONS.MOSTLY_CLOUDY;
    if (cloudCover >= 30) return SKY_CONDITIONS.PARTIALLY_CLOUDY;
    if (cloudCover >= 10) return SKY_CONDITIONS.LIGHT_CLOUDS;

    return SKY_CONDITIONS.CLEAR;
};

/**
 * Helper to generate 5 slots for a given start hour range
 */
const createSessionSlots = (dailyDate, hourlyData, minHour, maxHour) => {
    // Random start time within range
    const randomStartHour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
    const startHourStr = randomStartHour.toString().padStart(2, '0') + ":00";

    // Find index
    let startIndex = hourlyData.time.findIndex(t => t.startsWith(dailyDate) && t.includes(startHourStr));

    // Fallback if not found 
    if (startIndex === -1) {
        startIndex = hourlyData.time.findIndex(t => t.startsWith(dailyDate) && t.includes("12:00"));
    }
    if (startIndex === -1) return [];

    const interval = 2; // 2 hour gaps
    const offsets = [0, 1, 2, 3, 4].map(i => i * interval);

    return offsets.map((offset, i) => {
        let idx = startIndex + offset;
        if (idx >= hourlyData.time.length) idx = hourlyData.time.length - 1;

        const temp = hourlyData.temperature_2m[idx];
        const precip = hourlyData.precipitation[idx] || 0;
        const cloud = hourlyData.cloudcover[idx];
        const wCode = hourlyData.weathercode[idx];

        const skytag = getSkyCondition(cloud, precip, wCode);

        // Correct Logic:
        // Wet types -> CAN set Chance of Rain (allowRainChance = true).
        // Dry types -> CANNOT set Chance of Rain (Locked, allowRainChance = false).
        const isWet = skytag.includes("Rain") || skytag.includes("Drizzle") || skytag.includes("Storm");

        // Chance of Rain Calculation
        let chanceOfRain = 0;

        if (isWet) {
            // Wet weather: Calculate realistic chance
            if (precip > 0.1) {
                // Scale based on intensity 
                chanceOfRain = Math.min(100, 40 + (precip * 10));
            } else {
                // Baseline for wet sky type
                chanceOfRain = 40;
            }
            // Round to nearest 5
            chanceOfRain = Math.round(chanceOfRain / 5) * 5;
        } else {
            // Dry weather: Locked to 0
            chanceOfRain = 0;
        }

        return {
            slot: i + 1,
            timeLabel: hourlyData.time[idx].split('T')[1],
            Sky: skytag,
            ChanceOfRain: chanceOfRain,
            Temp: Math.round(temp),
            allowRainChance: isWet
        };
    });
};

/**
 * Generates distinct weather slots for Practice, Qualify, and Race
 */
export const generateWeatherSlots = (dailyDate, hourlyData) => {
    // Check if data exists for this day
    if (!hourlyData.time.some(t => t.startsWith(dailyDate))) return null;

    return {
        Practice: createSessionSlots(dailyDate, hourlyData, 8, 11),
        Qualify: createSessionSlots(dailyDate, hourlyData, 12, 14),
        Race: createSessionSlots(dailyDate, hourlyData, 10, 16)
    };
};

export const convertToLMUSettings = (dailyWeather) => { return {}; };
