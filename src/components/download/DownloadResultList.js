import DownloadResultItem from './DownloadResultItem'

/**
 * 下载结果列表组件
 * 职责：管理和渲染所有处理结果项
 */
export default function DownloadResultList({
  images = [],
  onRename,
  onDownload
}) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">
          No processed images to display
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-400 bg-white">
      <div className="p-4 space-y-4">
        {images.map((image) => (
          <DownloadResultItem
            key={image.id}
            image={image}
            onRename={onRename}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  )
}
