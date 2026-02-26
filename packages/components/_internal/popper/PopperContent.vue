<template>
  <Teleport to="body">
    <Transition :name="transition">
      <div
        v-if="shouldRender"
        v-show="visible"
        ref="contentRef"
        :class="contentClasses"
        :style="floatingStyles"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div v-if="showArrow" ref="arrowRef" class="x-popper__arrow" :style="arrowStyles" />
        <div class="x-popper__inner">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, type CSSProperties } from 'vue';

defineOptions({
  name: 'PopperContent',
});

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    floatingStyles?: CSSProperties;
    arrowStyles?: CSSProperties;
    showArrow?: boolean;
    popperClass?: string;
    placementClass?: string;
    transition?: string;
    enterable?: boolean;
    destroyOnHide?: boolean;
  }>(),
  {
    visible: false,
    showArrow: true,
    transition: 'x-popper-fade',
    enterable: true,
    destroyOnHide: false,
  }
);

const emit = defineEmits<{
  mouseenter: [];
  mouseleave: [];
}>();

const contentRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();
const rendered = ref(false);

// 控制是否渲染（destroyOnHide 模式下隐藏后销毁 DOM）
const shouldRender = computed(() => {
  if (props.destroyOnHide) {
    return props.visible;
  }
  // 非 destroyOnHide 模式下，一旦显示过就一直保留 DOM
  return rendered.value;
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      rendered.value = true;
    }
  },
  { immediate: true }
);

const contentClasses = computed(() => ['x-popper', props.popperClass, props.placementClass]);

const handleMouseEnter = () => {
  if (props.enterable) {
    emit('mouseenter');
  }
};

const handleMouseLeave = () => {
  if (props.enterable) {
    emit('mouseleave');
  }
};

defineExpose({
  contentRef,
  arrowRef,
});
</script>
