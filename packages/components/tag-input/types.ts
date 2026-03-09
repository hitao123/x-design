import type { TagType, TagEffect } from '../tag/types';

export interface TagInputProps {
  modelValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  maxTags?: number;
  closable?: boolean;
  tagType?: TagType;
  tagEffect?: TagEffect;
  allowDuplicates?: boolean;
}
