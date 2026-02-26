<template>
  <div ref="popconfirmRef" class="x-popconfirm">
    <div ref="referenceRef" class="x-popconfirm__trigger" @click="handleTriggerClick">
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="x-popconfirm-fade">
        <div
          v-if="shouldRender"
          v-show="visible"
          ref="floatingRef"
          :class="popperClasses"
          :style="popperStyles"
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
import { ref, computed, toRef, watch } from 'vue';
import { usePopper } from '../_internal/popper';
import { useClickOutside } from '../_hooks';
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

const popconfirmRef = ref<HTMLElement>();
const referenceRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();

const { visible, floatingStyles, actualPlacement, toggle, hide } = usePopper(
  referenceRef,
  floatingRef,
  arrowRef,
  {
    placement: toRef(props, 'placement'),
    offset: 8,
  }
);

const rendered = ref(false);
const shouldRender = computed(() => rendered.value || visible.value);

watch(
  visible,
  (val) => {
    if (val) rendered.value = true;
  },
  { immediate: true }
);

const popperStyles = computed(() => ({
  ...floatingStyles.value,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

const popperClasses = computed(() => [
  'x-popconfirm__popper',
  `x-popconfirm__popper--${actualPlacement.value.split('-')[0]}`,
]);

const handleTriggerClick = () => {
  toggle();
};

const handleConfirm = () => {
  emit('confirm');
  hide();
};

const handleCancel = () => {
  emit('cancel');
  hide();
};

// 点击外部关闭
useClickOutside([popconfirmRef, floatingRef], () => {
  if (visible.value) {
    hide();
  }
});
</script>

<style lang="scss">
@use './style.scss';
</style>
