<template>
  <div ref="referenceRef" :class="wrapperClasses" @click="toggleDropdown">
    <div class="x-select__input-wrapper">
      <!-- 多选标签 -->
      <div v-if="multiple && selectedOptions.length > 0" class="x-select__tags">
        <span
          v-for="option in selectedOptions"
          :key="option.value"
          class="x-select__tag"
        >
          {{ option.label }}
          <i class="x-select__tag-close" @click.stop="removeTag(option)">×</i>
        </span>
      </div>
      
      <!-- 输入框 -->
      <input
        ref="inputRef"
        v-model="displayValue"
        :class="inputClasses"
        :placeholder="currentPlaceholder"
        :disabled="disabled"
        :readonly="!filterable"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- 图标 -->
      <span class="x-select__suffix">
        <i
          v-if="clearable && !disabled && hasValue"
          class="x-select__clear"
          @click.stop="handleClear"
        >
          ×
        </i>
        <i
          v-else
          class="x-select__arrow"
          :class="{ 'is-reverse': visible }"
        >
          ▼
        </i>
      </span>
    </div>
  </div>

  <!-- 下拉面板 -->
  <Teleport to="body">
    <Transition name="x-select-dropdown">
      <div
        v-show="visible"
        ref="floatingRef"
        :class="['x-select__dropdown', popperClass]"
        :style="floatingStyles"
      >
        <div v-if="loading" class="x-select__loading">
          {{ loadingText || '加载中...' }}
        </div>
        <div v-else-if="filteredOptions.length === 0" class="x-select__empty">
          {{ query ? (noMatchText || '无匹配数据') : (noDataText || '无数据') }}
        </div>
        <ul v-else class="x-select__options">
          <li
            v-for="option in filteredOptions"
            :key="option.value"
            :class="getOptionClass(option)"
            @click="handleSelect(option)"
          >
            <span>{{ option.label }}</span>
            <i v-if="isSelected(option)" class="x-select__option-check">✓</i>
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useFloating, offset, flip, shift, size } from '@floating-ui/vue';
import type { SelectProps, SelectOption } from './types';

defineOptions({
  name: 'XSelect',
});

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  placeholder: '请选择',
  size: 'medium',
  disabled: false,
  clearable: false,
  filterable: false,
  multiple: false,
  multipleLimit: 0,
  loading: false,
  valueKey: 'value',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]];
  change: [value: string | number | (string | number)[]];
  visibleChange: [visible: boolean];
  clear: [];
  removeTag: [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const referenceRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();
const inputRef = ref<HTMLInputElement>();
const visible = ref(false);
const query = ref('');
const selectedValue = ref<string | number | (string | number)[]>(props.modelValue || (props.multiple ? [] : ''));

// Floating UI
const { floatingStyles, middlewareData } = useFloating(referenceRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [
    offset(8),
    flip(),
    shift({ padding: 5 }),
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          minWidth: `${rects.reference.width}px`,
        });
      },
    }),
  ],
});

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  selectedValue.value = val || (props.multiple ? [] : '');
});

const wrapperClasses = computed(() => [
  'x-select',
  `x-select--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-focus': visible.value,
    'is-multiple': props.multiple,
  },
]);

const inputClasses = computed(() => [
  'x-select__input',
  {
    'is-multiple': props.multiple,
  },
]);

// 已选中的选项
const selectedOptions = computed(() => {
  if (!props.multiple) {
    const option = props.options.find(opt => opt.value === selectedValue.value);
    return option ? [option] : [];
  }
  
  const values = selectedValue.value as (string | number)[];
  return props.options.filter(opt => values.includes(opt.value));
});

// 是否有值
const hasValue = computed(() => {
  if (props.multiple) {
    return (selectedValue.value as any[]).length > 0;
  }
  return selectedValue.value !== '' && selectedValue.value !== null && selectedValue.value !== undefined;
});

// 显示值
const displayValue = computed({
  get() {
    if (visible.value && props.filterable) {
      return query.value;
    }
    
    if (props.multiple) {
      return '';
    }
    
    const option = selectedOptions.value[0];
    return option ? option.label : '';
  },
  set(val) {
    query.value = val;
  },
});

// 当前占位符
const currentPlaceholder = computed(() => {
  if (props.multiple && selectedOptions.value.length > 0) {
    return '';
  }
  return props.placeholder;
});

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!props.filterable || !query.value) {
    return props.options;
  }
  
  const lowerQuery = query.value.toLowerCase();
  return props.options.filter(option => 
    option.label.toLowerCase().includes(lowerQuery)
  );
});

// 切换下拉框
const toggleDropdown = () => {
  if (props.disabled) return;
  visible.value = !visible.value;
};

// 关闭下拉框
const closeDropdown = () => {
  visible.value = false;
  query.value = '';
};

// 选择选项
const handleSelect = (option: SelectOption) => {
  if (option.disabled) return;
  
  if (props.multiple) {
    const values = [...(selectedValue.value as (string | number)[])];
    const index = values.indexOf(option.value);
    
    if (index > -1) {
      values.splice(index, 1);
    } else {
      if (props.multipleLimit && values.length >= props.multipleLimit) {
        return;
      }
      values.push(option.value);
    }
    
    selectedValue.value = values;
    emit('update:modelValue', values);
    emit('change', values);
    
    // 多选不关闭下拉框
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    selectedValue.value = option.value;
    emit('update:modelValue', option.value);
    emit('change', option.value);
    closeDropdown();
  }
};

// 移除标签
const removeTag = (option: SelectOption) => {
  if (props.disabled) return;
  
  const values = [...(selectedValue.value as (string | number)[])];
  const index = values.indexOf(option.value);
  
  if (index > -1) {
    values.splice(index, 1);
    selectedValue.value = values;
    emit('update:modelValue', values);
    emit('change', values);
    emit('removeTag', option.value);
  }
};

// 清空
const handleClear = () => {
  const emptyValue = props.multiple ? [] : '';
  selectedValue.value = emptyValue;
  emit('update:modelValue', emptyValue);
  emit('change', emptyValue);
  emit('clear');
  closeDropdown();
};

// 输入
const handleInput = (event: Event) => {
  if (!props.filterable) return;
  query.value = (event.target as HTMLInputElement).value;
  visible.value = true;
};

// 获取选项类名
const getOptionClass = (option: SelectOption) => [
  'x-select__option',
  {
    'is-selected': isSelected(option),
    'is-disabled': option.disabled,
  },
];

// 是否选中
const isSelected = (option: SelectOption) => {
  if (props.multiple) {
    return (selectedValue.value as (string | number)[]).includes(option.value);
  }
  return selectedValue.value === option.value;
};

// 键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown();
  } else if (event.key === 'Enter' && !visible.value) {
    visible.value = true;
  }
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

// 监听 visible 变化
watch(visible, (val) => {
  emit('visibleChange', val);
  
  if (val) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    query.value = '';
  }
});

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    visible.value &&
    referenceRef.value &&
    floatingRef.value &&
    !referenceRef.value.contains(target) &&
    !floatingRef.value.contains(target)
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 暴露方法
defineExpose({
  focus: () => {
    inputRef.value?.focus();
    visible.value = true;
  },
  blur: () => {
    inputRef.value?.blur();
    closeDropdown();
  },
});
</script>

<style lang="scss">
@import './style.scss';
</style>
