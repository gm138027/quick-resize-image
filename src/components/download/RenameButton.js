import { useTranslation } from 'next-i18next'

/**
 * 重命名按钮组件
 * 职责：提供文件重命名功能的触发按钮
 */
export default function RenameButton({
  isRenaming,
  onStartRename,
  disabled = false
}) {
  const { t } = useTranslation('common')

  return (
    <button
      onClick={onStartRename}
      disabled={disabled || isRenaming}
      className={`
        px-2 py-1 text-xs font-medium rounded transition-colors duration-200
        focus:outline-none focus:ring-1 focus:ring-offset-1
        ${disabled || isRenaming
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
        }
      `}
    >
      {t('download.rename', 'Rename')}
    </button>
  )
}
