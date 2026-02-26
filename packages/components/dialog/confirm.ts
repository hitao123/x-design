import { h, render, ref, nextTick } from 'vue';
import Dialog from './Dialog.vue';
import Button from '../button/Button.vue';
import type { DialogConfirmOptions, DialogMethodType } from './types';

function createDialog(options: DialogConfirmOptions, type: DialogMethodType = 'confirm'): Promise<void> {
  return new Promise((resolve, reject) => {
    const {
      title = type === 'confirm' ? '提示' : getDefaultTitle(type),
      message = '',
      confirmButtonText = '确定',
      cancelButtonText = '取消',
      confirmButtonType = type === 'confirm' ? 'primary' : getButtonType(type),
      width = '420px',
      showCancelButton = type === 'confirm',
      center = false,
    } = options;

    const container = document.createElement('div');
    document.body.appendChild(container);

    const isVisible = ref(true);
    const loading = ref(false);

    const cleanup = () => {
      setTimeout(() => {
        render(null, container);
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 300);
    };

    const handleConfirm = async () => {
      if (options.onConfirm) {
        loading.value = true;
        try {
          await options.onConfirm();
        } catch {
          loading.value = false;
          return;
        }
        loading.value = false;
      }
      isVisible.value = false;
      resolve();
      renderDialog();
      cleanup();
    };

    const handleCancel = () => {
      isVisible.value = false;
      options.onCancel?.();
      reject(new Error('cancel'));
      renderDialog();
      cleanup();
    };

    const renderDialog = () => {
      const vnode = h(
        Dialog,
        {
          modelValue: isVisible.value,
          title,
          width,
          center,
          showClose: type !== 'confirm',
          closeOnClickModal: false,
          closeOnPressEscape: type !== 'confirm',
          'onUpdate:modelValue': (val: boolean) => {
            if (!val) {
              handleCancel();
            }
          },
        },
        {
          default: () =>
            h('div', { class: `x-dialog-confirm__content x-dialog-confirm__content--${type}` }, [
              type !== 'confirm'
                ? h('span', { class: `x-dialog-confirm__icon x-dialog-confirm__icon--${type}` }, getIcon(type))
                : null,
              h('span', null, message),
            ]),
          footer: () =>
            h('div', { class: 'x-dialog-confirm__footer' }, [
              showCancelButton
                ? h(
                    Button,
                    { onClick: handleCancel },
                    { default: () => cancelButtonText },
                  )
                : null,
              h(
                Button,
                {
                  type: confirmButtonType,
                  disabled: loading.value,
                  onClick: handleConfirm,
                },
                { default: () => (loading.value ? '加载中...' : confirmButtonText) },
              ),
            ]),
        },
      );

      render(vnode, container);
    };

    nextTick(() => renderDialog());
  });
}

function getDefaultTitle(type: DialogMethodType): string {
  const titles: Record<string, string> = {
    info: '提示',
    success: '成功',
    warning: '警告',
    error: '错误',
    confirm: '提示',
  };
  return titles[type] || '提示';
}

function getButtonType(type: DialogMethodType): string {
  const types: Record<string, string> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'danger',
    confirm: 'primary',
  };
  return types[type] || 'primary';
}

function getIcon(type: DialogMethodType): string {
  const icons: Record<string, string> = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕',
  };
  return icons[type] || '';
}

export function confirm(options: DialogConfirmOptions): Promise<void> {
  return createDialog(options, 'confirm');
}

export function info(options: DialogConfirmOptions): Promise<void> {
  return createDialog(options, 'info');
}

export function success(options: DialogConfirmOptions): Promise<void> {
  return createDialog(options, 'success');
}

export function warning(options: DialogConfirmOptions): Promise<void> {
  return createDialog(options, 'warning');
}

export function error(options: DialogConfirmOptions): Promise<void> {
  return createDialog(options, 'error');
}
