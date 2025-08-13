/**
 * 核心图片压缩器 - 单一职责：执行压缩操作
 * 遵循KISS原则，只做最核心的压缩逻辑
 */
export default class ImageCompressor {

  /**
   * 创建Canvas并绘制图片
   */
  static createCanvas(img, width, height) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    // 使用高质量缩放
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(img, 0, 0, width, height)
    return canvas
  }

  /**
   * 获取DataURL的字节大小
   */
  static getDataUrlSize(dataUrl) {
    // data:image/jpeg;base64, 前缀长度约23字符
    const base64String = dataUrl.split(',')[1]
    const padding = (base64String.match(/=/g) || []).length
    return Math.floor((base64String.length * 3) / 4) - padding
  }

  /**
   * 压缩图片到指定字节大小
   * @param {HTMLImageElement} img - 图片对象
   * @param {number} width - 目标宽度
   * @param {number} height - 目标高度  
   * @param {number} quality - JPEG质量 (0-1)
   * @returns {Object} 压缩结果
   */
  static compressImage(img, width, height, quality) {
    try {
      // 确保质量参数精度
      const preciseQuality = Math.max(0.01, Math.min(1.0, parseFloat(quality.toFixed(5))))

      const canvas = this.createCanvas(img, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', preciseQuality)
      const actualBytes = this.getDataUrlSize(dataUrl)

      return {
        dataUrl,
        actualBytes,
        actualKB: parseFloat((actualBytes / 1024).toFixed(3)), // 提高KB精度到3位小数
        finalWidth: width,
        finalHeight: height,
        quality: preciseQuality
      }
    } catch (error) {
      throw new Error(`压缩失败: ${error.message}`)
    }
  }

  /**
   * 批量测试多个质量值，用于精确搜索
   * @param {HTMLImageElement} img - 图片对象
   * @param {number} width - 目标宽度
   * @param {number} height - 目标高度
   * @param {Array} qualities - 质量值数组
   * @returns {Array} 压缩结果数组
   */
  static batchCompressImage(img, width, height, qualities) {
    const results = []
    const canvas = this.createCanvas(img, width, height)

    for (const quality of qualities) {
      try {
        const preciseQuality = Math.max(0.01, Math.min(1.0, parseFloat(quality.toFixed(5))))
        const dataUrl = canvas.toDataURL('image/jpeg', preciseQuality)
        const actualBytes = this.getDataUrlSize(dataUrl)

        results.push({
          dataUrl,
          actualBytes,
          actualKB: parseFloat((actualBytes / 1024).toFixed(3)),
          finalWidth: width,
          finalHeight: height,
          quality: preciseQuality
        })
      } catch (error) {
        // 跳过失败的质量值
        continue
      }
    }

    return results
  }

  /**
   * 单位转换工具
   */
  static convertToPixels(width, height, unit, dpi = 200) {
    switch (unit) {
      case 'cm':
        return {
          width: Math.round(width * dpi / 2.54),
          height: Math.round(height * dpi / 2.54)
        }
      case 'mm':
        return {
          width: Math.round(width * dpi / 25.4),
          height: Math.round(height * dpi / 25.4)
        }
      case 'inch':
        return {
          width: Math.round(width * dpi),
          height: Math.round(height * dpi)
        }
      case 'px':
      default:
        return { width: Math.round(width), height: Math.round(height) }
    }
  }
}