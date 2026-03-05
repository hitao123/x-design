# Dialog 对话框

在保留当前页面状态的情况下，告知用户并承载相关操作。

<script setup>
import { ref, reactive } from 'vue';
import { XDialog, XButton, XTable, XForm, XFormItem, XInput, XSelect } from '@x-design/components';

const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const dialogVisible3 = ref(false);
const dialogVisible4 = ref(false);
const dialogVisible5 = ref(false);

// Table 示例数据
const tableColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色', width: 100 },
];

const tableData = [
  { name: '张三', age: 28, email: 'zhangsan@example.com', role: '管理员' },
  { name: '李四', age: 32, email: 'lisi@example.com', role: '编辑' },
  { name: '王五', age: 25, email: 'wangwu@example.com', role: '访客' },
  { name: '赵六', age: 30, email: 'zhaoliu@example.com', role: '编辑' },
];

// Form 示例数据
const formRef = ref(null);
const formData = reactive({ name: '', email: '', role: '' });
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '访客', value: 'viewer' },
];
const handleFormCancel = () => {
  formRef.value?.resetFields();
  dialogVisible5.value = false;
};
const handleFormSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    console.log('提交数据：', formData);
    dialogVisible5.value = false;
  }
};

const handleConfirm = () => {
  XDialog.confirm({
    title: '删除确认',
    message: '确定要删除这条记录吗？删除后无法恢复。',
    confirmButtonText: '删除',
    confirmButtonType: 'danger',
  }).then(() => {
    console.log('confirmed');
  }).catch(() => {
    console.log('canceled');
  });
};
</script>

## 基础用法

使用 `v-model` 控制对话框的显示和隐藏。

<div class="demo-block">
  <XButton type="primary" @click="dialogVisible = true">打开 Dialog</XButton>
  <XDialog v-model="dialogVisible" title="提示">
    <p>这是一段内容</p>
    <template #footer>
      <XButton @click="dialogVisible = false">取消</XButton>
      <XButton type="primary" @click="dialogVisible = false">确定</XButton>
    </template>
  </XDialog>
</div>

```vue
<template>
  <XButton type="primary" @click="dialogVisible = true">打开 Dialog</XButton>
  <XDialog v-model="dialogVisible" title="提示">
    <p>这是一段内容</p>
    <template #footer>
      <XButton @click="dialogVisible = false">取消</XButton>
      <XButton type="primary" @click="dialogVisible = false">确定</XButton>
    </template>
  </XDialog>
</template>

<script setup>
import { ref } from 'vue';
import { XDialog, XButton } from '@x-design/components';

const dialogVisible = ref(false);
</script>
```

## 自定义宽度

通过 `width` 属性设置对话框宽度。

<div class="demo-block">
  <XButton type="primary" @click="dialogVisible2 = true">自定义宽度</XButton>
  <XDialog v-model="dialogVisible2" title="提示" width="30%">
    <p>自定义宽度的对话框</p>
  </XDialog>
</div>

```vue
<XDialog v-model="dialogVisible" title="提示" width="30%">
  <p>自定义宽度的对话框</p>
</XDialog>
```

## 居中布局

设置 `center` 属性可以让标题和内容居中显示。

<div class="demo-block">
  <XButton type="primary" @click="dialogVisible3 = true">居中布局</XButton>
  <XDialog v-model="dialogVisible3" title="提示" center>
    <p>这是居中显示的对话框</p>
    <template #footer>
      <XButton @click="dialogVisible3 = false">取消</XButton>
      <XButton type="primary" @click="dialogVisible3 = false">确定</XButton>
    </template>
  </XDialog>
</div>

```vue
<XDialog v-model="dialogVisible" title="提示" center>
  <p>这是居中显示的对话框</p>
</XDialog>
```

## 包含表格

在 Dialog 中嵌入 `XTable` 展示数据列表，适用于数据预览、选择等场景。

<div class="demo-block">
  <XButton type="primary" @click="dialogVisible4 = true">查看用户列表</XButton>
  <XDialog v-model="dialogVisible4" title="用户列表" width="700px">
    <XTable :data="tableData" :columns="tableColumns" border stripe />
    <template #footer>
      <XButton @click="dialogVisible4 = false">关闭</XButton>
    </template>
  </XDialog>
</div>

```vue
<template>
  <XButton type="primary" @click="dialogVisible = true">查看用户列表</XButton>
  <XDialog v-model="dialogVisible" title="用户列表" width="700px">
    <XTable :data="tableData" :columns="tableColumns" border stripe />
    <template #footer>
      <XButton @click="dialogVisible = false">关闭</XButton>
    </template>
  </XDialog>
</template>

<script setup>
import { ref } from 'vue';
import { XDialog, XButton, XTable } from '@x-design/components';

const dialogVisible = ref(false);

const tableColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色', width: 100 },
];

const tableData = [
  { name: '张三', age: 28, email: 'zhangsan@example.com', role: '管理员' },
  { name: '李四', age: 32, email: 'lisi@example.com', role: '编辑' },
  { name: '王五', age: 25, email: 'wangwu@example.com', role: '访客' },
  { name: '赵六', age: 30, email: 'zhaoliu@example.com', role: '编辑' },
];
</script>
```

## 包含表单

在 Dialog 中嵌入 `XForm` 实现新增或编辑功能，点击确认时触发表单校验。

<div class="demo-block">
  <XButton type="primary" @click="dialogVisible5 = true">新增用户</XButton>
  <XDialog v-model="dialogVisible5" title="新增用户" width="500px" :close-on-click-modal="false">
    <XForm ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <XFormItem label="姓名" prop="name">
        <XInput v-model="formData.name" placeholder="请输入姓名" />
      </XFormItem>
      <XFormItem label="邮箱" prop="email">
        <XInput v-model="formData.email" placeholder="请输入邮箱" />
      </XFormItem>
      <XFormItem label="角色" prop="role">
        <XSelect v-model="formData.role" placeholder="请选择角色" :options="roleOptions" />
      </XFormItem>
    </XForm>
    <template #footer>
      <XButton @click="handleFormCancel">取消</XButton>
      <XButton type="primary" @click="handleFormSubmit">确定</XButton>
    </template>
  </XDialog>
</div>

```vue
<template>
  <XButton type="primary" @click="dialogVisible = true">新增用户</XButton>
  <XDialog v-model="dialogVisible" title="新增用户" width="500px" :close-on-click-modal="false">
    <XForm ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <XFormItem label="姓名" prop="name">
        <XInput v-model="formData.name" placeholder="请输入姓名" />
      </XFormItem>
      <XFormItem label="邮箱" prop="email">
        <XInput v-model="formData.email" placeholder="请输入邮箱" />
      </XFormItem>
      <XFormItem label="角色" prop="role">
        <XSelect v-model="formData.role" placeholder="请选择角色" :options="roleOptions" />
      </XFormItem>
    </XForm>
    <template #footer>
      <XButton @click="handleFormCancel">取消</XButton>
      <XButton type="primary" @click="handleFormSubmit">确定</XButton>
    </template>
  </XDialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { XDialog, XButton, XForm, XFormItem, XInput, XSelect } from '@x-design/components';

const dialogVisible = ref(false);
const formRef = ref(null);

const formData = reactive({
  name: '',
  email: '',
  role: '',
});

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '访客', value: 'viewer' },
];

const handleFormCancel = () => {
  formRef.value?.resetFields();
  dialogVisible.value = false;
};

const handleFormSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    console.log('提交数据：', formData);
    dialogVisible.value = false;
  }
};
</script>
```

## 函数式调用

可以使用 `XDialog.confirm()` 或 `this.$dialog.confirm()` 进行函数式调用。

<div class="demo-block">
  <XButton type="danger" @click="handleConfirm">删除数据</XButton>
</div>

```vue
<template>
  <XButton type="danger" @click="handleDelete">删除数据</XButton>
</template>

<script setup>
import { XDialog } from '@x-design/components';

const handleDelete = () => {
  XDialog.confirm({
    title: '删除确认',
    message: '确定要删除这条记录吗？删除后无法恢复。',
    confirmButtonText: '删除',
    confirmButtonType: 'danger',
  })
    .then(() => {
      // 确认后的逻辑
      console.log('confirmed');
    })
    .catch(() => {
      // 取消后的逻辑
      console.log('canceled');
    });
};
</script>
```

## API

### Props

| 参数                  | 说明                        | 类型               | 默认值   |
| --------------------- | --------------------------- | ------------------ | -------- |
| v-model               | 是否显示 Dialog             | `boolean`          | `false`  |
| title                 | 标题                        | `string`           | `''`     |
| width                 | 宽度                        | `string \| number` | `'50%'`  |
| top                   | 距离顶部位置                | `string`           | `'15vh'` |
| modal                 | 是否显示遮罩层              | `boolean`          | `true`   |
| close-on-click-modal  | 是否可以通过点击 modal 关闭 | `boolean`          | `true`   |
| close-on-press-escape | 是否可以通过按下 ESC 关闭   | `boolean`          | `true`   |
| show-close            | 是否显示关闭按钮            | `boolean`          | `true`   |
| center                | 是否居中布局                | `boolean`          | `false`  |
| destroy-on-close      | 关闭时销毁内容              | `boolean`          | `false`  |
| append-to-body        | 是否插入至 body 元素        | `boolean`          | `true`   |

### Events

| 事件名 | 说明                      | 类型         |
| ------ | ------------------------- | ------------ |
| open   | Dialog 打开动画开始时触发 | `() => void` |
| opened | Dialog 打开动画结束时触发 | `() => void` |
| close  | Dialog 关闭动画开始时触发 | `() => void` |
| closed | Dialog 关闭动画结束时触发 | `() => void` |

### Slots

| 插槽名  | 说明              |
| ------- | ----------------- |
| default | Dialog 内容       |
| header  | Dialog 标题区内容 |
| footer  | Dialog 底部区内容 |

### DialogConfirmOptions

用于 `XDialog.confirm()` 方法的配置项。

| 参数              | 说明             | 类型                                                                     | 默认值      |
| ----------------- | ---------------- | ------------------------------------------------------------------------ | ----------- |
| title             | 标题             | `string`                                                                 | `'提示'`    |
| message           | 内容文本         | `string`                                                                 | `''`        |
| confirmButtonText | 确认按钮文字     | `string`                                                                 | `'确定'`    |
| cancelButtonText  | 取消按钮文字     | `string`                                                                 | `'取消'`    |
| confirmButtonType | 确认按钮类型     | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |
| width             | 对话框宽度       | `string \| number`                                                       | `'420px'`   |
| showCancelButton  | 是否显示取消按钮 | `boolean`                                                                | `true`      |
| center            | 内容是否居中     | `boolean`                                                                | `false`     |
