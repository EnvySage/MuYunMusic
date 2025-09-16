import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // 创建状态
  const player = ref(false)
  
  // 创建修改状态的方法
  const showPlayer = () => {
    player.value = true
  }
  
  const hidePlayer = () => {
    player.value = false
  }
  
  const togglePlayer = () => {
    player.value = !player.value
  }
  return { player, showPlayer, hidePlayer, togglePlayer }
})