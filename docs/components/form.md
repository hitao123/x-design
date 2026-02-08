# Form 表单

由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。

<script setup>
import { ref, reactive } from 'vue';
import { XForm, XFormItem, XInput, XButton } from '@x-design/components';

const formData = reactive({
  name: '',
  email: '',
  age: '',
});

const rules = {
  name: [
    { required: true, message: '请输入姓名' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '邮箱格式不正确' },
  ],
  age: [
    { required: true, message: '请输入年龄' },
    { 
      validator: (rule, value) => {
        const age = Number(value);
        return age >= 1 && age <= 150;
      },
      message: '年龄必须在 1-150 之间'
    },
  ],
};

const formRef = ref(null);

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    console.log('验证通过', formData);
  } catch (error) {
    console.log('验证失败', error);
  }
};

const handleReset = () => {
  formRef.value.resetFields();
};

const inlineFormData = reactive({
  user: '',
  region: '',
});

const leftFormData = reactive({
  name: '',
  email: '',
});

const customFormData = reactive({
  password: '',
  confirmPassword: '',
});

const validateConfirmPassword = (rule, value) => {
  if (value !== customFormData.password) {
    return false;
  }
  return true;
};

const customRules = {
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度不能少于 6 位' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码' },
    { validator: validateConfirmPassword, message: '两次输入密码不一致' },
  ],
};

const customFormRef = ref(null);
</script>

## 基础用法

在 Form 组件中，每一个表单域由 FormItem 组件构成。

<div class="demo-block">
  <XForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
    <XFormItem label="姓名" prop="name">
      <XInput v-model="formData.name" placeholder="请输入姓名" />
    </XFormItem>
    <XFormItem label="邮箱" prop="email">
      <XInput v-model="formData.email" placeholder="请输入邮箱" />
    </XFormItem>
    <XFormItem label="年龄" prop="age">
      <XInput v-model="formData.age" placeholder="请输入年龄" />
    </XFormItem>
    <XFormItem>
      <XButton type="primary" @click="handleSubmit">提交</XButton>
      <XButton @click="handleReset">重置</XButton>
    </XFormItem>
  </XForm>
</div>

```vue
<template>
  <XForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
    <XFormItem label="姓名" prop="name">
      <XInput v-model="formData.name" placeholder="请输入姓名" />
    </XFormItem>
    <XFormItem label="邮箱" prop="email">
      <XInput v-model="formData.email" placeholder="请输入邮箱" />
    </XFormItem>
    <XFormItem label="年龄" prop="age">
      <XInput v-model="formData.age" placeholder="请输入年龄" />
    </XFormItem>
    <XFormItem>
      <XButton type="primary" @click="handleSubmit">提交</XButton>
      <XButton @click="handleReset">重置</XButton>
    </XFormItem>
  </XForm>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { XForm, XFormItem, XInput, XButton } from '@x-design/components';

const formData = reactive({
  name: '',
  email: '',
  age: '',
});

const rules = {
  name: [
    { required: true, message: '请输入姓名' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '邮箱格式不正确' },
  ],
};

const formRef = ref(null);

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    console.log('验证通过', formData);
  } catch (error) {
    console.log('验证失败', error);
  }
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```

## 行内表单

通过 `inline` 属性设置为行内表单。

<div class="demo-block">
  <XForm :model="inlineFormData" inline>
    <XFormItem label="用户">
      <XInput v-model="inlineFormData.user" placeholder="请输入用户名" />
    </XFormItem>
    <XFormItem label="地区">
      <XInput v-model="inlineFormData.region" placeholder="请选择地区" />
    </XFormItem>
    <XFormItem>
      <XButton type="primary">查询</XButton>
    </XFormItem>
  </XForm>
</div>

```vue
<XForm :model="formData" inline>
  <XFormItem label="用户">
    <XInput v-model="formData.user" placeholder="请输入用户名" />
  </XFormItem>
  <XFormItem label="地区">
    <XInput v-model="formData.region" placeholder="请选择地区" />
  </XFormItem>
  <XFormItem>
    <XButton type="primary">查询</XButton>
  </XFormItem>
</XForm>
```

## 标签对齐方式

通过 `label-position` 属性设置表单域标签的位置。

<div class="demo-block">
  <XForm :model="leftFormData" label-position="right" label-width="80px">
    <XFormItem label="姓名">
      <XInput v-model="leftFormData.name" />
    </XFormItem>
    <XFormItem label="邮箱">
      <XInput v-model="leftFormData.email" />
    </XFormItem>
  </XForm>
</div>

```vue
<XForm :model="formData" label-position="right" label-width="80px">
  <XFormItem label="姓名">
    <XInput v-model="formData.name" />
  </XFormItem>
  <XFormItem label="邮箱">
    <XInput v-model="formData.email" />
  </XFormItem>
</XForm>
```

## 自定义验证规则

除了内置的验证规则，还可以使用自定义验证函数。

<div class="demo-block">
  <XForm ref="customFormRef" :model="customFormData" :rules="customRules" label-width="100px">
    <XFormItem label="密码" prop="password">
      <XInput v-model="customFormData.password" type="password" />
    </XFormItem>
    <XFormItem label="确认密码" prop="confirmPassword">
      <XInput v-model="customFormData.confirmPassword" type="password" />
    </XFormItem>
    <XFormItem>
      <XButton type="primary" @click="customFormRef.validate()">提交</XButton>
    </XFormItem>
  </XForm>
</div>

```vue
<script setup>
const validateConfirmPassword = (rule, value) => {
  if (value !== formData.password) {
    return false;
  }
  return true;
};

const rules = {
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度不能少于 6 位' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码' },
    { validator: validateConfirmPassword, message: '两次输入密码不一致' },
  ],
};
</script>
```

## API

### Form Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | `object` | `{}` |
| rules | 表单验证规则 | `FormRules` | `{}` |
| inline | 是否行内表单 | `boolean` | `false` |
| label-position | 表单域标签位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| label-width | 表单域标签宽度 | `string \| number` | `''` |
| disabled | 是否禁用所有表单项 | `boolean` | `false` |

### FormItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | `string` | `''` |
| prop | 表单域 model 字段名 | `string` | `''` |
| required | 是否必填 | `boolean` | `false` |
| label-width | 标签宽度 | `string \| number` | `''` |

### Form Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 对整个表单进行验证 | `() => Promise<boolean>` |
| resetFields | 重置表单所有字段 | `() => void` |
| clearValidate | 清除表单验证信息 | `(props?: string \| string[]) => void` |

### FormItem Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 验证该表单项 | `() => Promise<boolean>` |
| resetField | 重置该表单项 | `() => void` |
| clearValidate | 清除验证信息 | `() => void` |

### FormRule

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| required | 是否必填 | `boolean` |
| message | 验证失败提示信息 | `string` |
| min | 最小长度 | `number` |
| max | 最大长度 | `number` |
| pattern | 正则表达式验证 | `RegExp` |
| validator | 自定义验证函数 | `(rule: FormRule, value: any) => boolean` |
