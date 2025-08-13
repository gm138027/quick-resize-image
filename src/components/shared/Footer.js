import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          {/* 品牌信息 */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src="/logo/favicon-32x32.png"
                  alt="Quick Resize Image Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">
                {t('footer.brandName')}
              </span>
            </div>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* 法律链接 */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
              <Link
                href="/privacy-policy"
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                href="/terms-of-service"
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>

            {/* 版权信息 */}
            <p className="text-slate-400 text-sm text-center">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}