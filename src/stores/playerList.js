import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { useMusicPlayerStore } from './musicPlayer'

export const usePlayerStore = defineStore('player', () => {
  const musicPlayerStore = useMusicPlayerStore()
  const playerList = ref([])
  // 创建状态
  const player = ref(false)

  // 播放模式：'sequence'(顺序播放) | 'random'(随机播放) | 'loop'(单曲循环)
  const playMode = ref('sequence')
  const playModeIcon = computed(() => {
    switch (playMode.value) {
      case 'sequence':
        return 'icon-liebiaoxunhuan'
      case 'random':
        return 'icon-suijibofang'
      case 'loop':
        return 'icon-danquxunhuan'
      default:
        return 'icon-liebiaoxunhuan'
    }
  })

  const currentSongIndex = computed(() => {
    return playerList.value.findIndex(song => song.id === musicPlayerStore.currentSong.id)
  })

  const nextSong = () => {
    // 检查播放列表是否为空
    if (playerList.value.length === 0) {
      return null
    }
    
    let nextIndex
    if (playMode.value === 'random') {
      // 随机播放模式（确保不会随机到同一首歌）
      if (playerList.value.length === 1) {
        nextIndex = currentSongIndex.value
      } else {
        do {
          nextIndex = Math.floor(Math.random() * playerList.value.length)
        } while (nextIndex === currentSongIndex.value && playerList.value.length > 1)
      }
    } else if (playMode.value === 'loop') {
      // 单曲循环模式
      nextIndex = currentSongIndex.value
    } else {
      // 顺序播放模式
      // 如果当前歌曲不在播放列表中，则从第一首开始播放
      let currentIndex = currentSongIndex.value
      if (currentIndex === -1) {
        nextIndex = 0
      } else {
        // 正常情况下切换到下一首
        nextIndex = (currentIndex + 1) % playerList.value.length
      }
    }
    
    const nextSong = createSongObject(playerList.value[nextIndex])
    const duration = playerList.value[nextIndex].duration
    musicPlayerStore.setCurrentSong(nextSong)
    musicPlayerStore.setDuration(duration)
    return nextSong
  }
  const createSongObject = (song) => {
    console.log("创建歌曲对象:", song);
    return {
      title: song.name,
      artist: song.artistName,
      url: song.musicUrl,
      cover: song.coverUrl,
      id: song.id,
      like: song.like || false
    }
  }
  const prevSong = () => {
    // 检查播放列表是否为空
    if (playerList.value.length === 0) {
      return null
    }
    
    let prevIndex
    if (playMode.value === 'random') {
      // 随机播放模式（这里也用随机方式处理上一首）
      if (playerList.value.length === 1) {
        prevIndex = currentSongIndex.value
      } else {
        do {
          prevIndex = Math.floor(Math.random() * playerList.value.length)
        } while (prevIndex === currentSongIndex.value && playerList.value.length > 1)
      }
    } else if (playMode.value === 'loop') {
      // 单曲循环模式
      prevIndex = currentSongIndex.value
    } else {
      // 顺序播放模式
      // 如果当前歌曲不在播放列表中，则从最后一首开始播放
      let currentIndex = currentSongIndex.value
      if (currentIndex === -1) {
        prevIndex = 0
      } else {
        // 正常情况下切换到上一首
        prevIndex = (currentIndex - 1 + playerList.value.length) % playerList.value.length
      }
    }
    
    const prevSong = createSongObject(playerList.value[prevIndex])
    const duration = playerList.value[prevIndex].duration
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

  // 切换播放模式
  const togglePlayMode = () => {
    const modes = ['sequence', 'random', 'loop']
    const currentIndex = modes.indexOf(playMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    playMode.value = modes[nextIndex]
  }

  // 设置播放模式
  const setPlayMode = (mode) => {
    if (['sequence', 'random', 'loop'].includes(mode)) {
      playMode.value = mode
    }
  }
  
  return { 
    player, 
    currentSongIndex, 
    createSongObject, 
    nextSong, 
    prevSong, 
    showPlayer, 
    hidePlayer, 
    togglePlayer, 
    addSong, 
    getPlayerList,
    playMode,
    playModeIcon,
    togglePlayMode,
    setPlayMode
  }
})