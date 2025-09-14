import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
  // 播放状态
  const isPlaying = ref(false)
  
  // 当前播放时间
  const currentTime = ref(0)
  
  // 歌曲总时长
  const duration = ref(0)
  
  // 音量
  const volume = ref(0.8)
  
  // 音频元素引用
  const audioElement = ref(null)
  
  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioElement.value) return
    
    if (isPlaying.value) {
      audioElement.value.pause()
    } else {
      audioElement.value.play()
    }
  }
  
  // 设置音频元素
  const setAudioElement = (element) => {
    audioElement.value = element
  }
  
  // 设置播放状态
  const setPlayingState = (state) => {
    isPlaying.value = state
  }
  
  // 设置当前时间
  const setCurrentTime = (time) => {
    currentTime.value = time
  }
  
  // 设置总时长
  const setDuration = (time) => {
    duration.value = time
  }
  
  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioElement,
    togglePlay,
    setAudioElement,
    setPlayingState,
    setCurrentTime,
    setDuration
  }
})