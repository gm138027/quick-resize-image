/**
 * 格式化文件大小 - 自动转换MB为KB
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes) {
  const kb = bytes / 1024
  const mb = kb / 1024

  // 如果大于1MB，显示为KB（按照要求）
  if (mb >= 1) {
    return `${kb.toFixed(1)}kb`
  } else {
    return `${kb.toFixed(1)}kb`
  }
}

/**
 * 计算物理尺寸（基于200 DPI）
 * @param {number} width - 像素宽度
 * @param {number} height - 像素高度
 * @returns {string} 物理尺寸字符串
 */
function calculatePhysicalSize(width, height) {
  const DPI = 200
  const widthCM = (width / DPI * 2.54).toFixed(1)
  const heightCM = (height / DPI * 2.54).toFixed(1)

  return `${widthCM}cm×${heightCM}cm`
}

/**
 * 独立的图片容器组件
 * 固定尺寸，灰色无圆角实线框，白色背景
 * 只装图片，信息显示在外部
 */
export default function ImageContainerComponent({
  imageData,
  isActive = false,
  onImageClick
}) {

  // 固定尺寸的图片容器
  const containerSize = "w-64 h-48"; // 固定256x192px

  return (
    <div className="inline-block">
      {/* 图片容器 - 完全独立的模块，只装图片 */}
      <div
        className={`
          ${containerSize} border-2 bg-white cursor-pointer overflow-hidden
          ${isActive ? 'border-blue-500' : 'border-gray-300'}
        `}
        onClick={onImageClick}
      >
        {imageData && (
          <div className="w-full h-full flex items-center justify-center p-2">
            <img
              src={imageData.url}
              alt={imageData.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* 图片信息卡片 - 完全独立的模块，不影响图片容器 */}
      {imageData && (
        <div className="w-64 bg-slate-700 text-white px-2 py-1.5 text-xs leading-tight">
          {/* 文件名 */}
          <div className="truncate mb-0.5">
            {imageData.name}
          </div>

          {/* 第一行：File size 和 px */}
          <div className="flex justify-between items-center mb-0.5">
            <span>
              <span className="font-bold">File size</span>:{formatFileSize(imageData.size)}
            </span>
            <span>
              <span className="font-bold">px</span>:{imageData.width}x{imageData.height}
            </span>
          </div>

          {/* 第二行：size (物理尺寸) */}
          <div>
            <span className="font-bold">size</span>:{calculatePhysicalSize(imageData.width, imageData.height)}
          </div>
        </div>
      )}
    </div>
  )
}