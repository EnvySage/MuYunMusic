import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/http'
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
    title: '未选择歌曲',
    artist: '',
    url: '',
    cover: '',
    id:""
  })
  
  // 歌词文本
  const lyricText = ref('')

  // 歌词偏移量
  const lyricOffset = ref(0)
  
// ... existing code ...
  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioElement.value) return
    
    if (isPlaying.value) {
      audioElement.value.pause()
    } else {
      audioElement.value.play().catch(e => {
        console.log("播放失败:", e);
        // 如果是由于没有加载完成导致的错误，尝试重新加载
        if (e.name === 'AbortError' || e.name === 'NotAllowedError') {
          audioElement.value.load();
          setTimeout(() => {
            audioElement.value.play().catch(e => console.log("重试播放失败:", e));
          }, 100);
        }
      })
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
   if (Math.abs(currentTime.value - time) > 0.1) {
      currentTime.value = time
    }
  }
  
  // 设置总时长
  const setDuration = (time) => {
    duration.value = time
  }
  

  // 设置当前歌曲
  const setCurrentSong = (song) => {
    const wasPlaying = isPlaying.value && audioElement.value;
    
    // 如果正在播放，先暂停
    if (wasPlaying) {
      audioElement.value.pause();
    }
    
    currentSong.value = song;
    
    // 等待 DOM 更新后重新开始播放
    setTimeout(() => {
      if (wasPlaying && audioElement.value) {
        setPlayingState(false);
        setCurrentTime(0);
        audioElement.value.load();
        // 等待音频加载完成后再播放
        const playWhenReady = () => {
          if (audioElement.value.readyState >= 2) {
            audioElement.value.play().catch(e => {
              console.log("播放失败:", e);
              // 如果播放失败，稍后重试
              setTimeout(() => {
                if (isPlaying.value && audioElement.value) {
                  audioElement.value.play().catch(e => console.log("重试播放失败:", e));
                }
              }, 500);
            });
          } else {
            setTimeout(playWhenReady, 50);
          }
        };
        playWhenReady();
      }
    }, 0);
  }

  // 设置歌词文本
  const setLyricText =async (id) => {
    try {
    const response = await request.get(`/song/lyric/${id}`)
    lyricText.value = response.data
  } catch (error) {
    console.error("获取歌词失败:", error)
    lyricText.value = '' // 失败时设置为空字符串
    return ''
  }
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