import Tree from './Tree.vue';
import { withInstall } from '@x-design/utils';

export const XTree = withInstall(Tree);
export default XTree;

export type { TreeProps, TreeNodeData, TreeKey } from './types';
