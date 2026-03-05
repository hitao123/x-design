<template>
  <IconWrapper v-bind="$props">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        d="M512 256c-217.6 0-403.2 134.4-480 320 76.8 185.6 262.4 320 480 320s403.2-134.4 480-320c-76.8-185.6-262.4-320-480-320m0 533.333c-117.76 0-213.333-95.573-213.333-213.333S394.24 362.667 512 362.667 725.333 458.24 725.333 576 629.76 789.333 512 789.333M512 448c-70.613 0-128 57.387-128 128s57.387 128 128 128 128-57.387 128-128-57.387-128-128-128"
      />
    </svg>
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue';
import type { IconProps } from '../types';

defineOptions({
  name: 'IconEye',
});

defineProps<IconProps>();
</script>
