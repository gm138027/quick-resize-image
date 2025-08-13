# 共享组件库

这个文件夹包含所有工具功能共享的UI组件。

## 组件列表

- `ActionButtonsComponent.js` - 操作按钮组件 (resize/download按钮)
- `ImageContainerComponent.js` - 图片容器组件 (图片预览和信息显示)
- `FloatingButtonsComponent.js` - 悬浮按钮组件 (裁剪/添加/删除/撤销)
- `OutputFormatSelector.js` - 输出格式选择器 (JPG/PNG/WEBP)

## 使用说明

- 这些组件供各个独立工具功能使用，避免代码重复
- 所有组件都遵循单一职责原则，可独立使用
- 不包含对具体功能组件的反向依赖

## 项目清理记录

- ✅ 删除了未使用的 `ImageManagementComponent.js`
- ✅ 删除了未使用的 `ImagePreviewComponent.js`  
- ✅ 删除了未使用的 `ParameterInputComponent.js`
- ✅ 移除了 `image-resizer` 目录的所有引用