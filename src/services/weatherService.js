import axios from 'axios';

const API_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

/**
 * Fetch historical weather data for a given location and date range.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Daily weather data
 */
export const fetchHistoricalWeather = async (lat, lon, startDate, endDate) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                start_date: startDate,
                end_date: endDate,
                daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,cloudcover_mean',
                hourly: 'temperature_2m,precipitation,rain,cloudcover,weathercode',
                timezone: 'auto'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};
