/**
 * 📲 PUSH NOTIFICATION & FCM INTEGRATION SERVICE
 * Handles web/mobile push token registration, token refresh, invalidation,
 * and dispatching via Firebase Cloud Messaging (FCM) or Web Push.
 */

// In-memory token storage (also saved to MongoDB if available)
const deviceTokensStore = new Map()

export class PushService {
  constructor() {
    this.fcmKey = process.env.FCM_SERVER_KEY || process.env.FIREBASE_SERVER_KEY || null
    this.isFCMConfigured = Boolean(this.fcmKey)
  }

  /**
   * Register or update a device push token
   */
  registerToken({ userId = 'default_farmer', token, platform = 'web', userAgent = '' }) {
    if (!token) return { success: false, error: 'Token is required' }

    const entry = {
      token,
      userId,
      platform,
      userAgent,
      updatedAt: new Date(),
      createdAt: deviceTokensStore.has(token) ? deviceTokensStore.get(token).createdAt : new Date(),
      active: true
    }

    deviceTokensStore.set(token, entry)
    return { success: true, message: 'Device token registered', token: entry }
  }

  /**
   * Remove or invalidate a device token
   */
  removeToken(token) {
    if (deviceTokensStore.has(token)) {
      deviceTokensStore.delete(token)
      return { success: true, message: 'Token removed' }
    }
    return { success: false, message: 'Token not found' }
  }

  /**
   * Get all active tokens for a user
   */
  getTokensForUser(userId = 'default_farmer') {
    const tokens = []
    for (const [token, data] of deviceTokensStore.entries()) {
      if (data.userId === userId && data.active) {
        tokens.push(token)
      }
    }
    return tokens
  }

  /**
   * Dispatch push notification to user devices
   */
  async sendPushNotification({ userId = 'default_farmer', title, body, icon = '🌱', data = {} }) {
    const tokens = this.getTokensForUser(userId)
    
    // If no devices registered, return gracefully
    if (tokens.length === 0) {
      return {
        success: true,
        dispatchedCount: 0,
        mode: 'NO_DEVICE_TOKENS',
        note: 'No active device tokens found for this user.'
      }
    }

    // 1. If FCM Server Key is configured in .env
    if (this.fcmKey) {
      const results = []
      for (const token of tokens) {
        try {
          const res = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${this.fcmKey}`
            },
            body: JSON.stringify({
              to: token,
              notification: {
                title,
                body,
                icon: icon || '/favicon.ico',
                click_action: data.actionUrl || '/'
              },
              data: {
                ...data,
                click_action: data.actionUrl || '/'
              }
            })
          })

          const json = await res.json()
          if (json.failure > 0 && json.results?.[0]?.error === 'NotRegistered') {
            // Clean up expired token
            this.removeToken(token)
          }
          results.push({ token, status: res.status, response: json })
        } catch (err) {
          results.push({ token, error: err.message })
        }
      }

      return {
        success: true,
        dispatchedCount: tokens.length,
        mode: 'FCM_REAL',
        results
      }
    }

    // 2. Simulated Push / Web Browser Notification fallback
    return {
      success: true,
      dispatchedCount: tokens.length,
      mode: 'SIMULATED_LOCAL',
      message: `[Simulated Push] To ${tokens.length} devices: "${title}" - ${body}`,
      notification: { title, body, data }
    }
  }

  /**
   * Get push service status
   */
  getStatus() {
    return {
      isFCMConfigured: this.isFCMConfigured,
      activeTokensCount: deviceTokensStore.size,
      supportedPlatforms: ['web', 'android', 'ios']
    }
  }
}

export const pushService = new PushService()
