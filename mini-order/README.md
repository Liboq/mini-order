# 电商应用项目

这是一个基于 Next.js 14 构建的现代电商应用，旨在提供用户友好的店铺体验和高效的店铺管理功能。

## 项目结构

```
/mini-order
  ├─ /components         # 通用组件
  ├─ /lib                # 库和工具函数
  ├─ /pages              # Next.js 页面
  ├─ /public             # 静态资源
  ├─ /styles             # 全局样式
  └─ /utils              # 实用脚本
```

## 技术栈

- **Next.js 14**: 用于构建服务端渲染和静态网站生成的 React 框架。
- **TypeScript**: 提供类型安全。
- **Framer Motion**: 用于动画效果。
- **Lucide Icons**: 图标库。
- **Canvas Confetti**: 用于庆祝效果。
- **Zustand**: 状态管理。
- **Docker**: 容器化应用。

## 功能模块

### 用户系统

- 用户注册、登录、登出
- 用户信息管理
- 虚拟货币系统（Happy Coins）

### 商店管理

- 店铺信息编辑
- 菜单管理
- 订单管理

### 订单系统

- 订单状态管理
- 订单历史查看

## 性能优化

- 使用服务器组件减少客户端 JavaScript 体积
- 实现增量静态再生成（ISR）
- 图片优化和懒加载
- 路由预加载

## 开发与部署

### 本地开发

1. 克隆项目到本地：

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm run dev
   ```

### Docker 部署

1. 构建 Docker 镜像：

   ```bash
   docker build -t mini-order .
   ```

2. 运行 Docker 容器：
   ```bash
   docker run -p 8888:8888 mini-order
   ```

## 贡献

欢迎贡献代码！请提交 Pull Request 或报告问题。

## 许可证

此项目遵循 MIT 许可证。
