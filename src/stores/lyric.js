// src/stores/lyric.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLyricStore = defineStore('lyric', () => {
  // 定义状态
  const lyricPage = ref(false)
  
  // 定义修改状态的方法
  const showLyricPage = () => {
    lyricPage.value = true
  }
  
  const hideLyricPage = () => {
    lyricPage.value = false
  }
  
  const toggleLyricPage = () => {
    lyricPage.value = !lyricPage.value
  }
  
  return {
    lyricPage,
    showLyricPage,
    hideLyricPage,
    toggleLyricPage
  }
})