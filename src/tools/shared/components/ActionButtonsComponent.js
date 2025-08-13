/**
 * 共享的操作按钮组件
 * resize image 和 download image 按钮
 * 所有功能都可以使用
 */
import { useTranslation } from 'next-i18next'

export default function ActionButtonsComponent({
  onResizeClick,
  onDownloadClick,
  showDownloadButton = false,
  isProcessing = false,
  className = ""
}) {
  const { t } = useTranslation('common')

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Resize Image 按钮 - 所有功能共享 */}
      <button
        onClick={onResizeClick}
        disabled={isProcessing}
        className={`px-8 py-2 text-lg font-medium transition-colors rounded ${isProcessing
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {isProcessing ? t('common.processing') : t('common.resizeImage')}
      </button>

      {/* Download Image 按钮 - 处理完成后显示 */}
      {showDownloadButton && (
        <button
          onClick={onDownloadClick}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 text-lg font-medium transition-colors rounded"
        >
          {t('common.downloadImage')}
        </button>
      )}
    </div>
  )
}