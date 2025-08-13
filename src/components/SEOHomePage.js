/**
 * SEO优化的首页组件
 * 展示完整的SEO文案内容，包含ResizeToKB功能
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import ResizeToKBInterface from '../tools/resize-to-kb/ResizeToKBInterface'
import { useImageManagerContext } from '../tools/shared/contexts/ImageManagerContext'

function SEOHomePageContent() {
    const { t } = useTranslation('common')
    const imageManager = useImageManagerContext()

    // 处理预设KB值点击
    const handlePresetClick = (kbValue) => {
        imageManager.setPreset(kbValue)
        window.scrollTo(0, 0)
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with SEO Content */}
            <div className="container mx-auto px-6 max-w-6xl py-12">

                {/* H1 Title and Main Description - 只在没有图片且没有预设时显示 */}
                {!imageManager.hasImages && !imageManager.hasPreset && (
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {t('hero.title')}
                        </h1>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {t('hero.subtitle')}
                        </p>
                    </div>
                )}

                {/* Main Tool Interface */}
                <ResizeToKBInterface />

                {/* SEO Content - 锚点区域始终存在，内容条件显示 */}
                {/* How to Use Section - 紧接在工具界面下方 */}
                <div id="how-to-use" className={!imageManager.hasImages && !imageManager.hasPreset ? "mt-12 mb-12" : "mt-12 mb-12 hidden"}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {t('hero.howToTitle')}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {t('hero.step1Title')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('hero.step1Description')}
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {t('hero.step2Title')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('hero.step2Description')}
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <span className="text-3xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {t('hero.step3Title')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('hero.step3Description')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Popular Sizes Section */}
                <div id="popular-sizes" className={!imageManager.hasImages && !imageManager.hasPreset ? "mb-12" : "mb-12 hidden"}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {t('hero.popularSizesTitle')}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div onClick={() => handlePresetClick(20)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.20kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(50)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.50kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(30)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.30kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(15)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.15kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(10)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.10kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(40)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.40kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(200)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.200kb')}</span>
                        </div>
                        <div onClick={() => handlePresetClick(500)} className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <span className="text-blue-600 font-medium">{t('hero.popularSizes.500kb')}</span>
                        </div>
                    </div>
                </div>

                {/* Key Features Section */}
                <div className={!imageManager.hasImages && !imageManager.hasPreset ? "mb-12" : "mb-12 hidden"}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {t('hero.featuresTitle')}
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('hero.features.privacy.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.features.privacy.description')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('hero.features.speed.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.features.speed.description')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('hero.features.batch.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.features.batch.description')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('hero.features.quality.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.features.quality.description')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('hero.features.formats.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.features.formats.description')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('hero.features.free.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.features.free.description')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className={!imageManager.hasImages && !imageManager.hasPreset ? "mb-12" : "mb-12 hidden"}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {t('hero.faqTitle')}
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {t('hero.faq.q1.question')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.faq.q1.answer')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {t('hero.faq.q2.question')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.faq.q2.answer')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {t('hero.faq.q3.question')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.faq.q3.answer')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {t('hero.faq.q4.question')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.faq.q4.answer')}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {t('hero.faq.q5.question')}
                            </h3>
                            <p className="text-gray-600">
                                {t('hero.faq.q5.answer')}
                            </p>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default function SEOHomePage() {
    return <SEOHomePageContent />
}