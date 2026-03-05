<template>
  <Transition name="x-loading-fade">
    <div v-show="visible" :class="classes" :style="overlayStyle">
      <div class="x-loading__spinner">
        <svg class="x-loading__circular" viewBox="0 0 50 50">
          <circle class="x-loading__path" cx="25" cy="25" r="20" fill="none" />
        </svg>
        <p v-if="text" class="x-loading__text">{{ text }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineOptions({
  name: 'XLoading',
});

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    text?: string;
    background?: string;
    fullscreen?: boolean;
    customClass?: string;
  }>(),
  {
    visible: false,
    fullscreen: false,
  },
);

const classes = computed(() => [
  'x-loading-mask',
  {
    'is-fullscreen': props.fullscreen,
  },
  props.customClass,
]);

const overlayStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.background) {
    style.backgroundColor = props.background;
  }
  return style;
});

const text = ref(props.text);

const setText = (val: string) => {
  text.value = val;
};

defineExpose({
  setText,
});
</script>

<style lang="scss">
@use './style.scss';
</style>
