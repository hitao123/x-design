import Tag from './Tag.vue';
import { withInstall } from '@x-design/utils';

export const XTag = withInstall(Tag);
export default XTag;

export type { TagProps, TagType, TagEffect, TagSize } from './types';
