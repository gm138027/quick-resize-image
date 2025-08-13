/**
 * Resize to KB 专用悬浮按钮组件
 * 只包含添加图片和删除图片功能，移除裁剪和撤销按钮
 */
export default function ResizeToKBFloatingButtons({
  onAdd,
  onDelete,
  className = ""
}) {

  return (
    <div className={`absolute top-0 -right-4 flex flex-col space-y-1 z-50 ${className}`}>
      {/* 添加图片按钮 */}
      <button
        className="w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
        title="增加图片"
        onClick={onAdd}
      >
        <img src="/icons/add.svg" alt="Add" className="w-4 h-4 filter brightness-0 invert" />
      </button>

      {/* 删除图片按钮 */}
      <button
        className="w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
        title="删除图片"
        onClick={onDelete}
      >
        <img src="/icons/bin.svg" alt="Delete" className="w-4 h-4 filter brightness-0 invert" />
      </button>
    </div>
  )
}