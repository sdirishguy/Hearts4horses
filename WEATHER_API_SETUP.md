# Weather API Setup Guide

## Weatherstack Integration

The Hearts4Horses portal now includes real-time weather data using the Weatherstack API.

### Setup Instructions

1. **Get a Weatherstack API Key**
   - Go to [Weatherstack](https://weatherstack.com/)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Configure Environment Variables**
   Create or update `apps/web/.env.local`:
   ```bash
   # Weather API Configuration
   NEXT_PUBLIC_WEATHERSTACK_API_KEY=your_weatherstack_api_key_here
   ```

3. **Features Included**
   - ✅ **Current Weather** - Temperature, condition, humidity, wind speed
   - ✅ **3-Day Forecast** - High/low temperatures and conditions
   - ✅ **Dynamic Icons** - Weather condition icons (sun, rain, snow, clouds)
   - ✅ **Fallback Data** - Works without API key (mock data)
   - ✅ **Error Handling** - Graceful fallback on API failures

### API Usage

**Free Tier Limits:**
- 100,000 calls per month
- Historical weather data for 1 day
- Real-time weather data
- 3-day weather forecasts

**Weather Data Displayed:**
- Current temperature and condition
- Humidity and wind speed
- 3-day forecast with high/low temps
- Weather condition icons

### Implementation Details

The weather integration is located in:
- `apps/web/lib/weather.ts` - Weather API service
- `apps/web/app/portal/user/page.tsx` - Weather widget display

The system automatically falls back to mock data if:
- No API key is provided
- API calls fail
- Rate limits are exceeded

### Testing

1. **With API Key**: Weather data will be real-time
2. **Without API Key**: Mock data will be displayed
3. **API Errors**: Fallback data will be shown

The weather widget appears in the unified portal dashboard and provides valuable information for lesson planning and scheduling.

### Location Configuration

The weather API is configured to use "Hearts4Horses Equestrian Center" as the default location. You can change this by:

1. **Updating the location parameter** in the weather API calls
2. **Modifying the default location** in `apps/web/lib/weather.ts`
3. **Setting a custom location** for your specific area

The system will automatically use the new location for all weather data and forecasts.
