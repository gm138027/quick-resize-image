import { useRouter } from 'next/router'
import { useState } from 'react'

export default function LanguageSelector() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ]

  const currentLanguage = languages.find(lang => lang.code === router.locale)

  const handleLanguageChange = (locale) => {
    // 使用 router.pathname 而不是 router.asPath 来避免保留查询参数
    // 这确保语言切换时生成规范的URL，不带查询参数
    router.push(router.pathname, router.pathname, { locale })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
      >
        <span className="text-sm">{currentLanguage?.flag}</span>
        <span className="font-medium text-sm hidden sm:block">{currentLanguage?.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg border border-slate-200 min-w-[140px] overflow-hidden z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200
                ${router.locale === language.code ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'}`}
            >
              <span className="text-sm">{language.flag}</span>
              <span className="font-medium text-sm">{language.name}</span>
              {router.locale === language.code && (
                <svg className="w-4 h-4 text-emerald-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}