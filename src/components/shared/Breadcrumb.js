/**
 * 面包屑导航组件
 * 提供页面导航路径，有利于SEO和用户体验
 */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export default function Breadcrumb({ customItems = [] }) {
  const router = useRouter()
  const { t } = useTranslation('common')
  
  // 如果是首页，不显示面包屑
  if (router.pathname === '/') {
    return null
  }
  
  // 构建面包屑项目
  const breadcrumbItems = [
    {
      label: t('breadcrumb.home'),
      href: '/',
      isHome: true
    },
    ...customItems
  ]
  
  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 py-3">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg 
                  className="w-4 h-4 text-gray-400 mx-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              
              {index === breadcrumbItems.length - 1 ? (
                // 当前页面，不可点击
                <span className="text-gray-600 font-medium">
                  {item.label}
                </span>
              ) : (
                // 可点击的链接
                <Link 
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
