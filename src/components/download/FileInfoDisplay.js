import { useState, useEffect } from 'react'

/**
 * 文件信息显示组件
 * 职责：显示文件名、尺寸、大小，支持内联编辑文件名
 */
export default function FileInfoDisplay({ 
  fileName, 
  dimensions, 
  fileSize,
  isRenaming,
  onRename,
  onCancelRename
}) {
  const [editingName, setEditingName] = useState(fileName)

  useEffect(() => {
    if (isRenaming) {
      setEditingName(fileName)
    }
  }, [isRenaming, fileName])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleSave = () => {
    const trimmedName = editingName.trim()
    if (trimmedName && trimmedName !== fileName) {
      onRename(trimmedName)
    } else {
      onCancelRename()
    }
  }

  const handleCancel = () => {
    setEditingName(fileName)
    onCancelRename()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDimensions = (dims) => {
    if (typeof dims === 'string') return dims
    if (dims && dims.width && dims.height) {
      return `${dims.width}x${dims.height}`
    }
    return 'Unknown'
  }

  return (
    <div className="min-w-0">
      {/* 文件名 */}
      <div className="mb-1">
        {isRenaming ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="
              w-full px-2 py-1 text-sm font-medium text-gray-900 
              border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            autoFocus
          />
        ) : (
          <div className="text-sm font-medium text-gray-900 truncate">
            {fileName}
          </div>
        )}
      </div>

      {/* 尺寸和文件大小 */}
      <div className="text-xs text-gray-500 space-y-0.5">
        <div>{formatDimensions(dimensions)}</div>
        <div>{formatFileSize(fileSize)}</div>
      </div>
    </div>
  )
}
