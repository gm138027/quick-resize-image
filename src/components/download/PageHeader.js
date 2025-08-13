import { useTranslation } from 'next-i18next'

/**
 * 下载页面头部组件
 * 职责：提供重新上传和批量下载功能
 */
export default function PageHeader({ 
  onReUpload, 
  onDownloadAll, 
  hasImages = false 
}) {
  const { t } = useTranslation('common')

  return (
    <div className="flex justify-end gap-3 mb-6">
      <button
        onClick={onReUpload}
        className="
          px-4 py-2 bg-blue-500 text-white font-medium rounded-lg text-sm
          hover:bg-blue-600 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        "
      >
        {t('download.reUploadImage', 'Re-upload image')}
      </button>

      <button
        onClick={onDownloadAll}
        disabled={!hasImages}
        className={`
          px-4 py-2 font-medium rounded-lg text-sm transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${hasImages
            ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {t('download.downloadAll', 'Download all')}
      </button>
    </div>
  )
}
