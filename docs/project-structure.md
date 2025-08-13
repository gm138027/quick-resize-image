# QuickResizeImage.com 项目结构

## 技术栈选择
- **框架**: Next.js 14 (React框架，SEO友好)
- **多语言**: next-i18next (国际化支持)
- **样式**: Tailwind CSS (快速开发，响应式)
- **图像处理**: Canvas API (客户端处理，保护隐私)
- **部署**: Vercel (CDN加速，自动优化)

## 完整的项目文件结构
```
quickresizeimage/
├── public/
│   ├── locales/
│   │   ├── en/common.json    # 英语翻译文件
│   │   └── hi/common.json    # 印地语翻译文件
│   └── favicon.svg           # 网站图标
├── pages/                    # Next.js路由文件夹（必须在根目录）
│   ├── _app.js              # 应用入口文件
│   ├── index.js             # 首页
│   ├── how-to-use.js        # 使用方法页面
│   ├── faq.js               # 常见问题页面
│   ├── contact.js           # 联系我们页面
│   └── tools/
│       ├── index.js         # 工具列表页面
│       └── resize-by-size.js # 按文件大小调整工具页面
├── src/                      # 源代码文件夹
│   ├── components/
│   │   ├── shared/           # 共享组件
│   │   │   ├── Layout.js     # 页面布局组件
│   │   │   ├── Navigation.js # 导航栏组件
│   │   │   ├── Footer.js     # 页脚组件
│   │   │   └── LanguageSelector.js # 语言选择器
│   │   └── home/             # 首页专用组件
│   │       ├── Hero.js       # 首页英雄区域
│   │       └── ToolsGrid.js  # 工具网格展示
│   └── tools/                # 工具相关代码
│       └── resize-by-size/
│           └── ResizeBySizeInterface.js # 按大小调整界面
├── styles/
│   └── globals.css          # 全局样式文件
├── next.config.js           # Next.js配置
├── next-i18next.config.js   # 国际化配置
├── tailwind.config.js       # Tailwind CSS配置
├── postcss.config.js        # PostCSS配置
└── package.json             # 项目依赖配置
```

## 架构说明

### 为什么pages文件夹在根目录？
- Next.js要求pages文件夹必须在项目根目录
- 这是Next.js的文件系统路由约定，不能更改
- pages文件夹负责定义应用的路由结构

### src文件夹的作用
- 包含所有业务逻辑代码
- 组件按功能和用途分类
- 工具代码独立管理，便于扩展

### 遵循的设计原则
- **DRY原则**: 消除了重复的components文件夹
- **KISS原则**: 简单清晰的文件夹结构
- **单一职责**: 每个文件夹有明确的职责
- **可扩展性**: 新工具可以轻松添加到src/tools/下

## 多语言支持
- **默认语言**: 英语 (en)
- **支持语言**: 印地语 (hi)
- **SEO优化**: 每种语言独立的meta标签和结构化数据
- **URL结构**: 
  - 英语: quickresizeimage.com
  - 印地语: quickresizeimage.com/hi

## 核心功能模块

### 1. 图像处理核心 (待开发)
```javascript
class ImageProcessor {
  // 按文件大小压缩
  compressToSize(file, targetSizeKB) {}
  
  // 按像素调整
  resizeByPixels(file, width, height, maintainRatio) {}
  
  // 按物理尺寸调整  
  resizeByDimensions(file, widthCM, heightCM, dpi) {}
  
  // 按百分比调整
  resizeByPercentage(file, percentage) {}
}
```

### 2. 页面组件
- **Hero**: 主标题和文件上传区域
- **ToolsGrid**: 四种调整方式的工具卡片
- **QuickActions**: 热门需求快速按钮
- **Features**: 产品特性说明
- **LanguageSelector**: 语言切换器

### 3. SEO优化
- 多语言meta标签
- 结构化数据
- 响应式设计
- 性能优化