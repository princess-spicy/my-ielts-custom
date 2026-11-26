<script setup lang="ts">
defineProps<{ saved: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    aria-label="收藏单词"
    :aria-pressed="saved"
    :title="saved ? '从当前单词簿移除' : '加入当前单词簿'"
    class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-lg dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-gray-700"
    :class="saved ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'"
    @click="$emit('toggle')"
  >
    <i aria-hidden="true" :class="saved ? 'i-ph-star-fill' : 'i-ph-star-bold'" />
  </button>
</template>
