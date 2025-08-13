/**
 * 超大图片预处理器
 * 单一职责：仅在必要时缩小超大图片到合理尺寸，然后交给原算法处理
 */

/**
 * 预处理超大图片 - 避免Canvas处理时卡死
 * @param {Object} imageData - 图片数据对象
 * @param {number} targetKB - 目标文件大小（KB）
 * @returns {Promise<Object>} 预处理后的图片数据
 */
async function preprocessLargeImage(imageData, targetKB) {
  const { width, height, size } = imageData
  const pixels = width * height
  
  // 只有超大图片才需要预处理
  const needsPreprocessing = pixels > 8_000_000 || size > 3 * 1024 * 1024
  
  if (!needsPreprocessing) {
    return imageData // 直接返回，走原算法
  }
  
  console.log(`🔧 Preprocessing large image: ${width}x${height} (${(pixels/1000000).toFixed(1)}M pixels)`)
  
  // 计算安全的缩放比例
  const maxPixels = 4_000_000 // 400万像素是安全阈值
  const scaleFactor = Math.sqrt(maxPixels / pixels)
  
  // 如果缩放比例接近1，不需要处理
  if (scaleFactor > 0.9) {
    console.log('📋 Image size is acceptable, no preprocessing needed')
    return imageData
  }
  
  // 执行预缩放
  const newWidth = Math.round(width * scaleFactor)
  const newHeight = Math.round(height * scaleFactor)
  
  console.log(`📐 Scaling image: ${width}x${height} → ${newWidth}x${newHeight} (scale: ${(scaleFactor*100).toFixed(1)}%)`)
  
  const canvas = document.createElement('canvas')
  canvas.width = newWidth
  canvas.height = newHeight
  
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  const img = new Image()
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        const scaledDataUrl = canvas.toDataURL('image/jpeg', 0.95)
        
        // 估算新的文件大小
        const base64String = scaledDataUrl.split(',')[1]
        const padding = (base64String.match(/=/g) || []).length
        const estimatedSize = Math.floor((base64String.length * 3) / 4) - padding
        
        // 清理Canvas
        canvas.width = 0
        canvas.height = 0
        
        console.log(`✅ Preprocessing complete: ${newWidth}x${newHeight}, estimated size: ${(estimatedSize/1024).toFixed(1)}KB`)
        
        resolve({
          ...imageData,
          url: scaledDataUrl,
          width: newWidth,
          height: newHeight,
          size: estimatedSize
        })
      } catch (error) {
        canvas.width = 0
        canvas.height = 0
        reject(new Error(`Preprocessing failed: ${error.message}`))
      }
    }
    
    img.onerror = () => {
      canvas.width = 0
      canvas.height = 0
      reject(new Error('Failed to load image for preprocessing'))
    }
    
    img.src = imageData.url
  })
}

export default preprocessLargeImage