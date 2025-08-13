/**
 * Production-safe logging utility
 * Automatically disables console logs in production environment
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isClient = typeof window !== 'undefined'

class Logger {
  static log(...args) {
    if (isDevelopment) {
      console.log(...args)
    }
  }

  static info(...args) {
    if (isDevelopment) {
      console.info(...args)
    }
  }

  static warn(...args) {
    if (isDevelopment) {
      console.warn(...args)
    } else {
      // In production, still log warnings but without sensitive data
      if (isClient && window.gtag) {
        window.gtag('event', 'warning', {
          event_category: 'application',
          event_label: 'warning_occurred'
        })
      }
    }
  }

  static error(...args) {
    if (isDevelopment) {
      console.error(...args)
    } else {
      // In production, log errors for monitoring but sanitize data
      if (isClient && window.gtag) {
        window.gtag('event', 'error', {
          event_category: 'application',
          event_label: 'error_occurred'
        })
      }
      
      // Still log to console in production for critical errors
      console.error('An error occurred. Check application monitoring for details.')
    }
  }

  static debug(...args) {
    if (isDevelopment) {
      console.debug(...args)
    }
  }

  // Performance logging for production monitoring
  static performance(label, value) {
    if (isDevelopment) {
      console.log(`⚡ Performance: ${label} - ${value}ms`)
    } else if (isClient && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: label,
        value: value
      })
    }
  }

  // User action tracking (privacy-safe)
  static userAction(action, category = 'user_interaction') {
    if (isDevelopment) {
      console.log(`👤 User Action: ${category} - ${action}`)
    } else if (isClient && window.gtag) {
      window.gtag('event', action, {
        event_category: category
      })
    }
  }
}

export default Logger
