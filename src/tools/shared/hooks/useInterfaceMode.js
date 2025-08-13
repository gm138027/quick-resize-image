/**
 * 界面模式管理Hook
 * 管理SEO模式和工具模式之间的切换
 * 解决导航跳转在工具模式下失效的问题
 */
import { useCallback } from 'react'
import { useImageManagerContext } from '../contexts/ImageManagerContext'

export default function useInterfaceMode() {
  const imageManager = useImageManagerContext()

  // 重置到SEO模式（清除所有状态）
  const resetToSEOMode = useCallback(() => {
    // 清除图片和预设状态
    if (imageManager.clearAllImages) {
      imageManager.clearAllImages()
    } else {
      // 如果没有clearAllImages方法，手动清除
      while (imageManager.images.length > 0) {
        imageManager.deleteImage(0)
      }
    }
    imageManager.clearPreset()
    imageManager.clearUploadError()
  }, [imageManager])

  // 导航到指定章节（先重置到SEO模式，再跳转）
  const navigateToSection = useCallback((sectionId) => {
    // 如果当前在工具模式，先重置到SEO模式
    if (imageManager.hasImages || imageManager.hasPreset) {
      resetToSEOMode()
      
      // 等待状态更新和DOM重渲染后再跳转
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    } else {
      // 如果已经在SEO模式，直接跳转
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [imageManager.hasImages, imageManager.hasPreset, resetToSEOMode])

  return {
    // 状态查询
    isToolMode: imageManager.hasImages || imageManager.hasPreset,
    isSEOMode: !imageManager.hasImages && !imageManager.hasPreset,
    
    // 操作方法
    resetToSEOMode,
    navigateToSection
  }
}
