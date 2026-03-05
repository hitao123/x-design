# Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

基础的树形结构展示。

<script setup>
import { ref } from 'vue';
import { XTree } from '@x-design/components';

const data = ref([
  {
    label: '一级 1',
    children: [
      {
        label: '二级 1-1',
        children: [
          { label: '三级 1-1-1' },
          { label: '三级 1-1-2' },
        ],
      },
    ],
  },
  {
    label: '一级 2',
    children: [
      { label: '二级 2-1' },
      { label: '二级 2-2' },
    ],
  },
  {
    label: '一级 3',
    children: [
      { label: '二级 3-1' },
      { label: '二级 3-2' },
    ],
  },
]);
</script>

<div class="demo-block">
  <XTree :data="data" />
</div>

```vue
<script setup>
import { ref } from 'vue';
const data = ref([
  {
    label: '一级 1',
    children: [
      {
        label: '二级 1-1',
        children: [
          { label: '三级 1-1-1' },
          { label: '三级 1-1-2' },
        ],
      },
    ],
  },
  {
    label: '一级 2',
    children: [
      { label: '二级 2-1' },
      { label: '二级 2-2' },
    ],
  },
]);
</script>

<XTree :data="data" />
```

## 默认展开

通过 `default-expand-all` 属性默认展开全部节点。

<div class="demo-block">
  <XTree :data="data" default-expand-all />
</div>

```vue
<XTree :data="data" default-expand-all />
```

## 可选择

通过 `show-checkbox` 属性启用复选框。

<div class="demo-block">
  <XTree :data="data" show-checkbox default-expand-all />
</div>

```vue
<XTree :data="data" show-checkbox default-expand-all />
```

## 禁用节点

通过节点数据中的 `disabled` 字段禁用节点。

<div class="demo-block">
  <XTree
    :data="[
      { label: '可选节点', children: [{ label: '子节点 1' }, { label: '子节点 2', disabled: true }] },
      { label: '禁用节点', disabled: true },
    ]"
    show-checkbox
    default-expand-all
  />
</div>

```vue
<XTree
  :data="[
    { label: '可选节点', children: [{ label: '子节点 1' }, { label: '子节点 2', disabled: true }] },
    { label: '禁用节点', disabled: true },
  ]"
  show-checkbox
  default-expand-all
/>
```

## 默认选中

通过 `default-checked-keys` 设置默认勾选的节点，需配合 `node-key` 使用。

```vue
<XTree
  :data="data"
  show-checkbox
  node-key="label"
  :default-checked-keys="['三级 1-1-1']"
  default-expand-all
/>
```

## 父子不关联

设置 `check-strictly` 为 `true`，父子节点不再联动。

```vue
<XTree
  :data="data"
  show-checkbox
  check-strictly
  default-expand-all
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 展示数据 | `TreeNodeData[]` | `[]` |
| node-key | 每个节点的唯一标识字段名 | `string` | `'label'` |
| show-checkbox | 是否显示复选框 | `boolean` | `false` |
| default-expand-all | 是否默认展开所有节点 | `boolean` | `false` |
| default-expanded-keys | 默认展开的节点 key 数组 | `(string \| number)[]` | — |
| default-checked-keys | 默认勾选的节点 key 数组 | `(string \| number)[]` | — |
| expand-on-click-node | 是否点击节点时展开 | `boolean` | `true` |
| check-strictly | 是否严格模式（父子不联动） | `boolean` | `false` |
| empty-text | 内容为空时展示的文本 | `string` | `'暂无数据'` |
| indent | 相邻级节点间的缩进（像素） | `number` | `18` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| node-click | 节点被点击时触发 | `(data: TreeNodeData, key: TreeKey)` |
| check-change | 节点选中状态变化时触发 | `(data: TreeNodeData, checked: boolean, key: TreeKey)` |
| current-change | 当前选中节点变化时触发 | `(data: TreeNodeData, key: TreeKey)` |

### Exposes

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| getCheckedKeys | 获取选中节点的 key 数组 | — |
| getCheckedNodes | 获取选中节点的数据数组 | — |
| setCheckedKeys | 设置选中的节点 | `(keys: TreeKey[])` |

### TreeNodeData

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| label | 节点标签 | `string` |
| children | 子节点 | `TreeNodeData[]` |
| disabled | 是否禁用 | `boolean` |
