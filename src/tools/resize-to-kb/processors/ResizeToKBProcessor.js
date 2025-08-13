/**
 * Resize to KB 处理器 - 重构版本
 * 遵循SOLID原则，代码简洁，职责单一
 * 目标：误差控制在5%以内
 */
import ImageCompressor from '../../shared/processors/ImageCompressor.js'
import SizeEstimator from '../../shared/processors/SizeEstimator.js'
import PrecisionOptimizer from '../../shared/processors/PrecisionOptimizer.js'

export default class ResizeToKBProcessor {

  /**
   * 验证输入参数
   */
  static validateInput(imageData, targetKB) {
    if (!imageData || (!imageData.file && !imageData.url)) {
      return { isValid: false, error: 'Invalid image data' }
    }

    if (!targetKB || targetKB <= 0) {
      return { isValid: false, error: 'Target size must be greater than 0KB' }
    }

    if (targetKB > 50000) {
      return { isValid: false, error: 'Target size cannot exceed 50MB' }
    }

    const originalKB = imageData.size / 1024
    if (targetKB > originalKB * 2) {
      return {
        isValid: false,
        error: `Target size (${targetKB}KB) cannot exceed 2x the original size (${originalKB.toFixed(1)}KB)`
      }
    }

    return { isValid: true, error: null }
  }

  /**
   * 处理图片压缩到指定KB大小
   * @param {Object} imageData - 图片数据对象
   * @param {number} targetKB - 目标KB大小
   * @param {string} resolutionMode - 分辨率模式: 'auto' 或 'fixed'
   * @param {Object} fixedDimensions - 固定分辨率参数
   * @returns {Promise<Object>} 处理后的图片数据
   */
  static async processImage(imageData, targetKB, resolutionMode = 'auto', fixedDimensions = null) {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🎯 Starting compression to ${targetKB}KB (mode: ${resolutionMode})`)

        const img = new Image()

        img.onload = async () => {
          try {
            const targetBytes = targetKB * 1024
            let result

            if (resolutionMode === 'fixed' && fixedDimensions) {
              // 固定分辨率模式
              result = await ResizeToKBProcessor.fixedResolutionCompress(img, targetBytes, fixedDimensions)
            } else {
              // 自动分辨率模式
              result = await ResizeToKBProcessor.autoResolutionCompress(img, targetBytes)
            }

            if (result) {
              const processedData = {
                ...imageData,
                url: result.dataUrl,
                size: result.actualBytes,
                width: result.finalWidth,
                height: result.finalHeight,
                processedAt: new Date().toISOString(),
                compressionRatio: ((imageData.size - result.actualBytes) / imageData.size * 100).toFixed(1),
                resolutionMode: resolutionMode,
                quality: result.quality
              }

              console.log(`✅ Compression complete: ${result.actualKB}KB, error ${result.errorPercent?.toFixed(1) || 'N/A'}%`)
              resolve(processedData)
            } else {
              reject(new Error('Compression failed, unable to reach target size'))
            }

          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error('Image loading failed'))
        }

        img.src = imageData.url

      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 自动分辨率压缩 - 智能调整尺寸和质量
   */
  static async autoResolutionCompress(img, targetBytes) {
    const originalWidth = img.width
    const originalHeight = img.height

    console.log(`📐 Auto mode: ${originalWidth}x${originalHeight} → target ${(targetBytes / 1024).toFixed(1)}KB`)

    // 生成测试组合
    const combinations = SizeEstimator.generateTestCombinations(originalWidth, originalHeight, targetBytes)
    const results = []

    console.log(`🔍 Testing ${combinations.length} combinations`)

    // 测试所有组合 - 使用新的网格搜索格式
    for (let i = 0; i < combinations.length; i++) {
      const { scale, quality, width, height } = combinations[i]  // 使用预计算的宽高

      if (width < 50 || height < 50) continue

      try {
        const result = ImageCompressor.compressImage(img, width, height, quality)
        const error = Math.abs(result.actualBytes - targetBytes)
        const errorPercent = (error / targetBytes) * 100

        results.push({
          ...result,
          error,
          errorPercent
        })

        console.log(`[${i + 1}/${combinations.length}] ${width}x${height}, quality ${quality}, ${result.actualKB}KB, error ${errorPercent.toFixed(1)}%`)

        // 如果误差小于5%，可以提前结束
        if (errorPercent <= 5.0) {
          console.log(`🎯 Found high precision result, ending early`)
          break
        }

      } catch (error) {
        console.error(`❌ Test failed: ${error.message}`)
        continue
      }
    }

    // 选择最佳结果
    const bestResult = PrecisionOptimizer.selectBestResult(results, targetBytes, 20) // 20%容差

    if (bestResult && bestResult.errorPercent > 5) {
      // 如果误差超过5%，必须进行精度优化
      console.log(`🔧 Error ${bestResult.errorPercent.toFixed(1)}% exceeds 5% target, starting precision optimization`)
      const optimized = PrecisionOptimizer.binarySearchOptimize(
        img,
        bestResult.finalWidth,
        bestResult.finalHeight,
        targetBytes,
        targetBytes * 0.05 // 5%容差
      )

      // 如果优化后的结果更好，使用优化结果
      if (optimized && optimized.errorPercent < bestResult.errorPercent) {
        console.log(`✨ Precision optimization successful: ${optimized.errorPercent.toFixed(1)}% < ${bestResult.errorPercent.toFixed(1)}%`)
        return optimized
      } else {
        console.log(`⚠️ Precision optimization did not improve result, using original`)
        return bestResult
      }
    }

    console.log(`🎯 Initial result meets 5% precision requirement: ${bestResult.errorPercent.toFixed(1)}%`)
    return bestResult
  }

  /**
   * 固定分辨率压缩 - 保持指定尺寸，仅调整质量
   */
  static async fixedResolutionCompress(img, targetBytes, fixedDimensions) {
    const targetDimensions = ImageCompressor.convertToPixels(
      fixedDimensions.width,
      fixedDimensions.height,
      fixedDimensions.unit
    )

    console.log(`📐 Fixed mode: ${targetDimensions.width}x${targetDimensions.height}`)

    // 直接使用二分查找优化质量
    return PrecisionOptimizer.binarySearchOptimize(
      img,
      targetDimensions.width,
      targetDimensions.height,
      targetBytes
    )
  }
}