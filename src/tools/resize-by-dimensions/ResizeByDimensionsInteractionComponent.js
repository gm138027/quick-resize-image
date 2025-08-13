/**
 * 按物理尺寸调整交互组件
 * 严格按照用户设计的界面实现 - 完全匹配设计图
 */
import { useState, useEffect } from 'react'

export default function ResizeByDimensionsInteractionComponent({
  params,
  onParamsChange,
  onValidationChange,
  imageData
}) {
  const [localParams, setLocalParams] = useState({
    width: '',
    height: '',
    unit: 'cm',
    enableCompression: false,
    targetKB: '',
    outputFormat: 'jpeg',
    dpi: 200,
    ...params
  })

  // 单位转换函数
  const convertFromPixels = (pixels, unit, dpi = 200) => {
    switch (unit) {
      case 'cm':
        return ((pixels * 2.54) / dpi).toFixed(1)
      case 'mm':
        return ((pixels * 25.4) / dpi).toFixed(0)
      case 'inch':
        return (pixels / dpi).toFixed(2)
      default:
        return pixels.toFixed(0)
    }
  }

  // 单位转换 - 当用户切换单位时，转换现有数值
  const convertBetweenUnits = (value, fromUnit, toUnit, dpi = 200) => {
    if (!value || fromUnit === toUnit) return value

    // 先转换为像素
    let pixels = 0
    switch (fromUnit) {
      case 'cm':
        pixels = (parseFloat(value) * dpi) / 2.54
        break
      case 'mm':
        pixels = (parseFloat(value) * dpi) / 25.4
        break
      case 'inch':
        pixels = parseFloat(value) * dpi
        break
    }

    // 再转换为目标单位
    return convertFromPixels(pixels, toUnit, dpi)
  }

  // 处理参数变化
  const handleParamChange = (key, value) => {
    let newParams = { ...localParams, [key]: value }

    // 如果是单位变化，需要转换现有的宽度和高度数值
    if (key === 'unit' && localParams.width && localParams.height) {
      const newWidth = convertBetweenUnits(localParams.width, localParams.unit, value)
      const newHeight = convertBetweenUnits(localParams.height, localParams.unit, value)

      newParams = {
        ...newParams,
        width: newWidth,
        height: newHeight
      }
    }

    setLocalParams(newParams)
    onParamsChange(newParams)
    validateInput(newParams)
  }

  // 初始化和更新图片物理尺寸
  useEffect(() => {
    if (imageData && imageData.width && imageData.height) {
      // 使用统一的200 DPI计算物理尺寸
      const dpi = 200
      const widthInCurrentUnit = convertFromPixels(imageData.width, localParams.unit, dpi)
      const heightInCurrentUnit = convertFromPixels(imageData.height, localParams.unit, dpi)

      const newParams = {
        ...localParams,
        width: widthInCurrentUnit,
        height: heightInCurrentUnit
      }

      setLocalParams(newParams)
      onParamsChange(newParams)
      validateInput(newParams)

      console.log(`📐 图片物理尺寸已更新: ${widthInCurrentUnit}x${heightInCurrentUnit} ${localParams.unit.toUpperCase()}`)
    }
  }, [imageData, localParams.unit]) // 依赖imageData和unit变化

  // 验证输入
  const validateInput = (params) => {
    if (!params.width || !params.height) {
      onValidationChange(false, '请输入宽度和高度')
      return
    }

    const width = parseFloat(params.width)
    const height = parseFloat(params.height)

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      onValidationChange(false, '宽度和高度必须是正数')
      return
    }

    if (params.enableCompression) {
      if (!params.targetKB) {
        onValidationChange(false, '请输入目标文件大小')
        return
      }
      const targetKB = parseFloat(params.targetKB)
      if (isNaN(targetKB) || targetKB <= 0) {
        onValidationChange(false, '目标文件大小必须是正数')
        return
      }
    }

    onValidationChange(true, '')
  }

  return (
    <div className="space-y-6">
      {/* 第一行：Width (CM) × Height (CM) unit - 单位标签动态更新 */}
      <div className="flex items-end justify-center space-x-4">
        {/* Width - 动态单位标签 */}
        <div className="text-center">
          <label className="block text-sm text-gray-500 mb-2">
            Width ({localParams.unit.toUpperCase()})
          </label>
          <input
            type="number"
            value={localParams.width}
            onChange={(e) => handleParamChange('width', e.target.value)}
            className="w-40 h-10 px-3 border-2 border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
            step="0.1"
            min="0"
          />
        </div>

        {/* × 分隔符 */}
        <div className="pb-1">
          <span className="text-2xl font-bold text-gray-400">×</span>
        </div>

        {/* Height - 动态单位标签 */}
        <div className="text-center">
          <label className="block text-sm text-gray-500 mb-2">
            Height ({localParams.unit.toUpperCase()})
          </label>
          <input
            type="number"
            value={localParams.height}
            onChange={(e) => handleParamChange('height', e.target.value)}
            className="w-40 h-10 px-3 border-2 border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
            step="0.1"
            min="0"
          />
        </div>

        {/* unit */}
        <div className="text-center">
          <label className="block text-sm text-gray-500 mb-2">unit</label>
          <select
            value={localParams.unit}
            onChange={(e) => handleParamChange('unit', e.target.value)}
            className="w-20 h-10 px-2 border-2 border-gray-300 rounded bg-white text-center focus:outline-none focus:border-blue-500"
          >
            <option value="cm">CM</option>
            <option value="mm">MM</option>
            <option value="inch">INCH</option>
          </select>
        </div>
      </div>

      {/* 第二行：压缩选项 */}
      <div className="flex items-center justify-center space-x-3">
        <input
          type="checkbox"
          id="enableCompression"
          checked={localParams.enableCompression}
          onChange={(e) => handleParamChange('enableCompression', e.target.checked)}
          className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="enableCompression" className="text-gray-500">
          Compress image to a specified size (e.g., 20KB)
        </label>
      </div>

      {/* 第三行：Size输入框 - 只有勾选压缩时才显示 */}
      {localParams.enableCompression && (
        <div className="flex items-center justify-center space-x-3">
          <span className="text-lg font-medium text-gray-700">Size</span>
          <div className="flex">
            <input
              type="number"
              value={localParams.targetKB}
              onChange={(e) => handleParamChange('targetKB', e.target.value)}
              className="w-40 h-10 px-3 border-2 border-gray-300 border-r-0 rounded-l text-center focus:outline-none focus:border-blue-500"
              step="1"
              min="1"
            />
            <div className="h-10 px-4 bg-blue-500 text-white font-medium rounded-r flex items-center">
              KB
            </div>
          </div>
        </div>
      )}

      {/* 第四行：输出格式 */}
      <div className="flex items-center justify-center space-x-6">
        <span className="text-gray-500">Output format:</span>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="outputFormat"
            value="jpeg"
            checked={localParams.outputFormat === 'jpeg'}
            onChange={(e) => handleParamChange('outputFormat', e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">JPG</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="outputFormat"
            value="png"
            checked={localParams.outputFormat === 'png'}
            onChange={(e) => handleParamChange('outputFormat', e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">PNG</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="outputFormat"
            value="webp"
            checked={localParams.outputFormat === 'webp'}
            onChange={(e) => handleParamChange('outputFormat', e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">WEBP</span>
        </label>
      </div>
    </div>
  )
}