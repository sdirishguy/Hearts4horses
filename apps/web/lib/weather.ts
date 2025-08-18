const WEATHERAPI_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  temperature: string;
  condition: string;
  location: string;
  humidity?: string;
  windSpeed?: string;
  feelsLike?: string;
  icon?: string;
  forecast?: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  high: string;
  low: string;
  condition: string;
  icon?: string;
}

export const weatherAPI = {
  // Get current weather for a location
  getCurrentWeather: async (location: string = 'Hearts4Horses Equestrian Center'): Promise<WeatherData> => {
    try {
      if (!WEATHERAPI_KEY) {
        // Fallback to mock data if no API key
        return {
          temperature: '72°F',
          condition: 'Sunny',
          location: 'Hearts4Horses Equestrian Center',
          humidity: '45%',
          windSpeed: '8 mph',
          feelsLike: '74°F'
        };
      }

      const response = await fetch(
        `${WEATHERAPI_BASE_URL}/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(location)}&aqi=no`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Weather API error');
      }

      return {
        temperature: `${data.current.temp_f}°F`,
        condition: data.current.condition.text,
        location: data.location.name,
        humidity: `${data.current.humidity}%`,
        windSpeed: `${data.current.wind_mph} mph`,
        feelsLike: `${data.current.feelslike_f}°F`,
        icon: data.current.condition.icon
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Return fallback data
      return {
        temperature: '72°F',
        condition: 'Sunny',
        location: 'Hearts4Horses',
        humidity: '45%',
        windSpeed: '8 mph',
        feelsLike: '74°F'
      };
    }
  },

  // Get weather forecast for a location
  getForecast: async (location: string = 'Hearts4Horses Equestrian Center', days: number = 3): Promise<WeatherForecast[]> => {
    try {
      if (!WEATHERAPI_KEY) {
        // Fallback to mock data if no API key
        return [
          {
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
            high: '75°F',
            low: '58°F',
            condition: 'Partly Cloudy'
          },
          {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            high: '78°F',
            low: '62°F',
            condition: 'Sunny'
          },
          {
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            high: '72°F',
            low: '55°F',
            condition: 'Cloudy'
          }
        ];
      }

      const response = await fetch(
        `${WEATHERAPI_BASE_URL}/forecast.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=no&alerts=no`
      );

      if (!response.ok) {
        throw new Error('Weather forecast API request failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Weather forecast API error');
      }

      return data.forecast?.forecastday?.slice(0, days).map((day: any) => ({
        date: day.date,
        high: `${day.day.maxtemp_f}°F`,
        low: `${day.day.mintemp_f}°F`,
        condition: day.day.condition.text,
        icon: day.day.condition.icon
      })) || [];
    } catch (error) {
      console.error('Weather forecast API error:', error);
      // Return fallback data
      return [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
          high: '75°F',
          low: '58°F',
          condition: 'Partly Cloudy'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          high: '78°F',
          low: '62°F',
          condition: 'Sunny'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          high: '72°F',
          low: '55°F',
          condition: 'Cloudy'
        }
      ];
    }
  },

  // Get weather for lesson planning (current + forecast)
  getLessonWeather: async (location: string = 'Hearts4Horses Equestrian Center'): Promise<{
    current: WeatherData;
    forecast: WeatherForecast[];
  }> => {
    const [current, forecast] = await Promise.all([
      weatherAPI.getCurrentWeather(location),
      weatherAPI.getForecast(location, 3)
    ]);

    return { current, forecast };
  }
};
