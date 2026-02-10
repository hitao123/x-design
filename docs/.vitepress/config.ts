import { defineConfig } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const resolve = (...args: string[]) => path.resolve(projectRoot, ...args);

export default defineConfig({
  title: 'X Design',
  description: 'Enterprise-level Vue 3 Component Library for PC',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/button' },
      { text: '资源', link: '/resources/design' },
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '主题定制', link: '/guide/theme' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Form 表单', link: '/components/form' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
          ],
        },
        {
          text: '反馈',
          items: [
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
          ],
        },
      ],
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/x-design' },
    ],
    
    search: {
      provider: 'local',
    },
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present X Design Team',
    },
  },
  
  vite: {
    resolve: {
      alias: {
        '@x-design/utils': resolve('packages', 'utils', 'index.ts'),
        '@x-design/components': resolve('packages', 'components', 'index.ts'),
        '@x-design/icons': resolve('packages', 'icons', 'index.ts'),
        '@x-design/theme/index.scss': resolve('packages', 'theme', 'index.scss'),
        '@x-design/theme': resolve('packages', 'theme'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
