<template>
  <div class="x-tree-node" :class="nodeClasses">
    <div
      class="x-tree-node__content"
      :style="{ paddingLeft: `${level * indent}px` }"
      @click="handleNodeClick"
    >
      <span
        class="x-tree-node__expand-icon"
        :class="{ 'is-expanded': isExpanded, 'is-leaf': isLeaf }"
        @click.stop="handleExpand"
      >
        <IconArrowRight v-if="!isLeaf" class="x-tree-node__expand-arrow" />
      </span>
      <span v-if="showCheckbox" class="x-tree-node__checkbox" @click.stop="handleCheck">
        <span
          class="x-tree-node__checkbox-inner"
          :class="{
            'is-checked': isChecked,
            'is-indeterminate': isIndeterminate,
            'is-disabled': node.disabled,
          }"
        ></span>
      </span>
      <span class="x-tree-node__label">{{ node.label }}</span>
    </div>
    <div v-show="isExpanded" class="x-tree-node__children">
      <TreeNode
        v-for="child in node.children"
        :key="treeContext.getNodeKey(child)"
        :node="child"
        :node-key="nodeKey"
        :level="level + 1"
        :indent="indent"
        :show-checkbox="showCheckbox"
        :expand-on-click-node="expandOnClickNode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { IconArrowRight } from '@x-design/icons';
import type { TreeNodeProps, TreeContext } from './types';

defineOptions({
  name: 'XTreeNode',
});

const props = defineProps<TreeNodeProps>();

const treeContext = inject<TreeContext>('xTree')!;

const nodeKey = computed(() => treeContext.getNodeKey(props.node));
const isLeaf = computed(() => !props.node.children?.length);
const isExpanded = computed(() => treeContext.expandedKeys.has(nodeKey.value));
const isChecked = computed(() => treeContext.checkedKeys.has(nodeKey.value));
const isCurrent = computed(() => treeContext.currentNodeKey === nodeKey.value);

const isIndeterminate = computed(() => {
  if (!props.showCheckbox || treeContext.checkStrictly) return false;
  if (isChecked.value || isLeaf.value) return false;
  // 检查是否有子节点被选中
  const hasCheckedDescendant = (children: typeof props.node.children): boolean => {
    if (!children) return false;
    return children.some((child) => {
      const key = treeContext.getNodeKey(child);
      return treeContext.checkedKeys.has(key) || hasCheckedDescendant(child.children);
    });
  };
  return hasCheckedDescendant(props.node.children);
});

const nodeClasses = computed(() => ({
  'is-expanded': isExpanded.value,
  'is-current': isCurrent.value,
  'is-disabled': props.node.disabled,
}));

const handleExpand = () => {
  if (isLeaf.value) return;
  treeContext.toggleExpand(nodeKey.value);
};

const handleCheck = () => {
  if (props.node.disabled) return;
  treeContext.toggleCheck(props.node, nodeKey.value);
};

const handleNodeClick = () => {
  if (props.node.disabled) return;
  treeContext.setCurrentNode(nodeKey.value, props.node);
  if (props.expandOnClickNode && !isLeaf.value) {
    handleExpand();
  }
};
</script>
