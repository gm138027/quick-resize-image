/**
 * Increase Image Size 功能的用户交互组件
 * 支持KB/MB单位选择和完整的分辨率控制
 * 完全复用Resize to KB的分辨率控制逻辑
 */
export default function IncreaseImageSizeInteractionComponent({
  currentValue,
  currentSizeUnit = 'kb', // 'kb' 或 'mb' - 新增大小单位
  currentResolutionMode = 'auto', // 'auto' 或 'fixed'
  currentWidth,
  currentHeight,
  currentUnit = 'px', // 'px', 'cm', 'mm', 'inch'
  onValueChange,
  onSizeUnitChange, // 新增大小单位变化回调
  onResolutionModeChange,
  onDimensionsChange,
  onUnitChange,
  onValidationChange,
  className = ""
}) {

  // 处理目标大小输入变化
  const handleSizeInputChange = (value) => {
    const numValue = parseFloat(value) || 0
    onValueChange(numValue)

    // 根据单位验证输入值
    const maxValue = currentSizeUnit === 'mb' ? 100 : 100000 // MB最大100，KB最大100000
    const unitText = currentSizeUnit.toUpperCase()
    const isValid = numValue > 0 && numValue <= maxValue
    onValidationChange?.(isValid, isValid ? null : `Please enter a valid ${unitText} value (1-${maxValue})`)
  }

  // 处理大小单位变化
  const handleSizeUnitChange = (unit) => {
    // 如果有当前值，需要进行单位转换
    if (currentValue && currentSizeUnit !== unit) {
      let convertedValue
      if (currentSizeUnit === 'kb' && unit === 'mb') {
        // KB转MB
        convertedValue = (currentValue / 1024).toFixed(1)
      } else if (currentSizeUnit === 'mb' && unit === 'kb') {
        // MB转KB
        convertedValue = (currentValue * 1024).toFixed(0)
      } else {
        convertedValue = currentValue
      }
      onValueChange(parseFloat(convertedValue))
    }
    onSizeUnitChange?.(unit)
  }

  // 处理分辨率模式变化
  const handleResolutionModeChange = (mode) => {
    onResolutionModeChange?.(mode)
  }

  // 处理宽度变化
  const handleWidthChange = (value) => {
    const numValue = parseFloat(value) || 0
    onDimensionsChange?.({ width: numValue, height: currentHeight })
  }

  // 处理高度变化
  const handleHeightChange = (value) => {
    const numValue = parseFloat(value) || 0
    onDimensionsChange?.({ width: currentWidth, height: numValue })
  }

  // 处理单位变化
  const handleUnitChange = (unit) => {
    // 如果有当前值，需要进行单位转换
    if (currentWidth && currentHeight && currentUnit !== unit) {
      const convertedDimensions = convertBetweenUnits(
        currentWidth,
        currentHeight,
        currentUnit,
        unit
      )
      onDimensionsChange?.(convertedDimensions)
    }
    onUnitChange?.(unit)
  }

  // 单位转换函数 - 使用统一的200 DPI
  const convertBetweenUnits = (width, height, fromUnit, toUnit) => {
    const DPI = 200 // 使用统一的200 DPI

    // 先转换为像素
    let pixelWidth, pixelHeight
    switch (fromUnit) {
      case 'cm':
        pixelWidth = width * DPI / 2.54
        pixelHeight = height * DPI / 2.54
        break
      case 'mm':
        pixelWidth = width * DPI / 25.4
        pixelHeight = height * DPI / 25.4
        break
      case 'inch':
        pixelWidth = width * DPI
        pixelHeight = height * DPI
        break
      case 'px':
      default:
        pixelWidth = width
        pixelHeight = height
        break
    }

    // 再从像素转换为目标单位
    let targetWidth, targetHeight
    switch (toUnit) {
      case 'cm':
        targetWidth = parseFloat((pixelWidth * 2.54 / DPI).toFixed(2))
        targetHeight = parseFloat((pixelHeight * 2.54 / DPI).toFixed(2))
        break
      case 'mm':
        targetWidth = parseFloat((pixelWidth * 25.4 / DPI).toFixed(1))
        targetHeight = parseFloat((pixelHeight * 25.4 / DPI).toFixed(1))
        break
      case 'inch':
        targetWidth = parseFloat((pixelWidth / DPI).toFixed(3))
        targetHeight = parseFloat((pixelHeight / DPI).toFixed(3))
        break
      case 'px':
      default:
        targetWidth = Math.round(pixelWidth)
        targetHeight = Math.round(pixelHeight)
        break
    }

    return { width: targetWidth, height: targetHeight }
  }

  // 获取单位显示文本
  const getUnitDisplayText = () => {
    switch (currentUnit) {
      case 'px': return 'PX'
      case 'cm': return 'CM'
      case 'mm': return 'MM'
      case 'inch': return 'INCH'
      default: return 'PX'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 目标大小输入 - 支持KB/MB单位选择 */}
      <div className="flex items-center justify-center space-x-4">
        <label className="text-lg font-medium text-gray-700">Size</label>
        <div className="flex items-center">
          <input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleSizeInputChange(e.target.value)}
            className="w-32 px-3 py-1.5 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-l"
            step={currentSizeUnit === 'mb' ? '0.1' : '1'}
            min="0.1"
            max={currentSizeUnit === 'mb' ? '100' : '100000'}
            placeholder={currentSizeUnit === 'mb' ? '1.0' : '1000'}
          />
          {/* KB/MB单位选择器 */}
          <select
            value={currentSizeUnit}
            onChange={(e) => handleSizeUnitChange(e.target.value)}
            className="bg-blue-500 text-white px-3 py-2 text-lg font-medium border-l-0 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="kb">KB</option>
            <option value="mb">MB</option>
          </select>
        </div>
      </div>

      {/* 图像分辨率控制 */}
      <div className="space-y-4">
        <div className="text-center">
          <label className="text-sm font-medium text-gray-600">Image Resolution:</label>
        </div>

        {/* 分辨率模式选择 */}
        <div className="flex items-center justify-center space-x-8">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="resolutionMode"
              value="auto"
              checked={currentResolutionMode === 'auto'}
              onChange={(e) => handleResolutionModeChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto resolution</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="resolutionMode"
              value="fixed"
              checked={currentResolutionMode === 'fixed'}
              onChange={(e) => handleResolutionModeChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Fixed resolution</span>
          </label>
        </div>

        {/* 固定分辨率输入区域 */}
        {currentResolutionMode === 'fixed' && (
          <div className="flex items-center justify-center space-x-4">
            {/* 宽度输入 */}
            <div className="flex flex-col items-center space-y-1">
              <label className="text-xs text-gray-500">Width ({getUnitDisplayText()})</label>
              <input
                type="number"
                value={currentWidth || ''}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-24 px-2 py-1.5 text-center text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1920"
                min="1"
              />
            </div>

            {/* X 分隔符 */}
            <div className="text-gray-400 font-medium pt-4">×</div>

            {/* 高度输入 */}
            <div className="flex flex-col items-center space-y-1">
              <label className="text-xs text-gray-500">Height ({getUnitDisplayText()})</label>
              <input
                type="number"
                value={currentHeight || ''}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-24 px-2 py-1.5 text-center text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1080"
                min="1"
              />
            </div>

            {/* 单位选择 */}
            <div className="flex flex-col items-center space-y-1">
              <label className="text-xs text-gray-500">unit</label>
              <select
                value={currentUnit}
                onChange={(e) => handleUnitChange(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="px">px</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="inch">inch</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 模式说明 - 针对增大图片的说明 */}
      <div className="text-center">
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          {currentResolutionMode === 'auto'
            ? 'Automatically increases image resolution and quality to achieve larger file size'
            : 'Maintains specified dimensions while increasing quality to reach target file size'
          }
        </p>
      </div>
    </div>
  )
}