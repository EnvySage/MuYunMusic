<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import { useLyricStore } from '@/stores/lyric'

// 响应式状态
const musicPlayerStore = useMusicPlayerStore()
const lyricStore = useLyricStore()

onMounted(() => {
    // 初始化歌曲信息
})

// LRC 歌词文本 (从store获取)
const lrcText = computed(() => musicPlayerStore.lyricText)

// 改進の歌词解析函数
const parseLRC = (lrcText) => {
  const lines = lrcText.split('\n');
  const lyrics = [];
  const timeRegex = /\[(\d+):(\d+)\.(\d+)\]/g;
  
  let currentTime = null;
  let currentJapanese = '';
  let currentChinese = '';
  
  lines.forEach(line => {
    // 提取所有时间标签
    const timeMatches = [...line.matchAll(timeRegex)];
    
    if (timeMatches.length > 0) {
      // 如果有时间标签，计算时间（秒）
      const match = timeMatches[0];
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const milliseconds = parseInt(match[3]);
      currentTime = (minutes * 60) + seconds + (milliseconds / 1000);
      
      // 提取文本内容
      const text = line.replace(timeRegex, '').trim();
      
      if (text) {
        // 判断是日文还是中文
        const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F]/.test(text);
        
        if (isJapanese) {
          currentJapanese = text;
        } else {
          currentChinese = text;
        }
      }
    } else if (line.trim()) {
      // 没有时间标签の行作为歌词内容
      const text = line.trim();
      const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F]/.test(text);
      
      if (isJapanese) {
        currentJapanese = text;
      } else {
        currentChinese = text;
      }
    }
    
    // 当同时有日文和中文时，添加到歌词列表
    if (currentTime !== null && currentJapanese && currentChinese) {
      lyrics.push({
        time: currentTime + musicPlayerStore.lyricOffset,
        originalTime: currentTime,
        japanese: currentJapanese,
        chinese: currentChinese
      });
      // 重置当前记录
      currentJapanese = '';
      currentChinese = '';
    }
  });

  return lyrics.sort((a, b) => a.time - b.time);
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 查找当前歌词索引（优化版）
const findCurrentLyricIndex = (lyrics, currentTime) => {
  if (!lyrics.length) return -1;
  
  // 添加0.1秒の提前量，使歌词显示更自然
  const adjustedTime = currentTime + 0.1
  
  // 使用二分查找提高性能
  let low = 0;
  let high = lyrics.length - 1;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midTime = lyrics[mid].time;
    
    if (midTime < adjustedTime) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  return Math.max(0, low - 1);
}

// 计算属性
const parsedLyrics = computed(() => parseLRC(lrcText.value))
const currentLyricIndex = computed(() => findCurrentLyricIndex(parsedLyrics.value, musicPlayerStore.currentTime))

// 歌曲信息
const songInfo = computed(() => {
  return {
    title: musicPlayerStore.currentSong.title,
    artist: musicPlayerStore.currentSong.artist
  }
})






// 自動滚动歌词（带平滑滚动）
const scrollToCurrentLyric = () => {
  const lyricsContainer = document.querySelector('.lyrics-container')
  const activeLyric = document.querySelector('.lyric-line.active')

  if (activeLyric && lyricsContainer) {
    const containerHeight = lyricsContainer.offsetHeight
    const activeLyricHeight = activeLyric.offsetHeight
    
    // 计算activeLyric相对于lyricsContainerの顶部位置
    const activeLyricTop = activeLyric.offsetTop - lyricsContainer.offsetTop
    
    // 计算滚动位置，使当前歌词位于容器正中央
    const targetScrollTop = activeLyricTop - (containerHeight / 2) + (activeLyricHeight / 2)
    
    lyricsContainer.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    })
  }
}

// 监听当前歌词变化
watch(currentLyricIndex, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nextTick(scrollToCurrentLyric);
  }
},{
  immediate: true
})

// 调整歌词偏移量
const adjustLyricOffset = (delta) => {
  musicPlayerStore.adjustLyricOffset(delta)
}
</script>

<template>
  <div class="LyricBox" :style="{ backgroundImage: `url(${musicPlayerStore.currentSong.cover})` }">
    <div class="playerHeader">
      <div class="iconfont icon-fanhui" @click="lyricStore.hideLyricPage()"></div>
    </div>
    <div class="SongBox">
      <div class="albumBox">
        <div class="album-cover">
          <img :src="musicPlayerStore.currentSong.cover" alt="专辑封面" :style="{'--album-rotation-state' : musicPlayerStore.isPlaying ? 'runing' : 'paused'}">
        </div>
      </div>
      <div class="playerBox">
        <div class="music-player">
          <div class="song-info">
            <h1 class="song-title">{{ songInfo.title }}</h1>
            <div class="song-artist">{{ songInfo.artist }}</div>
            <div class="lyric-offset-control">
              <button @click="adjustLyricOffset(-0.1)">-0.1s</button>
              <span>偏移: {{ musicPlayerStore.lyricOffset.toFixed(2) }}s</span>
              <button @click="adjustLyricOffset(0.1)">+0.1s</button>
            </div>
          </div>
  
          <div class="lyrics-container">
            <div 
              v-for="(line, index) in parsedLyrics" 
              :key="index" 
              class="lyric-line"
              :class="{
                'active': index === currentLyricIndex,
                'before-active': index < currentLyricIndex && index >= currentLyricIndex - 3,
                'after-active': index > currentLyricIndex && index <= currentLyricIndex + 3
              }"
            >
              <!-- <div class="time-tag">{{ formatTime(line.originalTime) }}</div> -->
              <div>
                <div class="japanese-lyric">{{ line.japanese }}</div>
                <div class="chinese-lyric">{{ line.chinese }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.LyricBox{
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  .playerHeader{
    width: 100%;
    height: 50px;
    position: fixed;
    top: 0;
    z-index: 9999;
    padding: 10px 20px;
    .iconfont{
      height: 50px;
      aspect-ratio: 1;
      font-size: 30px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(1000px);
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      transform: rotate(-90deg);
    }
  }
}
.SongBox {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  backdrop-filter: blur(1000px);
  .albumBox{
    width: 50%;
    .album-cover {
      width: 500px;
      height: 500px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      
      img {
        animation: rotateAlbum 20s linear infinite;
        animation-play-state: var(--album-rotation-state, paused);
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .playerBox{
    width: 50%;
    display: flex;
    align-items: center;
    .music-player {
      width: 100%;
      overflow: hidden;
      padding: 25px;
    }
  }
}

@keyframes rotateAlbum {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.song-info {
  margin-bottom: 25px;
}

.song-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
}

.song-artist {
  font-size: 16px;
  color: #aaa;
}

.lyrics-container {
  height: 700px;
  overflow-y: auto;
  padding: 10px;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.lyrics-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.lyric-line {
  margin-bottom: 20px;
  transition: all 0.3s ease-in-out;
  opacity: 0.3;
  color: white;
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 15px;
  transform: translateY(20px);
  transition-delay: calc(0.05s * var(--index));
}

.lyric-line.before-active {
  opacity: 0.6;
  font-size: 24px;
  transform: translateY(0);
}

.lyric-line.active {
  opacity: 1;
  color: #ff3e3e;
  font-size: 30px;
  font-weight: bold;
  margin: 15px 0;
  transform: translateY(0);
  text-shadow: 0 0 10px rgba(255, 62, 62, 0.5);
}

.lyric-line.after-active {
  opacity: 0.6;
  font-size: 24px;
  transform: translateY(0);
} 

.japanese-lyric {
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.chinese-lyric {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  transition: all 0.3s ease;
}

.lyric-line.active .japanese-lyric {
  font-size: 1.2em;
}

.lyric-line.active .chinese-lyric {
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.9);
}

.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #333;
  border: none;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: #444;
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn {
  width: 60px;
  height: 60px;
  background: #ff3e3e;
}

.play-btn:hover:not(:disabled) {
  background: #ff5e5e;
}

.progress-container {
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  margin-top: 20px;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #ff3e3e;
  border-radius: 2px;
  width: 0%;
  position: relative;
  transition: width 0.1s linear;
}

.progress-container:hover .progress-bar::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 5px rgba(255, 62, 62, 0.8);
}

.time-display {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #888;
  font-size: 12px;
}

.volume-control {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.volume-slider {
  flex: 1;
  margin-left: 10px;
  -webkit-appearance: none;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #ff3e3e;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.lyric-offset-control {
  margin-top: 10px;
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 10px;
}

.lyric-offset-control button {
  background: #333;
  border: none;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.lyric-offset-control button:hover {
  background: #444;
}

.time-tag {
  font-size: 14px;
  color: #919090;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}
</style>

