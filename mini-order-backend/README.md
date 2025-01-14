# 用 V0 和 Cursor 实现全栈开发：从小白到高手的蜕变

最近，我在探索如何让网站看起来更炫、更酷，尤其是对于我这种审美有点欠缺的开发者。经过一番查找，我发现了 [V0](https://v0.dev/)，一个能快速生成美观页面和动画的神器！对于像我这样对网站设计没有太多想法的开发者来说，简直是福音。所以我决定拿它来重构我之前做的小程序。**[mini-order](https:min.liboqiao.top)**

### 后端：高效的 Nest.js + Prisma 配合 MySQL

#### 技术栈

- **后端框架**：Nest.js
- **数据库**：Prisma + MySQL

我的开发思路是，利用 [Cursor](https://www.cursor.com/) 来加速开发、自动解决 bug，并且轻松生成数据库文件。虽然我之前也用过几次 Nest.js，略知一二，但借助 Cursor 后，我的工作效率显著提升。

#### 使用流程

首先，你需要告诉 Cursor 你打算做什么。比如，生成 Prisma 配置文件，然后让它根据数据库文件生成相应的接口。过程中遇到的 bug？大部分 Cursor 都能帮你自动解决。

在实现一些复杂逻辑时，你可以详细描述需求。例如，在更新用户头像和个人信息时，默认的逻辑是更新头像同时修改头像地址。虽然这没错，但我想要的逻辑是：上传图片时只需要存储图片 ID，而把 ID 存入用户表。这个需求一告诉 Cursor，它就会引导你怎么实现。

#### 统一接口返回字段

为了便于前后端联调，我决定使用 [拦截器](https://docs.nestjs.com/interceptors) 来统一返回字段格式。这样可以减少沟通成本，也能让整个开发流程更加流畅。

#### 打包与 Docker 化部署

这部分可以说是最“有挑战”的，但也非常有趣！你可以用以下 `Dockerfile` 来进行后端的 Docker 化部署：

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
COPY --from=0 /mini-order-server/dist ./prisma
COPY --from=0 /mini-order-server/dist ./dist
COPY --from=0 /mini-order-server/.env ./.env
COPY --from=0 /mini-order-server/node_modules ./node_modules

CMD node dist/src/main.js
EXPOSE 6666
```

遇到的几个问题：

1. **Prisma 配置文件获取不到**
   这通常是因为 Docker 打包时，`.env` 文件没有被正确复制进容器。

2. **Prisma Client 生成失败**
   如果遇到问题，可以先查看容器日志：

   ```bash
   docker ps -a
   docker logs containerId
   ```

   或者检查你的 `prisma` 配置，确保 binaryTargets 配置正确。

---

### 前端：用 V0 快速生成 UI

虽然我没有深入写前端代码，但用了 [V0](https://v0.dev/chat/lMCtpBa38vl?b=b_ZeIovawaX1b) 来快速生成页面，不仅能提高效率，还能让界面看起来非常酷。简直是为像我这种对前端设计无从下手的开发者量身定做。

![image-20241220134752561](https://cdn.liboqiao.top/markdown/image-20241220134752561.png)

#### 页面样式与设计

使用 V0 的时候，你可以通过反复调整 prompt 来实现你想要的页面效果。比如在第一版的设计中，我做了一些简单的样式微调，调整了页面的布局和配色，使得整体界面更加清晰。

如果你想要自己动手写前端代码，可以用这个 `Dockerfile` 来构建前端镜像：

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

---

### 部署：Coding.net 持续集成

![image-20241220133910896](https://cdn.liboqiao.top/markdown/image-20241220133910896.png)

我使用 [e.coding.net](https://e.coding.net/) 来实现持续部署，让部署变得更加自动化。通过设置好 `pipeline`，每当代码更新时，CI/CD 会自动构建、推送 Docker 镜像并部署到远程服务器。

下面是`pipeline`,当然有些环境变量还是要自己配置的

![image-20241220134214738](https://cdn.liboqiao.top/markdown/image-20241220134214738.png)

#### Jenkinsfile 配置

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
```

通过这种方式，前后端镜像都会自动推送到 Docker Registry，部署过程几乎不需要人工干预。

---

### Nginx：解决跨域问题

最后，为了让前后端更好地协同工作，我使用了 **Nginx** 来处理跨域问题，配置了合适的域名，使得整个应用可以在不同的服务之间无缝对接。

---

总的来说，整个过程既充满挑战，也非常有趣。借助 V0 和 Cursor，开发变得更加高效，而 Docker 化部署和 CI/CD 又让我有了更多时间专注于业务逻辑的实现。对于像我这样的全栈开发者来说，掌握这些工具无疑是提高开发效率的好方法。

## Show

**mini-order**
[线上预览地址](https://min.liboqiao.top)
![image-20241220142721762](https://cdn.liboqiao.top/markdown/image-20241220142721762.png)
![image-20241220142742940](https://cdn.liboqiao.top/markdown/image-20241220142742940.png)

**mini-order-admin**
[线上预览地址](https://min.admin.liboqiao.top)
![image-20250114133103851](https://cdn.liboqiao.top/markdown/image-20250114133103851.png)
![image-20250114133221018](https://cdn.liboqiao.top/markdown/image-20250114133221018.png)
