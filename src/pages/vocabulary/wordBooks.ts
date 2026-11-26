import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import vocabulary from './vocabulary'

interface WordBook {
  id: string
  name: string
  chapters: Record<string, number[]>
}

const defaultBook: WordBook = { id: 'default', name: '生词本', chapters: {} }
const books = useLocalStorage<WordBook[]>('ielts_word_books_v1', [defaultBook], { flush: 'sync' })
const bookId = useLocalStorage('ielts_active_word_book', defaultBook.id)
const reviewingBook = useLocalStorage('ielts_review_word_book', false)
const reviewChapter = useLocalStorage('ielts_word_book_chapter', '')

const activeBook = computed(() => books.value.find(book => book.id === bookId.value) ?? defaultBook)
const chapterNames = Object.keys(vocabulary)
const allChapters = Object.entries(vocabulary).map(([name, chapter]) => ({ name, count: chapter.wordCount }))
const reviewChapters = computed(() => allChapters.flatMap(({ name }) => {
  const count = activeBook.value.chapters[name]?.length ?? 0
  return count > 0 ? [{ name, count }] : []
}))

if (!books.value.length)
  books.value = [defaultBook]
if (!books.value.some(book => book.id === bookId.value))
  bookId.value = books.value[0].id

function createBook(name: string) {
  name = name.trim()
  if (!name)
    return '请输入单词簿名称。'
  if (books.value.some(book => book.name.toLowerCase() === name.toLowerCase()))
    return '这个单词簿名已存在。'

  const id = Array.from(crypto.getRandomValues(new Uint32Array(2)), part => part.toString(36)).join('-')
  books.value = [...books.value, { id, name, chapters: {} }]
  bookId.value = id
  return ''
}

function toggleWord(chapter: string, wordId: number) {
  const book = activeBook.value
  const words = book.chapters[chapter] ?? []
  const nextWords = words.includes(wordId) ? words.filter(id => id !== wordId) : [...words, wordId]
  const chapters = { ...book.chapters }
  if (nextWords.length)
    chapters[chapter] = nextWords
  else
    delete chapters[chapter]

  books.value = books.value.map(item => item.id === book.id ? { ...item, chapters } : item)
}

export function useWordBooks() {
  return { books, bookId, activeBook, reviewingBook, createBook, toggleWord }
}

export function useVocabularyChapter(storageKey: string) {
  const fullChapter = useLocalStorage(storageKey, chapterNames[0])
  const chapterOptions = computed(() => reviewingBook.value ? reviewChapters.value : allChapters)
  const chapter = computed({
    get: () => {
      const preferred = reviewingBook.value ? reviewChapter.value || fullChapter.value : fullChapter.value
      return chapterOptions.value.some(option => option.name === preferred)
        ? preferred
        : chapterOptions.value[0]?.name ?? ''
    },
    set: (name: string) => {
      if (reviewingBook.value)
        reviewChapter.value = name
      else
        fullChapter.value = name
    },
  })
  const savedWordIds = computed(() => new Set(activeBook.value.chapters[chapter.value] ?? []))

  return { chapter, chapterOptions, savedWordIds }
}
