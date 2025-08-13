/**
 * Resize by Pixels 处理器
 * 功能：按像素尺寸调整图片
 * 遵循SOLID原则，代码简洁，职责单一
 */
import ImageCompressor from '../../shared/processors/ImageCompressor.js'

export default class ResizeByPixelsProcessor {

  /**
   * 验证输入参数
   */
  static validateInput(imageData, targetWidth, targetHeight, maintainRatio = true) {
    if (!imageData || !imageData.file) {
      return { isValid: false, error: '无效的图片数据' }
    }
    
    if (!targetWidth || targetWidth <= 0) {
      return { isValid: false, error: '目标宽度必须大于0' }
    }
    
    if (!targetHeight || targetHeight <= 0) {
      return { isValid: false, error: '目标高度必须大于0' }
    }
    
    if (targetWidth > 10000 || targetHeight > 10000) {
      return { isValid: false, error: '目标尺寸不能超过10000像素' }
    }
    
    return { isValid: true, error: null }
  }

  /**
   * 处理图片按像素调整
   * @param {Object} imageData - 图片数据对象
   * @param {number} targetWidth - 目标宽度
   * @param {number} targetHeight - 目标高度
   * @param {boolean} maintainRatio - 是否保持宽高比
   * @param {Object} outputFormat - 输出格式 {id, label, mimeType}
   * @param {number} quality - 图片质量 (0-1)
   * @returns {Promise<Object>} 处理后的图片数据
   */
  static async processImage(imageData, targetWidth, targetHeight, maintainRatio = true, outputFormat = null, quality = 0.9) {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🎯 开始按像素调整: ${targetWidth}x${targetHeight}`)
        
        const img = new Image()
        
        img.onload = async () => {
          try {
            let finalWidth = targetWidth
            let finalHeight = targetHeight
            
            // 如果需要保持宽高比
            if (maintainRatio) {
              const originalRatio = img.width / img.height
              const targetRatio = targetWidth / targetHeight
              
              if (originalRatio > targetRatio) {
                // 原图更宽，以宽度为准
                finalHeight = Math.round(targetWidth / originalRatio)
              } else {
                // 原图更高，以高度为准
                finalWidth = Math.round(targetHeight * originalRatio)
              }
            }
            
            // 确定输出格式
            const format = outputFormat || { id: 'jpeg', label: 'JPG', mimeType: 'image/jpeg' }
            console.log(`📐 调整尺寸: ${img.width}x${img.height} → ${finalWidth}x${finalHeight}, 格式: ${format.label}`)
            
            // 执行压缩 - 支持多种输出格式
            const result = this.compressImageWithFormat(img, finalWidth, finalHeight, format, quality)
            
            const processedData = {
              ...imageData,
              url: result.dataUrl,
              size: result.actualBytes,
              width: result.finalWidth,
              height: result.finalHeight,
              processedAt: new Date().toISOString(),
              compressionRatio: ((imageData.size - result.actualBytes) / imageData.size * 100).toFixed(1),
              quality: result.quality,
              outputFormat: format,
              maintainedRatio: maintainRatio
            }
            
            console.log(`✅ 像素调整完成: ${result.finalWidth}x${result.finalHeight}, ${result.actualKB}KB, 格式: ${format.label}`)
            resolve(processedData)
            
          } catch (error) {
            reject(error)
          }
        }
        
        img.onerror = () => {
          reject(new Error('图片加载失败'))
        }
        
        img.src = imageData.url
        
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 支持多种输出格式的图片压缩
   * @param {HTMLImageElement} img - 图片对象
   * @param {number} width - 目标宽度
   * @param {number} height - 目标高度
   * @param {Object} format - 输出格式 {id, label, mimeType}
   * @param {number} quality - 图片质量 (0-1)
   * @returns {Object} 压缩结果
   */
  static compressImageWithFormat(img, width, height, format, quality) {
    try {
      const canvas = ImageCompressor.createCanvas(img, width, height)
      
      // 根据格式生成不同的DataURL
      let dataUrl
      if (format.id === 'png') {
        // PNG格式不支持质量参数
        dataUrl = canvas.toDataURL(format.mimeType)
      } else if (format.id === 'webp') {
        // WebP格式支持质量参数
        dataUrl = canvas.toDataURL(format.mimeType, quality)
      } else {
        // JPEG格式支持质量参数
        dataUrl = canvas.toDataURL(format.mimeType, quality)
      }
      
      const actualBytes = ImageCompressor.getDataUrlSize(dataUrl)
      
      return {
        dataUrl,
        actualBytes,
        actualKB: (actualBytes / 1024).toFixed(1),
        finalWidth: width,
        finalHeight: height,
        quality: format.id === 'png' ? 1.0 : quality, // PNG无损，质量为1.0
        format: format
      }
    } catch (error) {
      throw new Error(`格式${format.label}压缩失败: ${error.message}`)
    }
  }
}