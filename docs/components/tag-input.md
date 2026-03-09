# TagInput 标签输入

以标签的形式输入和管理多个值。

<script setup>
import { ref } from 'vue';
import { XTagInput } from '@x-design/components';

const tags1 = ref(['Vue', 'React']);
const tags2 = ref(['标签一']);
const tags3 = ref([]);
const tags4 = ref(['HTML', 'CSS']);
const tags5 = ref([]);
const tags6 = ref(['小型标签']);
const tags7 = ref(['中等标签']);
const tags8 = ref(['大型标签']);
const tags9 = ref(['Vue', 'React']);
</script>

## 基础用法

通过 `v-model` 绑定一个字符串数组，按 Enter 或 Tab 键添加标签，按 Backspace 键删除末尾标签。

<div class="demo-block">
  <XTagInput v-model="tags1" placeholder="输入后按 Enter 添加标签" />
</div>

```vue
<script setup>
import { ref } from 'vue';

const tags = ref(['Vue', 'React']);
</script>

<template>
  <XTagInput v-model="tags" placeholder="输入后按 Enter 添加标签" />
</template>
```

## 禁用状态

设置 `disabled` 属性禁用标签输入。

<div class="demo-block">
  <XTagInput v-model="tags2" disabled />
</div>

```vue
<XTagInput v-model="tags" disabled />
```

## 限制标签数量

使用 `max-tags` 属性限制最多可添加的标签数量。

<div class="demo-block">
  <XTagInput v-model="tags3" :max-tags="5" placeholder="最多 5 个标签" />
</div>

```vue
<XTagInput v-model="tags" :max-tags="5" placeholder="最多 5 个标签" />
```

## 允许重复

默认不允许添加重复的标签，设置 `allow-duplicates` 可以允许重复。

<div class="demo-block">
  <XTagInput v-model="tags4" allow-duplicates placeholder="可以输入重复标签" />
</div>

```vue
<XTagInput v-model="tags" allow-duplicates placeholder="可以输入重复标签" />
```

## 自定义标签样式

通过 `tag-type` 和 `tag-effect` 属性自定义标签的类型和主题。

<div class="demo-block">
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <XTagInput v-model="tags5" tag-type="success" placeholder="success 类型" />
    <XTagInput v-model="tags9" tag-type="warning" tag-effect="dark" placeholder="warning dark" />
  </div>
</div>

```vue
<XTagInput v-model="tags" tag-type="success" placeholder="success 类型" />
<XTagInput v-model="tags" tag-type="warning" tag-effect="dark" placeholder="warning dark" />
```

## 不同尺寸

提供三种尺寸的标签输入框。

<div class="demo-block">
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <XTagInput v-model="tags6" size="small" placeholder="小尺寸" />
    <XTagInput v-model="tags7" size="medium" placeholder="中等尺寸" />
    <XTagInput v-model="tags8" size="large" placeholder="大尺寸" />
  </div>
</div>

```vue
<XTagInput v-model="tags" size="small" placeholder="小尺寸" />
<XTagInput v-model="tags" size="medium" placeholder="中等尺寸" />
<XTagInput v-model="tags" size="large" placeholder="大尺寸" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `string[]` | `[]` |
| placeholder | 输入框占位文本 | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max-tags | 最大标签数量，0 为不限制 | `number` | `0` |
| closable | 标签是否可关闭 | `boolean` | `true` |
| tag-type | 标签类型 | `'default' \| 'success' \| 'info' \| 'warning' \| 'danger'` | `'default'` |
| tag-effect | 标签主题 | `'dark' \| 'light' \| 'plain'` | `'light'` |
| allow-duplicates | 是否允许重复标签 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 标签列表变化时触发 | `(value: string[]) => void` |
| add | 添加标签时触发 | `(value: string) => void` |
| remove | 移除标签时触发 | `(value: string) => void` |
| focus | 输入框获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 输入框失去焦点时触发 | `(event: FocusEvent) => void` |

### Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使输入框获得焦点 | `() => void` |
| blur | 使输入框失去焦点 | `() => void` |
