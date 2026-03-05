# Loading 加载

加载数据时显示动效。

## 区域加载

在表格等容器中使用 `v-loading` 指令。

<script setup>
import { ref } from 'vue';

const loading = ref(true);
</script>

<div class="demo-block">
  <div v-loading="loading" style="height: 200px; border: 1px solid #eee; padding: 20px;">
    加载区域内容
  </div>
  <button @click="loading = !loading" style="margin-top: 10px;">切换 Loading</button>
</div>

```vue
<script setup>
import { ref } from 'vue';
const loading = ref(true);
</script>

<div v-loading="loading">
  加载区域内容
</div>
```

## 自定义内容

通过 `x-loading-text` 和 `x-loading-background` 属性自定义加载文案和背景色。

<div class="demo-block">
  <div
    v-loading="true"
    x-loading-text="拼命加载中..."
    x-loading-background="rgba(0, 0, 0, 0.8)"
    style="height: 200px; border: 1px solid #eee;"
  ></div>
</div>

```vue
<div
  v-loading="true"
  x-loading-text="拼命加载中..."
  x-loading-background="rgba(0, 0, 0, 0.8)"
>
</div>
```

## 全屏加载

使用 `fullscreen` 修饰符可以全屏加载。

```vue
<div v-loading.fullscreen="fullscreenLoading"></div>
```

## 服务方式调用

通过 `loadingService` 以服务的方式调用 Loading。

```vue
<script setup>
import { loadingService } from '@x-design/components';

function openLoading() {
  const loading = loadingService({
    text: '加载中...',
    fullscreen: true,
    lock: true,
  });

  setTimeout(() => {
    loading.close();
  }, 2000);
}
</script>
```

## API

### 指令

| 指令 | 说明 | 类型 |
| --- | --- | --- |
| v-loading | 是否显示加载 | `boolean` |

### 指令修饰符

| 修饰符 | 说明 |
| --- | --- |
| fullscreen | 全屏加载 |

### 指令属性

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| x-loading-text | 加载文案 | `string` |
| x-loading-background | 遮罩背景色 | `string` |

### LoadingService Options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 需要覆盖的目标 DOM 节点 | `HTMLElement \| string` | — |
| fullscreen | 是否全屏 | `boolean` | `false` |
| text | 加载文案 | `string` | — |
| background | 遮罩背景色 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| lock | 是否锁定 body 滚动 | `boolean` | `false` |

### LoadingService 返回值

| 方法 | 说明 |
| --- | --- |
| close() | 关闭 Loading |
| setText(text) | 修改加载文案 |
