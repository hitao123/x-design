export interface LoadingOptions {
  target?: HTMLElement | string;
  fullscreen?: boolean;
  text?: string;
  background?: string;
  customClass?: string;
  lock?: boolean;
}

export interface LoadingInstance {
  close: () => void;
  setText: (text: string) => void;
}
