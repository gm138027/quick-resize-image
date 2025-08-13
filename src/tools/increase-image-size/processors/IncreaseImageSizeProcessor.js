/**
 * 增大图片处理器 - 务实稳定版本
 * 目标：误差5%以内，1-5秒完成，代码简洁(<500行)
 * 策略：快速预测 + 精确微调，避免过度复杂化
 */
import ImageCompressor from '../../shared/processors/ImageCompressor.js'

export default class IncreaseImageSizeProcessor {

  /**
   * 验证输入参数
   */
  static validateInput(imageData, params) {
    if (!imageData || !imageData.file) {
      return { isValid: false, error: '无效的图片数据' }
    }

    const { targetKB, sizeUnit = 'kb' } = params

    if (!targetKB || targetKB <= 0) {
      return { isValid: false, error: '目标大小必须大于0' }
    }

    const maxValue = sizeUnit === 'mb' ? 100 : 100000
    if (targetKB > maxValue) {
      const unitText = sizeUnit.toUpperCase()
      return { isValid: false, error: `目标大小不能超过${maxValue}${unitText}` }
    }

    const currentSizeKB = imageData.size / 1024
    const targetSizeKB = sizeUnit === 'mb' ? targetKB * 1024 : targetKB

    if (targetSizeKB <= currentSizeKB) {
      return {
        isValid: false,
        error: `目标大小(${targetSizeKB.toFixed(1)}KB)必须大于当前大小(${currentSizeKB.toFixed(1)}KB)`
      }
    }

    return { isValid: true, error: null }
  }

  /**
   * 处理图片增大
   */
  static async processImage(imageData, params) {
    return new Promise((resolve, reject) => {
      try {
        const {
          targetKB,
          sizeUnit = 'kb',
          resolutionMode = 'auto'
        } = params

        const targetSizeKB = sizeUnit === 'mb' ? targetKB * 1024 : targetKB
        const targetBytes = targetSizeKB * 1024

        console.log(`🎯 开始增大图片: 目标${targetKB}${sizeUnit.toUpperCase()} (${targetSizeKB.toFixed(1)}KB)`)

        const img = new Image()

        img.onload = async () => {
          try {
            const result = await this.fastPredictiveAlgorithm(img, targetBytes)

            if (result) {
              const processedData = {
                ...imageData,
                url: result.dataUrl,
                size: result.actualBytes,
                width: result.finalWidth,
                height: result.finalHeight,
                processedAt: new Date().toISOString(),
                processingType: 'increase-image-size',
                resolutionMode: resolutionMode,
                quality: result.quality,
                outputFormat: { id: 'jpeg', label: 'JPG', mimeType: 'image/jpeg' },
                sizeUnit: sizeUnit,
                targetSize: {
                  value: targetKB,
                  unit: sizeUnit,
                  bytes: targetBytes
                },
                actualSize: {
                  kb: result.actualKB,
                  mb: (result.actualBytes / (1024 * 1024)).toFixed(2)
                }
              }

              console.log(`✅ 图片增大完成: ${result.actualKB}KB, 尺寸${result.finalWidth}x${result.finalHeight}`)
              resolve(processedData)
            } else {
              reject(new Error('无法增大到目标大小'))
            }

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
   * 快速预测算法 - 核心算法
   * 直接基于目标大小进行处理，不再判断增大/压缩
   */
  static async fastPredictiveAlgorithm(img, targetBytes) {
    const originalWidth = img.width
    const originalHeight = img.height
    const targetKB = targetBytes / 1024

    console.log(`⚡ 快速预测算法: ${originalWidth}x${originalHeight} → 目标${targetKB.toFixed(1)}KB`)

    // 第一步：快速基准测试
    const baseline = await this.getBaseline(img)
    console.log(`📊 压缩基准: 最高质量${baseline.maxKB}KB`)

    // 第二步：计算处理策略
    const processingFactor = targetBytes / baseline.maxBytes
    console.log(`📊 处理倍数: ${processingFactor.toFixed(3)}x (相对于最高质量)`)

    // 第三步：智能参数预测
    const prediction = this.predictOptimalParameters(processingFactor, baseline, targetBytes)
    console.log(`🎯 参数预测: 尺寸${prediction.width}x${prediction.height}, 质量${prediction.quality.toFixed(4)}`)

    // 第四步：快速验证和微调
    const result = await this.quickRefinement(img, prediction, targetBytes)

    return result
  }

  /**
   * 获取原始文件大小 - 从imageData中获取真实的原始文件大小
   */
  static async getOriginalFileSize(img) {
    // 这个方法有问题，我们需要从外部传入原始文件大小
    // 暂时使用一个估算方法
    return new Promise((resolve) => {
      if (img.src.startsWith('data:')) {
        // 如果是data URL，计算其大小
        const base64String = img.src.split(',')[1]
        const padding = (base64String.match(/=/g) || []).length
        const bytes = Math.floor((base64String.length * 3) / 4) - padding
        resolve(bytes)
      } else {
        // 对于blob URL，我们无法直接获取原始文件大小
        // 这是一个设计缺陷，需要从调用方传入
        console.warn('⚠️ 无法获取原始文件大小，使用估算值')
        const currentResult = ImageCompressor.compressImage(img, img.width, img.height, 0.8)
        const estimatedOriginalSize = currentResult.actualBytes * 0.6 // 保守估算
        resolve(estimatedOriginalSize)
      }
    })
  }

  /**
   * 获取基准数据 - 只需1次测试
   */
  static async getBaseline(img) {
    const maxResult = ImageCompressor.compressImage(img, img.width, img.height, 1.0)

    return {
      maxKB: maxResult.actualKB,
      maxBytes: maxResult.actualBytes,
      pixelCount: img.width * img.height,
      aspectRatio: img.width / img.height,
      compressionRatio: maxResult.actualBytes / (img.width * img.height * 3)
    }
  }

  /**
   * 预测最优参数 - 修复尺寸和质量计算错误
   */
  static predictOptimalParameters(processingFactor, baseline, targetBytes) {
    // 直接从baseline获取真实尺寸，避免错误的数学计算
    const actualWidth = Math.round(Math.sqrt(baseline.pixelCount * baseline.aspectRatio))
    const actualHeight = Math.round(Math.sqrt(baseline.pixelCount / baseline.aspectRatio))

    let targetWidth, targetHeight, targetQuality

    if (processingFactor >= 1.0) {
      // 需要增大文件 (目标 > 最高质量)
      if (processingFactor <= 1.2) {
        console.log(`📋 策略: 保持分辨率增大 (${processingFactor.toFixed(3)}x)`)
        targetWidth = actualWidth
        targetHeight = actualHeight
        targetQuality = Math.min(0.99, 0.8 + (processingFactor - 1.0) * 0.5)
      } else {
        console.log(`📋 策略: 尺寸增大 (${processingFactor.toFixed(3)}x)`)
        const sizeScale = Math.pow(processingFactor, 0.8)
        targetWidth = Math.round(actualWidth * sizeScale)
        targetHeight = Math.round(actualHeight * sizeScale)
        targetQuality = Math.min(0.95, 0.85)
      }
    } else {
      // 需要压缩文件 (目标 < 最高质量)
      console.log(`📋 策略: 质量压缩 (${processingFactor.toFixed(3)}x)`)
      targetWidth = actualWidth
      targetHeight = actualHeight

      // 修复质量计算：确保质量在合理范围内
      if (processingFactor >= 0.8) {
        targetQuality = Math.max(0.5, Math.min(0.95, 0.9 * processingFactor))
      } else if (processingFactor >= 0.5) {
        targetQuality = Math.max(0.3, Math.min(0.8, 0.8 * processingFactor))
      } else if (processingFactor >= 0.2) {
        targetQuality = Math.max(0.2, Math.min(0.6, 0.6 * processingFactor))
      } else {
        targetQuality = Math.max(0.1, 0.3 * processingFactor)
      }
    }

    // 确保所有参数都在合理范围内
    targetWidth = Math.max(50, Math.min(5000, targetWidth))
    targetHeight = Math.max(50, Math.min(5000, targetHeight))
    targetQuality = Math.max(0.1, Math.min(0.99, targetQuality))

    return {
      width: targetWidth,
      height: targetHeight,
      quality: targetQuality,
      processingFactor: processingFactor
    }
  }

  /**
   * 快速微调 - 最多5次测试达到5%精度
   */
  static async quickRefinement(img, prediction, targetBytes) {
    console.log(`🔧 快速微调开始`)

    // 第一次测试预测参数
    let bestResult = ImageCompressor.compressImage(img, prediction.width, prediction.height, prediction.quality)
    let bestError = Math.abs(bestResult.actualBytes - targetBytes)
    let bestErrorPercent = (bestError / targetBytes) * 100

    console.log(`📊 预测结果: ${bestResult.actualKB}KB, 误差${bestErrorPercent.toFixed(2)}%`)

    // 如果误差已经很小，直接返回
    if (bestErrorPercent <= 5.0) {
      console.log(`🎯 预测精度达标: ${bestErrorPercent.toFixed(2)}%`)
      return { ...bestResult, error: bestError, errorPercent: bestErrorPercent }
    }

    // 如果误差较大，进行智能微调
    console.log(`🔧 启动智能微调`)

    const errorRatio = bestResult.actualBytes / targetBytes
    const adjustmentStrength = Math.min(0.1, Math.abs(1 - errorRatio) * 0.5)

    let testQualities = []

    if (errorRatio < 0.9) {
      // 文件太小，需要提高质量
      testQualities = [
        prediction.quality + adjustmentStrength * 0.5,
        prediction.quality + adjustmentStrength * 1.0,
        prediction.quality + adjustmentStrength * 1.5,
        Math.min(0.99, prediction.quality + adjustmentStrength * 2.0)
      ]
    } else if (errorRatio > 1.1) {
      // 文件太大，需要降低质量
      testQualities = [
        prediction.quality - adjustmentStrength * 0.5,
        prediction.quality - adjustmentStrength * 1.0,
        prediction.quality - adjustmentStrength * 1.5,
        Math.max(0.1, prediction.quality - adjustmentStrength * 2.0)
      ]
    } else {
      // 误差适中，精细调整
      testQualities = [
        prediction.quality - 0.02,
        prediction.quality + 0.02,
        prediction.quality - 0.05,
        prediction.quality + 0.05
      ]
    }

    // 测试微调质量
    let testCount = 0
    for (const quality of testQualities) {
      if (quality < 0.1 || quality > 0.99) continue

      testCount++
      try {
        const result = ImageCompressor.compressImage(img, prediction.width, prediction.height, quality)
        const error = Math.abs(result.actualBytes - targetBytes)
        const errorPercent = (error / targetBytes) * 100

        if (error < bestError) {
          bestResult = result
          bestError = error
          bestErrorPercent = errorPercent
          console.log(`   ✨ 微调改进: 质量${quality.toFixed(4)}, ${result.actualKB}KB, 误差${errorPercent.toFixed(2)}%`)
        }

        // 如果达到目标精度，提前结束
        if (errorPercent <= 5.0) {
          console.log(`🎯 达到目标精度${errorPercent.toFixed(2)}%，微调完成`)
          break
        }

      } catch (error) {
        continue
      }
    }

    console.log(`🏆 快速微调完成: ${bestResult.actualKB}KB, 最终精度${bestErrorPercent.toFixed(2)}%, ${testCount + 1}次测试`)

    return {
      ...bestResult,
      error: bestError,
      errorPercent: bestErrorPercent
    }
  }

  /**
   * 获取推荐的增大倍数选项
   */
  static getRecommendedScales() {
    return [
      { scale: 1.2, label: '1.2x', description: '轻微增大，保持分辨率' },
      { scale: 1.5, label: '1.5x', description: '适度增大，平衡质量' },
      { scale: 2.0, label: '2x', description: '标准增大，常用选择' },
      { scale: 2.5, label: '2.5x', description: '显著增大，主要调整尺寸' },
      { scale: 3.0, label: '3x', description: '大幅增大，尺寸优先' }
    ]
  }

  /**
   * 获取支持的大小单位
   */
  static getSizeUnits() {
    return [
      { value: 'kb', label: 'KB', description: '千字节，适合小文件' },
      { value: 'mb', label: 'MB', description: '兆字节，适合大文件' }
    ]
  }

  /**
   * 估算处理时间
   */
  static estimateProcessingTime(scaleFactor) {
    if (scaleFactor <= 1.2) return '1-2秒'
    if (scaleFactor <= 2.0) return '2-3秒'
    return '3-5秒'
  }

  /**
   * 估算预期精度
   */
  static estimateAccuracy(scaleFactor) {
    if (scaleFactor <= 1.2) return '2-5%误差'
    if (scaleFactor <= 2.0) return '3-6%误差'
    return '4-8%误差'
  }
}