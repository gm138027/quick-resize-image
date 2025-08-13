import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from './LanguageSelector'
import useInterfaceMode from '../../tools/shared/hooks/useInterfaceMode'

export default function Navigation() {
  const { t } = useTranslation('common')
  const interfaceMode = useInterfaceMode()

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo和品牌名 */}
          <Link
            href="/"
            className="flex items-center space-x-3"
            onClick={(e) => {
              // 如果在工具模式，重置到SEO模式而不是跳转页面
              if (interfaceMode.isToolMode) {
                e.preventDefault()
                interfaceMode.resetToSEOMode()
              }
            }}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/logo/favicon-32x32.png"
                alt="Quick Resize Image Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-slate-800">
              {t('navigation.brandName')}
            </span>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              onClick={(e) => {
                // 如果在工具模式，重置到SEO模式而不是跳转页面
                if (interfaceMode.isToolMode) {
                  e.preventDefault()
                  interfaceMode.resetToSEOMode()
                }
              }}
            >
              {t('navigation.home')}
            </Link>
            <button
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              onClick={() => interfaceMode.navigateToSection('how-to-use')}
            >
              {t('navigation.howToUse')}
            </button>
            <button
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              onClick={() => interfaceMode.navigateToSection('popular-sizes')}
            >
              {t('navigation.popularSizes')}
            </button>
            <button
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              onClick={() => interfaceMode.navigateToSection('faq')}
            >
              {t('navigation.faq')}
            </button>
          </div>

          {/* 语言选择器 */}
          <div className="relative">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  )
}