# Select 选择器

当选项过多时，使用下拉菜单展示并选择内容。

<script setup>
import { ref } from 'vue';
import { XSelect } from '@x-design/components';

const value = ref('');
const disabledValue = ref('1');
const value2 = ref('');
const value3 = ref('1');
const value4 = ref('');
const multipleValue = ref([]);
const limitValue = ref([]);
const sizeValue = ref('');

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
];

const optionsWithDisabled = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2', disabled: true },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4', disabled: true },
];

const searchOptions = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
];
</script>

## 基础用法

适用广泛的基础单选。

<div class="demo-block">
  <XSelect v-model="value" :options="options" placeholder="请选择" />
</div>

```vue
<template>
  <XSelect v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue';
import { XSelect } from '@x-design/components';

const value = ref('');

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
];
</script>
```

## 禁用状态

设置 `disabled` 属性禁用选择器。

<div class="demo-block">
  <XSelect v-model="disabledValue" :options="options" disabled />
</div>

```vue
<XSelect v-model="value" :options="options" disabled />
```

## 禁用选项

在选项对象中设置 `disabled` 属性可以禁用该选项。

<div class="demo-block">
  <XSelect v-model="value2" :options="optionsWithDisabled" placeholder="请选择" />
</div>

```vue
<script setup>
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2', disabled: true },
  { label: '选项3', value: '3' },
];
</script>
```

## 可清空

设置 `clearable` 属性可以清空已选项。

<div class="demo-block">
  <XSelect v-model="value3" :options="options" clearable placeholder="请选择" />
</div>

```vue
<XSelect v-model="value" :options="options" clearable placeholder="请选择" />
```

## 可搜索

设置 `filterable` 属性可以启用搜索功能。

<div class="demo-block">
  <XSelect v-model="value4" :options="searchOptions" filterable placeholder="请搜索" />
</div>

```vue
<XSelect v-model="value" :options="options" filterable placeholder="请搜索" />
```

## 多选

设置 `multiple` 属性启用多选，此时 `v-model` 的值为数组。

<div class="demo-block">
  <XSelect 
    v-model="multipleValue" 
    :options="options" 
    multiple 
    placeholder="请选择多个"
  />
</div>

```vue
<template>
  <XSelect 
    v-model="value" 
    :options="options" 
    multiple 
    placeholder="请选择多个"
  />
</template>

<script setup>
import { ref } from 'vue';

const value = ref([]);
</script>
```

## 限制多选数量

使用 `multiple-limit` 属性限制可选择的数量。

<div class="demo-block">
  <XSelect 
    v-model="limitValue" 
    :options="options" 
    multiple 
    :multiple-limit="3"
    placeholder="最多选择 3 项"
  />
</div>

```vue
<XSelect 
  v-model="value" 
  :options="options" 
  multiple 
  :multiple-limit="3"
  placeholder="最多选择 3 项"
/>
```

## 不同尺寸

提供三种尺寸的选择器。

<div class="demo-block">
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <XSelect v-model="sizeValue" :options="options" size="small" placeholder="小尺寸" />
    <XSelect v-model="sizeValue" :options="options" size="medium" placeholder="中等尺寸" />
    <XSelect v-model="sizeValue" :options="options" size="large" placeholder="大尺寸" />
  </div>
</div>

```vue
<XSelect v-model="value" :options="options" size="small" />
<XSelect v-model="value" :options="options" size="medium" />
<XSelect v-model="value" :options="options" size="large" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值 | `string \| number \| (string \| number)[]` | - |
| options | 选项数据 | `SelectOption[]` | `[]` |
| placeholder | 占位文本 | `string` | `'请选择'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 是否禁用 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `false` |
| filterable | 是否可搜索 | `boolean` | `false` |
| multiple | 是否多选 | `boolean` | `false` |
| multiple-limit | 多选时最多可选数量 | `number` | `0` |
| loading | 是否加载中 | `boolean` | `false` |
| loading-text | 加载中文本 | `string` | `'加载中...'` |
| no-data-text | 无数据时文本 | `string` | `'无数据'` |
| no-match-text | 无匹配数据时文本 | `string` | `'无匹配数据'` |
| popper-class | 下拉框自定义类名 | `string` | - |

### SelectOption

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| label | 选项显示文本 | `string` |
| value | 选项值 | `string \| number` |
| disabled | 是否禁用该选项 | `boolean` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中值发生变化时触发 | `(value: string \| number \| (string \| number)[]) => void` |
| visible-change | 下拉框出现/隐藏时触发 | `(visible: boolean) => void` |
| clear | 清空时触发 | `() => void` |
| remove-tag | 多选模式下移除标签时触发 | `(value: string \| number) => void` |
| focus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |

### Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使选择器获得焦点 | `() => void` |
| blur | 使选择器失去焦点 | `() => void` |
