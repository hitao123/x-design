export type TreeKey = string | number;

export interface TreeNodeData {
  label: string;
  children?: TreeNodeData[];
  disabled?: boolean;
  [key: string]: any;
}

export interface TreeProps {
  data: TreeNodeData[];
  nodeKey?: string;
  showCheckbox?: boolean;
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: TreeKey[];
  defaultCheckedKeys?: TreeKey[];
  expandOnClickNode?: boolean;
  checkStrictly?: boolean;
  emptyText?: string;
  indent?: number;
}

export interface TreeNodeProps {
  node: TreeNodeData;
  nodeKey: string;
  level: number;
  indent: number;
  showCheckbox: boolean;
  expandOnClickNode: boolean;
}

export interface TreeContext {
  expandedKeys: Set<TreeKey>;
  checkedKeys: Set<TreeKey>;
  currentNodeKey: TreeKey | null;
  checkStrictly: boolean;
  toggleExpand: (key: TreeKey) => void;
  toggleCheck: (node: TreeNodeData, key: TreeKey) => void;
  setCurrentNode: (key: TreeKey, node: TreeNodeData) => void;
  getNodeKey: (node: TreeNodeData) => TreeKey;
  allNodeMap: Map<TreeKey, TreeNodeData>;
}
