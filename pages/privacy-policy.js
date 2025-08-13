import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Layout from '../src/components/shared/Layout'
import PrivacyPolicy from '../src/components/legal/PrivacyPolicy'

export default function PrivacyPolicyPage() {
  const router = useRouter()
  const { t } = useTranslation('privacy-policy')
  const { locale, locales, defaultLocale } = router

  // 构建当前页面URL
  const baseUrl = 'https://quickresizeimage.com'
  const currentUrl = locale === defaultLocale
    ? `${baseUrl}/privacy-policy`
    : `${baseUrl}/${locale}/privacy-policy`

  return (
    <>
      <Head>
        <title>{t('title')} - Quick Resize Image</title>
        <meta
          name="description"
          content="Privacy Policy for Quick Resize Image. Learn how we protect your privacy and handle your data when using our free online image resizing tool."
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
            ? `${baseUrl}/privacy-policy`
            : `${baseUrl}/${loc}/privacy-policy`
          return (
            <link
              key={loc}
              rel="alternate"
              hrefLang={loc}
              href={hrefUrl}
            />
          )
        })}
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/privacy-policy`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${t('title')} - Quick Resize Image`} />
        <meta property="og:description" content="Privacy Policy for Quick Resize Image. Learn how we protect your privacy and handle your data when using our free online image resizing tool." />
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
        <meta name="twitter:title" content={`${t('title')} - Quick Resize Image`} />
        <meta name="twitter:description" content="Privacy Policy for Quick Resize Image. Learn how we protect your privacy and handle your data when using our free online image resizing tool." />
        <meta name="twitter:image" content={`${baseUrl}/logo/android-chrome-512x512.png`} />
        <meta name="twitter:image:alt" content="Quick Resize Image - Privacy Policy" />

        {/* Robots meta */}
        <meta name="robots" content="index, follow" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": t('title'),
              "description": t('description'),
              "url": currentUrl,
              "inLanguage": locale === 'hi' ? 'hi' : 'en',
              "isPartOf": {
                "@type": "WebSite",
                "name": "Quick Resize Image",
                "url": "https://quickresizeimage.com"
              },
              "about": {
                "@type": "Thing",
                "name": "Privacy Policy",
                "description": "Privacy policy for Quick Resize Image online tool"
              },
              "dateModified": "2025-08-13",
              "datePublished": "2024-01-01"
            })
          }}
        />

        {/* BreadcrumbList Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": locale === defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}`
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": t('title'),
                  "item": currentUrl
                }
              ]
            })
          }}
        />
      </Head>

      <Layout>
        <PrivacyPolicy />
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'privacy-policy'])),
    },
  }
}
