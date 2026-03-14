<template>
  <div v-if="shouldRender" v-show="isActive" class="x-tab-pane">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { TabPaneProps, TabsContext } from './types';

defineOptions({
  name: 'XTabPane',
});

const props = withDefaults(defineProps<TabPaneProps>(), {
  disabled: false,
  lazy: false,
});

const tabs = inject<TabsContext>('xTabs')!;

const isActive = computed(() => tabs.activeTab.value === props.name);

const hasBeenActive = ref(false);

watch(
  isActive,
  (val) => {
    if (val) {
      hasBeenActive.value = true;
    }
  },
  { immediate: true }
);

const shouldRender = computed(() => {
  if (!props.lazy) return true;
  return hasBeenActive.value;
});

const getPaneInstance = () => ({
  name: props.name,
  label: props.label ?? String(props.name),
  disabled: props.disabled,
  closable: props.closable ?? false,
  lazy: props.lazy,
});

onMounted(() => {
  tabs.registerPane(getPaneInstance());
});

watch(
  () => [props.name, props.label, props.disabled, props.closable, props.lazy],
  () => {
    tabs.registerPane(getPaneInstance());
  }
);

onBeforeUnmount(() => {
  tabs.unregisterPane(props.name);
});
</script>
