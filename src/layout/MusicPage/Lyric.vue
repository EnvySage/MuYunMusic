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

const parseLRC = (lrcText) => {
  const lines = lrcText.split('\n').filter(line => line.trim() !== '');
  const lyrics = [];

  const timeRegex = /\[(\d+):(\d+)\.(\d+)\]/;

  let buffer = []; // 用于暂存同一时间或相邻时间的歌词行

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;

    const timeMatch = line.match(timeRegex);
    let currentTime = null;
    let text = line;

    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseInt(timeMatch[2]);
      const milliseconds = parseInt(timeMatch[3]);
      currentTime = (minutes * 60) + seconds + (milliseconds / 1000);
      text = line.replace(timeRegex, '').trim();
    }

    const isJapanese = text ? /[\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F]/.test(text) : false;

    const entry = {
      time: currentTime,
      text,
      isJapanese,
      raw: rawLine,
      index
    };

    buffer.push(entry);

    // 尝试配对：查找当前 buffer 中是否有可以配对的日文和中文
    for (let i = 0; i < buffer.length - 1; i++) {
      const first = buffer[i];
      const second = buffer[i + 1];

      // 两者都有时间，且时间相等或非常接近，且一个是日文，一个是中文
      if (
        first.time !== null &&
        second.time !== null &&
        Math.abs(first.time - second.time) < 0.1 && // 允许微小误差
        first.isJapanese !== second.isJapanese && // 语言不同
        first.text && second.text // 有实际文本
      ) {
        lyrics.push({
          time: first.time + musicPlayerStore.lyricOffset, // 假设有 offset
          originalTime: first.time,
          japanese: first.isJapanese ? first.text : second.isJapanese ? second.text : '',
          chinese: first.isJapanese ? second.text : second.isJapanese ? first.text : ''
        });

        // 移除已配对的条目
        buffer.splice(i, 2);
        break; // 一次只配对一对
      }
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
  background: #0d0d0d;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  /* 深色遮罩层，参考网易云风格 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.65) 100%);
    z-index: 1;
  }
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
      color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      transform: rotate(-90deg);
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
      }
    }
  }
}
.SongBox {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  position: relative;
  z-index: 2;
  .albumBox{
    width: 50%;
    .album-cover {
      width: 500px;
      height: 500px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
      
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
  margin-bottom: 30px;
  padding: 0;
}

.song-title {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #fff;
}

.song-artist {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 15px;
}

.lyrics-container {
  height: 700px;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.lyrics-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.lyric-line {
  margin-bottom: 24px;
  transition: all 0.4s ease;
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.65);
  min-height: auto;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0;
}

.lyric-line.before-active {
  opacity: 0.7;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
}

.lyric-line.active {
  opacity: 1;
  color: #fff;
  font-size: 22px;
  font-weight: 400;
  margin: 20px 0;
}

.lyric-line.after-active {
  opacity: 0.7;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
} 

.japanese-lyric {
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.chinese-lyric {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  transition: all 0.3s ease;
  margin-top: 4px;
}

.lyric-line.active .japanese-lyric {
  font-size: 1em;
}

.lyric-line.active .chinese-lyric {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.85);
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
  appearance: none;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
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
  margin-top: 15px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 10px;
}

.lyric-offset-control button {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.lyric-offset-control button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.time-tag {
  font-size: 14px;
  color: #919090;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}
</style>