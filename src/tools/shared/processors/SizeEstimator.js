/**
 * 文件大小估算器 - 单一职责：估算最佳压缩参数
 * 基于目标文件大小智能估算缩放比例和质量
 */
export default class SizeEstimator {
  
  /**
   * 简化的直接估算算法
   * 放弃复杂的模型，使用简单直接的方法
   * @param {number} originalWidth - 原始宽度
   * @param {number} originalHeight - 原始高度
   * @param {number} targetBytes - 目标字节数
   * @returns {number} 估算的缩放比例
   */
  static estimateOptimalScale(originalWidth, originalHeight, targetBytes) {
    // 简化策略：直接返回1.0，让算法通过广泛搜索找到最佳结果
    // 这样避免了错误的估算导致搜索范围偏移
    
    console.log(`📊 Simplified estimation: using baseline scale 1.0, finding optimal result through extensive search`)
    
    return 1.0
  }

  /**
   * 全新的网格搜索策略 - 彻底解决精度问题
   * 使用网格搜索覆盖所有可能的参数组合
   * @param {number} originalWidth - 原始宽度
   * @param {number} originalHeight - 原始高度
   * @param {number} targetBytes - 目标字节数
   * @returns {Array} 测试组合数组
   */
  static generateTestCombinations(originalWidth, originalHeight, targetBytes) {
    const combinations = []
    const targetKB = targetBytes / 1024
    
    console.log(`🎯 New grid search strategy: target ${targetKB.toFixed(1)}KB`)
    
    // 尺寸网格：从0.4到1.0，步长0.05 (13个点)
    const scales = []
    for (let s = 0.4; s <= 1.0; s += 0.05) {
      scales.push(parseFloat(s.toFixed(2)))
    }
    
    // 质量网格：重点关注高质量区间，因为我们需要更大的文件
    const qualities = [
      // 超高质量区间 - 密集采样
      1.0, 0.98, 0.96, 0.94, 0.92, 0.90,
      // 高质量区间 - 中等采样  
      0.85, 0.80, 0.75, 0.70,
      // 中质量区间 - 稀疏采样
      0.60, 0.50, 0.40,
      // 低质量区间 - 极稀疏采样
      0.30, 0.20, 0.10
    ]
    
    console.log(`📊 Grid parameters: ${scales.length} sizes × ${qualities.length} qualities = ${scales.length * qualities.length} combinations`)
    
    // 生成所有组合
    for (const scale of scales) {
      for (const quality of qualities) {
        const width = Math.round(originalWidth * scale)
        const height = Math.round(originalHeight * scale)
        
        // 简单的文件大小估算（不用于排序，只用于记录）
        const estimatedPixels = width * height
        const estimatedBytes = estimatedPixels * quality * 2.0 // 使用更大的系数
        
        combinations.push({
          scale: scale,
          quality: quality,
          width: width,
          height: height,
          estimatedBytes: estimatedBytes,
          estimatedKB: (estimatedBytes / 1024).toFixed(1)
        })
      }
    }
    
    // 不进行预排序，让算法测试所有组合
    console.log(`📋 Generated ${combinations.length} grid combinations, testing all`)
    
    return combinations
  }
}