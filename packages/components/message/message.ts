import { createVNode, render, shallowReactive } from 'vue';
import MessageComponent from './Message.vue';
import type { MessageOptions, MessageInstance, MessageApi, MessageType, MessageProps } from './types';

const instances = shallowReactive<MessageInstance[]>([]);
let seed = 1;

const GAP = 16;

const getLastOffset = (): number => {
  if (instances.length === 0) return 0;
  const lastInstance = instances[instances.length - 1];
  const el = lastInstance.vm.el as HTMLElement;
  if (!el) return 0;
  return el.offsetTop + el.offsetHeight;
};

const message: MessageFn & Partial<MessageApi> = (options: MessageOptions): MessageInstance => {
  const normalizedOptions: MessageProps =
    typeof options === 'string' ? { message: options } : { ...options };

  const id = `x-message-${seed++}`;
  const userOnClose = normalizedOptions.onClose;

  const lastOffset = getLastOffset();
  const offset = (normalizedOptions.offset || GAP) + lastOffset;

  const container = document.createElement('div');

  const onDestroy = () => {
    render(null, container);
  };

  const props: MessageProps = {
    ...normalizedOptions,
    id,
    offset,
    onClose: () => {
      closeMessage(id, userOnClose);
    },
    onDestroy,
  };

  const vnode = createVNode(MessageComponent, props);
  render(vnode, container);

  document.body.appendChild(container.firstElementChild!);

  const instance: MessageInstance = {
    id,
    close: () => {
      (vnode.component!.exposed as any).close();
    },
    vm: vnode,
  };

  instances.push(instance);

  return instance;
};

const closeMessage = (id: string, userOnClose?: () => void) => {
  const idx = instances.findIndex((inst) => inst.id === id);
  if (idx === -1) return;

  const removedInstance = instances[idx];
  const removedEl = removedInstance.vm.el as HTMLElement;
  const removedHeight = removedEl ? removedEl.offsetHeight : 0;

  instances.splice(idx, 1);

  userOnClose?.();

  // 更新后续 message 的 offset
  for (let i = idx; i < instances.length; i++) {
    const el = instances[i].vm.el as HTMLElement;
    if (el) {
      const newTop = parseInt(el.style.top, 10) - removedHeight - GAP;
      el.style.top = `${Math.max(newTop, GAP)}px`;
    }
  }
};

(['success', 'warning', 'info', 'error'] as const).forEach((type) => {
  (message as any)[type] = (options: MessageOptions) => {
    const normalizedOptions: MessageProps =
      typeof options === 'string' ? { message: options, type } : { ...options, type };
    return message(normalizedOptions);
  };
});

(message as MessageApi).closeAll = () => {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

type MessageFn = (options: MessageOptions) => MessageInstance;

export const XMessage = message as MessageApi;
export default XMessage;
