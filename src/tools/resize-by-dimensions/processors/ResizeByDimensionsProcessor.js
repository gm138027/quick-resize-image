/**
 * 按物理尺寸调整处理器
 * 根据DPI和物理尺寸计算像素值，然后调整图片
 */
import ImageCompressor from '../../shared/processors/ImageCompressor.js'

class ResizeByDimensionsProcessor {
  /**
   * 验证输入参数 - 简化版本，匹配新的界面参数
   */
  static validateInput(imageData, params) {
    if (!imageData || !imageData.file) {
      return { isValid: false, error: '没有有效的图片数据' }
    }

    const { width, height, unit = 'cm', dpi = 200 } = params

    if (!width || !height || isNaN(width) || isNaN(height)) {
      return { isValid: false, error: '请输入有效的宽度和高度' }
    }

    if (parseFloat(width) <= 0 || parseFloat(height) <= 0) {
      return { isValid: false, error: '宽度和高度必须大于0' }
    }

    if (!['cm', 'mm', 'inch'].includes(unit)) {
      return { isValid: false, error: '无效的单位' }
    }

    // 转换为像素并验证
    const widthPx = this.convertToPixels(parseFloat(width), unit, dpi)
    const heightPx = this.convertToPixels(parseFloat(height), unit, dpi)

    if (widthPx > 10000 || heightPx > 10000) {
      return { isValid: false, error: '图片尺寸过大，请调整参数' }
    }

    if (widthPx < 1 || heightPx < 1) {
      return { isValid: false, error: '图片尺寸过小，请调整参数' }
    }

    return { isValid: true }
  }

  /**
   * 单位转换为像素
   */
  static convertToPixels(value, unit, dpi) {
    switch (unit) {
      case 'cm':
        return Math.round((value * dpi) / 2.54)
      case 'mm':
        return Math.round((value * dpi) / 25.4)
      case 'inch':
        return Math.round(value * dpi)
      default:
        return 0
    }
  }

  /**
   * 从像素转换到指定单位
   */
  static convertFromPixels(pixels, unit, dpi) {
    switch (unit) {
      case 'cm':
        return ((pixels * 2.54) / dpi).toFixed(2)
      case 'mm':
        return ((pixels * 25.4) / dpi).toFixed(1)
      case 'inch':
        return (pixels / dpi).toFixed(2)
      default:
        return 0
    }
  }

  /**
   * 处理图片调整 - 支持可选的压缩功能
   */
  static async processImage(imageData, params) {
    const {
      width,
      height,
      unit = 'cm',
      dpi = 200,
      enableCompression = false,
      targetKB = null,
      outputFormat = 'jpeg',
      quality = 0.9
    } = params
    try {
      console.log('🎯 开始按物理尺寸调整图片:', {
        originalSize: `${imageData.width}x${imageData.height}px`,
        targetSize: `${width}x${height} ${unit}`,
        dpi: dpi,
        enableCompression,
        targetKB
      })

      // 转换为像素值
      let targetWidthPx = this.convertToPixels(width, unit, dpi)
      let targetHeightPx = this.convertToPixels(height, unit, dpi)

      console.log('📐 转换后的像素尺寸:', `${targetWidthPx}x${targetHeightPx}px`)

      // 按物理尺寸调整不需要保持宽高比，因为用户已经指定了精确的物理尺寸
      // 如果需要保持宽高比，应该在界面层处理

      // 使用Promise包装图片处理逻辑
      const processedImageData = await new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = async () => {
          try {
            // 确定输出格式
            const format = {
              id: outputFormat,
              label: outputFormat.toUpperCase(),
              mimeType: `image/${outputFormat}`
            }

            // 首先调整到目标尺寸
            let result = this.compressImageWithFormat(img, targetWidthPx, targetHeightPx, format, quality)

            // 如果启用了压缩功能，进一步压缩到目标KB大小
            if (enableCompression && targetKB) {
              console.log('🗜️ 启用额外压缩，目标大小:', `${targetKB}KB`)
              result = await this.compressToTargetSize(result, targetKB, format)
            }

            resolve({
              url: result.dataUrl,
              size: result.actualBytes,
              width: result.finalWidth,
              height: result.finalHeight
            })
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error('图片加载失败'))
        }

        img.src = imageData.url
      })

      // 计算实际的物理尺寸
      const actualWidth = this.convertFromPixels(processedImageData.width, unit, dpi)
      const actualHeight = this.convertFromPixels(processedImageData.height, unit, dpi)

      // 计算压缩比
      const compressionRatio = imageData.size > 0 ?
        ((imageData.size - processedImageData.size) / imageData.size * 100).toFixed(1) : 0

      const result = {
        ...processedImageData,
        // 处理信息
        processedAt: new Date().toISOString(),
        processingType: 'resize-by-dimensions',

        // 原始参数
        originalDimensions: {
          width: this.convertFromPixels(imageData.width, unit, dpi),
          height: this.convertFromPixels(imageData.height, unit, dpi),
          unit: unit,
          dpi: dpi
        },

        // 目标参数
        targetDimensions: {
          width: parseFloat(width),
          height: parseFloat(height),
          unit: unit,
          dpi: dpi
        },

        // 实际结果
        actualDimensions: {
          width: parseFloat(actualWidth),
          height: parseFloat(actualHeight),
          unit: unit,
          dpi: dpi
        },

        // 其他信息
        maintainedRatio: false, // 按物理尺寸调整不保持宽高比
        compressionRatio: parseFloat(compressionRatio),
        enableCompression,
        targetKB: enableCompression ? parseFloat(targetKB) : null,
        outputFormat: {
          id: outputFormat,
          label: outputFormat.toUpperCase(),
          mimeType: `image/${outputFormat}`
        },
        quality: quality
      }

      console.log('✅ 按物理尺寸调整完成:', {
        originalSize: `${imageData.width}x${imageData.height}px`,
        targetSize: `${width}x${height} ${unit}`,
        actualSize: `${actualWidth}x${actualHeight} ${unit}`,
        pixelSize: `${result.width}x${result.height}px`,
        fileSize: `${(result.size / 1024).toFixed(1)}KB`,
        compression: `${compressionRatio}%`
      })

      return result

    } catch (error) {
      console.error('❌ 按物理尺寸调整失败:', error)
      throw new Error(`图片调整失败: ${error.message}`)
    }
  }

  /**
   * 压缩到目标KB大小
   * @param {Object} initialResult - 初始压缩结果
   * @param {number} targetKB - 目标KB大小
   * @param {Object} format - 输出格式
   * @returns {Promise<Object>} 压缩结果
   */
  static async compressToTargetSize(initialResult, targetKB, format) {
    const targetBytes = targetKB * 1024

    // 如果当前大小已经小于目标大小，直接返回
    if (initialResult.actualBytes <= targetBytes) {
      console.log('📦 当前大小已满足要求，无需额外压缩')
      return initialResult
    }

    // PNG格式无法通过质量参数压缩，直接返回
    if (format.id === 'png') {
      console.log('⚠️ PNG格式无法进一步压缩')
      return initialResult
    }

    return new Promise((resolve) => {
      // 通过降低质量来压缩
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = initialResult.finalWidth
      canvas.height = initialResult.finalHeight

      // 从dataUrl重新绘制到canvas
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)

        // 二分法查找合适的质量值
        let minQuality = 0.1
        let maxQuality = 0.9
        let bestResult = initialResult
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts && maxQuality - minQuality > 0.05) {
          const testQuality = (minQuality + maxQuality) / 2
          const testDataUrl = canvas.toDataURL(format.mimeType, testQuality)
          const testBytes = ImageCompressor.getDataUrlSize(testDataUrl)

          if (testBytes <= targetBytes) {
            // 找到合适的质量，但继续尝试提高质量
            bestResult = {
              dataUrl: testDataUrl,
              actualBytes: testBytes,
              actualKB: (testBytes / 1024).toFixed(1),
              finalWidth: initialResult.finalWidth,
              finalHeight: initialResult.finalHeight,
              quality: testQuality,
              format: format
            }
            minQuality = testQuality
          } else {
            // 质量太高，降低质量
            maxQuality = testQuality
          }
          attempts++
        }

        console.log(`🎯 压缩完成: ${bestResult.actualKB}KB (目标: ${targetKB}KB, 质量: ${(bestResult.quality * 100).toFixed(0)}%)`)
        resolve(bestResult)
      }

      img.src = initialResult.dataUrl
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

  /**
   * 获取常用的DPI选项
   */
  static getDPIOptions() {
    return [
      { value: 72, label: '72 DPI (Web)', description: '网页显示标准' },
      { value: 96, label: '96 DPI (Screen)', description: '屏幕显示标准' },
      { value: 150, label: '150 DPI (Draft)', description: '草稿打印' },
      { value: 200, label: '200 DPI (Good)', description: '良好打印质量' },
      { value: 300, label: '300 DPI (Print)', description: '专业打印标准' },
      { value: 600, label: '600 DPI (High)', description: '高质量打印' }
    ]
  }

  /**
   * 获取支持的单位
   */
  static getUnitOptions() {
    return [
      { value: 'cm', label: 'CM', description: '厘米' },
      { value: 'mm', label: 'MM', description: '毫米' },
      { value: 'inch', label: 'INCH', description: '英寸' }
    ]
  }

  /**
   * 获取常用的物理尺寸预设
   */
  static getCommonSizes() {
    return {
      photo: [
        { name: '1寸照片', width: 2.5, height: 3.5, unit: 'cm' },
        { name: '2寸照片', width: 3.5, height: 5.3, unit: 'cm' },
        { name: '小2寸', width: 3.3, height: 4.8, unit: 'cm' },
        { name: '5寸照片', width: 8.9, height: 12.7, unit: 'cm' },
        { name: '6寸照片', width: 10.2, height: 15.2, unit: 'cm' }
      ],
      document: [
        { name: 'A4', width: 21.0, height: 29.7, unit: 'cm' },
        { name: 'A5', width: 14.8, height: 21.0, unit: 'cm' },
        { name: 'A6', width: 10.5, height: 14.8, unit: 'cm' },
        { name: 'Letter', width: 8.5, height: 11.0, unit: 'inch' },
        { name: 'Legal', width: 8.5, height: 14.0, unit: 'inch' }
      ]
    }
  }
}

export default ResizeByDimensionsProcessor