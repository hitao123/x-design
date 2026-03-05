# Checkbox 多选框

在一组备选项中进行多选。

## 基础用法

单独使用可以表示两个状态之间的切换。

<script setup>
import { ref, computed } from 'vue';
import { XCheckbox, XCheckboxGroup } from '@x-design/components';

const checked = ref(true);
const checkList = ref(['选项A', '选项B']);

const allOptions = ['选项A', '选项B', '选项C'];
const checkAll = computed(() => checkList.value.length === allOptions.length);
const isIndeterminate = computed(() =>
  checkList.value.length > 0 && checkList.value.length < allOptions.length
);

function handleCheckAllChange(val) {
  checkList.value = val ? [...allOptions] : [];
}
</script>

<div class="demo-block">
  <XCheckbox v-model="checked">备选项</XCheckbox>
</div>

```vue
<script setup>
import { ref } from 'vue';
const checked = ref(true);
</script>

<XCheckbox v-model="checked">备选项</XCheckbox>
```

## 多选框组

使用 `XCheckboxGroup` 包裹 `XCheckbox`，通过 `v-model` 绑定选中的值数组。

<div class="demo-block">
  <XCheckboxGroup v-model="checkList">
    <XCheckbox label="选项A">选项 A</XCheckbox>
    <XCheckbox label="选项B">选项 B</XCheckbox>
    <XCheckbox label="选项C">选项 C</XCheckbox>
    <XCheckbox label="选项D" disabled>禁用</XCheckbox>
  </XCheckboxGroup>
</div>

```vue
<script setup>
import { ref } from 'vue';
const checkList = ref(['选项A', '选项B']);
</script>

<XCheckboxGroup v-model="checkList">
  <XCheckbox label="选项A">选项 A</XCheckbox>
  <XCheckbox label="选项B">选项 B</XCheckbox>
  <XCheckbox label="选项C">选项 C</XCheckbox>
  <XCheckbox label="选项D" disabled>禁用</XCheckbox>
</XCheckboxGroup>
```

## 半选状态

`indeterminate` 属性用以表示 checkbox 的不确定状态，一般用于实现全选效果。

<div class="demo-block">
  <XCheckbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >全选</XCheckbox>
  <XCheckboxGroup v-model="checkList">
    <XCheckbox label="选项A">选项 A</XCheckbox>
    <XCheckbox label="选项B">选项 B</XCheckbox>
    <XCheckbox label="选项C">选项 C</XCheckbox>
  </XCheckboxGroup>
</div>

```vue
<script setup>
import { ref, computed } from 'vue';
const checkList = ref(['选项A']);
const allOptions = ['选项A', '选项B', '选项C'];
const checkAll = computed(() => checkList.value.length === allOptions.length);
const isIndeterminate = computed(() =>
  checkList.value.length > 0 && checkList.value.length < allOptions.length
);

function handleCheckAllChange(val) {
  checkList.value = val ? [...allOptions] : [];
}
</script>
```

## 限制选中数量

使用 `min` 和 `max` 属性能够限制可以被勾选的项目的数量。

<div class="demo-block">
  <XCheckboxGroup v-model="checkList" :min="1" :max="2">
    <XCheckbox label="选项A">选项 A</XCheckbox>
    <XCheckbox label="选项B">选项 B</XCheckbox>
    <XCheckbox label="选项C">选项 C</XCheckbox>
  </XCheckboxGroup>
</div>

```vue
<XCheckboxGroup v-model="checkList" :min="1" :max="2">
  <XCheckbox label="选项A">选项 A</XCheckbox>
  <XCheckbox label="选项B">选项 B</XCheckbox>
  <XCheckbox label="选项C">选项 C</XCheckbox>
</XCheckboxGroup>
```

## API

### Checkbox Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `boolean` | — |
| label | 选项的值（在 group 中使用） | `string \| number` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| indeterminate | 半选状态 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| name | 原生 name 属性 | `string` | — |

### Checkbox Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中状态变化时触发 | `(value: boolean) => void` |

### CheckboxGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `(string \| number)[]` | `[]` |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| min | 可被勾选的最小数量 | `number` | `0` |
| max | 可被勾选的最大数量 | `number` | `0` |

### CheckboxGroup Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中值变化时触发 | `(value: (string \| number)[]) => void` |
