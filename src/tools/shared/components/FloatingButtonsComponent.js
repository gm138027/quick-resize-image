/**
 * 独立的悬浮按钮组件 - 外观层
 * 只负责UI显示，不包含业务逻辑
 */
export default function FloatingButtonsComponent({
  onCrop,
  onAdd,
  onDelete,
  onUndo,
  canUndo = true, // 是否可以撤销
  className = ""
}) {

  return (
    <div className={`absolute top-0 -right-4 flex flex-col space-y-1 z-50 ${className}`}>
      {/* 裁剪按钮 - 独立功能，暂时禁用 */}
      <button
        className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white shadow-md cursor-not-allowed opacity-50"
        title="裁剪图片 (暂未开放)"
        disabled
      >
        <img src="/icons/crop.svg" alt="Crop" className="w-4 h-4 filter brightness-0 invert" />
      </button>

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

      {/* 撤销按钮 - 根据状态显示不同样式 */}
      <button
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-colors ${canUndo
          ? 'bg-gray-500 hover:bg-gray-600 cursor-pointer'
          : 'bg-gray-400 cursor-not-allowed opacity-50'
          }`}
        title={canUndo ? "撤销最后一次resize操作" : "没有可撤销的操作"}
        onClick={canUndo ? onUndo : undefined}
        disabled={!canUndo}
      >
        <img src="/icons/undo.svg" alt="Undo" className="w-4 h-4 filter brightness-0 invert" />
      </button>
    </div>
  )
}