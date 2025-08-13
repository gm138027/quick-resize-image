/**
 * 图片管理Context
 * 提供全局的图片状态管理，确保所有组件共享同一个状态
 */
import React, { createContext, useContext } from 'react'
import useImageManager from '../hooks/useImageManager'

const ImageManagerContext = createContext(null)

export function ImageManagerProvider({ children }) {
  const imageManager = useImageManager()
  
  return (
    <ImageManagerContext.Provider value={imageManager}>
      {children}
    </ImageManagerContext.Provider>
  )
}

export function useImageManagerContext() {
  const context = useContext(ImageManagerContext)
  if (!context) {
    throw new Error('useImageManagerContext must be used within an ImageManagerProvider')
  }
  return context
}