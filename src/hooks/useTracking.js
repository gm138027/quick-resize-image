/**
 * 最简单的追踪Hook
 * 使用方法：
 * 
 * import { useTracking } from '../hooks/useTracking'
 * 
 * function MyComponent() {
 *   const tracking = useTracking()
 *   
 *   const handleUpload = (file) => {
 *     tracking.trackImageUpload({
 *       fileType: 'jpeg',
 *       fileSizeKB: 100
 *     })
 *   }
 * }
 */
import {
  trackImageUpload,
  trackBatchUpload,
  trackImageProcessingStart,
  trackImageProcessingComplete,
  trackImageDownload,
  trackBatchDownload,
  trackError,
  trackLanguageChange,
  trackUserPreference,
  trackPopularSizeSelection,
  trackTargetSizeInput,
  trackResolutionSelection,
  trackOutputFormatSelection
} from '../utils/analytics'

// 简单的Hook，直接返回追踪函数
export const useTracking = () => {
  return {
    trackImageUpload,
    trackBatchUpload,
    trackImageProcessingStart,
    trackImageProcessingComplete,
    trackImageDownload,
    trackBatchDownload,
    trackError,
    trackLanguageChange,
    trackUserPreference,
    trackPopularSizeSelection,
    trackTargetSizeInput,
    trackResolutionSelection,
    trackOutputFormatSelection
  }
}
