import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useTracking } from '../../hooks/useTracking'

/**
 * 下载按钮组件
 * 职责：提供单个文件下载功能，显示下载状态
 */
export default function DownloadButton({
  onDownload,
  fileName,
  disabled = false
}) {
  const { t } = useTranslation('common')
  const tracking = useTracking()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (disabled || isDownloading) return

    setIsDownloading(true)
    try {
      // 追踪下载事件
      tracking.trackImageDownload({
        fileType: fileName?.split('.').pop() || 'unknown',
        fileSizeKB: 0 // 无法获取确切大小，使用0
      })

      await onDownload()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      // 延迟重置状态，给用户视觉反馈
      setTimeout(() => setIsDownloading(false), 1000)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className={`
        w-12 h-12 rounded transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1
        flex items-center justify-center
        ${disabled
          ? 'text-gray-400 cursor-not-allowed'
          : isDownloading
          ? 'text-green-600'
          : 'text-green-500 hover:text-green-600 focus:ring-green-500'
        }
      `}
      title={t('download.downloadFile', { fileName })}
    >
      {isDownloading ? (
        <svg className="w-10 h-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <img
          src="/icons/download .svg"
          alt="Download"
          className="w-10 h-10"
        />
      )}
    </button>
  )
}
