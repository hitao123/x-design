# Tabs 选项卡

在同一区域切换展示不同内容。

## 基础用法

基础的、简洁的选项卡（line 模式）。

<script setup>
import { ref } from 'vue';
import { XTabs, XTabPane } from '@x-design/components';

const activeName = ref('first');
const activeCard = ref('first');
const activeBorder = ref('first');
const activeBottom = ref('first');
const activeDisabled = ref('first');
const activeLazy = ref('first');

// 动态增减标签
const editableTabs = ref([
  { label: '标签 1', name: '1', content: '标签 1 的内容' },
  { label: '标签 2', name: '2', content: '标签 2 的内容' },
  { label: '标签 3', name: '3', content: '标签 3 的内容' },
]);
const editableActive = ref('1');
let tabIndex = 3;

const handleTabAdd = () => {
  tabIndex++;
  editableTabs.value.push({
    label: `标签 ${tabIndex}`,
    name: String(tabIndex),
    content: `标签 ${tabIndex} 的内容`,
  });
  editableActive.value = String(tabIndex);
};

const handleTabRemove = (name) => {
  const tabs = editableTabs.value;
  let active = editableActive.value;
  if (active === name) {
    const index = tabs.findIndex((tab) => tab.name === name);
    const next = tabs[index + 1] || tabs[index - 1];
    if (next) {
      active = next.name;
    }
  }
  editableActive.value = active;
  editableTabs.value = tabs.filter((tab) => tab.name !== name);
};
</script>

<div class="demo-block">
  <XTabs v-model="activeName">
    <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
    <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
    <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
  </XTabs>
</div>

```vue
<script setup>
import { ref } from 'vue';
const activeName = ref('first');
</script>

<XTabs v-model="activeName">
  <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
  <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
  <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
</XTabs>
```

## 卡片类型

设置 `type="card"` 使用卡片风格的选项卡。

<div class="demo-block">
  <XTabs v-model="activeCard" type="card">
    <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
    <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
    <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
  </XTabs>
</div>

```vue
<XTabs v-model="activeCard" type="card">
  <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
  <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
  <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
</XTabs>
```

## 带边框卡片

设置 `type="border-card"` 使用带边框的卡片风格。

<div class="demo-block">
  <XTabs v-model="activeBorder" type="border-card">
    <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
    <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
    <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
  </XTabs>
</div>

```vue
<XTabs v-model="activeBorder" type="border-card">
  <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
  <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
  <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
</XTabs>
```

## 标签位置

设置 `tab-position="bottom"` 将标签栏放置在底部。

<div class="demo-block">
  <XTabs v-model="activeBottom" tab-position="bottom">
    <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
    <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
    <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
  </XTabs>
</div>

```vue
<XTabs v-model="activeBottom" tab-position="bottom">
  <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
  <XTabPane label="配置管理" name="second">配置管理的内容</XTabPane>
  <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
</XTabs>
```

## 禁用标签

通过 `disabled` 属性禁用某个标签页。

<div class="demo-block">
  <XTabs v-model="activeDisabled">
    <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
    <XTabPane label="配置管理" name="second" disabled>配置管理的内容</XTabPane>
    <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
  </XTabs>
</div>

```vue
<XTabs v-model="activeDisabled">
  <XTabPane label="用户管理" name="first">用户管理的内容</XTabPane>
  <XTabPane label="配置管理" name="second" disabled>配置管理的内容</XTabPane>
  <XTabPane label="角色管理" name="third">角色管理的内容</XTabPane>
</XTabs>
```

## 动态增减标签

通过 `addable` 和 `closable` 属性启用动态增减标签功能。

<div class="demo-block">
  <XTabs v-model="editableActive" type="card" addable closable @tab-add="handleTabAdd" @tab-remove="handleTabRemove">
    <XTabPane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      {{ item.content }}
    </XTabPane>
  </XTabs>
</div>

```vue
<script setup>
import { ref } from 'vue';

const editableTabs = ref([
  { label: '标签 1', name: '1', content: '标签 1 的内容' },
  { label: '标签 2', name: '2', content: '标签 2 的内容' },
  { label: '标签 3', name: '3', content: '标签 3 的内容' },
]);
const editableActive = ref('1');
let tabIndex = 3;

const handleTabAdd = () => {
  tabIndex++;
  editableTabs.value.push({
    label: `标签 ${tabIndex}`,
    name: String(tabIndex),
    content: `标签 ${tabIndex} 的内容`,
  });
  editableActive.value = String(tabIndex);
};

const handleTabRemove = (name) => {
  const tabs = editableTabs.value;
  let active = editableActive.value;
  if (active === name) {
    const index = tabs.findIndex((tab) => tab.name === name);
    const next = tabs[index + 1] || tabs[index - 1];
    if (next) {
      active = next.name;
    }
  }
  editableActive.value = active;
  editableTabs.value = tabs.filter((tab) => tab.name !== name);
};
</script>

<XTabs v-model="editableActive" type="card" addable closable
  @tab-add="handleTabAdd" @tab-remove="handleTabRemove">
  <XTabPane v-for="item in editableTabs" :key="item.name"
    :label="item.label" :name="item.name">
    {{ item.content }}
  </XTabPane>
</XTabs>
```

## 懒加载

设置 `lazy` 属性后，面板内容在首次激活前不会渲染。

<div class="demo-block">
  <XTabs v-model="activeLazy">
    <XTabPane label="即时渲染" name="first">此面板立即渲染</XTabPane>
    <XTabPane label="懒加载" name="second" lazy>此面板在首次激活时才渲染</XTabPane>
    <XTabPane label="懒加载 2" name="third" lazy>此面板在首次激活时才渲染</XTabPane>
  </XTabs>
</div>

```vue
<XTabs v-model="activeLazy">
  <XTabPane label="即时渲染" name="first">此面板立即渲染</XTabPane>
  <XTabPane label="懒加载" name="second" lazy>此面板在首次激活时才渲染</XTabPane>
  <XTabPane label="懒加载 2" name="third" lazy>此面板在首次激活时才渲染</XTabPane>
</XTabs>
```

## API

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 当前激活的标签页 name | `string \| number` | — |
| type | 标签类型 | `'line' \| 'card' \| 'border-card'` | `'line'` |
| closable | 标签是否可关闭 | `boolean` | `false` |
| addable | 标签是否可新增 | `boolean` | `false` |
| tab-position | 标签位置 | `'top' \| 'bottom'` | `'top'` |

### Tabs Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| tab-click | 标签被点击时触发 | `(pane: TabPaneInstance, event: MouseEvent) => void` |
| tab-remove | 标签被关闭时触发 | `(name: string \| number) => void` |
| tab-add | 点击新增按钮时触发 | `() => void` |

### TabPane Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签页标题 | `string` | — |
| name | 标签页唯一标识（必填） | `string \| number` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| lazy | 懒渲染 | `boolean` | `false` |
| closable | 单个标签可关闭（覆盖 Tabs 级别） | `boolean` | — |

### TabPane Slots

| 名称 | 说明 |
| --- | --- |
| default | 标签页内容 |
