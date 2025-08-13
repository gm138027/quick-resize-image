/**
 * 精度优化器 - 单一职责：在接近目标的结果中选择最佳
 * 使用二分查找等算法进一步优化精度
 */
import ImageCompressor from './ImageCompressor.js'

export default class PrecisionOptimizer {
  
  /**
   * 简化的二分查找优化 - 避免浏览器崩溃
   * @param {HTMLImageElement} img - 图片对象
   * @param {number} width - 固定宽度
   * @param {number} height - 固定高度
   * @param {number} targetBytes - 目标字节数
   * @param {number} tolerance - 容差字节数
   * @returns {Object|null} 优化结果
   */
  static binarySearchOptimize(img, width, height, targetBytes, tolerance = targetBytes * 0.005) {
    const targetKB = targetBytes / 1024
    console.log(`🎯 Simplified binary search: size ${width}x${height}, target ${targetKB.toFixed(1)}KB`)
    
    let minQuality = 0.1
    let maxQuality = 1.0
    let bestResult = null
    let bestError = Infinity
    let iterations = 0
    const maxIterations = 25 // 限制迭代次数避免崩溃
    
    while (iterations < maxIterations && (maxQuality - minQuality) > 0.005) {
      const quality = (minQuality + maxQuality) / 2
      
      try {
        const result = ImageCompressor.compressImage(img, width, height, quality)
        const error = Math.abs(result.actualBytes - targetBytes)
        const errorPercent = (error / targetBytes) * 100
        
        if (error < bestError) {
          bestResult = { ...result, error, errorPercent }
          bestError = error
          console.log(`   ✨ Binary search improvement: quality ${quality.toFixed(4)}, error ${errorPercent.toFixed(3)}%`)
        }
        
        if (result.actualBytes < targetBytes) {
          minQuality = quality
        } else {
          maxQuality = quality
        }
        
        // 如果达到可接受精度，提前结束
        if (errorPercent <= 0.5) {
          console.log(`🎯 Reached acceptable precision ${errorPercent.toFixed(3)}%, ending early`)
          break
        }
        
      } catch (error) {
        console.warn(`⚠️ Binary search test failed: quality ${quality.toFixed(4)}`)
        maxQuality = quality
      }
      
      iterations++
    }
    
    if (bestResult) {
      console.log(`✅ Binary search complete: ${bestResult.actualKB}KB, final error ${bestResult.errorPercent.toFixed(3)}%`)
    }
    
    return bestResult
  }



  /**
   * 选择最佳结果 - 超高精度策略，目标0.1%误差
   * 优先选择最接近目标的结果，使用多重筛选策略
   * @param {Array} results - 所有测试结果
   * @param {number} targetBytes - 目标字节数
   * @param {number} maxErrorPercent - 最大允许误差百分比
   * @returns {Object|null} 最佳结果
   */
  static selectBestResult(results, targetBytes, maxErrorPercent = 15) {
    if (!results || results.length === 0) return null
    
    const targetKB = targetBytes / 1024
    console.log(`🎯 Ultra-high precision result selection: choosing from ${results.length} results (target: ${targetKB.toFixed(1)}KB)`)
    
    // 计算所有结果的误差并排序
    const resultsWithError = results.map(result => {
      const error = Math.abs(result.actualBytes - targetBytes)
      const errorPercent = (error / targetBytes) * 100
      const relativeError = (result.actualBytes - targetBytes) / targetBytes * 100 // 带符号的相对误差
      
      return {
        ...result,
        error,
        errorPercent,
        relativeError,
        isOverTarget: result.actualBytes > targetBytes,
        isUnderTarget: result.actualBytes < targetBytes
      }
    })
    
    // 多重排序策略：
    // 1. 优先按绝对误差排序
    // 2. 相同误差时，对于增大图片功能，轻微偏向不超过目标的结果
    resultsWithError.sort((a, b) => {
      // 首先按绝对误差排序
      const errorDiff = a.error - b.error
      if (Math.abs(errorDiff) > 1) return errorDiff // 误差差异大于1字节时，直接按误差排序
      
      // 误差相近时的精细排序策略
      // 对于增大图片功能，在误差相近的情况下，轻微偏向不超过目标
      if (a.isUnderTarget && b.isOverTarget) return -0.1 // 轻微偏向不超标
      if (a.isOverTarget && b.isUnderTarget) return 0.1
      
      return errorDiff // 最终还是按绝对误差
    })
    
    // 显示前10个最佳结果以便分析
    console.log(`🏆 Top 10 best results:`)
    for (let i = 0; i < Math.min(10, resultsWithError.length); i++) {
      const result = resultsWithError[i]
      const statusFlag = result.isOverTarget ? ' (over+)' : result.isUnderTarget ? ' (under-)' : ' (exact)'
      const stageFlag = result.stage ? ` [${result.stage}]` : ''
      console.log(`   ${i + 1}. ${result.actualKB}KB (error ${result.errorPercent.toFixed(4)}%)${statusFlag}${stageFlag}`)
    }
    
    // 寻找超高精度结果 (误差 < 0.1%)
    const ultraHighPrecisionResults = resultsWithError.filter(r => r.errorPercent < 0.1)
    if (ultraHighPrecisionResults.length > 0) {
      const best = ultraHighPrecisionResults[0]
      console.log(`🏆 Found ultra-high precision result: ${best.actualKB}KB, error ${best.errorPercent.toFixed(4)}%`)
      return best
    }
    
    // 寻找高精度结果 (误差 < 0.5%)
    const highPrecisionResults = resultsWithError.filter(r => r.errorPercent < 0.5)
    if (highPrecisionResults.length > 0) {
      const best = highPrecisionResults[0]
      console.log(`🎯 Found high precision result: ${best.actualKB}KB, error ${best.errorPercent.toFixed(3)}%`)
      return best
    }
    
    // 寻找中等精度结果 (误差 < 2%)
    const mediumPrecisionResults = resultsWithError.filter(r => r.errorPercent < 2.0)
    if (mediumPrecisionResults.length > 0) {
      const best = mediumPrecisionResults[0]
      console.log(`📊 Found medium precision result: ${best.actualKB}KB, error ${best.errorPercent.toFixed(2)}%`)
      return best
    }
    
    // 如果没有找到高精度结果，选择误差最小的
    const bestResult = resultsWithError[0]
    console.log(`⚠️ Using best available result: ${bestResult.actualKB}KB, error ${bestResult.errorPercent.toFixed(2)}%`)
    
    return bestResult
  }

  /**
   * 超高效二分查找 - 3秒内完成，竞品级性能
   * @param {HTMLImageElement} img - 图片对象
   * @param {number} width - 固定宽度
   * @param {number} height - 固定高度
   * @param {number} targetBytes - 目标字节数
   * @param {number} startQuality - 起始质量
   * @returns {Object|null} 优化结果
   */
  static efficientBinarySearch(img, width, height, targetBytes, startQuality = 0.8) {
    const targetKB = targetBytes / 1024
    console.log(`⚡ Ultra-efficient binary search: size ${width}x${height}, target ${targetKB.toFixed(1)}KB`)
    
    // 简化边界确定，直接使用固定范围
    let minQuality = Math.max(0.2, startQuality - 0.3)
    let maxQuality = Math.min(1.0, startQuality + 0.2)
    
    console.log(`📊 Quality range: ${minQuality.toFixed(3)} - ${maxQuality.toFixed(3)}`)
    
    let bestResult = null
    let bestError = Infinity
    let iterations = 0
    const maxIterations = 10 // 进一步限制迭代次数
    
    // 快速二分查找
    while (iterations < maxIterations && (maxQuality - minQuality) > 0.01) {
      const quality = (minQuality + maxQuality) / 2
      
      try {
        const result = ImageCompressor.compressImage(img, width, height, quality)
        const error = Math.abs(result.actualBytes - targetBytes)
        const errorPercent = (error / targetBytes) * 100
        
        if (error < bestError) {
          bestResult = { ...result, error, errorPercent }
          bestError = error
          console.log(`   ⚡ Iteration ${iterations + 1}: quality ${quality.toFixed(3)}, error ${errorPercent.toFixed(2)}%`)
        }
        
        // 快速收敛策略
        if (result.actualBytes < targetBytes) {
          minQuality = quality
        } else {
          maxQuality = quality
        }
        
        // 达到可接受精度时提前结束
        if (errorPercent <= 0.2) {
          console.log(`🎯 Reached acceptable precision ${errorPercent.toFixed(2)}%, ending early`)
          break
        }
        
      } catch (error) {
        console.warn(`⚠️ Test failed: quality ${quality.toFixed(3)}`)
        maxQuality = quality
      }
      
      iterations++
    }
    
    if (bestResult) {
      console.log(`⚡ Ultra-efficient search complete: ${bestResult.actualKB}KB, error ${bestResult.errorPercent.toFixed(3)}%, ${iterations} iterations`)
    } else {
      console.log(`❌ Binary search failed`)
    }
    
    return bestResult
  }

  /**
   * 快速确定质量搜索边界
   */
  static findQualityBoundaries(img, width, height, targetBytes, startQuality) {
    console.log(`🔍 Determining quality boundaries, starting quality ${startQuality.toFixed(3)}`)
    
    try {
      // 测试起始质量
      const startResult = ImageCompressor.compressImage(img, width, height, startQuality)
      
      let minQuality, maxQuality
      
      if (startResult.actualBytes < targetBytes) {
        // 需要提高质量
        minQuality = startQuality
        maxQuality = Math.min(1.0, startQuality + 0.2)
        
        // 确保上边界足够
        const maxTest = ImageCompressor.compressImage(img, width, height, maxQuality)
        if (maxTest.actualBytes < targetBytes) {
          maxQuality = 1.0
        }
        
      } else {
        // 需要降低质量
        maxQuality = startQuality
        minQuality = Math.max(0.1, startQuality - 0.2)
        
        // 确保下边界足够
        const minTest = ImageCompressor.compressImage(img, width, height, minQuality)
        if (minTest.actualBytes > targetBytes) {
          minQuality = 0.1
        }
      }
      
      return { min: minQuality, max: maxQuality }
      
    } catch (error) {
      console.error(`❌ 边界测试失败:`, error)
      return null
    }
  }
}