<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition name="x-dialog-fade">
      <div v-if="visible" class="x-dialog__wrapper" @click.self="handleWrapperClick">
        <div
          :class="dialogClasses"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <div class="x-dialog__header">
            <slot name="header">
              <span class="x-dialog__title">{{ title }}</span>
            </slot>
            <button
              v-if="showClose"
              class="x-dialog__close"
              type="button"
              aria-label="Close"
              @click="handleClose"
            >
              <span>×</span>
            </button>
          </div>
          <div class="x-dialog__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="x-dialog__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="x-modal-fade">
      <div v-if="visible && modal" class="x-dialog__modal" />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount, toRef } from 'vue';
import { useLockScroll } from '../_hooks';
import type { DialogProps } from './types';

defineOptions({
  name: 'XDialog',
});

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: '50%',
  top: '15vh',
  modal: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  center: false,
  destroyOnClose: false,
  appendToBody: true,
  confirmLoading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  open: [];
  opened: [];
  close: [];
  closed: [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 使用 useLockScroll 替代手动管理
useLockScroll(toRef(() => props.modelValue));

const dialogClasses = computed(() => [
  'x-dialog',
  {
    'x-dialog--center': props.center,
  },
]);

const dialogStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  marginTop: props.top,
}));

const doClose = () => {
  emit('close');
  visible.value = false;
};

const handleClose = () => {
  if (props.beforeClose) {
    props.beforeClose(doClose);
  } else {
    doClose();
  }
};

const handleWrapperClick = () => {
  if (props.closeOnClickModal) {
    handleClose();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnPressEscape && visible.value) {
    handleClose();
  }
};

watch(visible, (val) => {
  if (val) {
    emit('open');
  } else {
    emit('closed');
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style lang="scss">
@use './style.scss';
</style>
