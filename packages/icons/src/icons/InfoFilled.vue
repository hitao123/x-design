<template>
  <IconWrapper v-bind="$props">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64m32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8zm-32-344a48 48 0 1 1 0-96 48 48 0 0 1 0 96"
      />
    </svg>
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from '../components/IconWrapper.vue';
import type { IconProps } from '../types';

defineOptions({
  name: 'IconInfoFilled',
});

defineProps<IconProps>();
</script>
