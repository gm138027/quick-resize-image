import { useTranslation } from 'next-i18next'
import Link from 'next/link'

export default function TermsOfService() {
  const { t } = useTranslation('terms-of-service')

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

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('serviceDescription.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('serviceDescription.content')}
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('acceptableUse.title')}
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('acceptableUse.permitted.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                {t('acceptableUse.permitted.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {t('acceptableUse.permitted.list', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('acceptableUse.prohibited.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                {t('acceptableUse.prohibited.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {t('acceptableUse.prohibited.list', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('intellectualProperty.title')}
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('intellectualProperty.ourRights.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('intellectualProperty.ourRights.content')}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('intellectualProperty.userContent.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('intellectualProperty.userContent.content')}
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('disclaimer.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('disclaimer.content')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('limitationOfLiability.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('limitationOfLiability.content')}
            </p>
          </section>

          {/* Service Availability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('serviceAvailability.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('serviceAvailability.content')}
            </p>
          </section>

          {/* Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('privacy.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.content')}
            </p>
          </section>

          {/* Modifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('modifications.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('modifications.content')}
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('termination.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termination.content')}
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('governingLaw.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('governingLaw.content')}
            </p>
          </section>

          {/* Severability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('severability.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('severability.content')}
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
