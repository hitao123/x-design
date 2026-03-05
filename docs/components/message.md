# Message 消息提示

常用于主动操作后的反馈提示。

## 基础用法

从顶部出现，3 秒后自动消失。

<script setup>
import { XMessage } from '@x-design/components';

function open() {
  XMessage('这是一条消息提示');
}

function openSuccess() {
  XMessage.success('恭喜你，这是一条成功消息');
}

function openWarning() {
  XMessage.warning('警告哦，这是一条警告消息');
}

function openError() {
  XMessage.error('错了哦，这是一条错误消息');
}
</script>

<div class="demo-block">
  <button @click="open">消息</button>
  <button @click="openSuccess">成功</button>
  <button @click="openWarning">警告</button>
  <button @click="openError">错误</button>
</div>

```vue
<script setup>
import { XMessage } from '@x-design/components';

XMessage('这是一条消息提示');
XMessage.success('恭喜你，这是一条成功消息');
XMessage.warning('警告哦，这是一条警告消息');
XMessage.error('错了哦，这是一条错误消息');
</script>
```

## 可关闭

设置 `showClose` 为 `true` 显示关闭按钮。

<div class="demo-block">
  <button @click="XMessage({ message: '可关闭的消息', showClose: true })">可关闭</button>
</div>

```vue
XMessage({
  message: '可关闭的消息',
  showClose: true,
});
```

## 自定义时长

设置 `duration` 为 `0` 则不会自动关闭。

```vue
XMessage({
  message: '不会自动关闭',
  duration: 0,
  showClose: true,
});
```

## 不同类型

通过 `type` 属性设置不同的消息类型。

```vue
XMessage({ message: '信息', type: 'info' });
XMessage({ message: '成功', type: 'success' });
XMessage({ message: '警告', type: 'warning' });
XMessage({ message: '错误', type: 'error' });
```

## 关闭所有

调用 `XMessage.closeAll()` 关闭所有消息。

```vue
XMessage.closeAll();
```

## API

### Options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| message | 消息文字 | `string` | — |
| type | 消息类型 | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| duration | 显示时长（毫秒），0 为不自动关闭 | `number` | `3000` |
| showClose | 是否显示关闭按钮 | `boolean` | `false` |
| offset | 距离窗口顶部的偏移量 | `number` | `16` |
| plain | 是否朴素样式 | `boolean` | `false` |
| onClose | 关闭时的回调函数 | `() => void` | — |

### Methods

| 方法名 | 说明 |
| --- | --- |
| XMessage(options) | 显示消息 |
| XMessage.success(options) | 显示成功消息 |
| XMessage.warning(options) | 显示警告消息 |
| XMessage.info(options) | 显示信息消息 |
| XMessage.error(options) | 显示错误消息 |
| XMessage.closeAll() | 关闭所有消息 |

### MessageInstance

| 属性/方法 | 说明 |
| --- | --- |
| close() | 关闭当前消息 |
