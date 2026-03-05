<template>
  <IconWrapper v-bind="$props">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        d="M192.128 683.136a30.59 30.59 0 0 0 42.752 0L512 371.264l277.12 311.872a30.59 30.59 0 0 0 42.752 0 29.12 29.12 0 0 0 0-41.728L500.416 309.76a32 32 0 0 0-44.672 0L124.288 641.344a29.12 29.12 0 0 0 0 41.728z"
      />
    </svg>
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue';
import type { IconProps } from '../types';

defineOptions({
  name: 'IconArrowUp',
});

defineProps<IconProps>();
</script>
