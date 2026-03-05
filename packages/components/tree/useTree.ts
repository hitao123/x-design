import { ref, reactive, watch } from 'vue';
import type { TreeNodeData, TreeKey, TreeProps } from './types';

export function useTree(props: TreeProps) {
  const expandedKeys = reactive(new Set<TreeKey>());
  const checkedKeys = reactive(new Set<TreeKey>());
  const currentNodeKey = ref<TreeKey | null>(null);
  const allNodeMap = reactive(new Map<TreeKey, TreeNodeData>());

  const getNodeKey = (node: TreeNodeData): TreeKey => {
    if (props.nodeKey && node[props.nodeKey] !== undefined) {
      return node[props.nodeKey];
    }
    return node.label;
  };

  // 构建节点映射
  const buildNodeMap = (nodes: TreeNodeData[]) => {
    allNodeMap.clear();
    const walk = (list: TreeNodeData[]) => {
      for (const node of list) {
        const key = getNodeKey(node);
        allNodeMap.set(key, node);
        if (node.children?.length) {
          walk(node.children);
        }
      }
    };
    walk(nodes);
  };

  // 初始化展开和选中状态
  const initState = () => {
    buildNodeMap(props.data);

    expandedKeys.clear();
    if (props.defaultExpandAll) {
      allNodeMap.forEach((_, key) => expandedKeys.add(key));
    } else if (props.defaultExpandedKeys) {
      props.defaultExpandedKeys.forEach((key) => expandedKeys.add(key));
    }

    checkedKeys.clear();
    if (props.defaultCheckedKeys) {
      props.defaultCheckedKeys.forEach((key) => {
        checkedKeys.add(key);
        if (!props.checkStrictly) {
          // 选中子节点
          const node = allNodeMap.get(key);
          if (node) checkChildren(node, true);
        }
      });
      if (!props.checkStrictly) {
        updateParentCheckState(props.data);
      }
    }
  };

  const toggleExpand = (key: TreeKey) => {
    if (expandedKeys.has(key)) {
      expandedKeys.delete(key);
    } else {
      expandedKeys.add(key);
    }
  };

  const checkChildren = (node: TreeNodeData, checked: boolean) => {
    if (node.children) {
      for (const child of node.children) {
        const childKey = getNodeKey(child);
        if (child.disabled) continue;
        if (checked) {
          checkedKeys.add(childKey);
        } else {
          checkedKeys.delete(childKey);
        }
        checkChildren(child, checked);
      }
    }
  };

  const updateParentCheckState = (nodes: TreeNodeData[]): boolean => {
    // 返回是否全部选中
    let allChecked = true;
    for (const node of nodes) {
      const key = getNodeKey(node);
      if (node.children?.length) {
        const childrenAllChecked = updateParentCheckState(node.children);
        if (childrenAllChecked && !node.disabled) {
          checkedKeys.add(key);
        } else {
          checkedKeys.delete(key);
          allChecked = false;
        }
      } else {
        if (!checkedKeys.has(key)) {
          allChecked = false;
        }
      }
    }
    return allChecked;
  };

  const toggleCheck = (node: TreeNodeData, key: TreeKey) => {
    if (node.disabled) return;
    const checked = !checkedKeys.has(key);
    if (checked) {
      checkedKeys.add(key);
    } else {
      checkedKeys.delete(key);
    }
    if (!props.checkStrictly) {
      checkChildren(node, checked);
      updateParentCheckState(props.data);
    }
  };

  const setCurrentNode = (key: TreeKey) => {
    currentNodeKey.value = key;
  };

  const getCheckedKeys = (): TreeKey[] => {
    return Array.from(checkedKeys);
  };

  const getCheckedNodes = (): TreeNodeData[] => {
    const result: TreeNodeData[] = [];
    checkedKeys.forEach((key) => {
      const node = allNodeMap.get(key);
      if (node) result.push(node);
    });
    return result;
  };

  const setCheckedKeys = (keys: TreeKey[]) => {
    checkedKeys.clear();
    keys.forEach((key) => checkedKeys.add(key));
    if (!props.checkStrictly) {
      updateParentCheckState(props.data);
    }
  };

  const isIndeterminate = (node: TreeNodeData): boolean => {
    if (!node.children?.length || props.checkStrictly) return false;
    const key = getNodeKey(node);
    const isChecked = checkedKeys.has(key);
    if (isChecked) return false;
    // check if any descendant is checked
    const hasCheckedChild = (n: TreeNodeData): boolean => {
      if (!n.children) return false;
      return n.children.some((child) => {
        const childKey = getNodeKey(child);
        return checkedKeys.has(childKey) || hasCheckedChild(child);
      });
    };
    return hasCheckedChild(node);
  };

  // watch data changes
  watch(() => props.data, initState, { immediate: true, deep: true });

  return {
    expandedKeys,
    checkedKeys,
    currentNodeKey,
    allNodeMap,
    getNodeKey,
    toggleExpand,
    toggleCheck,
    setCurrentNode,
    getCheckedKeys,
    getCheckedNodes,
    setCheckedKeys,
    isIndeterminate,
  };
}
