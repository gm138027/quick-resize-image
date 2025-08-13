/**
 * 输出格式选择器 - 共享组件
 * 支持保持不变、JPG、PNG、WEBP格式选择
 * 遵循SOLID原则，可复用
 */
import { useTranslation } from 'next-i18next'

export default function OutputFormatSelector({
  selectedFormat = 'original',
  onFormatChange,
  className = ""
}) {
  const { t } = useTranslation('common')

  const formats = [
    { id: 'original', label: t('interface.keepOriginal') || 'Keep Original', mimeType: null },
    { id: 'jpeg', label: 'JPG', mimeType: 'image/jpeg' },
    { id: 'png', label: 'PNG', mimeType: 'image/png' },
    { id: 'webp', label: 'WEBP', mimeType: 'image/webp' }
  ]

  const handleFormatChange = (formatId) => {
    const format = formats.find(f => f.id === formatId)
    onFormatChange?.(format)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-center">
        <label className="text-sm font-medium text-gray-600">
          {t('interface.outputFormat') || 'Output format:'}
        </label>
      </div>
      
      <div className="flex items-center space-x-6">
        {formats.map((format) => (
          <label key={format.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="outputFormat"
              value={format.id}
              checked={selectedFormat === format.id}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 font-medium">
              {format.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}