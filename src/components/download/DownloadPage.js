import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Layout from '../shared/Layout'
import PageHeader from './PageHeader'
import DownloadResultList from './DownloadResultList'

/**
 * 下载页面主组件
 * 职责：管理整个下载页面的状态和布局
 */
export default function DownloadPage({ 
  processedImages = [], 
  onReUpload,
  onDownloadAll 
}) {
  const { t } = useTranslation('common')
  const [images, setImages] = useState(processedImages)

  // 页面标题和描述
  const pageTitle = t('download.pageTitle', 'Download Processed Images')
  const pageDescription = t('download.pageDescription', 'Download your processed images with high quality compression results')

  // 处理单个图片重命名
  const handleRename = (imageId, newName) => {
    setImages(prevImages => 
      prevImages.map(img => 
        img.id === imageId 
          ? { ...img, fileName: newName }
          : img
      )
    )
  }

  // 处理单个图片下载
  const handleDownloadSingle = (imageData) => {
    // 创建下载链接
    const link = document.createElement('a')
    link.href = imageData.dataUrl
    link.download = imageData.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 处理批量下载
  const handleDownloadAll = () => {
    if (onDownloadAll) {
      onDownloadAll(images)
    } else {
      // 默认行为：逐个下载
      images.forEach(image => {
        setTimeout(() => handleDownloadSingle(image), 100)
      })
    }
  }

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader
            onReUpload={onReUpload}
            onDownloadAll={handleDownloadAll}
            hasImages={images.length > 0}
          />

          <DownloadResultList
            images={images}
            onRename={handleRename}
            onDownload={handleDownloadSingle}
          />
        </div>
      </div>
    </Layout>
  )
}