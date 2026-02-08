# 主题定制

X Design 使用 SCSS + CSS 变量的主题系统，方便进行定制。

## CSS 变量

所有主题变量都以 CSS 变量形式定义，可以直接在项目中覆盖：

```css
:root {
  /* 主题色 */
  --x-color-primary: #409eff;
  --x-color-success: #67c23a;
  --x-color-warning: #e6a23c;
  --x-color-danger: #f56c6c;
  --x-color-info: #909399;
  
  /* 中性色 */
  --x-color-text-primary: #303133;
  --x-color-text-regular: #606266;
  --x-color-text-secondary: #909399;
  
  /* 字体大小 */
  --x-font-size-base: 14px;
  --x-font-size-lg: 16px;
  --x-font-size-xl: 18px;
  
  /* 圆角 */
  --x-border-radius-base: 4px;
  --x-border-radius-round: 20px;
}
```

## 覆盖变量

### 方式一：全局覆盖

在项目入口文件中覆盖：

```scss
// main.scss
@use '@x-design/theme/index.scss' with (
  $color-primary: #1890ff,
  $font-size-base: 16px
);
```

### 方式二：局部覆盖

在组件中覆盖特定变量：

```vue
<template>
  <div class="custom-theme">
    <XButton type="primary">自定义主题按钮</XButton>
  </div>
</template>

<style scoped>
.custom-theme {
  --x-color-primary: #1890ff;
  --x-border-radius-base: 8px;
}
</style>
```

## SCSS Mixins

X Design 提供了常用的 SCSS mixins：

```scss
@use '@x-design/theme/src/mixins/button.scss' as *;

.my-custom-button {
  @include button-base;
  @include button-variant(#1890ff, #1890ff, #fff);
  @include button-size(40px, 0 20px, 16px);
}
```

## 完整变量列表

查看 [@x-design/theme](https://github.com/your-org/x-design/tree/main/packages/theme) 获取完整变量列表。
