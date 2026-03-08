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
const collapseValue = ref([]);
const sizeValue = ref('');
const remoteValue = ref('');
const remoteLoading = ref(false);
const remoteOptions = ref([]);
const customOptionValue = ref('');
const checkAllValue = ref([]);

// 下拉分页
const pageValue = ref('');
const pageOptions = ref([]);
const pageLoading = ref(false);
const pageHasMore = ref(true);
let currentPage = 0;
const loadPage = () => {
  pageLoading.value = true;
  setTimeout(() => {
    currentPage++;
    const newItems = Array.from({ length: 20 }, (_, i) => {
      const idx = (currentPage - 1) * 20 + i + 1;
      return { label: `选项 ${idx}`, value: idx };
    });
    pageOptions.value = [...pageOptions.value, ...newItems];
    pageHasMore.value = currentPage < 5;
    pageLoading.value = false;
  }, 800);
};
loadPage(); // 加载第一页

// 虚拟滚动
const virtualValue = ref('');
const virtualOptions = Array.from({ length: 10000 }, (_, i) => ({
  label: `虚拟选项 ${i + 1}`,
  value: i + 1,
}));

// 虚拟滚动 + 分页
const comboValue = ref('');
const comboOptions = ref([]);
const comboLoading = ref(false);
const comboHasMore = ref(true);
let comboPage = 0;
const loadComboPage = () => {
  comboLoading.value = true;
  setTimeout(() => {
    comboPage++;
    const newItems = Array.from({ length: 200 }, (_, i) => {
      const idx = (comboPage - 1) * 200 + i + 1;
      return { label: `数据 ${idx}`, value: idx };
    });
    comboOptions.value = [...comboOptions.value, ...newItems];
    comboHasMore.value = comboPage < 10;
    comboLoading.value = false;
  }, 500);
};
loadComboPage();

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

const allOptions = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
];

const remoteMethod = (query) => {
  if (query) {
    remoteLoading.value = true;
    setTimeout(() => {
      remoteOptions.value = allOptions.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      remoteLoading.value = false;
    }, 500);
  } else {
    remoteOptions.value = [];
  }
};
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

## 远程搜索

设置 `remote` 和 `remote-method` 属性启用远程搜索。配合 `loading` 属性展示加载状态。

<div class="demo-block">
  <XSelect
    v-model="remoteValue"
    :options="remoteOptions"
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="remoteLoading"
    placeholder="请输入关键词搜索"
  />
</div>

```vue
<template>
  <XSelect
    v-model="value"
    :options="remoteOptions"
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="loading"
    placeholder="请输入关键词搜索"
  />
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const loading = ref(false);
const remoteOptions = ref([]);

const allOptions = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
];

const remoteMethod = (query) => {
  if (query) {
    loading.value = true;
    setTimeout(() => {
      remoteOptions.value = allOptions.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      loading.value = false;
    }, 500);
  } else {
    remoteOptions.value = [];
  }
};
</script>
```

## 自定义选项模板

使用 `option` 插槽自定义下拉选项的渲染内容。

<div class="demo-block">
  <XSelect v-model="customOptionValue" :options="searchOptions" placeholder="请选择">
    <template #option="{ option, selected }">
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <span>{{ option.label }}</span>
        <span style="color: var(--x-text-color-secondary); font-size: 12px;">{{ option.value }}</span>
      </div>
    </template>
  </XSelect>
</div>

```vue
<template>
  <XSelect v-model="value" :options="options" placeholder="请选择">
    <template #option="{ option, selected }">
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <span>{{ option.label }}</span>
        <span style="color: var(--x-text-color-secondary); font-size: 12px;">{{ option.value }}</span>
      </div>
    </template>
  </XSelect>
</template>
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
  <XSelect v-model="value" :options="options" multiple placeholder="请选择多个" />
</template>

<script setup>
import { ref } from 'vue';

const value = ref([]);
</script>
```

## 多选全选

设置 `show-check-all` 属性在下拉框顶部显示全选 Checkbox。

<div class="demo-block">
  <XSelect
    v-model="checkAllValue"
    :options="searchOptions"
    multiple
    show-check-all
    placeholder="全选示例"
  />
</div>

```vue
<template>
  <XSelect
    v-model="value"
    :options="options"
    multiple
    show-check-all
    placeholder="全选示例"
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

## 多选标签折叠

使用 `max-tag-count` 属性限制展示的标签数量，超出部分折叠为 `+N`，hover 查看完整列表。

<div class="demo-block">
  <XSelect
    v-model="collapseValue"
    :options="options"
    multiple
    :max-tag-count="2"
    placeholder="最多展示 2 个标签"
  />
</div>

```vue
<template>
  <XSelect
    v-model="value"
    :options="options"
    multiple
    :max-tag-count="2"
    placeholder="最多展示 2 个标签"
  />
</template>

<script setup>
import { ref } from 'vue';

const value = ref([]);
</script>
```

## 自定义下拉底部

使用 `footer` 插槽在下拉面板底部添加自定义内容。

<div class="demo-block">
  <XSelect v-model="value" :options="options" placeholder="请选择">
    <template #footer>
      <div style="padding: 4px 0; text-align: center; color: var(--x-color-primary); cursor: pointer; font-size: 13px;">
        + 新增选项
      </div>
    </template>
  </XSelect>
</div>

```vue
<template>
  <XSelect v-model="value" :options="options" placeholder="请选择">
    <template #footer>
      <div style="text-align: center; color: var(--x-color-primary); cursor: pointer;">
        + 新增选项
      </div>
    </template>
  </XSelect>
</template>
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

## 下拉分页加载

设置 `has-more` 属性开启下拉分页，监听 `@load-more` 事件加载下一页数据。配合 `loading` 控制加载状态。

<div class="demo-block">
  <XSelect
    v-model="pageValue"
    :options="pageOptions"
    :has-more="pageHasMore"
    :loading="pageLoading"
    placeholder="滚动加载更多"
    @load-more="loadPage"
  />
</div>

```vue
<template>
  <XSelect
    v-model="value"
    :options="options"
    :has-more="hasMore"
    :loading="loading"
    @load-more="loadMore"
    placeholder="滚动加载更多"
  />
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const options = ref([]);
const loading = ref(false);
const hasMore = ref(true);
let page = 0;

const loadMore = () => {
  loading.value = true;
  // 模拟异步请求
  setTimeout(() => {
    page++;
    const newItems = Array.from({ length: 20 }, (_, i) => {
      const idx = (page - 1) * 20 + i + 1;
      return { label: `选项 ${idx}`, value: idx };
    });
    options.value = [...options.value, ...newItems];
    hasMore.value = page < 5; // 共 5 页
    loading.value = false;
  }, 800);
};

loadMore(); // 加载第一页
</script>
```

## 虚拟滚动

设置 `virtual` 属性开启虚拟滚动，适用于一次性加载大量数据的场景。可通过 `item-height` 指定选项行高（默认 34px）。

<div class="demo-block">
  <XSelect
    v-model="virtualValue"
    :options="virtualOptions"
    virtual
    filterable
    placeholder="10000 条虚拟滚动"
  />
</div>

```vue
<template>
  <XSelect
    v-model="value"
    :options="options"
    virtual
    filterable
    placeholder="10000 条虚拟滚动"
  />
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const options = Array.from({ length: 10000 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: i + 1,
}));
</script>
```

## 虚拟滚动 + 分页

`virtual` 和 `has-more` 可以同时使用。虚拟滚动只渲染可视区域，滚到底部时触发分页加载。

<div class="demo-block">
  <XSelect
    v-model="comboValue"
    :options="comboOptions"
    :has-more="comboHasMore"
    :loading="comboLoading"
    virtual
    placeholder="虚拟滚动 + 分页"
    @load-more="loadComboPage"
  />
</div>

```vue
<template>
  <XSelect
    v-model="value"
    :options="options"
    :has-more="hasMore"
    :loading="loading"
    virtual
    placeholder="虚拟滚动 + 分页"
    @load-more="loadMore"
  />
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const options = ref([]);
const loading = ref(false);
const hasMore = ref(true);
let page = 0;

const loadMore = () => {
  loading.value = true;
  setTimeout(() => {
    page++;
    const newItems = Array.from({ length: 200 }, (_, i) => {
      const idx = (page - 1) * 200 + i + 1;
      return { label: `数据 ${idx}`, value: idx };
    });
    options.value = [...options.value, ...newItems];
    hasMore.value = page < 10;
    loading.value = false;
  }, 500);
};

loadMore();
</script>
```

## API

### Props

| 参数           | 说明               | 类型                                       | 默认值         |
| -------------- | ------------------ | ------------------------------------------ | -------------- |
| v-model        | 绑定值             | `string \| number \| (string \| number)[]` | -              |
| options        | 选项数据           | `SelectOption[]`                           | `[]`           |
| placeholder    | 占位文本           | `string`                                   | `'请选择'`     |
| size           | 尺寸               | `'small' \| 'medium' \| 'large'`           | `'medium'`     |
| disabled       | 是否禁用           | `boolean`                                  | `false`        |
| clearable      | 是否可清空         | `boolean`                                  | `false`        |
| filterable     | 是否可搜索         | `boolean`                                  | `false`        |
| multiple       | 是否多选           | `boolean`                                  | `false`        |
| multiple-limit | 多选时最多可选数量 | `number`                                   | `0`            |
| max-tag-count  | 多选时最多展示的标签数，超出折叠为 +N | `number`                    | `0`            |
| loading        | 是否加载中         | `boolean`                                  | `false`        |
| loading-text   | 加载中文本         | `string`                                   | `'加载中...'`  |
| no-data-text   | 无数据时文本       | `string`                                   | `'无数据'`     |
| no-match-text  | 无匹配数据时文本   | `string`                                   | `'无匹配数据'` |
| popper-class   | 下拉框自定义类名   | `string`                                   | -              |
| remote         | 是否为远程搜索     | `boolean`                                  | `false`        |
| remote-method  | 远程搜索方法       | `(query: string) => void`                  | -              |
| show-check-all | 多选时是否显示全选  | `boolean`                                  | `false`        |
| has-more       | 是否还有更多数据（开启下拉分页） | `boolean`                     | `false`        |
| load-more-text | 加载更多提示文本   | `string`                                   | `'加载中...'`  |
| virtual        | 开启虚拟滚动       | `boolean`                                  | `false`        |
| item-height    | 选项行高 px（虚拟滚动用） | `number`                              | `34`           |

### SelectOption

| 参数     | 说明           | 类型               |
| -------- | -------------- | ------------------ |
| label    | 选项显示文本   | `string`           |
| value    | 选项值         | `string \| number` |
| disabled | 是否禁用该选项 | `boolean`          |

### Events

| 事件名         | 说明                     | 类型                                                        |
| -------------- | ------------------------ | ----------------------------------------------------------- |
| change         | 选中值发生变化时触发     | `(value: string \| number \| (string \| number)[]) => void` |
| visible-change | 下拉框出现/隐藏时触发    | `(visible: boolean) => void`                                |
| clear          | 清空时触发               | `() => void`                                                |
| remove-tag     | 多选模式下移除标签时触发 | `(value: string \| number) => void`                         |
| focus          | 获得焦点时触发           | `(event: FocusEvent) => void`                               |
| blur           | 失去焦点时触发           | `(event: FocusEvent) => void`                               |
| load-more      | 滚动到底部且 has-more 为 true 时触发 | `() => void`                                  |

### Methods

| 方法名 | 说明             | 类型         |
| ------ | ---------------- | ------------ |
| focus  | 使选择器获得焦点 | `() => void` |
| blur   | 使选择器失去焦点 | `() => void` |

### Slots

| 插槽名   | 说明                                                     | 作用域参数 |
| -------- | -------------------------------------------------------- | ---------- |
| empty    | 自定义无数据或无匹配时的内容 | - |
| option   | 自定义选项内容 | `{ option: SelectOption, selected: boolean }` |
| tag      | 自定义多选标签内容 | `{ option: SelectOption, close: () => void }` |
| selected | 自定义单选选中展示内容 | `{ option: SelectOption }` |
| footer   | 下拉面板底部自定义内容 | - |
