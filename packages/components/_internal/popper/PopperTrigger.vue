<template>
  <div ref="triggerRef" class="x-popper__trigger" v-bind="triggerEvents">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

defineOptions({
  name: 'PopperTrigger',
});

const props = defineProps<{
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
}>();

const emit = defineEmits<{
  show: [];
  hide: [];
  toggle: [];
}>();

const triggerRef = ref<HTMLElement>();

const triggerEvents = computed(() => {
  if (props.disabled) return {};

  switch (props.trigger) {
    case 'hover':
      return {
        onMouseenter: () => emit('show'),
        onMouseleave: () => emit('hide'),
      };
    case 'click':
      return {
        onClick: () => emit('toggle'),
      };
    case 'focus':
      return {
        onFocus: () => emit('show'),
        onBlur: () => emit('hide'),
      };
    default:
      return {};
  }
});

defineExpose({
  triggerRef,
});
</script>
