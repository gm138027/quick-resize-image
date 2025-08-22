/**
 * Resize to KB 独立功能主界面
 * 专门为resize-to-kb功能设计的独立界面
 */
import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import ImageUpload from '../../components/shared/ImageUpload'
import ImageContainerComponent from '../shared/components/ImageContainerComponent'
import ResizeToKBFloatingButtons from './components/ResizeToKBFloatingButtons'
import ResizeToKBInteractionComponent from './ResizeToKBInteractionComponent'
import ActionButtonsComponent from '../shared/components/ActionButtonsComponent'
import { useImageManagerContext } from '../shared/contexts/ImageManagerContext'
import useResizeToKB from './hooks/useResizeToKB'

export default function ResizeToKBInterface() {
  const { t } = useTranslation('common')
  const router = useRouter()

  // 使用共享的图片管理Context
  const imageManager = useImageManagerContext()

  // 使用统一的resize-to-kb Hook（包含参数管理和图片处理）
  const resizeToKB = useResizeToKB()



  // 初始化参数逻辑
  React.useEffect(() => {
    const currentImage = imageManager.getCurrentImage()

    if (currentImage) {
      // 有图片：根据是否有预设来决定参数
      if (imageManager.hasPreset) {
        resizeToKB.updateParams({ targetKB: imageManager.presetKB })
        imageManager.clearPreset()
      } else if (!resizeToKB.functionParams.targetKB) {
        resizeToKB.initializeParams(currentImage)
      }
    } else if (imageManager.hasPreset) {
      // 只有预设，没有图片：设置预设参数
      resizeToKB.updateParams({
        targetKB: imageManager.presetKB,
        resolutionMode: 'auto'
      })
    }
  }, [imageManager.images, imageManager.activeImageIndex, imageManager.presetKB])

  // 处理图片切换
  const handleImageSwitch = (index) => {
    imageManager.switchToImage(index)
    const newImage = imageManager.images[index]
    if (newImage) {
      resizeToKB.initializeParams(newImage)
      resizeToKB.resetState()
    }
  }

  // 处理图片处理 - 自动批处理：处理所有上传的图片
  const handleImageProcess = async () => {
    const allImages = imageManager.images

    if (!allImages || allImages.length === 0) {
      resizeToKB.setValidation(false, t('error.noImages'))
      return
    }

    // 验证参数
    if (!resizeToKB.functionParams.targetKB) {
      resizeToKB.setValidation(false, t('error.invalidTargetSize'))
      return
    }

    console.log(`🚀 Starting batch processing for ${allImages.length} images`)

    // 设置处理状态
    resizeToKB.resetState()

    const processedResults = []
    let hasErrors = false

    try {
      // 循环处理所有图片
      for (let i = 0; i < allImages.length; i++) {
        const image = allImages[i]
        console.log(`📷 Processing image ${i + 1}/${allImages.length}: ${image.name}`)

        try {
          // 为每张图片准备其特定的参数
          const imageParams = { ...resizeToKB.functionParams }

          // 如果是固定分辨率模式，使用当前图片的原始尺寸
          if (imageParams.resolutionMode === 'fixed') {
            imageParams.width = image.width
            imageParams.height = image.height
            imageParams.unit = 'px'
          }

          // 使用Promise包装现有的processImage方法
          const processedData = await new Promise((resolve, reject) => {
            resizeToKB.processImage(
              'kb',
              image,
              imageParams,
              // 成功回调
              (data) => resolve(data),
              // 错误回调
              (error) => reject(new Error(error))
            )
          })

          // 保存原始数据（如果还没有保存过）
          const originalData = image.hasBeenProcessed && image.originalData ?
            image.originalData :
            {
              url: image.url,
              size: image.size,
              width: image.width,
              height: image.height
            }

          // 更新图片状态
          imageManager.markImageAsProcessed(i, originalData, processedData)

          // 创建下载数据
          const downloadData = {
            id: image.id,
            fileName: image.name,
            dimensions: { width: processedData.width, height: processedData.height },
            fileSize: processedData.size,
            dataUrl: processedData.url,
            originalSize: originalData.size
          }

          processedResults.push(downloadData)
          console.log(`✅ Success: ${image.name} → ${(processedData.size / 1024).toFixed(1)}KB`)

        } catch (error) {
          console.error(`❌ Failed to process ${image.name}:`, error.message)
          hasErrors = true
          // 继续处理其他图片，不中断整个流程
        }
      }

      // 检查是否有成功处理的图片
      if (processedResults.length === 0) {
        resizeToKB.setValidation(false, t('error.allImagesFailed'))
        return
      }

      // 存储所有成功处理的图片到sessionStorage
      sessionStorage.setItem('processedImages', JSON.stringify(processedResults))

      console.log(`🎯 Batch processing completed: ${processedResults.length}/${allImages.length} successful`)

      // 跳转到下载页面
      router.push('/download')

    } catch (error) {
      console.error('❌ Batch processing error:', error)
      resizeToKB.setValidation(false, t('error.processingFailed'))
    }
  }



  // 处理图片下载
  const handleImageDownload = () => {
    const currentImage = imageManager.getCurrentImage()
    resizeToKB.downloadImage(currentImage)
  }

  return (
    <div>

      {/* 图片预览区域 */}
      <div className={imageManager.hasImages ? "mb-0" : "mb-8"}>
        {!imageManager.hasImages && !imageManager.hasPreset ? (
          <>
            <ImageUpload
              onImageUpload={imageManager.handleImageUpload}
              onMultipleImageUpload={imageManager.handleMultipleImageUpload}
              onUploadError={imageManager.handleUploadError}
              currentImageCount={imageManager.totalImages}
            />

            {/* 上传错误提示 */}
            {imageManager.uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                <div className="flex justify-between items-center">
                  <span>{imageManager.uploadError}</span>
                  <button
                    onClick={imageManager.clearUploadError}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </>
        ) : imageManager.hasPreset ? (
          <>
            <ImageUpload
              onImageUpload={imageManager.handleImageUpload}
              onMultipleImageUpload={imageManager.handleMultipleImageUpload}
              onUploadError={imageManager.handleUploadError}
              currentImageCount={imageManager.totalImages}
            />

            {/* 上传错误提示 */}
            {imageManager.uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                <div className="flex justify-between items-center">
                  <span>{imageManager.uploadError}</span>
                  <button
                    onClick={imageManager.clearUploadError}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative image-container-border p-8 mx-auto" style={{ maxWidth: '896px', minHeight: '326px' }}>
            {imageManager.totalImages === 1 ? (
              // 单张图片显示
              <div className="flex justify-center items-center h-full w-full">
                <div className="relative">
                  <ImageContainerComponent
                    imageData={imageManager.images[0]}
                    isActive={true}
                    onImageClick={() => handleImageSwitch(0)}
                  />
                  <ResizeToKBFloatingButtons
                    onAdd={imageManager.handleAddImages}
                    onDelete={() => imageManager.deleteImage()}
                  />
                </div>
              </div>
            ) : (
              // 多张图片网格显示
              <div className="grid grid-cols-3 gap-6 justify-items-center">
                {imageManager.images.map((image, index) => (
                  <div key={index} className="relative">
                    <ImageContainerComponent
                      imageData={image}
                      isActive={index === imageManager.activeImageIndex}
                      onImageClick={() => handleImageSwitch(index)}
                    />
                    {index === imageManager.activeImageIndex && (
                      <ResizeToKBFloatingButtons
                        onAdd={imageManager.handleAddImages}
                        onDelete={() => imageManager.deleteImage()}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 用户交互区域 */}
      {(imageManager.hasImages || imageManager.hasPreset) && (
        <>
          <div className="px-8 py-6">
            {/* Resize to KB 专用交互组件 */}
            <div className="mb-8">
              <ResizeToKBInteractionComponent
                currentValue={resizeToKB.functionParams.targetKB}
                currentResolutionMode={resizeToKB.functionParams.resolutionMode}
                currentWidth={resizeToKB.functionParams.width}
                currentHeight={resizeToKB.functionParams.height}
                currentUnit={resizeToKB.functionParams.unit}
                onValueChange={(value) => resizeToKB.updateParams({ targetKB: value })}
                onResolutionModeChange={(mode) => resizeToKB.updateParams({ resolutionMode: mode })}
                onDimensionsChange={(dimensions) => resizeToKB.updateParams(dimensions)}
                onUnitChange={(unit) => resizeToKB.updateParams({ unit: unit })}
                onValidationChange={resizeToKB.setValidation}
              />
            </div>

            {/* 共享的操作按钮组件 - 只显示Resize按钮 */}
            <ActionButtonsComponent
              onResizeClick={handleImageProcess}
              onDownloadClick={handleImageDownload}
              showDownloadButton={false}
              isProcessing={resizeToKB.isProcessing}
            />
          </div>



          {/* 验证错误提示 */}
          {resizeToKB.validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
              {resizeToKB.validationError}
            </div>
          )}
        </>
      )}
    </div>
  )
}