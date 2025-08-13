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

        {/* SEO Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

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