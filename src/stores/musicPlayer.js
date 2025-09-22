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
  
  // 歌曲信息
  const currentSong = ref({
    title: '晚餐歌',
    artist: 'tuki.',
    url: '',
    cover: ''
  })
  
  // 歌词文本
  const lyricText = ref('')

  // 歌词偏移量
  const lyricOffset = ref(0)
  
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
  
  // 设置当前歌曲
  const setCurrentSong = (song) => {
    currentSong.value = song
  }
  
  // 设置歌词文本
  const setLyricText = (text) => {
    lyricText.value = text
  }
  
  // 调整歌词偏移量
  const adjustLyricOffset = (delta) => {
    lyricOffset.value += delta
  }
  
  // 重置歌词偏移量
  const resetLyricOffset = () => {
    lyricOffset.value = 0
  }
  
  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioElement,
    currentSong,
    lyricText,
    lyricOffset,
    togglePlay,
    setAudioElement,
    setPlayingState,
    setCurrentTime,
    setDuration,
    setCurrentSong,
    setLyricText,
    adjustLyricOffset,
    resetLyricOffset
  }
})