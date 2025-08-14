import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import Navigation from './Navigation'
import Footer from './Footer'
import { ImageManagerProvider } from '../../tools/shared/contexts/ImageManagerContext'

export default function Layout({ children, title, description }) {
  const { t } = useTranslation('common')
  
  const pageTitle = title || t('site.title')
  const pageDescription = description || t('site.description')

  return (
    <ImageManagerProvider>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 基础SEO Meta标签 */}
        <meta name="keywords" content="image resize, compress image, reduce file size, image optimization, KB resize, JPEG PNG WebP" />
        <meta name="author" content="Quick Resize Image" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />

        {/* Open Graph Meta标签 */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://quickresizeimage.com" />
        <meta property="og:image" content="https://quickresizeimage.com/logo/android-chrome-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:site_name" content="Quick Resize Image" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta标签 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://quickresizeimage.com/logo/android-chrome-512x512.png" />

        {/* 移动端优化 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Quick Resize Image" />

        {/* 性能优化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t('site.name'),
              "applicationCategory": "PhotographyApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ImageManagerProvider>
  )
}