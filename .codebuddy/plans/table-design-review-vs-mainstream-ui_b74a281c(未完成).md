---
name: table-design-review-vs-mainstream-ui
overview: 梳理当前 `XTable` 的设计问题与能力缺口，并基于主流开源 UI 表格组件给出分优先级的改进建议和演进路线。
todos:
  - id: audit-current-state
    content: 使用[subagent:code-explorer]复核Table现状与文档差异
    status: pending
  - id: build-benchmark-matrix
    content: 建立主流表格能力对标矩阵
    status: pending
    dependencies:
      - audit-current-state
  - id: define-core-priorities
    content: 定义状态一致性与高频能力优先项
    status: pending
    dependencies:
      - audit-current-state
      - build-benchmark-matrix
  - id: plan-advanced-roadmap
    content: 规划中长期高级能力演进路线
    status: pending
    dependencies:
      - define-core-priorities
  - id: map-file-impacts
    content: 使用[subagent:code-explorer]映射文件级改造范围
    status: pending
    dependencies:
      - define-core-priorities
      - plan-advanced-roadmap
---

## 用户需求

审视当前 Table 组件在固定列、滚动、分页、排序、筛选、选择、展开、树形、溢出提示等方面的设计问题，结合现有实现与文档，识别状态一致性、交互完整性、组合场景风险和文档缺漏，并提出改进建议。

## 产品概览

该组件用于展示结构化数据，当前已具备基础表格、固定表头、固定列、行选择、排序筛选、展开行、树形数据、分页和自定义列内容等能力。此次输出需说明这些能力在横向滚动、长数据表格和复杂交互组合下的表现差异与体验问题。

## 核心功能

- 盘点当前 Table 能力、API 与文档覆盖范围
- 识别状态流和组合场景中的设计缺陷
- 对照主流 UI 库归纳缺失能力与成熟做法
- 输出短期、中期、长期改进建议及优先级

## 技术栈选择

- 组件框架：Vue 3 SFC + Composition API
- 语言：TypeScript
- 样式体系：SCSS + Theme Mixins + CSS Variables
- 文档：VitePress
- 测试基础：Vitest + jsdom（`/