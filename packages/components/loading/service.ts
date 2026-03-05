import { createApp, ref, reactive, nextTick } from 'vue';
import Loading from './Loading.vue';
import type { LoadingOptions, LoadingInstance } from './types';

let fullscreenInstance: LoadingInstance | null = null;

export const loadingService = (options: LoadingOptions = {}): LoadingInstance => {
  // 全屏模式复用实例
  if (options.fullscreen && fullscreenInstance) {
    return fullscreenInstance;
  }

  let target: HTMLElement;
  if (options.target) {
    target =
      typeof options.target === 'string'
        ? (document.querySelector(options.target) as HTMLElement) || document.body
        : options.target;
  } else if (options.fullscreen) {
    target = document.body;
  } else {
    target = document.body;
  }

  const data = reactive({
    visible: true,
    text: options.text || '',
    background: options.background || '',
    fullscreen: options.fullscreen || false,
    customClass: options.customClass || '',
  });

  const container = document.createElement('div');
  const app = createApp(Loading, data);
  const vm = app.mount(container);

  // 设置 target position
  if (!options.fullscreen) {
    const position = getComputedStyle(target).position;
    if (position === 'static' || !position) {
      target.style.position = 'relative';
    }
  }

  const maskEl = container.firstElementChild as HTMLElement;
  target.appendChild(maskEl);

  // lock scroll
  if (options.lock && options.fullscreen) {
    document.body.style.overflow = 'hidden';
  }

  const instance: LoadingInstance = {
    close: () => {
      data.visible = false;
      nextTick(() => {
        maskEl.remove();
        app.unmount();
        if (options.fullscreen) {
          fullscreenInstance = null;
          if (options.lock) {
            document.body.style.overflow = '';
          }
        }
      });
    },
    setText: (text: string) => {
      data.text = text;
    },
  };

  if (options.fullscreen) {
    fullscreenInstance = instance;
  }

  return instance;
};
