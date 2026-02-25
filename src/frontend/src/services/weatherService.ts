import { Weather, WeatherCondition } from '../types/types';

// Código de condición WMO de Open-Meteo mapeado a nuestro tipo interno
function mapWmoToCondition(wmoCode: number, isDay: boolean): WeatherCondition {
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog and depositing rime fog
    // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
    // 61, 63, 65: Rain: Slight, moderate and heavy intensity
    // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
    // 95: Thunderstorm: Slight or moderate

    if (!isDay && wmoCode <= 3) return 'NOCHE';

    if (wmoCode === 0 || wmoCode === 1) return 'SOL';
    if (wmoCode === 2 || wmoCode === 3 || wmoCode === 45 || wmoCode === 48) return 'NUBLADO';
    if (wmoCode >= 51 && wmoCode <= 67) return 'LLUVIA';
    if (wmoCode >= 71 && wmoCode <= 86) return 'NIEVE';
    if (wmoCode >= 95) return 'TORMENTA';

    return 'SOL'; // Fallback
}

export async function fetchCurrentWeather(latitude: number, longitude: number, locationName = 'Ubicación Actual'): Promise<Weather> {
    try {
        // Obtenemos clima, código WMO e indicador de si es de día
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code&timezone=auto`);

        if (!res.ok) {
            throw new Error('Error al obtener el clima real');
        }

        const data = await res.json();
        const current = data.current;

        const condition = mapWmoToCondition(current.weather_code, current.is_day === 1);

        return {
            condition: condition,
            location: locationName,
            temperature: Math.round(current.temperature_2m),
        };
    } catch (e) {
        console.warn('Usando clima de fallback por error de API', e);
        return {
            condition: 'SOL',
            location: 'Santuario (Local)',
            temperature: 20
        };
    }
}
