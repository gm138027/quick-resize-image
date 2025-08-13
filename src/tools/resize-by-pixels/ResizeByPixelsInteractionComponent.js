/**
 * Resize by Pixels 功能的用户交互组件
 * 严格按照用户设计的界面实现
 */
import { useState, useEffect, useRef } from 'react'
import OutputFormatSelector from '../shared/components/OutputFormatSelector'

export default function ResizeByPixelsInteractionComponent({
  currentWidth,
  currentHeight,
  currentMaintainRatio = true,
  currentOutputFormat = { id: 'jpeg', label: 'JPG', mimeType: 'image/jpeg' },
  onDimensionsChange,
  onMaintainRatioChange,
  onOutputFormatChange,
  onValidationChange,
  className = ""
}) {

  const [width, setWidth] = useState(currentWidth || '')
  const [height, setHeight] = useState(currentHeight || '')
  const [maintainRatio, setMaintainRatio] = useState(currentMaintainRatio)
  const [originalRatio, setOriginalRatio] = useState(null)

  // 监听当前图片变化，自动更新输入框
  // 使用useRef来避免循环依赖
  const isInternalUpdate = useRef(false)
  
  useEffect(() => {
    console.log(`🔄 useEffect触发: currentWidth=${currentWidth}, currentHeight=${currentHeight}`)
    if (currentWidth && currentHeight && !isInternalUpdate.current) {
      const ratio = currentWidth / currentHeight
      setWidth(currentWidth.toString())
      setHeight(currentHeight.toString())
      setOriginalRatio(ratio)
      console.log(`📐 更新输入框: ${currentWidth}x${currentHeight}, 宽高比: ${ratio.toFixed(4)}`)
    }
  }, [currentWidth, currentHeight])

  // 监听保持宽高比状态变化
  useEffect(() => {
    setMaintainRatio(currentMaintainRatio)
  }, [currentMaintainRatio])

  // 处理宽度变化
  const handleWidthChange = (value) => {
    const numValue = parseInt(value) || 0
    
    console.log(`🔧 宽度变化: ${value}, maintainRatio: ${maintainRatio}, originalRatio: ${originalRatio}`)

    // 设置标志，表示这是内部更新
    isInternalUpdate.current = true

    // 如果保持宽高比且有原始比例，自动计算高度
    if (maintainRatio && originalRatio && numValue > 0) {
      let calculatedHeight = Math.round(numValue / originalRatio)
      
      // 验证计算结果的合理性
      if (calculatedHeight < 1) {
        console.warn(`⚠️ 计算高度过小: ${calculatedHeight}，设置为最小值1`)
        calculatedHeight = 1
      }
      
      console.log(`📐 计算高度: ${numValue} / ${originalRatio.toFixed(6)} = ${calculatedHeight}`)
      
      // 同时更新宽度和高度状态
      setWidth(value)
      setHeight(calculatedHeight.toString())
      
      // 通知父组件
      onDimensionsChange?.({ width: numValue, height: calculatedHeight })
      
      // 验证输入
      validateInput(numValue, calculatedHeight)
    } else {
      // 只更新宽度
      setWidth(value)
      const currentHeightValue = parseInt(height) || 0
      onDimensionsChange?.({ width: numValue, height: currentHeightValue })
      validateInput(numValue, currentHeightValue)
    }

    // 重置标志
    setTimeout(() => {
      isInternalUpdate.current = false
    }, 0)
  }

  // 处理高度变化
  const handleHeightChange = (value) => {
    const numValue = parseInt(value) || 0
    
    // 设置标志，表示这是内部更新
    isInternalUpdate.current = true
    
    setHeight(value)

    // 如果保持宽高比且有原始比例，自动计算宽度
    if (maintainRatio && originalRatio && numValue > 0) {
      let calculatedWidth = Math.round(numValue * originalRatio)
      
      // 验证计算结果的合理性
      if (calculatedWidth < 1) {
        console.warn(`⚠️ 计算宽度过小: ${calculatedWidth}，设置为最小值1`)
        calculatedWidth = 1
      }
      
      console.log(`📐 计算宽度: ${numValue} * ${originalRatio.toFixed(6)} = ${calculatedWidth}`)
      
      setWidth(calculatedWidth.toString())
      onDimensionsChange?.({ width: calculatedWidth, height: numValue })
      validateInput(calculatedWidth, numValue)
    } else {
      onDimensionsChange?.({ width: parseInt(width) || 0, height: numValue })
      validateInput(parseInt(width) || 0, numValue)
    }

    // 重置标志
    setTimeout(() => {
      isInternalUpdate.current = false
    }, 0)
  }

  // 处理保持宽高比变化
  const handleMaintainRatioChange = (checked) => {
    setMaintainRatio(checked)
    onMaintainRatioChange?.(checked)

    // 如果启用保持宽高比且有宽度值，重新计算高度
    if (checked && originalRatio && width) {
      const numWidth = parseInt(width) || 0
      if (numWidth > 0) {
        const calculatedHeight = Math.round(numWidth / originalRatio)
        setHeight(calculatedHeight.toString())
        onDimensionsChange?.({ width: numWidth, height: calculatedHeight })
        validateInput(numWidth, calculatedHeight)
      }
    }
  }

  // 验证输入值
  const validateInput = (widthValue, heightValue) => {
    if (!widthValue || widthValue <= 0) {
      onValidationChange?.(false, '宽度必须大于0')
      return
    }
    
    if (!heightValue || heightValue <= 0) {
      onValidationChange?.(false, '高度必须大于0')
      return
    }
    
    if (widthValue > 10000 || heightValue > 10000) {
      onValidationChange?.(false, '尺寸不能超过10000像素')
      return
    }
    
    onValidationChange?.(true, null)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* 保持宽高比复选框 */}
      <div className="flex items-center justify-center">
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={maintainRatio}
              onChange={(e) => handleMaintainRatioChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            {maintainRatio && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-base text-gray-600">
            Maintain image aspect ratio
          </span>
        </label>
      </div>

      {/* 宽度和高度输入 */}
      <div className="flex items-center justify-center space-x-4">
        
        {/* 宽度输入 */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-sm text-gray-500">Width (PX)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="w-32 px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2720"
            min="1"
            max="10000"
          />
        </div>

        {/* X 分隔符 */}
        <div className="text-2xl text-gray-400 font-bold pt-6">
          ×
        </div>

        {/* 高度输入 */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-sm text-gray-500">Height (PX)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-32 px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2040"
            min="1"
            max="10000"
          />
        </div>
      </div>

      {/* 输出格式选择器 */}
      <div className="flex justify-center">
        <OutputFormatSelector
          selectedFormat={currentOutputFormat.id}
          onFormatChange={onOutputFormatChange}
        />
      </div>
    </div>
  )
}