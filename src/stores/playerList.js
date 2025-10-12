import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { useMusicPlayerStore } from './musicPlayer'

export const usePlayerStore = defineStore('player', () => {
  const musicPlayerStore = useMusicPlayerStore()
  const playerList = ref([])
  // 创建状态
  const player = ref(false)

  const currentSongIndex = computed(() => {
    return playerList.value.findIndex(song => song.id === musicPlayerStore.currentSong.id)
  })

  const nextSong = () => {
    // 检查播放列表是否为空
    if (playerList.value.length === 0) {
      return null
    }
    
    // 如果当前歌曲不在播放列表中，则从第一首开始播放
    let currentIndex = currentSongIndex.value
    if (currentIndex === -1) {
      currentIndex = 0
    } else {
      // 正常情况下切换到下一首
      currentIndex = (currentIndex + 1) % playerList.value.length
    }
    
    const nextSong = createSongObject(playerList.value[currentIndex])
    const duration = playerList.value[currentIndex].duration
    musicPlayerStore.setCurrentSong(nextSong)
    musicPlayerStore.setDuration(duration)
    return nextSong
  }
  const createSongObject = (song) => {
    return {
      title: song.name,
      artist: song.artistName,
      url: song.musicUrl,
      cover: song.coverUrl,
      id: song.id
    }
  }
  const prevSong = () => {
    // 检查播放列表是否为空
    if (playerList.value.length === 0) {
      return null
    }
    
    // 如果当前歌曲不在播放列表中，则从最后一首开始播放
    let currentIndex = currentSongIndex.value
    if (currentIndex === -1) {
      currentIndex = 0
    } else {
      // 正常情况下切换到上一首
      currentIndex = (currentIndex - 1 + playerList.value.length) % playerList.value.length
    }
    
    const prevSong = createSongObject(playerList.value[currentIndex])
    const duration = playerList.value[currentIndex].duration
    musicPlayerStore.setCurrentSong(prevSong)
    musicPlayerStore.setDuration(duration)
    return prevSong
  }
  const addSong = (song) => {
    playerList.value=song
    console.log(playerList.value)
  }
  const getPlayerList = () => {
    return playerList.value
  }
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
  return { player,currentSongIndex,createSongObject,nextSong,prevSong, showPlayer, hidePlayer, togglePlayer,addSong,getPlayerList }
})