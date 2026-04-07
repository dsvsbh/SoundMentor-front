# SoundMentor 前端项目

## 项目简介

SoundMentor前端项目是基于Vue.js 3开发的智能语音教辅系统前端界面，为用户提供直观、友好的操作体验，实现有声课件生成、语音阅读辅助等功能。

## 技术栈

- **框架**：Vue.js 3
- **UI组件库**：Element Plus
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由**：Vue Router
- **HTTP客户端**：Axios
- **代码规范**：ESLint + Prettier

## 项目结构

```
SoundMentor-front/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 项目资源文件
│   ├── components/     # 公共组件
│   ├── views/          # 页面视图
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── api/            # API请求
│   ├── utils/          # 工具函数
│   ├── constants/      # 常量定义
│   ├── App.vue         # 应用入口组件
│   └── main.js         # 应用入口文件
├── .gitignore          # Git忽略配置
├── index.html          # HTML模板
├── jsconfig.json       # JavaScript配置
├── package.json        # 项目配置和依赖
├── vite.config.js      # Vite配置
└── README.md           # 项目说明
```

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 核心功能

### 1. 用户管理
- 用户登录/注册
- 个人信息管理
- 密码重置

### 2. 组织管理
- 组织创建与管理
- 成员邀请与管理
- 组织文件共享

### 3. 有声课件生成
- PPT上传与解析
- 课件内容编辑
- 语音讲解生成
- 课件预览与导出

### 4. 语音阅读辅助
- 文本输入与上传
- 语音参数调整
- 语音生成与播放
- 语音文件下载

### 5. 声音库管理
- 预设声音浏览
- 声音效果调整

## 开发规范

### 组件命名
- 组件名使用大驼峰命名法
- 文件名与组件名保持一致

### 代码风格
- 使用ES6+语法
- 遵循ESLint和Prettier规范
- 代码注释清晰完整

### 提交规范
- 提交信息使用语义化提交格式
- 提交前运行 `npm run lint` 检查代码规范

## 环境变量

在 `.env` 文件中配置以下环境变量：

```env
# 后端API地址
VITE_API_BASE_URL=http://localhost:8080/api

# 静态资源地址
VITE_STATIC_BASE_URL=http://localhost:8080
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 开发工具推荐

- VS Code
- Volar 插件
- ESLint 插件
- Prettier 插件

## 许可证

本项目采用MIT许可证。