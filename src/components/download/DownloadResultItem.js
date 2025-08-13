import { useState } from 'react'
import ImageThumbnail from './ImageThumbnail'
import FileInfoDisplay from './FileInfoDisplay'
import RenameButton from './RenameButton'
import DownloadButton from './DownloadButton'

/**
 * 单个下载结果项组件
 * 职责：展示单个处理结果的所有信息和操作
 */
export default function DownloadResultItem({ 
  image, 
  onRename, 
  onDownload 
}) {
  const [isRenaming, setIsRenaming] = useState(false)

  const handleRename = (newName) => {
    onRename(image.id, newName)
    setIsRenaming(false)
  }

  const handleDownload = () => {
    onDownload(image)
  }

  return (
    <div className="p-4 flex items-center gap-4 bg-gray-100">
      {/* 图片缩略图 */}
      <div className="flex-shrink-0">
        <ImageThumbnail
          src={image.dataUrl}
          alt={image.fileName}
          className="w-20 h-20"
        />
      </div>

      {/* 文件信息 */}
      <div className="flex-grow min-w-0">
        <FileInfoDisplay
          fileName={image.fileName}
          dimensions={image.dimensions}
          fileSize={image.fileSize}
          isRenaming={isRenaming}
          onRename={handleRename}
          onCancelRename={() => setIsRenaming(false)}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex-shrink-0 flex items-center gap-6">
        <RenameButton
          isRenaming={isRenaming}
          onStartRename={() => setIsRenaming(true)}
        />

        <DownloadButton
          onDownload={handleDownload}
          fileName={image.fileName}
        />
      </div>
    </div>
  )
}
