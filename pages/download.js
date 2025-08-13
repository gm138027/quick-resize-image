import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { DownloadPage } from '../src/components/download'

/**
 * 下载页面路由
 * 显示处理后的图片结果
 */
export default function Download() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { locale, locales, defaultLocale } = router
  const [processedImages, setProcessedImages] = useState([])

  // 构建当前页面的完整URL
  const baseUrl = 'https://quickresizeimage.com'
  const currentUrl = locale === defaultLocale
    ? `${baseUrl}/download`
    : `${baseUrl}/${locale}/download`

  useEffect(() => {
    // 检查已处理的图片数据
    const storedImages = sessionStorage.getItem('processedImages')
    
    if (storedImages) {
      try {
        const images = JSON.parse(storedImages)
        setProcessedImages(images)
      } catch (error) {
        console.error('Failed to parse processed images:', error)
        router.push('/')
      }
    } else {
      console.log('No processed images found, redirecting to home')
      router.push('/')
    }
  }, [router])

  const handleReUpload = () => {
    // 清除存储的数据并返回首页
    sessionStorage.removeItem('processedImages')
    router.push('/')
  }

  const handleDownloadAll = (images) => {
    // 批量下载所有图片
    images.forEach((image, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = image.dataUrl
        link.download = image.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 200) // 每个下载间隔200ms
    })
  }

  // 如果没有图片数据，立即重定向
  if (processedImages.length === 0) {
    return null // 不显示任何内容，直接重定向
  }

  return (
    <>
      <Head>
        <title>{t('download.pageTitle')}</title>
        <meta
          name="description"
          content={t('download.pageDescription')}
        />

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/logo/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo/apple-touch-icon.png" />
        <link rel="manifest" href="/logo/site.webmanifest" />

        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/logo/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo/android-chrome-512x512.png" />

        {/* Hreflang tags */}
        {locales && locales.map((loc) => {
          const hrefUrl = loc === defaultLocale
            ? `${baseUrl}/download`
            : `${baseUrl}/${loc}/download`
          return (
            <link
              key={loc}
              rel="alternate"
              hrefLang={loc}
              href={hrefUrl}
            />
          )
        })}
        {/* Ensure all languages are always included */}
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/download`} />
        <link rel="alternate" hrefLang="hi" href={`${baseUrl}/hi/download`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/download`} />

        {/* Open Graph */}
        <meta property="og:title" content={t('download.pageTitle')} />
        <meta property="og:description" content={t('download.pageDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={`${baseUrl}/logo/android-chrome-512x512.png`} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:locale" content={locale === 'hi' ? 'hi_IN' : 'en_US'} />
        {locales.filter(loc => loc !== locale).map((loc) => (
          <meta
            key={loc}
            property="og:locale:alternate"
            content={loc === 'hi' ? 'hi_IN' : 'en_US'}
          />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('download.pageTitle')} />
        <meta name="twitter:description" content={t('download.pageDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/logo/android-chrome-512x512.png`} />
        <meta name="twitter:image:alt" content="Quick Resize Image - Download Processed Images" />

        {/* Robots meta - prevent indexing of download pages */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DownloadPage
        processedImages={processedImages}
        onReUpload={handleReUpload}
        onDownloadAll={handleDownloadAll}
      />
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}