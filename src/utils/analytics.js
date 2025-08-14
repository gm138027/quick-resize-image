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

// 图片上传事件
export const trackImageUpload = (details = {}) => {
  event({
    action: 'image_upload',
    category: 'user_interaction',
    label: details.fileType || 'unknown',
    value: details.fileSizeKB || 0
  })
}

// 批量上传事件
export const trackBatchUpload = (imageCount, totalSizeKB = 0) => {
  event({
    action: 'batch_upload',
    category: 'user_interaction',
    label: `${imageCount}_images`,
    value: Math.round(totalSizeKB)
  })
}

// 图片处理开始事件
export const trackImageProcessingStart = (details = {}) => {
  event({
    action: 'processing_start',
    category: 'image_processing',
    label: `${details.fileType || 'unknown'}_to_${details.targetKB || 0}KB`,
    value: details.originalSizeKB || 0
  })
}

// 图片处理完成事件
export const trackImageProcessingComplete = (details = {}) => {
  event({
    action: 'processing_complete',
    category: 'image_processing',
    label: `${details.fileType || 'unknown'}_${details.originalSizeKB || 0}KB_to_${details.finalSizeKB || 0}KB`,
    value: details.processingTimeMs || 0
  })
}

// 图片下载事件
export const trackImageDownload = (details = {}) => {
  event({
    action: 'image_download',
    category: 'conversion',
    label: details.fileType || 'unknown',
    value: details.fileSizeKB || 0
  })
}

// 批量下载事件
export const trackBatchDownload = (imageCount, totalSizeKB = 0) => {
  event({
    action: 'batch_download',
    category: 'conversion',
    label: `${imageCount}_images`,
    value: Math.round(totalSizeKB)
  })
}

// 图片处理事件 (保持向后兼容)
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

// 用户偏好追踪
export const trackUserPreference = (preferenceType, value) => {
  event({
    action: 'preference_selected',
    category: 'user_preference',
    label: `${preferenceType}: ${value}`
  })
}

// 热门尺寸选择追踪
export const trackPopularSizeSelection = (targetKB) => {
  event({
    action: 'popular_size_selected',
    category: 'user_interaction',
    label: `${targetKB}KB`,
    value: targetKB
  })
}

// 目标大小输入追踪
export const trackTargetSizeInput = (targetKB) => {
  event({
    action: 'target_size_input',
    category: 'user_preference',
    label: `${targetKB}KB`,
    value: targetKB
  })
}

// 分辨率选择追踪
export const trackResolutionSelection = (width, height) => {
  event({
    action: 'resolution_selected',
    category: 'user_preference',
    label: `${width}x${height}`,
    value: width * height
  })
}

// 输出格式选择追踪
export const trackOutputFormatSelection = (format) => {
  event({
    action: 'output_format_selected',
    category: 'user_preference',
    label: format
  })
}
