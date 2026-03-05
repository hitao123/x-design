import DefaultTheme from 'vitepress/theme';
import '@x-design/theme/index.scss';
import './custom.css';
import type { Theme } from 'vitepress';
import { vLoading } from '@x-design/components';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.directive('loading', vLoading);
  },
} satisfies Theme;
