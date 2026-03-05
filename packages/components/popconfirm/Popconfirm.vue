<template>
  <div ref="popconfirmRef" class="x-popconfirm">
    <PopperTrigger ref="triggerComp" trigger="click" @toggle="toggle">
      <slot />
    </PopperTrigger>
    <PopperContent
      ref="contentComp"
      :visible="visible"
      :floating-styles="mergedFloatingStyles"
      :show-arrow="false"
      :popper-class="popperClass"
      :placement-class="placementClass"
      transition="x-popconfirm-fade"
      :enterable="false"
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
    </PopperContent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef, onBeforeUnmount } from 'vue';
import { usePopper, PopperTrigger, PopperContent } from '../_internal/popper';
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
const triggerComp = ref<InstanceType<typeof PopperTrigger>>();
const contentComp = ref<InstanceType<typeof PopperContent>>();

const referenceRef = computed(() => triggerComp.value?.triggerRef);
const floatingRef = computed(() => contentComp.value?.contentRef);
const arrowRef = computed(() => contentComp.value?.arrowRef);

const { visible, floatingStyles, actualPlacement, toggle, hide, clearTimers } = usePopper(
  referenceRef,
  floatingRef,
  arrowRef,
  {
    placement: toRef(props, 'placement'),
    offset: 8,
  }
);

const mergedFloatingStyles = computed(() => ({
  ...floatingStyles.value,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

const popperClass = 'x-popconfirm__popper';

const placementClass = computed(
  () => `x-popconfirm__popper--${actualPlacement.value.split('-')[0]}`
);

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

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style lang="scss">
@use './style.scss';
</style>
