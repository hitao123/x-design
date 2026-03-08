<template>
  <div ref="referenceRef" :class="wrapperClasses" @click="toggleDropdown">
    <div class="x-select__input-wrapper">
      <!-- 多选标签 -->
      <div v-if="multiple && selectedOptions.length > 0" class="x-select__tags">
        <template v-for="option in visibleTags" :key="option.value">
          <slot name="tag" :option="option" :close="() => removeTag(option)">
            <span class="x-select__tag">
              {{ option.label }}
              <IconClose class="x-select__tag-close" @click.stop="removeTag(option)" />
            </span>
          </slot>
        </template>
        <XTooltip v-if="collapsedCount > 0" placement="top">
          <span class="x-select__tag x-select__tag--collapse"> +{{ collapsedCount }} </span>
          <template #content>
            <div class="x-select__tag--collapse-list">
              <span v-for="tag in collapsedTags" :key="tag.value">{{ tag.label }}</span>
            </div>
          </template>
        </XTooltip>
      </div>

      <!-- 单选自定义展示覆盖层 -->
      <div
        v-if="!multiple && $slots.selected && selectedOptions.length > 0 && !dropdownVisible"
        class="x-select__selected-overlay"
      >
        <slot name="selected" :option="selectedOptions[0]" />
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
        <IconClose
          v-if="clearable && !disabled && hasValue"
          class="x-select__clear"
          @click.stop="handleClear"
        />
        <IconArrowDown v-else class="x-select__arrow" :class="{ 'is-reverse': dropdownVisible }" />
      </span>
    </div>
  </div>

  <!-- 下拉面板 -->
  <Teleport to="body">
    <Transition name="x-select-dropdown">
      <div
        v-show="dropdownVisible"
        ref="floatingRef"
        :class="['x-select__dropdown', popperClass]"
        :style="floatingStyles"
      >
        <div v-if="loading && filteredOptions.length === 0" class="x-select__loading">
          {{ loadingText || '加载中...' }}
        </div>
        <div v-else-if="filteredOptions.length === 0" class="x-select__empty">
          <slot name="empty">
            {{ query ? noMatchText || '无匹配数据' : noDataText || '无数据' }}
          </slot>
        </div>
        <template v-else>
          <!-- 全选 -->
          <div
            v-if="multiple && showCheckAll"
            class="x-select__check-all"
            @click.stop="handleCheckAll"
          >
            <XCheckbox
              :model-value="isAllSelected"
              :indeterminate="isIndeterminate"
              class="x-select__check-all-checkbox"
              >全选</XCheckbox
            >
          </div>
          <!-- 滚动容器 -->
          <div
            ref="optionsContainerRef"
            class="x-select__options-wrapper"
            @scroll="handleDropdownScroll"
          >
            <!-- 虚拟滚动模式 -->
            <template v-if="virtual">
              <div :style="{ height: totalHeight + 'px', position: 'relative' }">
                <ul
                  class="x-select__options x-select__options--virtual"
                  :style="{ transform: 'translateY(' + offsetTop + 'px)' }"
                >
                  <li
                    v-for="item in virtualItems"
                    :key="item.data.value"
                    :class="getOptionClass(item.data)"
                    @click="handleSelect(item.data)"
                  >
                    <template v-if="multiple">
                      <XCheckbox
                        :model-value="isSelected(item.data)"
                        :disabled="item.data.disabled"
                        class="x-select__option-checkbox"
                      >
                        <slot name="option" :option="item.data" :selected="isSelected(item.data)">{{
                          item.data.label
                        }}</slot>
                      </XCheckbox>
                    </template>
                    <template v-else>
                      <slot name="option" :option="item.data" :selected="isSelected(item.data)">
                        <span>{{ item.data.label }}</span>
                        <IconCheck v-if="isSelected(item.data)" class="x-select__option-check" />
                      </slot>
                    </template>
                  </li>
                </ul>
              </div>
            </template>
            <!-- 普通模式 -->
            <template v-else>
              <ul class="x-select__options">
                <li
                  v-for="option in filteredOptions"
                  :key="option.value"
                  :class="getOptionClass(option)"
                  @click="handleSelect(option)"
                >
                  <template v-if="multiple">
                    <XCheckbox
                      :model-value="isSelected(option)"
                      :disabled="option.disabled"
                      class="x-select__option-checkbox"
                    >
                      <slot name="option" :option="option" :selected="isSelected(option)">{{
                        option.label
                      }}</slot>
                    </XCheckbox>
                  </template>
                  <template v-else>
                    <slot name="option" :option="option" :selected="isSelected(option)">
                      <span>{{ option.label }}</span>
                      <IconCheck v-if="isSelected(option)" class="x-select__option-check" />
                    </slot>
                  </template>
                </li>
              </ul>
            </template>
            <!-- 加载更多 -->
            <div v-if="hasMore" class="x-select__load-more">
              {{ loading ? (loadMoreText || '加载中...') : '' }}
            </div>
          </div>
        </template>
        <!-- 底部扩展区域 -->
        <div v-if="$slots.footer" class="x-select__footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, useSlots } from 'vue';
import { IconClose, IconCheck, IconArrowDown } from '@x-design/icons';
import { XTooltip } from '../tooltip';
import { XCheckbox } from '../checkbox';
import { usePopper } from '../_internal/popper';
import { useClickOutside, useVirtualList } from '../_hooks';
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
  maxTagCount: 0,
  loading: false,
  valueKey: 'value',
  remote: false,
  showCheckAll: false,
  hasMore: false,
  virtual: false,
  itemHeight: 34,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]];
  change: [value: string | number | (string | number)[]];
  visibleChange: [visible: boolean];
  clear: [];
  removeTag: [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  loadMore: [];
}>();

defineSlots<{
  empty?: () => any;
  option?: (props: { option: SelectOption; selected: boolean }) => any;
  tag?: (props: { option: SelectOption; close: () => void }) => any;
  selected?: (props: { option: SelectOption }) => any;
  footer?: () => any;
}>();

const $slots = useSlots();

const referenceRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();
const inputRef = ref<HTMLInputElement>();
const optionsContainerRef = ref<HTMLElement>();
const query = ref('');
const isLoadMorePending = ref(false);
const selectedValue = ref<string | number | (string | number)[]>(
  props.modelValue || (props.multiple ? [] : '')
);

// 使用 usePopper 替代直接调用 @floating-ui/vue
const {
  visible: dropdownVisible,
  floatingStyles,
  show,
  hide,
} = usePopper(referenceRef, floatingRef, arrowRef, {
  placement: 'bottom-start' as any,
  offset: 8,
  matchWidth: true,
});

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val || (props.multiple ? [] : '');
  }
);

const wrapperClasses = computed(() => [
  'x-select',
  `x-select--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-focus': dropdownVisible.value,
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
    const option = props.options.find((opt) => opt.value === selectedValue.value);
    return option ? [option] : [];
  }

  const values = selectedValue.value as (string | number)[];
  return props.options.filter((opt) => values.includes(opt.value));
});

// 可见标签（maxTagCount 限制）
const visibleTags = computed(() => {
  if (props.maxTagCount > 0 && selectedOptions.value.length > props.maxTagCount) {
    return selectedOptions.value.slice(0, props.maxTagCount);
  }
  return selectedOptions.value;
});

// 被折叠的标签
const collapsedTags = computed(() => {
  if (props.maxTagCount > 0 && selectedOptions.value.length > props.maxTagCount) {
    return selectedOptions.value.slice(props.maxTagCount);
  }
  return [];
});

// 折叠数量
const collapsedCount = computed(() => collapsedTags.value.length);

// 是否有值
const hasValue = computed(() => {
  if (props.multiple) {
    return (selectedValue.value as any[]).length > 0;
  }
  return (
    selectedValue.value !== '' && selectedValue.value !== null && selectedValue.value !== undefined
  );
});

// 显示值
const displayValue = computed({
  get() {
    if (dropdownVisible.value && props.filterable) {
      return query.value;
    }

    if (props.multiple) {
      return '';
    }

    // 当有 selected slot 且下拉关闭时，不显示文本（由 overlay 展示）
    if ($slots.selected && selectedOptions.value.length > 0 && !dropdownVisible.value) {
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
  if (props.remote) {
    return props.options;
  }

  if (!props.filterable || !query.value) {
    return props.options;
  }

  const lowerQuery = query.value.toLowerCase();
  return props.options.filter((option) => option.label.toLowerCase().includes(lowerQuery));
});

// 虚拟滚动
const {
  virtualItems,
  totalHeight,
  offsetTop,
  scrollToTop,
  onScroll: virtualOnScroll,
  refreshClientHeight,
} = useVirtualList({
  items: filteredOptions,
  itemHeight: computed(() => props.itemHeight!),
  containerRef: optionsContainerRef,
});

// 滚动处理
const handleDropdownScroll = (event: Event) => {
  if (props.virtual) {
    virtualOnScroll(event);
  }
  // load-more: 距底部 < 50px 时触发
  if (props.hasMore && !props.loading && !isLoadMorePending.value) {
    const el = event.target as HTMLElement;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
      isLoadMorePending.value = true;
      emit('loadMore');
    }
  }
};

// Feature 4: 全选相关 computed
const selectableOptions = computed(() => {
  return filteredOptions.value.filter((opt) => !opt.disabled);
});

const isAllSelected = computed(() => {
  if (selectableOptions.value.length === 0) return false;
  const values = selectedValue.value as (string | number)[];
  return selectableOptions.value.every((opt) => values.includes(opt.value));
});

const isIndeterminate = computed(() => {
  const values = selectedValue.value as (string | number)[];
  const selectedCount = selectableOptions.value.filter((opt) => values.includes(opt.value)).length;
  return selectedCount > 0 && selectedCount < selectableOptions.value.length;
});

// 切换下拉框
const toggleDropdown = () => {
  if (props.disabled) return;
  if (dropdownVisible.value) {
    closeDropdown();
  } else {
    show();
  }
};

// 关闭下拉框
const closeDropdown = () => {
  hide();
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

  if (props.remote && props.remoteMethod) {
    props.remoteMethod(query.value);
  }

  show();
};

// 全选/取消全选
const handleCheckAll = () => {
  const values = [...(selectedValue.value as (string | number)[])];

  if (isAllSelected.value) {
    // 取消全选：移除所有可选选项的值
    const selectableValues = new Set(selectableOptions.value.map((opt) => opt.value));
    const newValues = values.filter((v) => !selectableValues.has(v));
    selectedValue.value = newValues;
    emit('update:modelValue', newValues);
    emit('change', newValues);
  } else {
    // 全选：添加所有未选中的可选选项
    const newValues = [...values];
    for (const opt of selectableOptions.value) {
      if (!newValues.includes(opt.value)) {
        if (props.multipleLimit && newValues.length >= props.multipleLimit) {
          break;
        }
        newValues.push(opt.value);
      }
    }
    selectedValue.value = newValues;
    emit('update:modelValue', newValues);
    emit('change', newValues);
  }
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
  } else if (event.key === 'Enter' && !dropdownVisible.value) {
    show();
  }
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

// 监听 visible 变化
watch(dropdownVisible, (val) => {
  emit('visibleChange', val);

  if (val) {
    nextTick(() => {
      inputRef.value?.focus();
      // 重置滚动位置
      if (optionsContainerRef.value) {
        optionsContainerRef.value.scrollTop = 0;
      }
      // 下拉框可见后刷新容器高度（v-show 隐藏时 clientHeight 为 0）
      refreshClientHeight();
    });
  } else {
    query.value = '';
  }
});

// loading 变 false 时重置 load-more 防抖
watch(
  () => props.loading,
  (val) => {
    if (!val) {
      isLoadMorePending.value = false;
    }
  }
);

// filteredOptions 变化时重置滚动位置（仅在非追加场景，如搜索/筛选时）
watch(filteredOptions, (newVal, oldVal) => {
  // 如果新列表更短或完全不同，重置滚动位置
  if (newVal.length <= oldVal.length) {
    scrollToTop();
    if (optionsContainerRef.value) {
      optionsContainerRef.value.scrollTop = 0;
    }
  }
});

// 点击外部关闭
useClickOutside([referenceRef, floatingRef], () => {
  if (dropdownVisible.value) {
    closeDropdown();
  }
});

// 暴露方法
defineExpose({
  focus: () => {
    inputRef.value?.focus();
    show();
  },
  blur: () => {
    inputRef.value?.blur();
    closeDropdown();
  },
});
</script>

<style lang="scss">
@use './style.scss';
</style>
