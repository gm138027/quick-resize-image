import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../src/components/shared/Layout'
import SEOHomePage from '../src/components/SEOHomePage'

export default function Home() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { locale, locales, defaultLocale } = router

  // 构建当前页面的完整URL
  const baseUrl = 'https://quickresizeimage.com'
  const currentUrl = locale === defaultLocale
    ? `${baseUrl}/`
    : `${baseUrl}/${locale}`

  return (
    <>
      <Head>
        <title>{t('site.title')}</title>
        <meta
          name="description"
          content={t('site.description')}
        />
        <meta
          name="keywords"
          content="compress image to 50kb, resize image to 20kb, image compressor to 50kb, image compressor to 20kb, compress image online, resize image kb"
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
            ? `${baseUrl}/`
            : `${baseUrl}/${loc}`
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
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/`} />
        <link rel="alternate" hrefLang="hi" href={`${baseUrl}/hi`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />

        {/* Open Graph */}
        <meta property="og:title" content={t('site.title')} />
        <meta property="og:description" content={t('site.description')} />
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
        <meta name="twitter:title" content={t('site.title')} />
        <meta name="twitter:description" content={t('site.description')} />
        <meta name="twitter:image" content={`${baseUrl}/logo/android-chrome-512x512.png`} />
        <meta name="twitter:image:alt" content="Quick Resize Image - Online Image Resizer Tool" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "QuickResizeImage - Image Resizer",
              "description": t('site.description'),
              "url": currentUrl,
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript",
              "softwareVersion": "1.0",
              "datePublished": "2024-01-01",
              "dateModified": "2025-08-13",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "Resize image to 20KB",
                "Compress image to 50KB",
                "Resize image to any KB size",
                "High quality processing",
                "Privacy protection - no upload required",
                "Support JPG, PNG, WebP, HEIC, BMP, GIF formats"
              ]
            })
          }}
        />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Quick Resize Image",
              "url": "https://quickresizeimage.com",
              "logo": "https://quickresizeimage.com/logo/android-chrome-512x512.png",
              "description": t('site.description'),
              "foundingDate": "2024",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              }
            })
          }}
        />

        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Quick Resize Image",
              "url": "https://quickresizeimage.com",
              "description": t('site.description'),
              "inLanguage": [
                {
                  "@type": "Language",
                  "name": "English",
                  "alternateName": "en"
                },
                {
                  "@type": "Language",
                  "name": "Hindi",
                  "alternateName": "hi"
                }
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://quickresizeimage.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": t('hero.faq.q1.question'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('hero.faq.q1.answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('hero.faq.q2.question'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('hero.faq.q2.answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('hero.faq.q3.question'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('hero.faq.q3.answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('hero.faq.q4.question'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('hero.faq.q4.answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('hero.faq.q5.question'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('hero.faq.q5.answer')
                  }
                }
              ]
            })
          }}
        />
      </Head>

      <Layout>
        <SEOHomePage />
      </Layout>
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