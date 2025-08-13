/**
 * Google Analytics utility functions
 * 提供隐私友好的分析功能
 */

// 检查是否启用了Analytics
export const isAnalyticsEnabled = () => {
  return (
    typeof window !== 'undefined' &&
    window.gtag
  )
}

// 页面浏览事件
export const pageview = (url) => {
  if (isAnalyticsEnabled()) {
    window.gtag('config', 'G-4P8C1C16Y7', {
      page_path: url,
    })
  }
}

// 自定义事件跟踪
export const event = ({ action, category, label, value }) => {
  if (isAnalyticsEnabled()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// 图片处理事件
export const trackImageProcessing = (action, details = {}) => {
  event({
    action: action,
    category: 'image_processing',
    label: details.fileType || 'unknown',
    value: details.fileSizeKB || 0
  })
}

// 语言切换事件
export const trackLanguageChange = (language) => {
  event({
    action: 'language_change',
    category: 'user_interaction',
    label: language
  })
}

// 页面停留时间
export const trackTimeOnPage = (pageName, timeInSeconds) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    label: pageName,
    value: Math.round(timeInSeconds)
  })
}

// 错误跟踪
export const trackError = (errorType, errorMessage) => {
  event({
    action: 'error',
    category: 'application_error',
    label: `${errorType}: ${errorMessage}`
  })
}
