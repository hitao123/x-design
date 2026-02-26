import type { LocaleType } from './zh-CN';

export const en: LocaleType = {
  name: 'en',
  dialog: {
    confirm: 'OK',
    cancel: 'Cancel',
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
  },
  popconfirm: {
    title: 'Are you sure?',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  },
  select: {
    placeholder: 'Please select',
    loading: 'Loading...',
    noData: 'No data',
    noMatch: 'No matching data',
  },
  table: {
    loading: 'Loading...',
    emptyText: 'No data',
    filterConfirm: 'Filter',
    filterReset: 'Reset',
    sortAscending: 'Click to sort ascending',
    sortDescending: 'Click to sort descending',
    cancelSort: 'Cancel sort',
  },
  form: {
    required: 'This field is required',
  },
  pagination: {
    total: 'Total {total}',
    pageSize: '{size} / page',
    prev: 'Previous',
    next: 'Next',
    goto: 'Go to',
    page: '',
  },
};
