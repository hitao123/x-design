export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $dialog: import('./types').DialogMethods;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialog: import('./types').DialogMethods;
  }
}
