/**
 * 图片管理Hook - 简化版本
 * 管理图片的上传、切换、删除等操作，支持批量上传
 */
import { useState, useCallback } from 'react'

export default function useImageManager() {
  const [images, setImages] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [presetKB, setPresetKB] = useState(null)

  // 处理图片上传（支持HEIC、BMP、GIF等格式）
  const handleImageUpload = useCallback(async (file) => {
    try {
      console.log(`📷 Processing upload: ${file.name} (${file.type})`)
      
      let processedFile = file
      let url = URL.createObjectURL(file)
      
      // 检查是否是HEIC格式，需要转换
      if (file.type === 'image/heic' || file.type === 'image/heif' || 
          file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        
        try {
          // 动态导入heic2any库（如果可用）
          const heic2any = await import('heic2any').catch(() => null)
          
          if (heic2any) {
            console.log('🔄 Converting HEIC to JPEG...')
            const convertedBlob = await heic2any.default({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.9
            })
            
            // 创建新的File对象
            const convertedFile = new File(
              [convertedBlob], 
              file.name.replace(/\.(heic|heif)$/i, '.jpg'),
              { type: 'image/jpeg' }
            )
            
            processedFile = convertedFile
            URL.revokeObjectURL(url) // 清理原始URL
            url = URL.createObjectURL(convertedFile)
            console.log('✅ HEIC conversion successful')
          } else {
            console.warn('⚠️ HEIC conversion library not available, trying direct load...')
          }
        } catch (conversionError) {
          console.warn('⚠️ HEIC conversion failed, trying direct load:', conversionError.message)
        }
      }

      const img = new Image()

      img.onload = () => {
        const imageData = {
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          file: processedFile,
          url,
          name: processedFile.name,
          size: processedFile.size,
          width: img.width,
          height: img.height,
          originalData: null,
          processedData: null,
          hasBeenProcessed: false,
          originalFormat: file.type || 'unknown',
          isConverted: processedFile !== file
        }

        setImages(prev => {
          const newImages = [...prev, imageData]
          if (prev.length === 0) {
            setActiveImageIndex(0)
          }
          return newImages
        })

        console.log(`📷 Image upload successful: ${processedFile.name} (${img.width}x${img.height})`)
        if (imageData.isConverted) {
          console.log(`🔄 Original format: ${file.type} → Converted to: ${processedFile.type}`)
        }
      }

      img.onerror = () => {
        console.error('❌ Image loading failed:', processedFile.name)
        URL.revokeObjectURL(url) // 清理URL
        setUploadError(`Failed to load image: ${file.name}`)
      }

      img.src = url
    } catch (error) {
      console.error('❌ Image upload failed:', error)
      setUploadError(`Upload failed: ${error.message}`)
    }
  }, [])

  // 处理批量图片上传
  const handleMultipleImageUpload = useCallback(async (files) => {
    const MAX_IMAGES = 10
    
    // 检查是否超出最大图片数量限制
    if (images.length + files.length > MAX_IMAGES) {
      const allowedCount = MAX_IMAGES - images.length
      setUploadError(`Cannot upload ${files.length} images. Maximum ${MAX_IMAGES} images allowed. You can upload ${allowedCount} more images.`)
      return
    }

    // 清除之前的错误
    setUploadError(null)

    // 批量上传图片
    for (const file of files) {
      await handleImageUpload(file)
    }
  }, [images.length, handleImageUpload])

  // 处理上传错误
  const handleUploadError = useCallback((error) => {
    setUploadError(error)
  }, [])

  // 清除上传错误
  const clearUploadError = useCallback(() => {
    setUploadError(null)
  }, [])

  // 处理添加图片
  const handleAddImages = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        await handleMultipleImageUpload(files)
      }
    }
    
    input.click()
  }, [handleMultipleImageUpload])

  // 切换活跃图片
  const switchToImage = useCallback((index) => {
    if (index >= 0 && index < images.length) {
      setActiveImageIndex(index)
    }
  }, [images.length])

  // 删除图片
  const deleteImage = useCallback((indexToDelete = activeImageIndex) => {
    setImages(prev => {
      const newImages = prev.filter((_, index) => index !== indexToDelete)
      if (indexToDelete === activeImageIndex && newImages.length > 0) {
        const newActiveIndex = Math.min(activeImageIndex, newImages.length - 1)
        setActiveImageIndex(newActiveIndex)
      } else if (newImages.length === 0) {
        setActiveImageIndex(0)
      }
      return newImages
    })
  }, [activeImageIndex])

  // 标记图片为已处理
  const markImageAsProcessed = useCallback((imageIndex, originalData, processedData) => {
    setImages(prev => prev.map((img, index) => {
      if (index === imageIndex) {
        return {
          ...img,
          originalData: originalData,
          processedData: processedData,
          hasBeenProcessed: true,
          url: processedData.url,
          size: processedData.size,
          width: processedData.width,
          height: processedData.height
        }
      }
      return img
    }))
  }, [])

  // 撤销处理
  const undoImageProcessing = useCallback(() => {
    const currentImage = images[activeImageIndex]
    if (!currentImage?.hasBeenProcessed || !currentImage?.originalData) {
      return false
    }

    setImages(prev => prev.map((img, index) => {
      if (index === activeImageIndex) {
        return {
          ...img,
          url: img.originalData.url,
          size: img.originalData.size,
          width: img.originalData.width,
          height: img.originalData.height,
          processedData: null,
          hasBeenProcessed: false
        }
      }
      return img
    }))

    return true
  }, [activeImageIndex, images])

  // 设置预设KB值
  const setPreset = useCallback((kbValue) => {
    setPresetKB(kbValue)
  }, [])

  // 清除预设
  const clearPreset = useCallback(() => {
    setPresetKB(null)
  }, [])

  // 清除所有图片（用于重置到SEO模式）
  const clearAllImages = useCallback(() => {
    setImages([])
    setActiveImageIndex(0)
    setUploadError(null)
  }, [])

  // 获取当前活跃图片
  const getCurrentImage = useCallback(() => {
    return images[activeImageIndex] || null
  }, [images, activeImageIndex])

  // 检查是否可以撤销
  const canUndo = useCallback(() => {
    const currentImage = getCurrentImage()
    return currentImage?.hasBeenProcessed && currentImage?.originalData
  }, [getCurrentImage])

  return {
    // 状态
    images,
    activeImageIndex,
    uploadError,
    presetKB,
    
    // 操作方法
    handleImageUpload,
    handleMultipleImageUpload,
    handleAddImages,
    handleUploadError,
    clearUploadError,
    switchToImage,
    deleteImage,
    markImageAsProcessed,
    undoImageProcessing,
    setPreset,
    clearPreset,
    clearAllImages,
    
    // 查询方法
    getCurrentImage,
    canUndo: canUndo(),
    
    // 统计信息
    totalImages: images.length,
    hasImages: images.length > 0,
    hasPreset: presetKB !== null
  }
}