# Pagination 分页

当数据量过多时，使用分页分解数据。

<script setup>
import { ref } from 'vue';
import { XPagination } from '@x-design/components';

const current1 = ref(1);
const current2 = ref(1);
const pageSize2 = ref(10);
const current3 = ref(1);
const current4 = ref(5);
const current5 = ref(1);
const pageSize5 = ref(10);
</script>

## 基础用法

<div class="demo-block">
  <XPagination
    :current="current1"
    :total="100"
    @current-change="(val) => current1 = val"
  />
</div>

```vue
<template>
  <XPagination
    :current="current"
    :total="100"
    @current-change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import { XPagination } from '@x-design/components';

const current = ref(1);
const handleChange = (page) => {
  current.value = page;
};
</script>
```

## 完整功能

通过 `layout` 属性控制显示的功能模块，支持 `total`、`sizes`、`prev`、`pager`、`next`、`jumper`。

<div class="demo-block">
  <XPagination
    :current="current2"
    :page-size="pageSize2"
    :total="200"
    :page-sizes="[10, 20, 30, 50]"
    layout="total, sizes, prev, pager, next, jumper"
    @current-change="(val) => current2 = val"
    @size-change="(val) => { pageSize2 = val; current2 = 1; }"
  />
</div>

```vue
<template>
  <XPagination
    :current="current"
    :page-size="pageSize"
    :total="200"
    :page-sizes="[10, 20, 30, 50]"
    layout="total, sizes, prev, pager, next, jumper"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import { XPagination } from '@x-design/components';

const current = ref(1);
const pageSize = ref(10);

const handleCurrentChange = (page) => {
  current.value = page;
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  current.value = 1;
};
</script>
```

## 小尺寸

设置 `small` 属性使用小尺寸分页。

<div class="demo-block">
  <XPagination
    :current="current3"
    :total="100"
    small
    layout="prev, pager, next"
    @current-change="(val) => current3 = val"
  />
</div>

```vue
<XPagination :current="current" :total="100" small layout="prev, pager, next" />
```

## 大量页码

当页码较多时，会自动显示省略号，点击省略号快进/快退。

<div class="demo-block">
  <XPagination
    :current="current4"
    :total="500"
    layout="prev, pager, next"
    @current-change="(val) => current4 = val"
  />
</div>

```vue
<XPagination :current="current" :total="500" layout="prev, pager, next" />
```

## 禁用状态

<div class="demo-block">
  <XPagination
    :current="current5"
    :page-size="pageSize5"
    :total="100"
    disabled
    layout="total, prev, pager, next"
    @current-change="(val) => current5 = val"
  />
</div>

```vue
<XPagination :current="current" :total="100" disabled layout="total, prev, pager, next" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current | 当前页码 | `number` | `1` |
| page-size | 每页条数 | `number` | `10` |
| total | 总条数 | `number` | `0` |
| page-sizes | 每页条数选项 | `number[]` | `[10, 20, 30, 50]` |
| layout | 布局控件，逗号分隔 | `string` | `'total, prev, pager, next'` |
| small | 是否使用小型分页 | `boolean` | `false` |
| pager-count | 页码按钮数量（奇数） | `number` | `7` |
| hide-on-single-page | 只有一页时是否隐藏 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| current-change | 页码改变时触发 | `(page: number) => void` |
| size-change | 每页条数改变时触发 | `(size: number) => void` |
| update:current | 当前页码更新 | `(page: number) => void` |
| update:pageSize | 每页条数更新 | `(size: number) => void` |
