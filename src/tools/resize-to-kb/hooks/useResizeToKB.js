/**
 * Resize to KB 统一Hook
 * 管理参数、验证和图片处理的完整逻辑
 */
import { useState, useCallback } from 'react'
import ResizeToKBProcessor from '../processors/ResizeToKBProcessor'
import preprocessLargeImage from '../../shared/processors/ImagePreProcessor'

export default function useResizeToKB() {
  // 参数管理
  const [functionParams, setFunctionParams] = useState({})
  const [validationError, setValidationError] = useState(null)

  // 处理状态管理
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDownloadButton, setShowDownloadButton] = useState(false)
  const [error, setError] = useState(null)

  // 根据图片初始化resize-to-kb参数
  const initializeParams = useCallback((imageData) => {
    if (!imageData) return

    setFunctionParams({
      targetKB: 20, // 默认设置为20KB，这是常用的大小
      resolutionMode: 'auto',
      width: imageData.width,
      height: imageData.height,
      unit: 'px'
    })

    // 清除之前的状态
    setValidationError(null)
    setShowDownloadButton(false)
    setError(null)
  }, [])

  // 更新参数
  const updateParams = useCallback((newParams) => {
    setFunctionParams(prev => ({ ...prev, ...newParams }))
  }, [])

  // 设置验证错误
  const setValidation = useCallback((isValid, error) => {
    setValidationError(isValid ? null : error)
  }, [])

  // 处理图片 - 核心功能（保持与原始Hook相同的接口）
  const processImage = useCallback(async (functionType, imageData, params, onSuccess, onError) => {
    if (!imageData) {
      onError?.('No image selected')
      return
    }

    setIsProcessing(true)
    setError(null)
    setShowDownloadButton(false)

    try {
      // 验证输入参数
      const validation = ResizeToKBProcessor.validateInput(imageData, params.targetKB)
      if (!validation.isValid) {
        onError?.(validation.error)
        return
      }

      // 🔥 新增：预处理超大图片（避免卡死）
      const processedImageData = await preprocessLargeImage(imageData, params.targetKB)

      // 原有算法完全不变，只是输入可能是预处理后的图片
      const processedData = await ResizeToKBProcessor.processImage(
        processedImageData, // 🔥 这里从imageData改为processedImageData
        params.targetKB,
        params.resolutionMode || 'auto',
        params.resolutionMode === 'fixed' ? {
          width: params.width,
          height: params.height,
          unit: params.unit
        } : null
      )

      if (processedData) {
        setShowDownloadButton(true)
        onSuccess?.(processedData)
      }

    } catch (err) {
      setError(err.message || 'Image processing failed, please try again')
      onError?.(err.message || 'Image processing failed, please try again')
    } finally {
      setIsProcessing(false)
    }
  }, [functionParams])

  // 下载图片
  const downloadImage = useCallback((imageData) => {
    if (!imageData || !imageData.hasBeenProcessed) {
      return
    }

    try {
      const link = document.createElement('a')
      link.href = imageData.url
      link.download = `resized-${imageData.name || 'image.jpg'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError('Download failed')
    }
  }, [])

  // 重置状态
  const resetState = useCallback(() => {
    setIsProcessing(false)
    setShowDownloadButton(false)
    setError(null)
    setValidationError(null)
  }, [])

  return {
    // 参数状态
    functionParams,
    validationError,

    // 处理状态
    isProcessing,
    showDownloadButton,
    error,

    // 操作方法
    initializeParams,
    updateParams,
    setValidation,
    processImage,
    downloadImage,
    resetState,

    // 查询方法
    isValid: !validationError
  }
}