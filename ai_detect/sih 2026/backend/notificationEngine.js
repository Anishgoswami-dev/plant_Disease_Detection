/**
 * 🔔 NOTIFICATION ENGINE & BACKGROUND SCHEDULER
 * Crop-aware, location-aware, growth-stage-aware, weather-aware,
 * disease/pest-aware, and personalized smart notification engine for 30 crops.
 */

import { CROPS_CONFIG_30, getCropConfig, normalizeCropName } from './cropConfig.js'
import { pushService } from './pushService.js'

// In-memory deduplication & cooldown cache (key -> timestamp)
const recentAlertsCache = new Map()
const COOLDOWN_HOURS = 24

// Default notification preferences
export const defaultPreferences = {
  notificationEnabled: true,
  weatherAlertEnabled: true,
  cultivationReminderEnabled: true,
  diseaseAlertEnabled: true,
  irrigationAlertEnabled: true,
  treatmentFollowupEnabled: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '06:00'
  },
  frequency: 'instant'
}

export class NotificationEngine {
  constructor(options = {}) {
    this.preferences = new Map() // userId -> preferences
    this.evalIntervalMs = options.evalIntervalMs || 15 * 60 * 1000 // default 15 minutes
    this.intervalHandle = null
  }

  /**
   * Get preferences for a user
   */
  getPreferences(userId = 'default_farmer') {
    if (!this.preferences.has(userId)) {
      this.preferences.set(userId, { ...defaultPreferences })
    }
    return this.preferences.get(userId)
  }

  /**
   * Update preferences for a user
   */
  updatePreferences(userId = 'default_farmer', newPrefs = {}) {
    const current = this.getPreferences(userId)
    const updated = {
      ...current,
      ...newPrefs,
      quietHours: {
        ...current.quietHours,
        ...(newPrefs.quietHours || {})
      }
    }
    this.preferences.set(userId, updated)
    return updated
  }

  /**
   * Check if current time is within Quiet Hours
   */
  isQuietHour(userId = 'default_farmer') {
    const prefs = this.getPreferences(userId)
    if (!prefs.quietHours?.enabled) return false

    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTimeMinutes = currentHours * 60 + currentMinutes

    const [startH, startM] = (prefs.quietHours.start || '22:00').split(':').map(Number)
    const [endH, endM] = (prefs.quietHours.end || '06:00').split(':').map(Number)
    const startMinutes = startH * 60 + (startM || 0)
    const endMinutes = endH * 60 + (endM || 0)

    if (startMinutes > endMinutes) {
      // Crosses midnight (e.g. 22:00 to 06:00)
      return currentTimeMinutes >= startMinutes || currentTimeMinutes < endMinutes
    }
    return currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes
  }

  /**
   * Check if an alert was already sent within the cooldown window
   */
  isDuplicateAlert(hashKey) {
    if (!recentAlertsCache.has(hashKey)) return false
    const lastSent = recentAlertsCache.get(hashKey)
    const hoursElapsed = (Date.now() - lastSent) / (1000 * 60 * 60)
    return hoursElapsed < COOLDOWN_HOURS
  }

  /**
   * Record that an alert has been sent
   */
  recordAlertSent(hashKey) {
    recentAlertsCache.set(hashKey, Date.now())
  }

  /**
   * Calculate Days After Sowing (DAS)
   */
  calculateDAS(sowingDateStr) {
    if (!sowingDateStr) return 0
    const sowing = new Date(sowingDateStr)
    if (isNaN(sowing.getTime())) return 0
    const today = new Date()
    const diffTime = today.getTime() - sowing.getTime()
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
  }

  /**
   * Determine Growth Stage from Days After Sowing (DAS)
   */
  determineStage(cropName, das) {
    const config = getCropConfig(cropName)
    if (!config?.stages?.length) return 'Vegetative'

    for (const stage of config.stages) {
      if (das >= stage.startDay && das <= stage.endDay) {
        return stage.name
      }
    }

    if (das > config.totalDurationDays) {
      return 'Maturity & Harvest'
    }
    return config.stages[config.stages.length - 1].name
  }

  /**
   * 1. EVALUATE CROP CALENDAR & CULTIVATION ALERTS
   */
  evaluateCultivationAlerts(field, userPrefs) {
    if (!userPrefs.cultivationReminderEnabled) return []
    const alerts = []
    const cropName = normalizeCropName(field.crop)
    const config = getCropConfig(cropName)
    const das = this.calculateDAS(field.sowingDate)
    const stage = this.determineStage(cropName, das)

    // A. Growth Stage Entry Alert
    const stageHash = `stage_${field._id || field.id || 'f1'}_${stage}`
    if (!this.isDuplicateAlert(stageHash)) {
      alerts.push({
        type: 'calendar',
        category: 'Cultivation',
        crop: cropName,
        title: `🌱 ${cropName} Growth Stage: ${stage}`,
        message: `Your ${cropName} crop has reached Day ${das} (${stage}). Check your crop calendar for recommended field activities.`,
        priority: 'LOW',
        actionUrl: '/cultivation',
        hashKey: stageHash,
        metadata: { das, stage, fieldName: field.name }
      })
    }

    // B. Nutrient Management Reminders
    if (config.nutrientReminders) {
      for (const nr of config.nutrientReminders) {
        if (Math.abs(das - nr.day) <= 2) {
          const nutHash = `nutrient_${field._id || field.id || 'f1'}_${nr.day}`
          if (!this.isDuplicateAlert(nutHash)) {
            alerts.push({
              type: 'cultivation',
              category: 'Cultivation',
              crop: cropName,
              title: `🧪 ${cropName} Nutrient Reminder: ${nr.title}`,
              message: `${nr.message} Inspect your crop vigor and local conditions before applying.`,
              priority: 'MEDIUM',
              actionUrl: '/fertilizer',
              hashKey: nutHash,
              metadata: { das, recommendedDay: nr.day }
            })
          }
        }
      }
    }

    // C. Weeding Reminders
    if (config.weedingReminders) {
      for (const wr of config.weedingReminders) {
        if (Math.abs(das - wr.day) <= 2) {
          const weedHash = `weeding_${field._id || field.id || 'f1'}_${wr.day}`
          if (!this.isDuplicateAlert(weedHash)) {
            alerts.push({
              type: 'cultivation',
              category: 'Cultivation',
              crop: cropName,
              title: `🌿 ${cropName} Weeding Advisory`,
              message: `${wr.message} Inspect your field and follow locally recommended weed management practices.`,
              priority: 'MEDIUM',
              actionUrl: '/cultivation',
              hashKey: weedHash,
              metadata: { das, recommendedDay: wr.day }
            })
          }
        }
      }
    }

    return alerts
  }

  /**
   * 2. EVALUATE IRRIGATION ALERTS (WITH RAIN SUPPRESSION)
   */
  evaluateIrrigationAlerts(field, weather, userPrefs) {
    if (!userPrefs.irrigationAlertEnabled) return []
    const alerts = []
    const cropName = normalizeCropName(field.crop)
    const config = getCropConfig(cropName)
    const das = this.calculateDAS(field.sowingDate)

    // Rainfall check: If significant rainfall occurred (> 10mm) or is forecasted (> 15mm), SUPPRESS irrigation reminder!
    const recentRainMm = Number(weather?.rainfall || 0)
    const forecastRainChance = parseInt(weather?.precipitationProbability || weather?.rainChance || '0', 10)
    const willRainSoon = forecastRainChance >= 75 || recentRainMm >= 10

    if (willRainSoon) {
      // Suppress irrigation reminder due to sufficient rain
      return []
    }

    // Check if crop is currently at a critical irrigation timing
    const criticalDays = config.irrigation?.criticalDays || []
    const isCriticalDay = criticalDays.some(d => Math.abs(das - d) <= 3)

    if (isCriticalDay) {
      const irrHash = `irrigation_${field._id || field.id || 'f1'}_${das}`
      if (!this.isDuplicateAlert(irrHash)) {
        const soilMoistureText = field.soilMoisture !== undefined
          ? `Current sensor soil moisture is ${field.soilMoisture}%.`
          : `Sensor soil moisture data is unavailable.`

        alerts.push({
          type: 'irrigation',
          category: 'Irrigation',
          crop: cropName,
          title: `💧 ${cropName} Irrigation Advisory`,
          message: `Your ${cropName} is in an active moisture-sensitive stage (Day ${das}). ${soilMoistureText} Check field moisture before irrigating.`,
          priority: 'MEDIUM',
          actionUrl: '/farm-monitor',
          hashKey: irrHash,
          metadata: { das, soilMoisture: field.soilMoisture, recentRainMm }
        })
      }
    }

    return alerts
  }

  /**
   * 3. EVALUATE WEATHER RISK ALERTS
   */
  evaluateWeatherAlerts(field, weather, userPrefs) {
    if (!userPrefs.weatherAlertEnabled || !weather) return []
    const alerts = []
    const cropName = normalizeCropName(field.crop)
    const config = getCropConfig(cropName)
    const temp = Number(weather.temperature || weather.tempMax || 28)
    const windSpeed = Number(weather.windSpeed || weather.windVal || 10)
    const rain = Number(weather.rainfall || 0)
    const rainProb = parseInt(weather.precipitationProbability || weather.rainChance || '0', 10)
    const isThunderstorm = (weather.condition || '').toLowerCase().includes('thunderstorm')

    // A. Heavy Rainfall Alert
    if (rain >= 20 || (rainProb >= 85 && isThunderstorm)) {
      const rainHash = `weather_heavyrain_${field.location || 'default'}_${new Date().toDateString()}`
      if (!this.isDuplicateAlert(rainHash)) {
        alerts.push({
          type: 'weather',
          category: 'Weather',
          crop: cropName,
          title: `🌧️ Heavy Rain Alert for ${weather.city || 'Farm'}`,
          message: `Heavy rainfall expected (${rain} mm, ${rainProb}% chance). Consider postponing irrigation and avoid spraying fertilizers or pesticides before rain.`,
          priority: 'CRITICAL',
          actionUrl: '/weather',
          hashKey: rainHash,
          metadata: { rain, rainProb, city: weather.city }
        })
      }
    }

    // B. Extreme Heat Stress
    const maxThreshold = config.weatherSensitivities?.maxTemp || 40
    if (temp >= maxThreshold) {
      const heatHash = `weather_heat_${field.location || 'default'}_${new Date().toDateString()}`
      if (!this.isDuplicateAlert(heatHash)) {
        alerts.push({
          type: 'weather',
          category: 'Weather',
          crop: cropName,
          title: `🔥 Heat Stress Alert (${temp}°C)`,
          message: `High ambient temperatures (${temp}°C) expected. Monitor your ${cropName} for heat stress symptoms and maintain optimal soil moisture.`,
          priority: 'CRITICAL',
          actionUrl: '/weather',
          hashKey: heatHash,
          metadata: { temp, maxThreshold }
        })
      }
    }

    // C. Strong Wind Alert
    if (windSpeed >= 28) {
      const windHash = `weather_wind_${field.location || 'default'}_${new Date().toDateString()}`
      if (!this.isDuplicateAlert(windHash)) {
        alerts.push({
          type: 'weather',
          category: 'Weather',
          crop: cropName,
          title: `💨 Strong Wind Alert (${windSpeed} km/h)`,
          message: `Gusty winds of ${windSpeed} km/h detected. Inspect vulnerable crops (such as Sugarcane, Banana, Maize) and provide staking where needed. Avoid spraying.`,
          priority: 'HIGH',
          actionUrl: '/weather',
          hashKey: windHash,
          metadata: { windSpeed }
        })
      }
    }

    // D. Cold / Frost Risk
    const minThreshold = config.weatherSensitivities?.minTemp || 6
    if (temp <= minThreshold && temp > 0) {
      const coldHash = `weather_cold_${field.location || 'default'}_${new Date().toDateString()}`
      if (!this.isDuplicateAlert(coldHash)) {
        alerts.push({
          type: 'weather',
          category: 'Weather',
          crop: cropName,
          title: `❄️ Cold / Frost Risk Alert (${temp}°C)`,
          message: `Low temperatures of ${temp}°C forecasted. Protect tender seedlings and inspect for frost injury.`,
          priority: 'HIGH',
          actionUrl: '/weather',
          hashKey: coldHash,
          metadata: { temp, minThreshold }
        })
      }
    }

    return alerts
  }

  /**
   * 4. EVALUATE PEST & DISEASE RISK ALERTS
   */
  evaluateDiseaseRiskAlerts(field, weather, userPrefs) {
    if (!userPrefs.diseaseAlertEnabled || !weather) return []
    const alerts = []
    const cropName = normalizeCropName(field.crop)
    const humidity = Number(weather.humidityVal || parseInt(weather.humidity, 10) || 70)
    const temp = Number(weather.temperature || 28)

    // High fungal risk: Humidity >= 80% and Temperature between 20°C and 30°C
    if (humidity >= 80 && temp >= 20 && temp <= 30) {
      const disHash = `disease_risk_${field._id || field.id || 'f1'}_${new Date().toDateString()}`
      if (!this.isDuplicateAlert(disHash)) {
        const keyDiseases = getCropConfig(cropName).pestsAndDiseases.slice(0, 3).join(', ')
        alerts.push({
          type: 'disease',
          category: 'Disease/Pest',
          crop: cropName,
          title: `⚠️ ${cropName} Disease Risk Alert`,
          message: `Elevated humidity (${humidity}%) and warm weather (${temp}°C) create conditions favoring foliar fungal development. Inspect ${cropName} for early symptoms of ${keyDiseases}.`,
          priority: 'HIGH',
          actionUrl: '/diagnosis',
          hashKey: disHash,
          metadata: { humidity, temp, keyDiseases }
        })
      }
    }

    return alerts
  }

  /**
   * 5. SCHEDULE / EVALUATE TREATMENT FOLLOW-UP NOTIFICATIONS
   */
  generateFollowUpAlert(scan) {
    if (!scan) return null
    const cropName = normalizeCropName(scan.crop)
    const diseaseName = scan.diagnosis || 'Foliar Pathology'
    const scanId = scan._id || scan.id || `scan_${Date.now()}`

    return {
      type: 'followup',
      category: 'Treatment Follow-up',
      crop: cropName,
      title: `🔔 Treatment Follow-up: ${cropName}`,
      message: `Please inspect your ${cropName} crop again following the recent diagnosis of ${diseaseName}. Check if symptoms persist and record a follow-up assessment.`,
      priority: 'HIGH',
      actionUrl: '/followups',
      hashKey: `followup_${scanId}`,
      metadata: {
        originalScanId: scanId,
        crop: cropName,
        disease: diseaseName,
        severity: scan.severity || 'Moderate',
        diagnosedDate: scan.date || new Date().toLocaleDateString()
      }
    }
  }

  /**
   * 🌟 MASTER EVALUATOR: Runs over all user fields and dispatches new notifications
   */
  async evaluateAll({ fields = [], weatherData = null, scans = [], userId = 'default_farmer' }) {
    const userPrefs = this.getPreferences(userId)
    if (!userPrefs.notificationEnabled) {
      return { evaluatedCount: 0, generatedCount: 0, notifications: [] }
    }

    const generated = []

    for (const field of fields) {
      // 1. Cultivation & Calendar Alerts
      const cultAlerts = this.evaluateCultivationAlerts(field, userPrefs)
      generated.push(...cultAlerts)

      // 2. Weather Alerts
      const weatherAlerts = this.evaluateWeatherAlerts(field, weatherData, userPrefs)
      generated.push(...weatherAlerts)

      // 3. Irrigation Alerts (Rain-Suppressed)
      const irrAlerts = this.evaluateIrrigationAlerts(field, weatherData, userPrefs)
      generated.push(...irrAlerts)

      // 4. Disease Risk Alerts
      const disAlerts = this.evaluateDiseaseRiskAlerts(field, weatherData, userPrefs)
      generated.push(...disAlerts)
    }

    // 5. Treatment Follow-ups for recent scans older than 5 days
    if (userPrefs.treatmentFollowupEnabled && scans.length > 0) {
      const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000)
      for (const scan of scans) {
        const scanTime = scan.createdAt ? new Date(scan.createdAt).getTime() : 0
        if (scanTime > 0 && scanTime <= fiveDaysAgo && !scan.isHealthy) {
          const fuAlert = this.generateFollowUpAlert(scan)
          if (fuAlert && !this.isDuplicateAlert(fuAlert.hashKey)) {
            generated.push(fuAlert)
          }
        }
      }
    }

    // Filter out quiet hours (unless CRITICAL)
    const isQuiet = this.isQuietHour(userId)
    const eligible = generated.filter(item => {
      if (isQuiet && item.priority !== 'CRITICAL') {
        return false
      }
      return true
    })

    // Record hashes in cooldown cache and dispatch push notifications
    for (const item of eligible) {
      this.recordAlertSent(item.hashKey)
      // Send push notification asynchronously
      pushService.sendPushNotification({
        userId,
        title: item.title,
        body: item.message,
        data: { actionUrl: item.actionUrl, crop: item.crop, priority: item.priority }
      }).catch(err => console.warn('[PushService Error]', err.message))
    }

    return {
      evaluatedCount: fields.length,
      generatedCount: eligible.length,
      notifications: eligible
    }
  }
}

export const notificationEngine = new NotificationEngine()
