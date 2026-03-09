export type TagType = 'default' | 'success' | 'info' | 'warning' | 'danger';
export type TagEffect = 'dark' | 'light' | 'plain';
export type TagSize = 'small' | 'medium' | 'large';

export interface TagProps {
  type?: TagType;
  closable?: boolean;
  size?: TagSize;
  effect?: TagEffect;
  round?: boolean;
  color?: string;
}
