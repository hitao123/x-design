<template>
  <IconWrapper v-bind="$props">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        d="M831.872 340.864a30.59 30.59 0 0 0-42.752 0L512 652.736 234.752 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.728L510.336 714.24a32 32 0 0 0 44.672 0l331.648-331.648a29.12 29.12 0 0 0 0-41.728z"
      />
    </svg>
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue';
import type { IconProps } from '../types';

defineOptions({
  name: 'IconArrowDown',
});

defineProps<IconProps>();
</script>
