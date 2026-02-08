<template>
  <div ref="popconfirmRef" class="x-popconfirm">
    <div
      ref="referenceRef"
      class="x-popconfirm__trigger"
      @click="handleTriggerClick"
    >
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="x-popconfirm-fade">
        <div
          v-if="visible"
          ref="floatingRef"
          :class="popperClasses"
          :style="floatingStyles"
        >
          <div class="x-popconfirm__content">
            <div v-if="!hideIcon" class="x-popconfirm__icon" :style="{ color: iconColor }">
              <slot name="icon">
                <span>?</span>
              </slot>
            </div>
            <div class="x-popconfirm__title">
              <slot name="title">{{ title }}</slot>
            </div>
          </div>
          <div class="x-popconfirm__actions">
            <XButton :type="cancelButtonType" size="small" @click="handleCancel">
              {{ cancelButtonText }}
            </XButton>
            <XButton :type="confirmButtonType" size="small" @click="handleConfirm">
              {{ confirmButtonText }}
            </XButton>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useFloating, offset, flip, shift } from '@floating-ui/vue';
import { XButton } from '../button';
import type { PopconfirmProps } from './types';

defineOptions({
  name: 'XPopconfirm',
});

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: '确定执行此操作吗？',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  confirmButtonType: 'primary',
  cancelButtonType: 'default',
  iconColor: '#f90',
  hideIcon: false,
  placement: 'top',
  width: 200,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const visible = ref(false);
const popconfirmRef = ref<HTMLElement>();
const referenceRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();

// Use Floating UI
const { floatingStyles: baseFloatingStyles, placement: actualPlacement } = useFloating(
  referenceRef,
  floatingRef,
  {
    placement: props.placement,
    middleware: [offset(8), flip(), shift({ padding: 5 })],
    whileElementsMounted: (reference, floating, update) => {
      if (visible.value) {
        update();
      }
    },
  }
);

// Add width to floating styles
const floatingStyles = computed(() => ({
  ...baseFloatingStyles.value,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

const popperClasses = computed(() => [
  'x-popconfirm__popper',
  `x-popconfirm__popper--${actualPlacement.value}`,
]);

const handleTriggerClick = () => {
  visible.value = !visible.value;
};

const handleConfirm = () => {
  emit('confirm');
  visible.value = false;
};

const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    visible.value &&
    popconfirmRef.value &&
    !popconfirmRef.value.contains(event.target as Node) &&
    floatingRef.value &&
    !floatingRef.value.contains(event.target as Node)
  ) {
    visible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss">
@import './style.scss';
</style>
