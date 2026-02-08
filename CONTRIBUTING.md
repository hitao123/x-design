# Contributing to X Design

感谢你对 X Design 的关注和支持！

## 开发设置

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-org/x-design.git
cd x-design

# 安装依赖
pnpm install

# 启动文档站点
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 格式化代码
pnpm format
```

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档修改
- `style`: 代码格式修改（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat(button): add loading state
fix(input): resolve focus issue
docs: update quick start guide
```

## 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 创建 Pull Request

## 组件开发指南

### 目录结构

```
packages/components/
└── button/
    ├── Button.vue      # 组件实现
    ├── index.ts        # 导出
    ├── types.ts        # TypeScript 类型
    ├── style.scss      # 样式
    └── __tests__/      # 测试文件
        └── button.spec.ts
```

### 代码规范

- 使用 TypeScript
- 使用 Composition API
- 遵循 ESLint 规则
- 编写单元测试
- 添加文档示例

## 问题反馈

发现 bug 或有新功能建议？请创建 [Issue](https://github.com/your-org/x-design/issues)。

## License

[MIT](./LICENSE)
