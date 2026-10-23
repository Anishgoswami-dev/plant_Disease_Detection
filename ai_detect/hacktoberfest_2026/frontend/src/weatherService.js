// ----------------------------------------------------
// 🌦️ WEATHER SERVICE — OPEN-METEO ENGINE & FARM GPS
// ----------------------------------------------------

const CACHE_KEY = 'CropSentinel_weather_cache'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes cache
const FARM_COORDS_KEY = 'CropSentinel_farm_coords'

/**
 * Maps WMO weather interpretation codes to readable conditions and icons.
 * Codes specification: https://open-meteo.com/en/docs
 */
export function parseWeatherCode(code) {
  const c = Number(code)
  switch (c) {
    case 0:
      return { condition: 'Clear sky', icon: '☀️', isRain: false }
    case 1:
      return { condition: 'Mainly clear', icon: '🌤️', isRain: false }
    case 2:
      return { condition: 'Partly cloudy', icon: '⛅', isRain: false }
    case 3:
      return { condition: 'Overcast', icon: '☁️', isRain: false }
    case 45:
      return { condition: 'Foggy', icon: '🌫️', isRain: false }
    case 48:
      return { condition: 'Depositing rime fog', icon: '🌫️', isRain: false }
    case 51:
      return { condition: 'Light drizzle', icon: '🌦️', isRain: true }
    case 53:
      return { condition: 'Moderate drizzle', icon: '🌦️', isRain: true }
    case 55:
      return { condition: 'Dense drizzle', icon: '🌦️', isRain: true }
    case 56:
    case 57:
      return { condition: 'Freezing drizzle', icon: '🌧️', isRain: true }
    case 61:
      return { condition: 'Slight rain', icon: '🌧️', isRain: true }
    case 63:
      return { condition: 'Moderate rain', icon: '🌧️', isRain: true }
    case 65:
      return { condition: 'Heavy rain', icon: '🌧️', isRain: true }
    case 66:
    case 67:
      return { condition: 'Freezing rain', icon: '🌧️', isRain: true }
    case 71:
      return { condition: 'Slight snowfall', icon: '❄️', isRain: false }
    case 73:
      return { condition: 'Moderate snowfall', icon: '❄️', isRain: false }
    case 75:
      return { condition: 'Heavy snowfall', icon: '❄️', isRain: false }
    case 77:
      return { condition: 'Snow grains', icon: '❄️', isRain: false }
    case 80:
      return { condition: 'Slight rain showers', icon: '🌧️', isRain: true }
    case 81:
      return { condition: 'Moderate rain showers', icon: '🌧️', isRain: true }
    case 82:
      return { condition: 'Violent rain showers', icon: '🌧️', isRain: true }
    case 85:
    case 86:
      return { condition: 'Snow showers', icon: '🌨️', isRain: false }
    case 95:
      return { condition: 'Thunderstorm', icon: '⛈️', isRain: true }
    case 96:
    case 99:
      return { condition: 'Thunderstorm with hail', icon: '⛈️', isRain: true }
    default:
      return { condition: 'Partly cloudy', icon: '⛅', isRain: false }
  }
}

/**
 * Converts wind degrees (0–360°) to cardinal direction string.
 */
export function getCompassDirection(deg) {
  if (deg === undefined || deg === null) return 'From South-East'
  const val = Math.round((deg / 22.5) + 0.5) % 16
  const directions = [
    'North', 'North-North-East', 'North-East', 'East-North-East',
    'East', 'East-South-East', 'South-East', 'South-South-East',
    'South', 'South-South-West', 'South-West', 'West-South-West',
    'West', 'West-North-West', 'North-West', 'North-North-West'
  ]
  return `From ${directions[val] || 'South-East'}`
}

/**
 * Resolves the farmer's farm GPS coordinates with graceful fallback hierarchy:
 * 1. Saved Exact Farm Map coordinates from localStorage.
 * 2. Live navigator.geolocation.getCurrentPosition().
 */
export async function getFarmCoordinates() {
  // 1. Check existing stored farm GPS coordinates
  try {
    const saved = localStorage.getItem(FARM_COORDS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
        return {
          lat: parsed.lat,
          lon: parsed.lon,
          name: parsed.name || '',
          source: 'SAVED_FARM_MAP'
        }
      }
    }
  } catch {}

  // 2. Request browser geolocation
  if (!navigator.geolocation) {
    throw new Error('GEOLOCATION_NOT_SUPPORTED')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
          accuracy: Math.round(pos.coords.accuracy || 10),
          source: 'BROWSER_GPS'
        }
        resolve(coords)
      },
      (err) => {
        if (err.code === 1) {
          reject(new Error('PERMISSION_DENIED'))
        } else if (err.code === 2) {
          reject(new Error('POSITION_UNAVAILABLE'))
        } else if (err.code === 3) {
          reject(new Error('TIMEOUT'))
        } else {
          reject(new Error('GPS_ERROR'))
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    )
  })
}

/**
 * Reverse geocodes coordinates to actual local Village, District, and State.
 * Uses OpenStreetMap Nominatim or BigDataCloud with timeout and failover.
 */
export async function reverseGeocode(lat, lon) {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    
    // 1. Try OpenStreetMap Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      { signal: ctrl.signal, headers: { 'Accept-Language': 'en' } }
    )
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      const addr = data.address || {}
      const village = addr.village || addr.town || addr.city || addr.suburb || addr.hamlet || addr.county || ''
      const district = addr.state_district || addr.district || addr.county || ''
      const state = addr.state || ''

      const parts = [village, district || state].filter(Boolean)
      if (parts.length > 0) {
        return {
          displayName: parts.join(', '),
          village,
          district,
          state
        }
      }
    }
  } catch {}

  // 2. Fallback to BigDataCloud
  try {
    const res2 = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )
    if (res2.ok) {
      const d2 = await res2.json()
      const loc = d2.locality || d2.city || d2.principalSubdivision || ''
      const sub = d2.principalSubdivision || d2.countryName || ''
      return {
        displayName: loc && sub && loc !== sub ? `${loc}, ${sub}` : loc || sub || `Farm (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
        village: loc,
        district: '',
        state: sub
      }
    }
  } catch {}

  return {
    displayName: `Farm (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`,
    village: `Plot ${lat.toFixed(2)}°`,
    district: '',
    state: ''
  }
}

/**
 * Calculates rule-based spraying suitability based on Open-Meteo hourly & current data.
 * Considers: wind speed (<12 km/h good, >16 unfavourable), rain probability, precip, RH, temp.
 */
export function calculateSprayingSuitability(current, hourly) {
  const windKmh = current.wind_speed_10m ?? 10
  const rh = current.relative_humidity_2m ?? 65
  const temp = current.temperature_2m ?? 28
  const currentPrecip = current.precipitation ?? 0

  // Calculate maximum rain chance in next 4 hours
  let next4hRainChance = 0
  let next4hPrecipSum = 0
  if (hourly && Array.isArray(hourly.precipitation_probability)) {
    const nextPops = hourly.precipitation_probability.slice(0, 4)
    next4hRainChance = Math.max(...nextPops, 0)
  }
  if (hourly && Array.isArray(hourly.precipitation)) {
    const nextPrecips = hourly.precipitation.slice(0, 4)
    next4hPrecipSum = nextPrecips.reduce((a, b) => a + b, 0)
  }

  // Determine suitability
  let status = 'GOOD'
  let conditionLabel = 'Optimal spraying conditions'
  let bestTime = 'Best time: 6:00 AM – 11:00 AM'
  let advisory = 'Ideal calm conditions with low wind and minimal rain risk for maximum chemical absorption.'
  let isFavourable = true

  if (currentPrecip > 0.1 || next4hRainChance > 60 || next4hPrecipSum > 1.0 || windKmh > 16 || temp > 35) {
    status = 'UNFAVOURABLE'
    conditionLabel = 'Unfavourable spraying conditions'
    bestTime = 'Wait for calm & dry weather window'
    
    const reasons = []
    if (next4hRainChance > 60 || currentPrecip > 0.1) reasons.push('high rain probability causes chemical wash-off')
    if (windKmh > 16) reasons.push(`strong wind (${windKmh} km/h) causes severe spray drift`)
    if (temp > 35) reasons.push('extreme heat causes rapid droplet evaporation and leaf scorch')
    
    advisory = `Avoid spraying now: ${reasons.join(', ')}.`
    isFavourable = false
  } else if (windKmh >= 12 || next4hRainChance >= 30 || rh < 45 || rh > 82 || temp > 31) {
    status = 'MODERATE'
    conditionLabel = 'Moderate spraying conditions'
    bestTime = 'Best time: Early morning before 10:00 AM'
    
    const cautions = []
    if (windKmh >= 12) cautions.push('use drift-reduction nozzles due to moderate wind')
    if (next4hRainChance >= 30) cautions.push('monitor cloud buildup')
    if (rh > 82) cautions.push('high morning moisture delays drying')
    
    advisory = `Spray with caution: ${cautions.join(', ')}.`
    isFavourable = true
  }

  return {
    status,
    conditionLabel,
    bestTime,
    advisory,
    isFavourable
  }
}

/**
 * Deterministically generates a farmer-tailored AI meteorological summary
 * strictly from fetched Open-Meteo values.
 */
export function generateWeatherSummary({
  currentTemp,
  minTemp,
  maxTemp,
  humidity,
  windSpeed,
  windDirection,
  rainChance,
  condition,
  sprayingSuitability
}) {
  const rainText = rainChance >= 70
    ? `showers are very likely (${rainChance}% chance)`
    : rainChance >= 35
    ? `intermittent light rain or showers are possible (${rainChance}% chance)`
    : `dry conditions are expected with a low rain chance (${rainChance}%)`

  const windText = windSpeed > 15
    ? `Brisk winds averaging ${windSpeed} km/h ${windDirection.toLowerCase()} are expected.`
    : `Wind conditions remain gentle to moderate at ${windSpeed} km/h.`

  const sprayAdvice = sprayingSuitability.status === 'GOOD'
    ? 'Morning spraying windows (6:00 AM – 11:00 AM) are optimal with minimal chemical drift.'
    : sprayingSuitability.status === 'MODERATE'
    ? 'If spraying today, complete early morning applications with drift-reduction nozzles.'
    : 'Postpone chemical foliar spraying until rain risk subsides to prevent costly chemical wash-off.'

  return `Today will be ${condition.toLowerCase()} and warm, with temperatures ranging between ${minTemp}°C and ${maxTemp}°C (currently ${currentTemp}°C) and relative humidity around ${humidity}%.\n\nPrecipitation outlook indicates ${rainText}. ${windText} ${sprayAdvice}`
}

/**
 * Fetches 7-day live weather data from Open-Meteo API using exact latitude and longitude.
 * Timezone: Asia/Kolkata.
 */
export async function fetchOpenMeteoWeather(lat, lon, customLocationName = null) {
  if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
    throw new Error('INVALID_COORDINATES')
  }

  const cacheKey = `${CACHE_KEY}_${lat.toFixed(3)}_${lon.toFixed(3)}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.data
      }
    }
  } catch {}

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code,sunrise,sunset&forecast_days=7&timezone=Asia%2FKolkata`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 9000)

  let res
  try {
    res = await fetch(url, { signal: controller.signal })
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('API_TIMEOUT')
    throw new Error('NETWORK_ERROR')
  } finally {
    clearTimeout(timeoutId)
  }

  if (!res.ok) {
    throw new Error(`API_HTTP_ERROR_${res.status}`)
  }

  const data = await res.json()
  if (!data || !data.current || !data.daily) {
    throw new Error('EMPTY_API_RESPONSE')
  }

  // 1. Current Weather
  const currentTemp = Math.round(data.current.temperature_2m)
  const feelsLike = Math.round(data.current.apparent_temperature ?? currentTemp)
  const humidity = Math.round(data.current.relative_humidity_2m)
  const windSpeed = Math.round(data.current.wind_speed_10m)
  const windDirection = getCompassDirection(data.current.wind_direction_10m)
  const weatherCode = data.current.weather_code
  const codeInfo = parseWeatherCode(weatherCode)

  // 2. Daily Max / Min & Sunset
  const maxTemp = Math.round(data.daily.temperature_2m_max?.[0] ?? currentTemp)
  const minTemp = Math.round(data.daily.temperature_2m_min?.[0] ?? currentTemp)
  const rainChance = Math.round(data.daily.precipitation_probability_max?.[0] ?? 0)

  // Format Sunset time (e.g. 5:41 PM)
  let sunsetStr = '6:00 PM'
  if (data.daily.sunset?.[0]) {
    const sDate = new Date(data.daily.sunset[0])
    sunsetStr = sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  let sunriseStr = '6:00 AM'
  if (data.daily.sunrise?.[0]) {
    const sDate = new Date(data.daily.sunrise[0])
    sunriseStr = sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  // 3. 7-Day Forecast Mapping
  const next7Days = []
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailyDates = data.daily.time || []

  for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
    const dayDate = new Date(dailyDates[i] + 'T00:00:00')
    const dCode = data.daily.weather_code?.[i] ?? 0
    const dInfo = parseWeatherCode(dCode)
    const dMax = Math.round(data.daily.temperature_2m_max?.[i] ?? currentTemp)
    const dMin = Math.round(data.daily.temperature_2m_min?.[i] ?? currentTemp)
    const dPop = Math.round(data.daily.precipitation_probability_max?.[i] ?? 0)

    next7Days.push({
      day: daysOfWeek[dayDate.getDay()],
      date: dayDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      temp: `${dMax}°`,
      minTemp: `${dMin}°`,
      tempRange: `${dMax}° / ${dMin}°`,
      condition: dInfo.condition,
      icon: dInfo.icon,
      rainChance: `${dPop}%`,
      rainVal: dPop,
      isSelected: i === 0
    })
  }

  // 4. Calculate Spraying Suitability from hourly parameters
  const sprayingSuitability = calculateSprayingSuitability(data.current, data.hourly)

  // 5. Generate Dynamic AI Summary
  const aiSummary = generateWeatherSummary({
    currentTemp,
    minTemp,
    maxTemp,
    humidity,
    windSpeed,
    windDirection,
    rainChance,
    condition: codeInfo.condition,
    sprayingSuitability
  })

  // 6. Reverse Geocoded Location Name
  let locationTitle = customLocationName
  if (!locationTitle) {
    const geo = await reverseGeocode(lat, lon)
    locationTitle = geo.displayName
  }

  const now = new Date()
  const todayStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  const fullDateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })

  const parsedPayload = {
    success: true,
    source: 'Open-Meteo',
    lat,
    lon,
    city: locationTitle,
    date: todayStr,
    fullDate: fullDateStr,
    temperature: currentTemp,
    tempMax: maxTemp,
    tempMin: minTemp,
    tempRange: `${maxTemp}°C / ${minTemp}°C`,
    feelsLike,
    sunset: sunsetStr,
    sunrise: sunriseStr,
    humidity: `${humidity}%`,
    humidityVal: humidity,
    humidityStatus: humidity > 80 ? 'High humidity' : humidity < 40 ? 'Dry air' : 'Comfortable',
    precipitationProbability: `${rainChance}%`,
    rainChance: `${rainChance}%`,
    rainVal: rainChance,
    windSpeed: `${windSpeed} km/h`,
    windVal: windSpeed,
    windDirection,
    condition: codeInfo.condition,
    icon: codeInfo.icon,
    isRain: codeInfo.isRain,
    sprayingCondition: sprayingSuitability.conditionLabel,
    sprayingBestTime: sprayingSuitability.bestTime,
    sprayingAdvisory: sprayingSuitability.advisory,
    sprayingStatus: sprayingSuitability.status,
    isFavourable: sprayingSuitability.isFavourable,
    aiSummary,
    next6Days: next7Days.slice(0, 6),
    next7Days,
    fetchedAt: Date.now()
  }

  // Cache response
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ data: parsedPayload, timestamp: Date.now() }))
  } catch {}

  return parsedPayload
}
