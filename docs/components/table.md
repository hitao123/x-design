# Table 表格

用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。

<script setup>
import { ref } from 'vue';
import { XTable } from '@x-design/components';

const tableData = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区', phone: '13800001111', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区', phone: '13800002222', email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区', phone: '13800003333', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', age: 30, address: '深圳市南山区', phone: '13800004444', email: 'zhaoliu@example.com' },
  { id: 5, name: '孙七', age: 27, address: '杭州市西湖区', phone: '13800005555', email: 'sunqi@example.com' },
  { id: 6, name: '周八', age: 35, address: '成都市武侯区', phone: '13800006666', email: 'zhouba@example.com' },
  { id: 7, name: '吴九', age: 29, address: '南京市鼓楼区', phone: '13800007777', email: 'wujiu@example.com' },
  { id: 8, name: '郑十', age: 33, address: '武汉市江汉区', phone: '13800008888', email: 'zhengshi@example.com' },
]);

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址' },
];

const columnsWithSelection = [
  { type: 'selection', width: 55 },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址' },
];

const handleSelectionChange = (selection) => {
  console.log('选中的行：', selection);
};

const sortableColumns = [
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, sortable: true },
  { prop: 'address', label: '地址' },
];

const handleSortChange = ({ prop, order }) => {
  console.log('排序：', prop, order);
};

const columnsWithSlots = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址' },
  { prop: 'actions', label: '操作', slots: { default: 'actions' } },
];

const handleEdit = (row) => {
  console.log('编辑：', row);
};

const handleDelete = (row) => {
  console.log('删除：', row);
};

const expandColumns = [
  { type: 'expand' },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
];

const treeData = ref([
  {
    id: 1,
    name: '一级 1',
    children: [
      {
        id: 11,
        name: '二级 1-1',
        children: [
          { id: 111, name: '三级 1-1-1' },
          { id: 112, name: '三级 1-1-2' },
        ],
      },
      { id: 12, name: '二级 1-2' },
    ],
  },
  {
    id: 2,
    name: '一级 2',
    children: [
      { id: 21, name: '二级 2-1' },
      { id: 22, name: '二级 2-2' },
    ],
  },
]);

const treeColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '名称' },
];

const fixedColumns = [
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: '姓名', width: 120, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'address', label: '地址', width: 300 },
  { prop: 'phone', label: '电话', width: 150 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'actions', label: '操作', width: 150, fixed: 'right' },
];

const customHeaderColumns = [
  { prop: 'name', label: '姓名', slots: { header: 'nameHeader' } },
  { prop: 'age', label: '年龄' },
];

// 分页 Demo
const paginationData = ref([]);
for (let i = 1; i <= 50; i++) {
  paginationData.value.push({
    id: i,
    name: `用户 ${i}`,
    age: 20 + (i % 30),
    address: ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区'][i % 5],
  });
}

const paginationColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址' },
];
</script>

## 基础用法

基础的表格展示用法。

<div class="demo-block">
  <XTable :data="tableData" :columns="columns" />
</div>

```vue
<template>
  <XTable :data="tableData" :columns="columns" />
</template>

<script setup>
import { ref } from 'vue';
import { XTable } from '@x-design/components';

const tableData = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区' },
]);

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址' },
];
</script>
```

## 带边框表格

设置 `border` 属性显示列边框。

<div class="demo-block">
  <XTable :data="tableData" :columns="columns" border />
</div>

```vue
<XTable :data="tableData" :columns="columns" border />
```

## 斑马纹表格

使用 `stripe` 属性创建斑马纹表格。

<div class="demo-block">
  <XTable :data="tableData" :columns="columns" stripe />
</div>

```vue
<XTable :data="tableData" :columns="columns" stripe />
```

## 斑马纹 + 边框组合

`stripe` 和 `border` 可以同时使用。

<div class="demo-block">
  <XTable :data="tableData" :columns="columns" stripe border />
</div>

```vue
<XTable :data="tableData" :columns="columns" stripe border />
```

## 带选择框

添加 `type="selection"` 的列即可实现多选功能。

<div class="demo-block">
  <XTable
    :data="tableData"
    :columns="columnsWithSelection"
    row-key="id"
    @selection-change="handleSelectionChange"
  />
</div>

```vue
<template>
  <XTable
    :data="tableData"
    :columns="columns"
    row-key="id"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup>
const columns = [
  { type: 'selection', width: 55 },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名' },
];

const handleSelectionChange = (selection) => {
  console.log('选中的行：', selection);
};
</script>
```

## 排序

在列中设置 `sortable` 属性即可实现该列的排序。

<div class="demo-block">
  <XTable
    :data="tableData"
    :columns="sortableColumns"
    @sort-change="handleSortChange"
  />
</div>

```vue
<template>
  <XTable
    :data="tableData"
    :columns="columns"
    @sort-change="handleSortChange"
  />
</template>

<script setup>
const columns = [
  { prop: 'id', label: 'ID', sortable: true },
  { prop: 'age', label: '年龄', sortable: true },
];

const handleSortChange = ({ prop, order }) => {
  console.log('排序：', prop, order);
};
</script>
```

## 自定义列模板

通过插槽可以自定义列的显示内容。

<div class="demo-block">
  <XTable :data="tableData" :columns="columnsWithSlots">
    <template #actions="{ row }">
      <button @click="handleEdit(row)">编辑</button>
      <button @click="handleDelete(row)">删除</button>
    </template>
  </XTable>
</div>

```vue
<template>
  <XTable :data="tableData" :columns="columns">
    <template #actions="{ row }">
      <XButton size="small" @click="handleEdit(row)">编辑</XButton>
      <XButton size="small" type="danger" @click="handleDelete(row)">删除</XButton>
    </template>
  </XTable>
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'actions', label: '操作', slots: { default: 'actions' } },
];
</script>
```

## 展开行

当行内容过多并且不想显示横向滚动条时，可以使用展开行功能。

<div class="demo-block">
  <XTable :data="tableData" :columns="expandColumns" row-key="id">
    <template #expand="{ row }">
      <div style="padding: 20px;">
        <p><strong>详细信息：</strong></p>
        <p>地址：{{ row.address }}</p>
        <p>ID：{{ row.id }}</p>
      </div>
    </template>
  </XTable>
</div>

```vue
<template>
  <XTable :data="tableData" :columns="columns" row-key="id">
    <template #expand="{ row }">
      <div style="padding: 20px;">
        <p>详细信息：{{ row.address }}</p>
      </div>
    </template>
  </XTable>
</template>

<script setup>
const columns = [
  { type: 'expand' },
  { prop: 'name', label: '姓名' },
];
</script>
```

## 树形数据

支持树形数据的显示。

<div class="demo-block">
  <XTable
    :data="treeData"
    :columns="treeColumns"
    row-key="id"
    :tree-props="{ children: 'children' }"
  />
</div>

```vue
<template>
  <XTable
    :data="treeData"
    :columns="columns"
    row-key="id"
    :tree-props="{ children: 'children' }"
  />
</template>

<script setup>
const treeData = ref([
  {
    id: 1,
    name: '一级 1',
    children: [
      { id: 11, name: '二级 1-1' },
    ],
  },
]);

const columns = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '名称' },
];
</script>
```

## 固定列

固定列需要使用 `fixed` 属性，它接受 `left` 或 `right`。多个固定列会按累计宽度偏移，不会重叠。

<div class="demo-block">
  <XTable :data="tableData" :columns="fixedColumns" border style="width: 800px;" />
</div>

```vue
<XTable :data="tableData" :columns="columns" border style="width: 800px;" />

<script setup>
const columns = [
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: '姓名', width: 120, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'address', label: '地址', width: 300 },
  { prop: 'phone', label: '电话', width: 150 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'actions', label: '操作', width: 150, fixed: 'right' },
];
</script>
```

## 固定表头

设置 `height` 或 `max-height` 属性即可实现固定表头。滚动时表头保持在顶部。

<div class="demo-block">
  <XTable :data="tableData" :columns="columns" height="250px" border />
</div>

```vue
<XTable :data="tableData" :columns="columns" height="250px" border />
```

## 自定义表头

通过设置列的 `slots.header` 属性可以自定义表头。

<div class="demo-block">
  <XTable :data="tableData" :columns="customHeaderColumns">
    <template #nameHeader="{ column }">
      <span style="color: red;">★ {{ column.label }}</span>
    </template>
  </XTable>
</div>

```vue
<template>
  <XTable :data="tableData" :columns="columns">
    <template #nameHeader="{ column }">
      <span style="color: red;">★ {{ column.label }}</span>
    </template>
  </XTable>
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', slots: { header: 'nameHeader' } },
];
</script>
```

## 分页

通过 `pagination` 属性配置内置分页。

<div class="demo-block">
  <XTable
    :data="paginationData"
    :columns="paginationColumns"
    :pagination="{ pageSize: 10 }"
  />
</div>

```vue
<template>
  <XTable
    :data="tableData"
    :columns="columns"
    :pagination="{ pageSize: 10 }"
  />
</template>

<script setup>
// 50 条数据，每页 10 条
const tableData = ref([...]);
</script>
```

## API

### Table Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表格数据 | `any[]` | `[]` |
| columns | 列配置 | `TableColumn[]` | `[]` |
| border | 是否显示列边框 | `boolean` | `false` |
| stripe | 是否显示斑马纹 | `boolean` | `false` |
| size | 表格尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| show-header | 是否显示表头 | `boolean` | `true` |
| highlight-current-row | 是否高亮当前行 | `boolean` | `false` |
| row-key | 行数据的 Key，用于优化渲染 | `string` | - |
| height | 表格高度，固定表头 | `string \| number` | - |
| max-height | 表格最大高度 | `string \| number` | - |
| loading | 加载状态 | `boolean` | `false` |
| default-sort | 默认排序列 | `{ prop: string, order: SortOrder }` | - |
| row-class-name | 行类名 | `string \| ((row, index) => string)` | - |
| cell-class-name | 单元格类名 | `string \| ((row, column, rowIndex, columnIndex) => string)` | - |
| show-overflow-tooltip | 内容溢出时显示 tooltip | `boolean` | `false` |
| expand-row-keys | 展开行的 key 数组 | `(string \| number)[]` | - |
| default-expand-all | 是否默认展开所有行（树形数据） | `boolean` | `false` |
| tree-props | 树形数据配置 | `{ children?: string, hasChildren?: string }` | - |
| pagination | 分页配置 | `TablePagination \| false` | - |

### TableColumn

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 列类型 | `'selection' \| 'index' \| 'expand'` | - |
| prop | 字段名 | `string` | - |
| label | 列标题 | `string` | - |
| width | 列宽度 | `number \| string` | - |
| min-width | 列最小宽度 | `number \| string` | - |
| align | 对齐方式 | `'left' \| 'center' \| 'right'` | `'left'` |
| fixed | 固定列 | `'left' \| 'right'` | - |
| sortable | 是否可排序 | `boolean \| 'custom'` | `false` |
| formatter | 格式化函数 | `(row, column, cellValue, index) => any` | - |
| slots | 自定义插槽 | `{ default?: string, header?: string }` | - |

### Table Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| row-click | 行点击事件 | `(row, index) => void` |
| selection-change | 选择项变化事件 | `(selection: any[]) => void` |
| sort-change | 排序变化事件 | `({ prop: string, order: SortOrder }) => void` |
| expand-change | 展开行变化事件 | `(row: any, expanded: boolean) => void` |
| pagination-change | 分页变化事件 | `(current: number, pageSize: number) => void` |

### Table Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| clearSelection | 清空选择 | `() => void` |
| toggleRowSelection | 切换某行的选中状态 | `(row: any, selected?: boolean) => void` |
| toggleAllSelection | 切换全选 | `() => void` |
| clearSort | 清空排序 | `() => void` |
| sort | 设置排序 | `(prop: string, order: SortOrder) => void` |

### Table Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| empty | 空数据时的内容 | - |
| expand | 展开行内容 | `{ row, $index }` |
| [column.slots.default] | 自定义列内容 | `{ row, column, $index }` |
| [column.slots.header] | 自定义表头内容 | `{ column }` |
