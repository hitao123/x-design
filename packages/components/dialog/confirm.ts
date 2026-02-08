import { createApp, h } from 'vue';
import Dialog from './Dialog.vue';
import Button from '../button/Button.vue';
import type { DialogConfirmOptions } from './types';

export function confirm(options: DialogConfirmOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const {
      title = '提示',
      message = '',
      confirmButtonText = '确定',
      cancelButtonText = '取消',
      confirmButtonType = 'primary',
      width = '420px',
      showCancelButton = true,
      center = false,
    } = options;

    const container = document.createElement('div');
    document.body.appendChild(container);

    let visible = true;

    const handleConfirm = () => {
      visible = false;
      resolve();
      cleanup();
    };

    const handleCancel = () => {
      visible = false;
      reject(new Error('cancel'));
      cleanup();
    };

    const cleanup = () => {
      setTimeout(() => {
        app.unmount();
        document.body.removeChild(container);
      }, 300);
    };

    const app = createApp({
      setup() {
        return () =>
          h(
            Dialog,
            {
              modelValue: visible,
              title,
              width,
              center,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              'onUpdate:modelValue': (val: boolean) => {
                if (!val) {
                  handleCancel();
                }
              },
            },
            {
              default: () => h('div', { class: 'x-dialog-confirm__content' }, message),
              footer: () =>
                h('div', { class: 'x-dialog-confirm__footer' }, [
                  showCancelButton &&
                    h(
                      Button,
                      {
                        onClick: handleCancel,
                      },
                      { default: () => cancelButtonText }
                    ),
                  h(
                    Button,
                    {
                      type: confirmButtonType,
                      onClick: handleConfirm,
                    },
                    { default: () => confirmButtonText }
                  ),
                ]),
            }
          );
      },
    });

    app.mount(container);
  });
}
