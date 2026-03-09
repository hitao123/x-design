---
name: table-review
overview: 评估当前 XTable 的设计缺口，并整理对标主流 UI 库的改进路线。
todos:
  - id: inventory-table
    content: 使用 [subagent:code-explorer] 盘点 Table 能力与状态流
    status: completed
  - id: benchmark-mainstream
    content: 对照主流 UI 库整理能力矩阵与差距
    status: completed
    dependencies:
      - inventory-table
  - id: identify-risks
    content: 归类 Table 设计缺陷与组合场景风险
    status: completed
    dependencies:
      - inventory-table
  - id: prioritize-roadmap
    content: 输出短中长期改进优先级与取舍
    status: completed
    dependencies:
      - benchmark-mainstream
      - identify-risks
  - id: map-code-changes
    content: 映射 types、composables、样式与文档改造点
    status: completed
    dependencies:
      - prioritize-roadmap
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
- 测试基础：Vitest + jsdom（`/Users/henryhua/gitProj/x-design/vitest.config.ts` 已配置，仓库当前暂无现成组件测试）

## 实施方案

### 高层策略

以 `/Users/henryhua/gitProj/x-design/packages/components/table/Table.vue` 的状态编排为主线，先建立“现有能力矩阵”，再按主流表格组件的共同能力基线进行对照，最后把问题分成“语义缺陷、基础能力缺失、企业级能力缺失、性能能力缺口”四类，输出分优先级的改进路线。

### 关键技术判断

- **当前定位**：现有 `XTable` 已覆盖基础展示型表格，但距离主流企业级数据表格仍有明显差距。
- **首要问题不是功能数量，而是状态语义一致性**：`selection`、`pagination`、`filter`、`sort`、`expand`、`tree` 目前没有统一的受控模型，组合场景容易出现行为不一致。
- **主流对照基线**：参考 Element Plus、Ant Design Vue、Naive UI、TDesign 的共同成熟能力维度，重点看：
- 受控与非受控状态一致性
- 本地与远程排序/筛选/分页语义
- 固定列/固定表头/横向滚动稳定性
- 树形、展开、选择的组合行为
- ellipsis + 真实 tooltip
- summary、单元格合并、懒加载
- 虚拟滚动、列宽调整、拖拽等性能与高级能力
- **性能判断**：当前数据管线是 `排序 O(n log n) + 筛选 O(n*m) + 树形展平 O(n) + 分页切片`。大数据场景的瓶颈主要在全量重算和整表重渲染；固定列偏移在 `useColumns.ts` 中按列重复遍历，后续可通过预计算列元数据降低热路径开销。
- **避免技术债**：后续若进入实现，应优先补齐受控同步与 API 语义，不建议直接堆叠高级功能，否则会放大现有不一致。

### 主流对照后的改进建议

#### 短期优先

- 统一排序、筛选、分页、选择、展开的状态语义，先解决“看得见的数据”和“内部维护的数据”不一致问题
- 补齐 `rowKey` 在选择、树形、展开、分页组合场景中的稳定约束
- 让 `pagination.current`、`pagination.pageSize`、`filteredValue` 支持外部更新同步
- 将 `showOverflowTooltip` 从原生 `title` 升级为复用现有 Tooltip 组件的真实提示
- 补正文档遗漏的 `filter-change`、`clearFilter`、`setFilter`，同步示例与 API 表

#### 中期增强

- 为排序补充更细粒度扩展点，如自定义 compare、远程排序语义
- 为筛选补充更完整的受控模型和可扩展筛选面板能力
- 增加 `summary`、单元格合并、header/cell style 回调等高频企业能力
- 为选择列补齐禁选、保留选择、仅当前页全选等常见语义
- 为树形数据补齐 `hasChildren` 语义与懒加载扩展位

#### 长期演进

- 虚拟滚动与大数据优化
- 列宽调整、列拖拽、顺序持久化
- 可编辑单元格/行编辑
- 更细粒度的多状态联动与性能缓存

## 实施注意事项

- 复用现有 composable 拆分，不引入并行新架构；优先在 `useSelection`、`useSorter`、`useFilter`、`useExpand`、`useTree`、`useColumns` 内各自收敛职责。
- `Table.vue`、`useColumns.ts`、`style.scss`、`packages/theme/src/mixins/table.scss` 当前已有未提交变更；后续实施必须基于现有 diff 精准追加，避免覆盖用户在工作区中的修改。
- 保持向后兼容，优先新增可选 props / emits / expose 能力，不轻易修改现有事件名和基础列定义。
- 若继续允许缺省 `rowKey`，建议至少增加文档限制说明；更稳妥的做法是在复杂模式下给出开发态警告。
- 浮层类能力优先复用现有组件库能力，避免 `TableFilter.vue` 和 Tooltip 形成两套不同浮层行为。

## 架构设计

### 当前结构

- `Table.vue`：主渲染入口，负责事件派发、分页集成、状态串联
- `TableFilter.vue`：筛选面板交互
- `useSelection.ts`：选择逻辑
- `useSorter.ts`：排序逻辑
- `useFilter.ts`：筛选逻辑
- `useExpand.ts`：展开逻辑
- `useTree.ts`：树形逻辑
- `useColumns.ts`：列宽、固定列、表头 class 计算
- `style.scss` 与 `packages/theme/src/mixins/table.scss`：样式与主题

### 当前数据流

- `props.data -> sorter.sortedData -> filter.filteredData -> tree.flattenTreeData -> pagination slice -> displayData`
- 但 `selection` 直接基于 `props.data`，与显示数据流脱节，是当前最明显的设计问题之一。

### 改进架构方向

- 第一层：统一状态模型，收敛本地/受控语义
- 第二层：补齐高频基础能力与文档
- 第三层：补齐企业级表格能力
- 第四层：单独推进性能能力，避免一次性重构

## 目录结构

本次评审与后续首轮改造建议集中在现有 Table 实现，不建议新增平行组件。

`/Users/henryhua/gitProj/x-design/`

- `packages/components/table/Table.vue`  `[MODIFY]` 表格主入口。用于统一排序、筛选、分页、选择、展开的数据语义，补齐受控同步与事件行为。
- `packages/components/table/TableFilter.vue`  `[MODIFY]` 筛选面板。用于修复定位、滚动/resize 跟随、可访问性与交互一致性。
- `packages/components/table/types.ts`  `[MODIFY]` 类型定义。用于补齐受控状态、远程模式、selection 配置、ellipsis/summary/span 等扩展接口。
- `packages/components/table/composables/useSelection.ts`  `[MODIFY]` 选择逻辑。改为基于稳定 `rowKey` 和明确的数据语义，支持后续保留选择与禁选扩展。
- `packages/components/table/composables/useSorter.ts`  `[MODIFY]` 排序逻辑。补齐 compare 扩展和远程排序语义。
- `packages/components/table/composables/useFilter.ts`  `[MODIFY]` 筛选逻辑。补齐外部 `filteredValue` 同步和统一筛选状态。
- `packages/components/table/composables/useExpand.ts`  `[MODIFY]` 展开逻辑。补强受控展开与树形/展开组合语义。
- `packages/components/table/composables/useTree.ts`  `[MODIFY]` 树形逻辑。补齐 `hasChildren` 和懒加载扩展位。
- `packages/components/table/composables/useColumns.ts`  `[MODIFY]` 列布局与固定列计算。后续用于预计算 fixed offset，并扩展 scroll/ellipsis/resizable 相关能力。
- `packages/components/table/style.scss`  `[MODIFY]` 组件样式。补齐 ellipsis、tooltip、固定列阴影、状态背景与高级交互样式。
- `packages/theme/src/mixins/table.scss`  `[MODIFY]` Table 主题 mixin。统一 sticky 层级、滚动容器和尺寸变量。
- `docs/components/table.md`  `[MODIFY]` 文档与 demo。补齐 API、事件、方法、受控模式与高级能力示例。
- `packages/components/table/__tests__/table.spec.ts`  `[NEW]` 表格核心行为测试。覆盖排序/筛选/分页/固定列/受控状态关键回归场景。

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 深入扫描 `table` 组件相关文件、状态流、调用链和文档缺口，验证后续改造范围。
- Expected outcome: 形成可靠的能力矩阵、问题清单和文件改造落点，避免遗漏受影响模块。