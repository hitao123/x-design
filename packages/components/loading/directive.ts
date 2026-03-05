import { createApp, reactive, ref } from 'vue';
import type { Directive, DirectiveBinding } from 'vue';
import Loading from './Loading.vue';

const INSTANCE_KEY = Symbol('loading');

interface LoadingEl extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: any;
    app: any;
    container: HTMLElement;
    visible: ReturnType<typeof ref<boolean>>;
    originalPosition: string;
  };
}

const createLoadingInstance = (el: LoadingEl, binding: DirectiveBinding) => {
  const textExpr = el.getAttribute('x-loading-text');
  const backgroundExpr = el.getAttribute('x-loading-background');

  const visible = ref(!!binding.value);
  const data = reactive({
    visible: visible.value,
    text: textExpr || '',
    background: backgroundExpr || '',
    fullscreen: binding.modifiers.fullscreen || false,
  });

  const container = document.createElement('div');
  const app = createApp(Loading, data);
  const instance = app.mount(container);

  el[INSTANCE_KEY] = {
    instance,
    app,
    container,
    visible,
    originalPosition: getComputedStyle(el).position,
  };

  if (binding.modifiers.fullscreen) {
    document.body.appendChild(container.firstElementChild!);
  } else {
    el.appendChild(container.firstElementChild!);
  }
};

const updateLoading = (el: LoadingEl, binding: DirectiveBinding) => {
  const data = el[INSTANCE_KEY];
  if (!data) return;

  if (binding.value) {
    // show
    if (!data.container.parentNode) {
      if (binding.modifiers.fullscreen) {
        document.body.appendChild(data.container.firstElementChild || data.container);
      } else {
        el.appendChild(data.container.firstElementChild || data.container);
      }
    }
    // 确保 target 有 position
    if (!binding.modifiers.fullscreen) {
      const position = getComputedStyle(el).position;
      if (position === 'static' || !position) {
        el.style.position = 'relative';
      }
    }
    const mask = binding.modifiers.fullscreen
      ? document.body.querySelector('.x-loading-mask')
      : el.querySelector('.x-loading-mask');
    if (mask) {
      (mask as HTMLElement).style.display = '';
    }
  } else {
    // hide
    const mask = binding.modifiers.fullscreen
      ? document.body.querySelector('.x-loading-mask')
      : el.querySelector('.x-loading-mask');
    if (mask) {
      (mask as HTMLElement).style.display = 'none';
    }
  }
};

export const vLoading: Directive<LoadingEl> = {
  mounted(el, binding) {
    if (!binding.modifiers.fullscreen) {
      const position = getComputedStyle(el).position;
      if (position === 'static' || !position) {
        el.style.position = 'relative';
      }
    }
    createLoadingInstance(el, binding);
    if (!binding.value) {
      const mask = el.querySelector('.x-loading-mask') as HTMLElement;
      if (mask) mask.style.display = 'none';
    }
  },

  updated(el, binding) {
    if (binding.oldValue !== binding.value) {
      updateLoading(el, binding);
    }
  },

  unmounted(el) {
    const data = el[INSTANCE_KEY];
    if (data) {
      data.app.unmount();
      delete el[INSTANCE_KEY];
    }
  },
};
