<template>
  <div class="x-table-filter" ref="filterRef">
    <span class="x-table-filter__trigger" @click.stop="toggleVisible">
      <i class="x-table-filter__icon" :class="{ 'is-active': hasActiveFilter }">▼</i>
    </span>
    <Teleport to="body">
      <Transition name="x-table-filter-fade">
        <div v-if="visible" class="x-table-filter__panel" :style="panelStyle" @click.stop>
          <ul class="x-table-filter__list">
            <li
              v-for="filter in filters"
              :key="filter.value"
              class="x-table-filter__item"
              :class="{ 'is-active': isSelected(filter.value) }"
              @click="handleSelect(filter.value)"
            >
              <input
                v-if="filterMultiple"
                type="checkbox"
                :checked="isSelected(filter.value)"
              />
              {{ filter.text }}
            </li>
          </ul>
          <div class="x-table-filter__footer">
            <button class="x-table-filter__btn" @click="handleReset">重置</button>
            <button class="x-table-filter__btn x-table-filter__btn--primary" @click="handleConfirm">筛选</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    filters: Array<{ text: string; value: any }>;
    filterMultiple?: boolean;
    activeValues?: any[];
  }>(),
  {
    filterMultiple: true,
    activeValues: () => [],
  },
);

const emit = defineEmits<{
  filter: [values: any[]];
}>();

const visible = ref(false);
const filterRef = ref<HTMLElement>();
const selectedValues = ref<any[]>([...props.activeValues]);

const panelStyle = computed(() => {
  if (!filterRef.value) return {};
  const rect = filterRef.value.getBoundingClientRect();
  return {
    position: 'fixed' as const,
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    zIndex: 2100,
  };
});

const hasActiveFilter = computed(() => props.activeValues.length > 0);

const isSelected = (value: any) => selectedValues.value.includes(value);

const toggleVisible = () => {
  visible.value = !visible.value;
  if (visible.value) {
    selectedValues.value = [...props.activeValues];
  }
};

const handleSelect = (value: any) => {
  if (props.filterMultiple) {
    const index = selectedValues.value.indexOf(value);
    if (index > -1) {
      selectedValues.value.splice(index, 1);
    } else {
      selectedValues.value.push(value);
    }
  } else {
    selectedValues.value = [value];
  }
};

const handleConfirm = () => {
  emit('filter', [...selectedValues.value]);
  visible.value = false;
};

const handleReset = () => {
  selectedValues.value = [];
  emit('filter', []);
  visible.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (visible.value && filterRef.value && !filterRef.value.contains(event.target as Node)) {
    visible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
