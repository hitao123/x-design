<template>
  <div v-if="!hideOnSinglePage || totalPages > 1" :class="wrapperClasses">
    <template v-for="item in layoutItems" :key="item">
      <!-- total -->
      <span v-if="item === 'total'" class="x-pagination__total"> 共 {{ total }} 条 </span>

      <!-- sizes -->
      <span v-else-if="item === 'sizes'" class="x-pagination__sizes">
        <XSelect
          :model-value="innerPageSize"
          :options="sizeOptions"
          :size="small ? 'small' : 'medium'"
          :disabled="disabled"
          @change="handleSizeChange"
        />
      </span>

      <!-- prev -->
      <button
        v-else-if="item === 'prev'"
        class="x-pagination__btn x-pagination__prev"
        :disabled="disabled || innerCurrent <= 1"
        @click="handlePrev"
      >
        <IconArrowLeft />
      </button>

      <!-- pager -->
      <ul v-else-if="item === 'pager'" class="x-pagination__pager">
        <li
          v-for="page in pagerList"
          :key="page.value"
          :class="[
            'x-pagination__number',
            {
              'is-active': page.value === innerCurrent,
              'is-quickprev': page.type === 'quickprev',
              'is-quicknext': page.type === 'quicknext',
            },
          ]"
          @click="handlePagerClick(page)"
        >
          <template v-if="page.type === 'quickprev' || page.type === 'quicknext'"> ... </template>
          <template v-else>
            {{ page.value }}
          </template>
        </li>
      </ul>

      <!-- next -->
      <button
        v-else-if="item === 'next'"
        class="x-pagination__btn x-pagination__next"
        :disabled="disabled || innerCurrent >= totalPages"
        @click="handleNext"
      >
        <IconArrowRight />
      </button>

      <!-- jumper -->
      <span v-else-if="item === 'jumper'" class="x-pagination__jumper">
        前往
        <XInput
          :model-value="jumperValue"
          :size="small ? 'small' : 'medium'"
          :disabled="disabled"
          class="x-pagination__editor"
          @keyup.enter="handleJumperEnter"
          @change="handleJumperChange"
        />
        页
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IconArrowLeft, IconArrowRight } from '@x-design/icons';
import { XSelect } from '../select';
import { XInput } from '../input';
import type { PaginationProps } from './types';

defineOptions({
  name: 'XPagination',
});

interface PagerItem {
  type: 'page' | 'quickprev' | 'quicknext';
  value: number;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 30, 50],
  layout: 'total, prev, pager, next',
  small: false,
  pagerCount: 7,
  hideOnSinglePage: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:current': [page: number];
  'update:pageSize': [size: number];
  currentChange: [page: number];
  sizeChange: [size: number];
}>();

const innerCurrent = ref(props.current);
const innerPageSize = ref(props.pageSize);
const jumperValue = ref('');

watch(
  () => props.current,
  (val) => {
    innerCurrent.value = val;
  }
);

watch(
  () => props.pageSize,
  (val) => {
    innerPageSize.value = val;
  }
);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / innerPageSize.value)));

const layoutItems = computed(() =>
  props.layout
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);

const sizeOptions = computed(() =>
  props.pageSizes.map((size) => ({
    label: `${size} 条/页`,
    value: size,
  }))
);

const wrapperClasses = computed(() => [
  'x-pagination',
  {
    'x-pagination--small': props.small,
    'is-disabled': props.disabled,
  },
]);

const pagerList = computed((): PagerItem[] => {
  const total = totalPages.value;
  const current = innerCurrent.value;
  const count = props.pagerCount;

  if (total <= count) {
    const pages: PagerItem[] = [];
    for (let i = 1; i <= total; i++) {
      pages.push({ type: 'page', value: i });
    }
    return pages;
  }

  const halfCount = Math.floor(count / 2);
  let showQuickPrev = false;
  let showQuickNext = false;

  if (current > halfCount + 1) showQuickPrev = true;
  if (current < total - halfCount) showQuickNext = true;

  const pages: PagerItem[] = [];

  // Always show first page
  pages.push({ type: 'page', value: 1 });

  if (showQuickPrev) {
    pages.push({ type: 'quickprev', value: Math.max(1, current - (count - 2)) });
  }

  // Calculate middle pages
  let start: number, end: number;

  if (showQuickPrev && showQuickNext) {
    const offset = Math.floor((count - 4) / 2);
    start = current - offset;
    end = current + offset;
  } else if (showQuickPrev) {
    end = total - 1;
    start = total - (count - 3);
  } else {
    start = 2;
    end = count - 2;
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < total) {
      pages.push({ type: 'page', value: i });
    }
  }

  if (showQuickNext) {
    pages.push({ type: 'quicknext', value: Math.min(total, current + (count - 2)) });
  }

  // Always show last page
  if (total > 1) {
    pages.push({ type: 'page', value: total });
  }

  return pages;
});

const setCurrentPage = (page: number) => {
  const p = Math.max(1, Math.min(page, totalPages.value));
  if (p === innerCurrent.value) return;
  innerCurrent.value = p;
  emit('update:current', p);
  emit('currentChange', p);
};

const handlePrev = () => {
  if (props.disabled) return;
  setCurrentPage(innerCurrent.value - 1);
};

const handleNext = () => {
  if (props.disabled) return;
  setCurrentPage(innerCurrent.value + 1);
};

const handlePagerClick = (page: PagerItem) => {
  if (props.disabled) return;
  if (page.type === 'quickprev') {
    setCurrentPage(Math.max(1, innerCurrent.value - (props.pagerCount - 2)));
  } else if (page.type === 'quicknext') {
    setCurrentPage(Math.min(totalPages.value, innerCurrent.value + (props.pagerCount - 2)));
  } else {
    setCurrentPage(page.value);
  }
};

const handleSizeChange = (val: string | number | (string | number)[]) => {
  if (props.disabled) return;
  const newSize = Number(val);
  innerPageSize.value = newSize;
  emit('update:pageSize', newSize);
  emit('sizeChange', newSize);
  // Reset to page 1 when page size changes
  setCurrentPage(1);
};

const handleJumperEnter = () => {
  handleJumper();
};

const handleJumperChange = (val: string | number) => {
  jumperValue.value = String(val);
};

const handleJumper = () => {
  if (props.disabled) return;
  const page = parseInt(jumperValue.value, 10);
  if (!isNaN(page)) {
    setCurrentPage(page);
  }
  jumperValue.value = '';
};

// Clamp current page if it becomes out of range
watch(totalPages, (newTotal) => {
  if (innerCurrent.value > newTotal) {
    setCurrentPage(newTotal);
  }
});
</script>

<style lang="scss">
@use './style.scss';
</style>
