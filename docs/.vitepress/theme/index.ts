import DefaultTheme from 'vitepress/theme';
import '@x-design/theme/index.scss';
import './custom.css';
import type { Theme } from 'vitepress';

export default {
  extends: DefaultTheme,
} satisfies Theme;
