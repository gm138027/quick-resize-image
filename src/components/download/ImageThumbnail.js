import { useState } from 'react'

/**
 * 图片缩略图组件
 * 职责：显示图片缩略图，处理加载状态和错误状态
 * 特点：无圆角，完整显示图片内容（不截断）
 */
export default function ImageThumbnail({
  src,
  alt,
  className = "w-20 h-20", // 适中的尺寸，在灰色卡片内合适显示
  onClick
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleClick = () => {
    if (onClick && !hasError) {
      onClick()
    }
  }

  return (
    <div
      className={`
        ${className} 
        bg-gray-100
        ${onClick ? 'cursor-pointer' : ''}
        flex items-center justify-center p-1
      `}
      onClick={handleClick}
    >
      {isLoading && (
        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
      )}

      {hasError && (
        <div className="text-gray-400 text-xs text-center">
          <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Error
        </div>
      )}

      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`max-w-full max-h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}