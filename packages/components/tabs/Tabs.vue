<template>
  <div :class="classes">
    <div class="x-tabs__header">
      <div class="x-tabs__nav-wrap">
        <div ref="navRef" class="x-tabs__nav">
          <div
            v-for="pane in panes"
            :key="pane.name"
            :ref="(el) => setItemRef(pane.name, el as HTMLElement | null)"
            :class="[
              'x-tabs__item',
              {
                'is-active': pane.name === activeTab,
                'is-disabled': pane.disabled,
                'is-closable': isClosable(pane),
              },
            ]"
            @click="handleTabClick(pane, $event)"
          >
            <span>{{ pane.label }}</span>
            <IconClose
              v-if="isClosable(pane)"
              class="x-tabs__close"
              @click.stop="handleTabRemove(pane.name)"
            />
          </div>
          <div v-if="addable" class="x-tabs__new-tab" @click="handleTabAdd">
            <span>+</span>
          </div>
          <div v-if="type === 'line'" class="x-tabs__active-bar" :style="barStyle"></div>
        </div>
      </div>
    </div>
    <div class="x-tabs__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from 'vue';
import { IconClose } from '@x-design/icons';
import type { TabsProps, TabsContext, TabPaneInstance } from './types';

defineOptions({
  name: 'XTabs',
});

const props = withDefaults(defineProps<TabsProps>(), {
  type: 'line',
  closable: false,
  addable: false,
  tabPosition: 'top',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'tab-click': [pane: TabPaneInstance, event: MouseEvent];
  'tab-remove': [name: string | number];
  'tab-add': [];
}>();

const activeTab = computed(() => props.modelValue);

const panes = reactive<TabPaneInstance[]>([]);

const navRef = ref<HTMLElement>();
const itemRefs = new Map<string | number, HTMLElement>();

const barStyle = ref<Record<string, string>>({});

const setItemRef = (name: string | number, el: HTMLElement | null) => {
  if (el) {
    itemRefs.set(name, el);
  } else {
    itemRefs.delete(name);
  }
};

const updateBar = () => {
  if (props.type !== 'line') return;
  nextTick(() => {
    const activeName = activeTab.value;
    if (activeName == null) {
      barStyle.value = { width: '0px' };
      return;
    }
    const el = itemRefs.get(activeName);
    if (!el || !navRef.value) {
      barStyle.value = { width: '0px' };
      return;
    }
    const navRect = navRef.value.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    barStyle.value = {
      width: `${elRect.width}px`,
      transform: `translateX(${elRect.left - navRect.left}px)`,
    };
  });
};

watch(() => props.modelValue, updateBar);
watch(() => panes.length, updateBar);
onMounted(updateBar);

const isClosable = (pane: TabPaneInstance) => {
  if (pane.closable !== undefined && pane.closable !== null) {
    return pane.closable;
  }
  return props.closable;
};

const handleTabClick = (pane: TabPaneInstance, event: MouseEvent) => {
  if (pane.disabled) return;
  emit('update:modelValue', pane.name);
  emit('tab-click', pane, event);
};

const handleTabRemove = (name: string | number) => {
  emit('tab-remove', name);
};

const handleTabAdd = () => {
  emit('tab-add');
};

const registerPane = (pane: TabPaneInstance) => {
  const index = panes.findIndex((p) => p.name === pane.name);
  if (index > -1) {
    panes[index] = pane;
  } else {
    panes.push(pane);
  }
};

const unregisterPane = (name: string | number) => {
  const index = panes.findIndex((p) => p.name === name);
  if (index > -1) {
    panes.splice(index, 1);
  }
};

provide<TabsContext>('xTabs', {
  activeTab,
  registerPane,
  unregisterPane,
});

const classes = computed(() => ['x-tabs', `x-tabs--${props.type}`, `x-tabs--${props.tabPosition}`]);
</script>

<style lang="scss">
@use './style.scss';
</style>
