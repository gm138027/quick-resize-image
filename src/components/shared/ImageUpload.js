import { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useTracking } from '../../hooks/useTracking'

/**
 * 独立的图片上传组件
 * 支持单张和多张图片上传，最多10张
 */
export default function ImageUpload({ onImageUpload, onMultipleImageUpload, onUploadError, currentImageCount = 0, className = "" }) {
  const { t } = useTranslation('common')
  const tracking = useTracking()
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const MAX_IMAGES = 10

  const handleFileSelect = (files) => {
    const fileArray = Array.isArray(files) ? files : [files]
    
    // 支持的图片格式（包括HEIC、BMP、GIF）
    const supportedFormats = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'image/bmp', 'image/gif', 'image/heic', 'image/heif'
    ]
    
    const imageFiles = fileArray.filter(file => {
      if (!file) return false
      
      // 检查MIME类型
      if (supportedFormats.includes(file.type.toLowerCase())) {
        return true
      }
      
      // 检查文件扩展名（用于HEIC等可能没有正确MIME类型的文件）
      const fileName = file.name.toLowerCase()
      const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.heic', '.heif']
      return supportedExtensions.some(ext => fileName.endsWith(ext))
    })

    if (imageFiles.length === 0) {
      onUploadError?.(t('error.unsupportedFormat'))
      return
    }

    // 检查是否超出最大图片数量限制
    const totalImages = currentImageCount + imageFiles.length
    if (totalImages > MAX_IMAGES) {
      const allowedCount = MAX_IMAGES - currentImageCount
      onUploadError?.(t('error.tooManyImages', { max: MAX_IMAGES, current: currentImageCount, allowed: allowedCount }))
      return
    }

    // 追踪上传事件
    if (imageFiles.length > 1) {
      // 批量上传追踪
      const totalSizeKB = imageFiles.reduce((sum, file) => sum + (file.size / 1024), 0)
      tracking.trackBatchUpload(imageFiles.length, totalSizeKB)
    } else if (imageFiles.length === 1) {
      // 单张上传追踪
      const file = imageFiles[0]
      tracking.trackImageUpload({
        fileType: file.type?.split('/')[1] || 'unknown',
        fileSizeKB: Math.round(file.size / 1024)
      })
    }

    // 如果有多张图片上传回调，使用它；否则逐个调用单张上传回调
    if (onMultipleImageUpload && imageFiles.length > 1) {
      onMultipleImageUpload(imageFiles)
    } else {
      // 逐个上传图片
      imageFiles.forEach(file => onImageUpload(file))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    handleFileSelect(files)
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          image-container-border rounded-lg p-8 text-center cursor-pointer h-64 mx-auto
          transition-colors duration-200 bg-white flex items-center justify-center
          ${isDragOver ? 'bg-blue-50' : ''}
        `}
        style={{ maxWidth: '896px' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center space-y-3">
          {/* Select Images Button - 直角设计，更突出 */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-base font-medium transition-colors">
            {t('upload.selectImages')}
          </button>
          
          {/* Instructions - 紧凑排列 */}
          <div className="space-y-1">
            <p className="text-gray-600 text-sm">
              {t('upload.subtitle')}
            </p>
            <p className="text-gray-500 text-sm">
              {t('upload.supportedFormats')}
            </p>
            <p className="text-gray-500 text-sm">
              {t('upload.batchUploadInfo')}
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}