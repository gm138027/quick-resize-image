/**
 * Resize to KB 功能的用户交互组件
 * 支持目标大小设置和分辨率控制选择
 */
import { useTranslation } from 'next-i18next'
import OutputFormatSelector from '../shared/components/OutputFormatSelector'
import { trackImageProcessing } from '../../utils/analytics'

export default function ResizeToKBInteractionComponent({
  currentValue,
  currentResolutionMode = 'auto', // 'auto' 或 'fixed'
  currentWidth,
  currentHeight,
  currentUnit = 'px', // 'px', 'cm', 'mm', 'inch'
  currentOutputFormat = 'original', // 输出格式
  onValueChange,
  onResolutionModeChange,
  onDimensionsChange,
  onUnitChange,
  onOutputFormatChange,
  onValidationChange,
  className = ""
}) {
  const { t } = useTranslation('common')

  // 处理目标大小输入变化
  const handleSizeInputChange = (value) => {
    const numValue = parseFloat(value) || 0
    onValueChange(numValue)

    // 验证输入值
    const isValid = numValue > 0 && numValue <= 50000 // 最大50MB
    onValidationChange?.(isValid, isValid ? null : t('errors.invalidKBValue', { min: 1, max: 50000 }))
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

  // 单位转换函数
  const convertBetweenUnits = (width, height, fromUnit, toUnit) => {
    const DPI = 72 // 默认DPI

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
    <div className={`space-y-4 ${className}`}>
      {/* 目标大小输入 */}
      <div className="flex items-center justify-center space-x-4">
        <label className="text-lg font-medium text-gray-700">{t('interface.size')}</label>
        <div className="flex items-center">
          <input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleSizeInputChange(e.target.value)}
            className="w-32 px-3 py-0.5 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-gray-300"
            step="0.1"
            autoFocus={false}
            min="0.1"
            max="50000"
            placeholder="100"
          />
          <div className="bg-blue-500 text-white px-3 py-1.5 text-lg font-medium -ml-px">
            KB
          </div>
        </div>
      </div>

      {/* 图像分辨率控制 */}
      <div className="space-y-2">
        <div className="text-center">
          <label className="text-sm font-medium text-gray-600">{t('interface.imageResolution')}</label>
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
            <span className="text-sm text-gray-700">{t('interface.autoResolution')}</span>
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
            <span className="text-sm text-gray-700">{t('interface.fixedResolution')}</span>
          </label>
        </div>

        {/* 固定分辨率输入区域 */}
        {currentResolutionMode === 'fixed' && (
          <div className="flex items-center justify-center space-x-4">
            {/* 宽度输入 */}
            <div className="flex flex-col items-center space-y-1">
              <label className="text-xs text-gray-500">{t('interface.width')} ({getUnitDisplayText()})</label>
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
              <label className="text-xs text-gray-500">{t('interface.height')} ({getUnitDisplayText()})</label>
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
              <label className="text-xs text-gray-500">{t('interface.unit')}</label>
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

      {/* 模式说明 */}
      <div className="text-center">
        <p className="text-xs text-gray-500 max-w-md mx-auto whitespace-nowrap">
          {currentResolutionMode === 'auto'
            ? t('descriptions.autoResolution')
            : t('descriptions.fixedResolution')
          }
        </p>
      </div>

      {/* 输出格式选择 */}
      <div className="space-y-2">
        <div className="text-center">
          <label className="text-sm font-medium text-gray-600">
            {t('interface.outputFormat') || 'Output format:'}
          </label>
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          {[
            { id: 'original', label: t('interface.keepOriginal') || 'Keep Original' },
            { id: 'jpeg', label: 'JPG' },
            { id: 'png', label: 'PNG' },
            { id: 'webp', label: 'WEBP' }
          ].map((format) => (
            <label key={format.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="outputFormat"
                value={format.id}
                checked={currentOutputFormat === format.id}
                onChange={(e) => {
                  const selectedFormat = { id: e.target.value, label: format.label }
                  onOutputFormatChange?.(selectedFormat)
                }}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 font-medium">
                {format.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}