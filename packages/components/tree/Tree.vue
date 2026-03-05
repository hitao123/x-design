<template>
  <div :class="classes" role="tree">
    <template v-if="data && data.length">
      <TreeNode
        v-for="node in data"
        :key="getNodeKey(node)"
        :node="node"
        :node-key="nodeKey || 'label'"
        :level="0"
        :indent="indent"
        :show-checkbox="showCheckbox"
        :expand-on-click-node="expandOnClickNode"
      />
    </template>
    <div v-else class="x-tree__empty">
      <span class="x-tree__empty-text">{{ emptyText || '暂无数据' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import TreeNode from './TreeNode.vue';
import { useTree } from './useTree';
import type { TreeProps, TreeContext, TreeNodeData, TreeKey } from './types';

defineOptions({
  name: 'XTree',
});

const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
  nodeKey: 'label',
  showCheckbox: false,
  defaultExpandAll: false,
  expandOnClickNode: true,
  checkStrictly: false,
  indent: 18,
});

const emit = defineEmits<{
  'node-click': [data: TreeNodeData, key: TreeKey];
  'check-change': [data: TreeNodeData, checked: boolean, key: TreeKey];
  'current-change': [data: TreeNodeData, key: TreeKey];
}>();

const {
  expandedKeys,
  checkedKeys,
  currentNodeKey,
  allNodeMap,
  getNodeKey,
  toggleExpand,
  toggleCheck: originalToggleCheck,
  setCurrentNode: originalSetCurrentNode,
  getCheckedKeys,
  getCheckedNodes,
  setCheckedKeys,
  isIndeterminate,
} = useTree(props);

const classes = computed(() => ['x-tree']);

const toggleCheck = (node: TreeNodeData, key: TreeKey) => {
  originalToggleCheck(node, key);
  emit('check-change', node, checkedKeys.has(key), key);
};

const setCurrentNode = (key: TreeKey, node: TreeNodeData) => {
  originalSetCurrentNode(key);
  emit('current-change', node, key);
  emit('node-click', node, key);
};

provide<TreeContext>('xTree', {
  expandedKeys,
  checkedKeys,
  currentNodeKey: currentNodeKey as any,
  checkStrictly: props.checkStrictly,
  toggleExpand,
  toggleCheck,
  setCurrentNode,
  getNodeKey,
  allNodeMap,
});

defineExpose({
  getCheckedKeys,
  getCheckedNodes,
  setCheckedKeys,
});
</script>

<style lang="scss">
@use './style.scss';
</style>
