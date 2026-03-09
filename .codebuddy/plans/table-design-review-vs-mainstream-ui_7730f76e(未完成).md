---
name: table-design-review-vs-mainstream-ui
overview: 评估当前 `XTable` 的能力边界、设计问题与 API 缺口，并对照主流开源 UI 库整理优先级明确的改进建议与落地路线。
todos:
  - id: audit-current-capabilities
    content: 用 [subagent:code-explorer] 复核 Table 能力、状态链路与文档差异
    status: pending
  - id: build-benchmark-matrix
    content: 建立主流 UI 表格能力对照矩阵
    status: pending
    dependencies:
      - audit-current-capabilities
  - id: classify-design-gaps
    content: 归类设计缺陷、缺失能力与交互风险
    status: pending
    dependencies:
      - build-benchmark-matrix
  - id: prioritize-roadmap
    content: 输出短中长期改进优先级与取舍依据
    status: pending
    dependencies:
      - classify-design-gaps
  - id: map-change-scope
    content: 落到 types、Table.vue、composables、styles、docs 改造范围
    status: pending
    dependencies:
      - prioritize-roadmap
---

## User Requirements

- 基于现有 XTable 实现与文档，审视当前 Table 设计还存在哪些问题，先做评估与建议，不直接改代码。
- 对照主流开源 UI 表格组件的共性能力维度，评估当前能力覆盖、API 语义、状态一致性、交互完整性、扩展性与文档完整度。
- 输出可落地的改进建议，并按短期修复、中期增强、长期演进进行分层。

## Product Overview

- 当前对象是 PC 端组件库中的表格组件，承载数据展示、排序、筛选、选择、展开、树形、固定列、分页等核心表格交互。
- 评审不仅关注功能是否可用，也关注滚动体验、固定列表现、内容溢出提示、筛选弹层定位、状态联动和文档可理解性。

## Core Features

- 盘点当前已实现能力及边界：列配置、固定列与固定表头、排序、筛选、选择列、展开行、树形数据、分页、自定义插槽与 render、溢出提示。
- 归类当前问题：状态模型不一致、组合场景语义不完整、布局和滚动边界脆弱、企业级能力缺失、文档与实现不一致。
- 形成改进建议：建立主流能力对照矩阵，给出分阶段演进方向与优先级。

## Tech Stack Selection

- 保持现有项目技术栈：Vue 3 Composition API、TypeScript、SCSS、VitePress、Vitest、pnpm workspace Monorepo。
- 评估范围基于已确认代码：`packages/components/table`、`packages/theme/src/mixins/table.scss`、`docs/components/table.md`。
- 对照基线采用主流 Vue 表格组件的共性能力维度，参考范围包括 Element Plus、Ant Design Vue、Naive UI、TDesign Vue Next。

## Implementation Approach

- 采用“现状基线梳理 + 主流能力对照 + 分层改进建议”的方式完成评审，先确认当前实现事实，再输出问题分类和演进建议。
- 重点从五个层面审视：API 语义、状态一致性、组合场景、布局交互、性能与扩展性。
- 关键决策：
- 以现有 `Table.vue + composables + types + style + docs` 结构为基础，不建议先引入全新架构。
- 优先解决受控与非受控语义、状态联动和文档口径，再评估高级能力扩展。
- 对照采用主流表格的共性能力维度，而不是照搬单一库实现细节，降低设计偏差。
- 性能与可靠性：
- 树形展平在相关状态变化时为 O(n)，大数据量场景会放大计算成本。
- 固定列偏移当前按列线性累计，渲染期重复计算，后续实现时应考虑缓存左右偏移映射。
- 排序、筛选、树形、分页、选择应收敛为单一展示数据管线，避免状态脱节。
- 避免技术债：
- 先补齐现有 props、events、expose 的语义一致性与受控监听。
- 虚拟滚动、列宽调整、列拖拽、可编辑单元格等高复杂度能力放在基础状态模型稳定后再推进。

## Implementation Notes

- 已确认的设计与实现问题：
- `useSelection` 基于 `props.data`，与分页、筛选、树形后的展示数据语义不一致。
- `filteredValue` 只在挂载时初始化一次，外部更新列配置无法同步。
- `pagination.current` 和 `pagination.pageSize` 仅初始化读取，缺少后续同步。
- `treeProps.hasChildren` 当前未被使用，树形懒加载扩展路径不完整。
- `showOverflowTooltip` 当前仅通过 `title` 提示，和完整 tooltip 交互不一致。
- `TableFilter.vue` 的弹层位置未随容器滚动或窗口变化重算。
- 变更控制建议：
- 当前 `Table.vue`、`useColumns.ts`、`style.scss`、`packages/theme/src/mixins/table.scss` 已存在在途修改，后续实施需避免覆盖冲突。
- 优先保持向后兼容，通过补充监听、补齐事件文档和新增配置项渐进演进，避免一次性重写。

## Architecture Design

- 当前结构职责已较清晰：
- `Table.vue` 负责渲染、状态编排、事件透出、分页接入。
- `types.ts` 定义 `TableProps`、`TableColumn`、排序和筛选状态边界。
- `useSelection`、`useSorter`、`useFilter`、`useExpand`、`useTree`、`useColumns` 分别承载单项能力。
- `style.scss` 与 `packages/theme/src/mixins/table.scss` 共同承担表格视觉和布局规则。
- `docs/components/table.md` 负责示例和 API 文档。
- 建议演进顺序：

1. 统一状态模型与受控语义。
2. 统一布局、滚动、tooltip、筛选弹层等交互行为。
3. 再扩展企业级能力，如远程模式、summary、span、virtual、resizable。

## Directory Structure

本次评审及后续建议主要落在以下文件：

```text
/Users/henryhua/gitProj/x-design/
├── packages/components/table/Table.vue
│   - [MODIFY] 表格主渲染与状态编排；后续用于统一排序、筛选、分页、选择、展开、树形的数据管线与暴露方法。
├── packages/components/table/types.ts
│   - [MODIFY] 表格与列配置类型边界；后续用于补齐受控属性、远程模式和扩展型列能力。
├── packages/components/table/TableFilter.vue
│   - [MODIFY] 筛选面板交互与定位；后续用于统一弹层定位、状态同步和可访问性行为。
├── packages/components/table/composables/useSelection.ts
│   - [MODIFY] 选择模型；重点核对与分页、筛选、树形联动的语义一致性。
├── packages/components/table/composables/useSorter.ts
│   - [MODIFY] 排序模型；重点扩展本地和远程排序边界与比较能力。
├── packages/components/table/composables/useFilter.ts
│   - [MODIFY] 筛选模型；重点补齐受控同步、默认值更新与外部驱动能力。
├── packages/components/table/composables/useExpand.ts
│   - [MODIFY] 展开行状态；重点核对受控展开与树形展开的职责边界。
├── packages/components/table/composables/useTree.ts
│   - [MODIFY] 树形数据处理；重点评估懒加载、hasChildren、展平性能与层级语义。
├── packages/components/table/composables/useColumns.ts
│   - [MODIFY] 列宽、固定列、最小宽度计算；重点优化固定列偏移与布局鲁棒性。
├── packages/components/table/style.scss
│   - [MODIFY] 组件层视觉规则；重点统一 fixed、hover、stripe、selected、overflow 视觉表现。
├── packages/theme/src/mixins/table.scss
│   - [MODIFY] 主题级表格基础 mixin；重点约束 sticky、z-index、overflow 与尺寸变量。
└── docs/components/table.md
    - [MODIFY] 文档与 demo；补齐事件、方法、能力边界、已知限制与对照说明。
```

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 复核 Table 相关文件、API 定义、状态链路和文档差异，保证评审结论基于代码事实。
- Expected outcome: 输出可靠的能力盘点、问题清单、影响范围和分阶段改进建议。