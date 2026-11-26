<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useWordBooks } from '~/pages/vocabulary/wordBooks'

const { books, bookId, reviewingBook, createBook } = useWordBooks()
const creating = ref(false)
const name = ref('')
const error = ref('')
const nameInput = ref<HTMLInputElement>()
const createButton = ref<HTMLButtonElement>()

async function startCreating() {
  creating.value = true
  await nextTick()
  nameInput.value?.focus()
}

async function closeForm() {
  creating.value = false
  name.value = ''
  error.value = ''
  await nextTick()
  createButton.value?.focus()
}

function submitBook() {
  error.value = createBook(name.value)
  if (!error.value)
    closeForm()
}
</script>

<template>
  <div class="mt-4 border border-gray-200 rounded-lg bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <label for="vocabulary-word-book" class="font-medium text-gray-900 dark:text-white">单词簿</label>
      <select
        id="vocabulary-word-book"
        v-model="bookId"
        class="max-w-full border border-gray-300 rounded-md bg-white px-3 py-2 dark:border-gray-500 dark:bg-gray-800 dark:text-white"
      >
        <option v-for="book in books" :key="book.id" :value="book.id">
          {{ book.name }}（{{ Object.values(book.chapters).reduce((total, ids) => total + ids.length, 0) }}）
        </option>
      </select>
      <button
        ref="createButton"
        type="button"
        :aria-expanded="creating"
        class="whitespace-nowrap rounded-md px-3 py-2 font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-600"
        @click="startCreating"
      >
        + 新建单词簿
      </button>
      <div class="inline-flex rounded-md border border-gray-300 p-0.5 dark:border-gray-500" role="group" aria-label="词汇范围">
        <button
          type="button"
          :aria-pressed="!reviewingBook"
          class="whitespace-nowrap rounded px-3 py-1.5 font-medium"
          :class="reviewingBook ? 'text-gray-700 dark:text-gray-200' : 'bg-blue-700 text-white'"
          @click="reviewingBook = false"
        >
          全部词汇
        </button>
        <button
          type="button"
          :aria-pressed="reviewingBook"
          class="whitespace-nowrap rounded px-3 py-1.5 font-medium"
          :class="reviewingBook ? 'bg-blue-700 text-white' : 'text-gray-700 dark:text-gray-200'"
          @click="reviewingBook = true"
        >
          只看本簿
        </button>
      </div>
    </div>
    <form v-if="creating" class="mt-3 flex flex-wrap items-center gap-2 text-sm" @submit.prevent="submitBook" @keydown.esc="closeForm">
      <input
        ref="nameInput"
        v-model="name"
        aria-label="单词簿名称"
        maxlength="40"
        placeholder="例如：考前冲刺"
        class="min-w-0 border border-gray-300 rounded-md bg-white px-3 py-2 dark:border-gray-500 dark:bg-gray-800 dark:text-white"
        @input="error = ''"
      >
      <button type="submit" class="rounded-md bg-blue-700 px-3 py-2 font-medium text-white hover:bg-blue-800">
        创建
      </button>
      <button type="button" class="rounded-md px-3 py-2 text-gray-700 dark:text-gray-200" @click="closeForm">
        取消
      </button>
      <p v-if="error" role="alert" class="w-full text-red-700 dark:text-red-300">
        {{ error }}
      </p>
    </form>
  </div>
</template>
