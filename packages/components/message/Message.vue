<template>
  <Transition name="x-message-fade" @before-leave="onClose" @after-leave="onDestroy">
    <div
      v-show="visible"
      :id="id"
      :class="classes"
      :style="customStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <span :class="iconClass"></span>
      <p class="x-message__content">
        <slot>{{ message }}</slot>
      </p>
      <button v-if="showClose" class="x-message__close" @click="close">
        <IconClose />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { IconClose } from '@x-design/icons';
import type { MessageProps } from './types';

defineOptions({
  name: 'XMessage',
});

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  showClose: false,
  offset: 16,
  plain: false,
});

const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const classes = computed(() => [
  'x-message',
  `x-message--${props.type}`,
  {
    'is-plain': props.plain,
    'is-closable': props.showClose,
  },
]);

const iconClass = computed(() => ['x-message__icon', `x-message__icon--${props.type}`]);

const customStyle = computed(() => ({
  top: `${props.offset}px`,
}));

const startTimer = () => {
  if (props.duration === 0) return;
  timer = setTimeout(() => {
    close();
  }, props.duration);
};

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

const close = () => {
  visible.value = false;
};

onMounted(() => {
  visible.value = true;
  startTimer();
});

defineExpose({
  visible,
  close,
});
</script>

<style lang="scss">
@use './style.scss';
</style>
