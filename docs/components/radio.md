# Radio 单选框

在一组备选项中进行单选。

## 基础用法

使用 `v-model` 绑定选中值，`label` 为选项的值。

<script setup>
import { ref } from 'vue';
import { XRadio, XRadioGroup } from '@x-design/components';

const radio = ref('1');
const radioGroup = ref('选项A');
</script>

<div class="demo-block">
  <XRadio v-model="radio" label="1">选项 1</XRadio>
  <XRadio v-model="radio" label="2">选项 2</XRadio>
</div>

```vue
<script setup>
import { ref } from 'vue';
const radio = ref('1');
</script>

<XRadio v-model="radio" label="1">选项 1</XRadio>
<XRadio v-model="radio" label="2">选项 2</XRadio>
```

## 单选框组

使用 `XRadioGroup` 包裹 `XRadio`，通过 `v-model` 统一管理选中状态。

<div class="demo-block">
  <XRadioGroup v-model="radioGroup">
    <XRadio label="选项A">选项 A</XRadio>
    <XRadio label="选项B">选项 B</XRadio>
    <XRadio label="选项C">选项 C</XRadio>
  </XRadioGroup>
</div>

```vue
<script setup>
import { ref } from 'vue';
const radioGroup = ref('选项A');
</script>

<XRadioGroup v-model="radioGroup">
  <XRadio label="选项A">选项 A</XRadio>
  <XRadio label="选项B">选项 B</XRadio>
  <XRadio label="选项C">选项 C</XRadio>
</XRadioGroup>
```

## 禁用状态

通过 `disabled` 属性禁用单选框。

<div class="demo-block">
  <XRadio v-model="radio" label="1" disabled>选项 1</XRadio>
  <XRadio v-model="radio" label="2">选项 2</XRadio>
</div>

```vue
<XRadio v-model="radio" label="1" disabled>选项 1</XRadio>
<XRadio v-model="radio" label="2">选项 2</XRadio>
```

## 不同尺寸

提供三种尺寸的单选框。

<div class="demo-block">
  <XRadioGroup v-model="radioGroup" size="small">
    <XRadio label="选项A">小型</XRadio>
    <XRadio label="选项B">小型</XRadio>
  </XRadioGroup>
  <br />
  <XRadioGroup v-model="radioGroup" size="medium">
    <XRadio label="选项A">中等</XRadio>
    <XRadio label="选项B">中等</XRadio>
  </XRadioGroup>
  <br />
  <XRadioGroup v-model="radioGroup" size="large">
    <XRadio label="选项A">大型</XRadio>
    <XRadio label="选项B">大型</XRadio>
  </XRadioGroup>
</div>

```vue
<XRadioGroup v-model="radioGroup" size="small">
  <XRadio label="选项A">小型</XRadio>
  <XRadio label="选项B">小型</XRadio>
</XRadioGroup>
```

## API

### Radio Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `string \| number \| boolean` | — |
| label | 选项的值 | `string \| number \| boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| name | 原生 name 属性 | `string` | — |

### Radio Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中值变化时触发 | `(value: string \| number \| boolean) => void` |

### RadioGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `string \| number \| boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| name | 原生 name 属性 | `string` | — |

### RadioGroup Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中值变化时触发 | `(value: string \| number \| boolean) => void` |
