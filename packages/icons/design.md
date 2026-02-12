## Figma 自动拉取 SVG + CI 自动发包 — 流程说明

### 一、Figma → SVG 自动拉取

**前提**：设计师在 Figma 中维护一个专门的图标页面（Page），每个图标是一个独立的 Component/Frame，命名用 kebab-case（如 `arrow-left`、`close`）。

**流程**：

```
Figma 图标页面
     │
     │  Figma REST API (GET /v1/files/:file_key/components)
     ▼
获取所有图标组件的 node id + 名称
     │
     │  Figma REST API (GET /v1/images/:file_key?ids=xxx&format=svg)
     ▼
拿到每个图标的 SVG 下载 URL
     │
     │  HTTP 下载
     ▼
写入 packages/icons/svg/{name}.svg
     │
     │  pnpm generate (已有的管线)
     ▼
Vue 组件 + index.ts 自动生成
```

**关键 API 调用**：

```
# 1. 获取文件中所有组件
GET https://api.figma.com/v1/files/{file_key}/components
Headers: X-Figma-Token: {personal_access_token}

# 响应中拿到每个组件的 node_id 和 name

# 2. 批量导出为 SVG
GET https://api.figma.com/v1/images/{file_key}?ids={node_id1,node_id2,...}&format=svg
Headers: X-Figma-Token: {personal_access_token}

# 响应返回每个 node_id 对应的 SVG 下载 URL（临时 S3 链接）

# 3. 逐个下载 SVG 文件，写入 svg/ 目录
```

**设计师端约定**：

- 图标统一放在 Figma 文件的某个固定 Page（如 "Icons"）
- 每个图标是一个 Component，命名即最终文件名（`close`、`arrow-left`）
- 画布尺寸统一（如 1024x1024 或 24x24）
- 不要嵌套多余的 Group/Frame

---

### 二、CI 自动化（GitHub Actions）

**触发时机**：`svg/` 目录有变更的 PR 合入 main 分支后。

**流程**：

```yaml
# .github/workflows/icons-publish.yml

name: Publish Icons

on:
  push:
    branches: [main]
    paths:
      - 'packages/icons/svg/**' # 只有 SVG 变更才触发

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      # 1. 拉代码
      - uses: actions/checkout@v4

      # 2. 装环境
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          registry-url: 'https://registry.npmjs.org'

      # 3. 安装依赖
      - run: pnpm install

      # 4. 生成组件（SVG → Vue → index.ts）
      - run: pnpm --filter @x-design/icons generate

      # 5. 构建
      - run: pnpm --filter @x-design/icons build

      # 6. 版本号自增（patch）
      - run: cd packages/icons && npm version patch --no-git-tag-version

      # 7. 发布
      - run: cd packages/icons && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      # 8. 提交版本号变更回 main
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore(icons): release $(node -p "require('./packages/icons/package.json').version")"
          git push
```

---

### 三、完整端到端流程

```
设计师更新 Figma 图标
        │
        │  方式 A: 手动触发脚本 (pnpm fetch-figma)
        │  方式 B: Figma Webhook → 自动触发 CI
        ▼
┌─────────────────────────┐
│  fetch-figma 脚本        │
│  1. 调 Figma API 拉组件列表 │
│  2. 导出 SVG 下载链接      │
│  3. 下载写入 svg/ 目录     │
└────────────┬────────────┘
             │  git add + commit + push (或自动 PR)
             ▼
┌─────────────────────────┐
│  PR 合入 main            │
└────────────┬────────────┘
             │  触发 GitHub Actions
             ▼
┌─────────────────────────┐
│  CI Pipeline             │
│  1. pnpm generate        │  SVG → SVGO优化 → Vue组件 → index.ts
│  2. pnpm build           │  Vite 构建产物
│  3. npm version patch    │  自增版本号
│  4. npm publish           │  发布到 npm
│  5. git push version     │  提交版本号回 main
└─────────────────────────┘
             │
             ▼
    @x-design/icons@0.0.2 发布成功
    业务项目 pnpm update 即可使用新图标
```

**方式 B 补充**：Figma 支持 Webhook（`FILE_UPDATE` 事件），可以在设计师保存文件时自动通知你的服务，触发 GitHub Actions 的 `workflow_dispatch`，实现全自动——设计师改完图标，什么都不用做，新版本就发出来了。

### 四、关键配置项

| 配置             | 位置                | 说明                                 |
| ---------------- | ------------------- | ------------------------------------ |
| `FIGMA_TOKEN`    | GitHub Secrets      | Figma Personal Access Token          |
| `FIGMA_FILE_KEY` | 环境变量 / 脚本配置 | Figma 文件 URL 中的 key              |
| `NPM_TOKEN`      | GitHub Secrets      | npm 发布 token                       |
| `paths` 过滤     | CI yaml             | 只在 `svg/` 变更时触发，避免无效构建 |
