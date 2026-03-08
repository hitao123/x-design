# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

<script setup>
import { ref } from 'vue';
import { XInput, XSelect } from '@x-design/components';
import { IconArrowRight } from '@x-design/icons';

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const input4 = ref('');
const input5 = ref('');
const input6 = ref('');
const textarea1 = ref('');
const textarea2 = ref('');
const textarea3 = ref('');
const textarea4 = ref('');
const password1 = ref('');
const clearable1 = ref('可清除的内容');
const limit1 = ref('');
const limit2 = ref('');
const value = ref('');

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
];
</script>

<div class="demo-block">
  <XInput v-model="input1" placeholder="请输入内容" />
  <div style="margin-top: 12px">输入值: {{ input1 }}</div>
</div>

```vue
<template>
  <XInput v-model="input" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const input = ref('');
</script>
```

## 不同尺寸

<div class="demo-block">
  <XInput v-model="input1" size="small" placeholder="小尺寸" />
  <div style="margin-top: 12px">
    <XInput v-model="input2" size="medium" placeholder="中等尺寸" />
  </div>
  <div style="margin-top: 12px">
    <XInput v-model="input3" size="large" placeholder="大尺寸" />
  </div>
</div>

```vue
<XInput v-model="input1" size="small" placeholder="小尺寸" />
<XInput v-model="input2" size="medium" placeholder="中等尺寸" />
<XInput v-model="input3" size="large" placeholder="大尺寸" />
```

## 禁用状态

<div class="demo-block">
  <XInput v-model="input1" disabled placeholder="禁用状态" />
</div>

```vue
<XInput v-model="input" disabled placeholder="禁用状态" />
```

## 只读状态

<div class="demo-block">
  <XInput v-model="input1" readonly placeholder="只读状态" />
</div>

```vue
<XInput v-model="input" readonly placeholder="只读状态" />
```

## 可清空

使用 `clearable` 属性可以得到一个可清空的输入框。鼠标悬浮或聚焦时会显示清除图标。

<div class="demo-block">
  <XInput v-model="clearable1" clearable placeholder="请输入内容" />
</div>

```vue
<template>
  <XInput v-model="input" clearable placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const input = ref('可清除的内容');
</script>
```

## 密码框

使用 `show-password` 属性可以得到一个可切换显示隐藏的密码框。

<div class="demo-block">
  <XInput v-model="password1" show-password placeholder="请输入密码" />
</div>

```vue
<template>
  <XInput v-model="password" show-password placeholder="请输入密码" />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const password = ref('');
</script>
```

## 带图标的输入框

通过 `prefix-icon` 和 `suffix-icon` 属性可以在输入框前后添加图标，也可以通过 `prefix` 和 `suffix` 插槽自定义内容。

<div class="demo-block">
  <XInput v-model="input4" :suffix-icon="IconArrowRight" placeholder="后缀图标" />
  <div style="margin-top: 12px">
    <XInput v-model="input5" placeholder="后缀插槽">
      <template #suffix>
        <span style="font-size: 12px; color: #909399">.com</span>
      </template>
    </XInput>
  </div>
  <div style="margin-top: 12px">
    <XInput v-model="input6" placeholder="前缀插槽">
      <template #prefix>
        <span style="font-size: 12px; color: #909399">https://</span>
      </template>
    </XInput>
  </div>
  <div style="margin-top: 12px">
    <XInput v-model="input3" placeholder="前缀插槽">
      <template #prefix>
        <XSelect v-model="value" :options="options" placeholder="请选择" />
      </template>
    </XInput>
  </div>

</div>

```vue
<template>
  <XInput v-model="input1" :suffix-icon="IconArrowRight" placeholder="后缀图标" />

  <XInput v-model="input2" placeholder="后缀插槽">
    <template #suffix>
      <span>.com</span>
    </template>
  </XInput>

  <XInput v-model="input3" placeholder="前缀插槽">
    <template #prefix>
      <span>https://</span>
    </template>
  </XInput>

  <XInput v-model="input3" placeholder="前缀插槽">
    <template #prefix>
      <XSelect v-model="value" :options="options" placeholder="请选择" />
    </template>
  </XInput>
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';
import { IconArrowRight } from '@x-design/icons';

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
</script>
```

## 文本域

设置 `type="textarea"` 可以使用文本域，通过 `rows` 属性控制行数。

<div class="demo-block">
  <XInput v-model="textarea1" type="textarea" placeholder="请输入内容" />
  <div style="margin-top: 12px">
    <XInput v-model="textarea2" type="textarea" :rows="4" placeholder="4 行文本域" />
  </div>
</div>

```vue
<template>
  <XInput v-model="textarea1" type="textarea" placeholder="请输入内容" />
  <XInput v-model="textarea2" type="textarea" :rows="4" placeholder="4 行文本域" />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const textarea1 = ref('');
const textarea2 = ref('');
</script>
```

## 自适应文本域

设置 `autosize` 属性可以使文本域根据内容自动调整高度。也可以传入对象 `{ minRows, maxRows }` 来限制最小和最大行数。

<div class="demo-block">
  <XInput v-model="textarea3" type="textarea" autosize placeholder="自适应高度" />
  <div style="margin-top: 12px">
    <XInput
      v-model="textarea4"
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 6 }"
      placeholder="限制 2-6 行"
    />
  </div>
</div>

```vue
<template>
  <XInput v-model="textarea1" type="textarea" autosize placeholder="自适应高度" />
  <XInput
    v-model="textarea2"
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 6 }"
    placeholder="限制 2-6 行"
  />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const textarea1 = ref('');
const textarea2 = ref('');
</script>
```

## 字数统计

设置 `maxlength` 和 `show-word-limit` 属性可以显示字数统计，适用于 input 和 textarea。

<div class="demo-block">
  <XInput v-model="limit1" :maxlength="20" show-word-limit placeholder="最多 20 个字符" />
  <div style="margin-top: 12px">
    <XInput
      v-model="limit2"
      type="textarea"
      :maxlength="100"
      show-word-limit
      placeholder="最多 100 个字符"
    />
  </div>
</div>

```vue
<template>
  <XInput v-model="input" :maxlength="20" show-word-limit placeholder="最多 20 个字符" />
  <XInput
    v-model="textarea"
    type="textarea"
    :maxlength="100"
    show-word-limit
    placeholder="最多 100 个字符"
  />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const input = ref('');
const textarea = ref('');
</script>
```

## API

### Props

| 参数                  | 说明                                 | 类型                                                | 默认值     |
| --------------------- | ------------------------------------ | --------------------------------------------------- | ---------- |
| model-value / v-model | 绑定值                               | `string`                                            | `''`       |
| type                  | 类型，支持 `'textarea'`              | `string`                                            | `'text'`   |
| size                  | 尺寸（仅 input 模式）                | `'small' \| 'medium' \| 'large'`                    | `'medium'` |
| placeholder           | 占位文本                             | `string`                                            | `''`       |
| disabled              | 是否禁用                             | `boolean`                                           | `false`    |
| readonly              | 是否只读                             | `boolean`                                           | `false`    |
| maxlength             | 最大输入长度                         | `number`                                            | -          |
| clearable             | 是否可清空                           | `boolean`                                           | `false`    |
| show-password         | 是否显示切换密码图标                 | `boolean`                                           | `false`    |
| show-word-limit       | 是否显示字数统计（需配合 maxlength） | `boolean`                                           | `false`    |
| prefix-icon           | 前缀图标组件                         | `Component`                                         | -          |
| suffix-icon           | 后缀图标组件                         | `Component`                                         | -          |
| rows                  | textarea 行数                        | `number`                                            | `2`        |
| autosize              | textarea 自适应高度                  | `boolean \| { minRows?: number; maxRows?: number }` | `false`    |

### Events

| 事件名 | 说明               | 类型                          |
| ------ | ------------------ | ----------------------------- |
| input  | 输入时触发         | `(value: string) => void`     |
| change | 值改变时触发       | `(value: string) => void`     |
| focus  | 获得焦点时触发     | `(event: FocusEvent) => void` |
| blur   | 失去焦点时触发     | `(event: FocusEvent) => void` |
| clear  | 点击清除按钮时触发 | `() => void`                  |

### Slots

| 插槽名 | 说明           |
| ------ | -------------- |
| prefix | 输入框前缀内容 |
| suffix | 输入框后缀内容 |

### Exposes

| 方法名         | 说明                           | 类型                                           |
| -------------- | ------------------------------ | ---------------------------------------------- |
| focus          | 使输入框获取焦点               | `() => void`                                   |
| blur           | 使输入框失去焦点               | `() => void`                                   |
| resizeTextarea | 手动触发 textarea 高度重新计算 | `() => void`                                   |
| ref            | 原生 input/textarea 元素引用   | `Ref<HTMLInputElement \| HTMLTextAreaElement>` |
