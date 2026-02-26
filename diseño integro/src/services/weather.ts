export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    location: string;
    description: string;
}

export async function fetchWeather(city: string = 'Madrid'): Promise<WeatherData> {
    try {
        // Using wttr.in with JSON format for zero-config weather
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        const data = await response.json();

        const current = data.current_condition[0];
        const area = data.nearest_area[0];

        return {
            temp: parseInt(current.temp_C),
            condition: current.weatherDesc[0].value,
            icon: getWeatherIcon(current.weatherCode),
            location: area.areaName[0].value,
            description: `Wind: ${current.windspeedKmph} km/h • Humidity: ${current.humidity}%`
        };
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        // Fallback data
        return {
            temp: 22,
            condition: 'Clear',
            icon: 'sunny',
            location: city,
            description: 'Weather service unavailable. Showing seasonal averages.'
        };
    }
}

function getWeatherIcon(code: string): string {
    const codeMap: Record<string, string> = {
        '113': 'sunny',
        '116': 'partly_cloudy_day',
        '119': 'cloudy',
        '122': 'cloud',
        '143': 'mist',
        '200': 'thunderstorm',
        '302': 'rainy',
        '338': 'ac_unit' // snow
    };
    return codeMap[code] || 'sunny';
}
