import { useTranslation } from 'next-i18next'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const { t } = useTranslation('privacy-policy')

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-4xl py-12">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            {t('navigation.backToHome')}
          </Link>
          <p className="text-gray-600 text-sm mt-1">
            {t('navigation.homeDescription')}
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-600">
            {t('lastUpdated')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('introduction.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('introduction.content')}
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('dataCollection.title')}
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('dataCollection.localProcessing.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('dataCollection.localProcessing.content')}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('dataCollection.noPersonalData.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('dataCollection.noPersonalData.content')}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('dataCollection.technicalData.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('dataCollection.technicalData.content')}
              </p>
            </div>
          </section>

          {/* Data Usage */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('dataUsage.title')}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {t('dataUsage.purposes', { returnObjects: true }).map((purpose, index) => (
                <li key={index} className="leading-relaxed">{purpose}</li>
              ))}
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('dataSharing.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('dataSharing.content')}
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('cookies.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('cookies.content')}
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('dataSecurity.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('dataSecurity.content')}
            </p>
          </section>

          {/* Third Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('thirdPartyServices.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('thirdPartyServices.content')}
            </p>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('userRights.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('userRights.content')}
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('childrenPrivacy.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('childrenPrivacy.content')}
            </p>
          </section>

          {/* Policy Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('policyChanges.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('policyChanges.content')}
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              {t('contact.content')}
            </p>
            <p className="text-blue-600 font-medium">
              {t('contact.email')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
