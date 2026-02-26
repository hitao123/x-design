<template>
  <slot />
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import type { ConfigProviderProps } from './types';
import { CONFIG_PROVIDER_KEY } from './types';

defineOptions({
  name: 'XConfigProvider',
});

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  size: 'medium',
  zIndex: 2000,
  namespace: 'x',
});

const config = computed<ConfigProviderProps>(() => ({
  size: props.size,
  zIndex: props.zIndex,
  locale: props.locale,
  namespace: props.namespace,
}));

provide(CONFIG_PROVIDER_KEY, config);
</script>
