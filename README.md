# 全栈电商应用项目

> 本项目是 ui 是通过[V0](https://v0.dev/)生成的,也是看出了 `AI` 对于前端的重要性

## 简介

本项目是一个现代化的全栈电商应用，结合了 **Next.js 14**、**Nest.js**、**Prisma** 以及 **MySQL**，主要目的是给朋友及亲人晚上点餐使用，同时为商家提供高效的店铺管理功能。项目包括前端用户界面、管理后台以及高性能的后端服务，完全采用 **Docker** 容器化部署，支持持续集成与持续部署（CI/CD）。

## 预览

**mini-order**[线上预览地址](https://min.liboqiao.top)

![image-20241220142721762](https://cdn.liboqiao.top/markdown/image-20241220142721762.png)
![image-20241220142742940](https://cdn.liboqiao.top/markdown/image-20241220142742940.png)

**mini-order-admin**
[线上预览地址](https://min.admin.liboqiao.top)

![image-20250114133103851](https://cdn.liboqiao.top/markdown/image-20250114133103851.png)
![image-20250114133221018](https://cdn.liboqiao.top/markdown/image-20250114133221018.png)

## 项目结构

```
/
├── mini-order
│   ├─ /components         # 通用组件
│   ├─ /lib                # 库和工具函数
│   ├─ /pages              # Next.js 页面
│   ├─ /public             # 静态资源
│   ├─ /styles             # 全局样式
│   ├─ /utils              # 实用脚本
│   ├─ .eslintrc.json     # ESLint 配置
│   ├─ .env               # 环境变量
│   ├─ .gitignore         # Git 忽略文件
│   └── README.md          # 前端 README
├── mini-order-admin
│   ├── app/
│   ├── components/
│   ├── api/
│   ├── public/
│   ├── styles/
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── dockerfile
│   ├── .gitignore
│   └── README.md
├── mini-order-backend
│   ├─ /src
│   │   ├─ /users
│   │   │   ├─ users.controller.spec.ts
│   │   │   ├─ users.controller.ts
│   │   │   ├─ users.module.ts
│   │   │   ├─ users.service.ts
│   │   │   └─ dto/
│   │   │       └─ get-balance-transactions.dto.ts
│   │   ├─ /utils
│   │   │   ├─ crypto.ts
│   │   │   ├─ index.ts
│   │   │   └─ validate.ts
│   ├─ /test
│   │   ├─ app.e2e-spec.ts
│   │   └─ jest-e2e.json
│   ├─ prisma/
│   ├─ .env
│   ├─ tsconfig.json
│   ├─ tsconfig.build.json
│   ├─ package.json
│   ├─ pnpm-lock.yaml
│   ├─ dockerfile
│   ├─ nest-cli.json
│   ├─ .prettierrc
│   ├─ .eslintrc.js
│   ├─ .gitignore
│   └─ README.md
└── README.md
```

## 技术栈

### 前端

- **Next.js 14**: 用于构建服务端渲染和静态网站生成的 React 框架。
- **TypeScript**: 提供类型安全。
- **Framer Motion**: 用于动画效果。
- **Lucide Icons**: 图标库。
- **Canvas Confetti**: 用于庆祝效果。
- **Zustand**: 状态管理。
- **Docker**: 容器化应用。

### 后端

- **Nest.js**: 高效的后端框架。
- **Prisma**: ORM 工具，配合 **MySQL** 使用。
- **Cursor**: 加速开发和自动化 Bug 解决。
- **Docker**: 后端服务的容器化部署。

### 管理后台

- **Next.js**
- **TypeScript**
- **Tailwind CSS & PostCSS**: 样式处理。
- **Framer Motion**: 动画效果。
- **Chart.js & react-chartjs-2**: 数据可视化。
- **Lucide Icons**: 图标库。
- **Sonner**: 通知系统。
- **自定义 Dialog 组件**: 对话框功能。

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

### 管理后台

- 订单管理：查看、搜索、编辑状态、删除订单
- 商店管理：查看、搜索、添加、编辑信息、删除商店
- 图表展示：使用甜甜圈图展示关键数据
- 响应式设计与动画效果优化用户体验

## 性能优化

- 使用服务器组件减少客户端 JavaScript 体积
- 实现增量静态再生成（ISR）
- 图片优化和懒加载
- 路由预加载

## 相关配置文件

### 前端配置

- **.eslintrc.json**: ESLint 配置文件，用于代码静态检查和风格统一。
- **.env**: 环境变量文件，存储敏感信息和配置参数。
- **.gitignore**: 指定 Git 忽略的文件和目录。

### 后端配置

- **tsconfig.json**: TypeScript 编译选项配置。
- **tsconfig.build.json**: TypeScript 构建配置。
- **jest-e2e.json**: Jest 端到端测试配置。
- **nest-cli.json**: Nest.js CLI 配置文件。
- **.prettierrc**: Prettier 格式化配置。
- **.eslintrc.js**: ESLint 配置文件。
- **.gitignore**: 指定 Git 忽略的文件和目录。

### 管理后台配置

- **next.config.mjs**: Next.js 配置文件。
- **package.json**: 项目依赖及脚本定义。
- **postcss.config.mjs**: PostCSS 配置文件。
- **dockerfile**: Docker 镜像构建配置。
- **.gitignore**: 指定 Git 忽略的文件和目录。

## 开发与部署

### 本地开发

#### 前端

1. **克隆项目到本地**：

   ```bash
   git clone <repository-url>
   cd mini-order
   ```

2. **安装依赖**：

   ```bash
   pnpm install
   ```

3. **启动开发服务器**：

   ```bash
   pnpm run dev
   ```

   打开 [http://localhost:8888](http://localhost:8888) 查看应用。

#### 后端

1. **导航到后端目录**：

   ```bash
   cd mini-order-backend
   ```

2. **安装依赖**：

   ```bash
   pnpm install
   ```

3. **生成 Prisma 客户端**：

   ```bash
   npx prisma generate --schema=./prisma/schema.prisma
   ```

4. **启动开发服务器**：

   ```bash
   pnpm run start:dev
   ```

#### 管理后台

1. **导航到管理后台目录**：

   ```bash
   cd mini-order-admin
   ```

2. **安装依赖**：

   ```bash
   npm install
   ```

3. **运行开发服务器**：

   ```bash
   npm run dev
   ```

   打开 [http://localhost:3000](http://localhost:3000) 查看管理后台。

### Docker 部署

#### 前端和后端

参考各自的 `dockerfile` 进行构建和部署。

##### 后端 Dockerfile 示例

```dockerfile
FROM node:latest
WORKDIR /mini-order-server
COPY package.json ./
COPY .env .env
COPY ./prisma prisma

# 安装 pnpm
RUN npm install -g pnpm
RUN pnpm install

RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .
RUN npm run build

FROM node:latest
COPY --from=0 /mini-order-server/dist ./dist
COPY --from=0 /mini-order-server/.env ./.env
COPY --from=0 /mini-order-server/node_modules ./node_modules

CMD node dist/src/main.js
EXPOSE 6666
```

##### 管理后台 Dockerfile 示例

```dockerfile
FROM node:22-alpine as builder
WORKDIR /mini_order_web

COPY package.json ./

# 安装 pnpm
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:22-alpine as runner
WORKDIR /mini_order_web

COPY --from=builder /mini_order_web ./

EXPOSE 8888
CMD ["npx", "next", "start", "-p", "8888"]
```

### 持续集成与持续部署（CI/CD）

本项目使用 [e.coding.net](https://e.coding.net/) 实现持续集成与持续部署。配置好的 `pipeline` 会在代码更新时自动构建、推送 Docker 镜像并部署到远程服务器。

#### 示例 Jenkinsfile 配置

```jenkinsfile
pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM',
        branches: [[name: GIT_BUILD_REF]],
        userRemoteConfigs: [[
          url: GIT_REPO_URL,
          credentialsId: CREDENTIALS_ID
        ]]])
      }
    }
    stage('构建前端镜像') {
      steps {
        script {
          docker.withRegistry(
            "${CCI_CURRENT_WEB_PROTOCOL}://${CODING_DOCKER_REG_HOST}",
            "${CODING_ARTIFACTS_CREDENTIALS_ID}"
          ) {
            def frontendImage = docker.build("${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}", "-f ./mini-order/dockerfile ./mini-order")
            frontendImage.push()
          }
        }
      }
    }
    // 后端镜像构建和部署类似...
  }
}
```

## 解决跨域问题

使用 **Nginx** 来处理跨域问题，配置合适的域名，使前后端服务能够无缝对接。

## 配置与工具

### ESLint

- **前端**和**后端**均配置了 ESLint 以保证代码质量和一致的编码风格。
- 配置文件分别位于 `mini-order/.eslintrc.json` 和 `mini-order-backend/.eslintrc.js`。

### TypeScript

- **前端**和**后端**均使用 TypeScript，提高代码的类型安全性。
- 配置文件位于 `mini-order-backend/tsconfig.json` 和 `mini-order-backend/tsconfig.build.json`。

### Prettier

- 统一代码格式化工具。
- 配置文件位于 `mini-order-backend/.prettierrc`。

### Git

- 各项目均配置了 `.gitignore` 文件，确保不必要的文件不会被提交到版本控制。

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

本项目遵循 [MIT](LICENSE) 许可证。

## 联系我们

如果您有任何问题或建议，请通过 [2661158759@qq.com](mailto:2661158759@qq.com) 与我们联系。
