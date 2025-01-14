# 网站名称

## 简介

这是一个基于 **Next.js** 和 **TypeScript** 构建的管理后台系统，旨在帮助用户高效管理订单和商店。系统集成了多种现代化的前端技术和组件，提供流畅的用户体验和强大的功能。

## 功能

- **订单管理**
  - 查看订单列表
  - 搜索订单
  - 编辑订单状态
  - 删除订单

- **商店管理**
  - 查看商店列表
  - 搜索商店
  - 添加新商店
  - 编辑商店信息
  - 删除商店

- **图表展示**
  - 使用甜甜圈图展示关键数据

- **用户界面**
  - 响应式设计，适配不同设备
  - 动画效果提升用户体验
  - 使用图标增强可视化

## 技术栈

- **框架**: Next.js
- **语言**: TypeScript
- **样式**: Tailwind CSS, PostCSS
- **状态管理**: React Hooks
- **动画库**: Framer Motion
- **图表库**: Chart.js, react-chartjs-2
- **图标库**: Lucide Icons
- **通知**: Sonner
- **对话框**: 自定义 Dialog 组件

## 安装

### 前提条件

- [Node.js](https://nodejs.org/) v14 或以上
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **安装依赖**

   使用 npm:

   ```bash
   npm install
   ```

   或者使用 yarn:

   ```bash
   yarn install
   ```

3. **配置环境变量**

   创建 `.env.local` 文件，并根据需求配置环境变量。例如：

   ```env
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

4. **运行开发服务器**

   使用 npm:

   ```bash
   npm run dev
   ```

   或者使用 yarn:

   ```bash
   yarn dev
   ```

   打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 构建与部署

### 构建生产版本

使用 npm:

```bash
npm run build
```

或者使用 yarn:

```bash
yarn build
```

### 启动生产服务器

使用 npm:

```bash
npm start
```

或者使用 yarn:

```bash
yarn start
```

### 部署

将构建后的应用部署到您偏好的平台，如 Vercel、Netlify、等。

## 项目结构

```
your-repo/
├── app/
│   └── dashboard/
│       ├── orders/
│       │   └── page.tsx
│       └── stores/
│           └── page.tsx
├── components/
│   ├── animated-card.tsx
│   ├── donut-chart.tsx
│   └── edit-dialog.tsx
├── api/
│   └── admin/
│       ├── index.ts
│       └── types.ts
├── public/
├── styles/
│   └── globals.css
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── dockerfile
└── README.md
```

## 贡献

欢迎贡献代码！请遵循以下步骤：

1. **Fork 仓库**
2. **创建新分支**

   ```bash
   git checkout -b feature/你的功能
   ```

3. **提交更改**

   ```bash
   git commit -m "添加了...功能"
   ```

4. **推送到分支**

   ```bash
   git push origin feature/你的功能
   ```

5. **创建 Pull Request**

## 许可证

[MIT](LICENSE)

## 联系我们

如果您有任何问题或建议，请通过 [your-email@example.com](mailto:your-email@example.com) 与我们联系。
