<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Lyric from 'lyric-parser'
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
  if (!lrcText) return [];

  try {
    const parser = new Lyric(lrcText);
    parser.parse();
    
    // 过滤无效时间戳并确保时间有效性
    const validLines = parser.lines.filter(line => 
      typeof line.time === 'number' && 
      !isNaN(line.time) && 
      line.time >= 0
    );

    if (validLines.length === 0) {
      console.warn('No valid lyric lines found, falling back to manual parse');
      return manualParseLRC(lrcText);
    }

    // 按时间分组（基于当前组最后一行比较）
    const groups = [];
    let currentGroup = [];

    for (const line of validLines) {
      if (currentGroup.length === 0) {
        currentGroup.push(line);
      } else {
        const lastTime = currentGroup[currentGroup.length - 1].time;
        if (Math.abs(line.time - lastTime) < 0.1) {
          currentGroup.push(line);
        } else {
          groups.push(currentGroup);
          currentGroup = [line];
        }
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    // 处理每个分组（确保至少包含原始文本）
    return groups.map(group => ({
      time: group[0].time + musicPlayerStore.lyricOffset,
      originalTime: group[0].time,
      original: group[0].text || '',
      translation: group.length > 1 ? group[1].text || '' : ''
    })).sort((a, b) => a.time - b.time);
  } catch (e) {
    console.error('Error parsing lyrics with lyric-parser:', e);
    return manualParseLRC(lrcText);
  }
};

// 手动解析回退方案
const manualParseLRC = (lrcText) => {
  const lines = lrcText.split('\n').filter(line => line.trim() !== '');
  const lyrics = [];
  const timeRegex = /\[(\d+):(\d+)\.(\d+)\]/g; // 注意这里的 'g' 标志，用于匹配一行中的多个时间戳

  let currentTime = null;
  let currentOriginal = '';
  let currentTranslation = '';

  lines.forEach(rawLine => {
    const line = rawLine.trim();
    const timeMatches = [...line.matchAll(timeRegex)]; // 获取一行中所有的时间戳匹配结果

    if (timeMatches.length > 0) {
      // 计算时间（以第一个时间戳为准）
      const firstMatch = timeMatches[0];
      const minutes = parseInt(firstMatch[1]);
      const seconds = parseInt(firstMatch[2]);
      const milliseconds = parseInt(firstMatch[3]);
      const time = (minutes * 60) + seconds + (milliseconds / 1000);

      const text = line.replace(timeRegex, '').trim(); // 移除所有时间戳后得到纯文本

      // 如果当前时间点没有记录原文，则将此行作为原文
      // 如果当前时间点已记录原文，则将此行作为翻译
      if (currentTime === null || Math.abs(time - currentTime) > 0.01) {
        // 遇到新时间点，将前一个分组保存（如果有的话）
        if (currentTime !== null) {
          lyrics.push({
            time: currentTime + musicPlayerStore.lyricOffset,
            originalTime: currentTime,
            original: currentOriginal,
            translation: currentTranslation
          });
        }
        // 开始新的分组
        currentTime = time;
        currentOriginal = text;
        currentTranslation = '';
      } else {
        // 与当前时间点相同或非常接近，视为翻译行
        currentTranslation = text;
      }
    }
  });

  // 循环结束后，添加最后一个分组
  if (currentTime !== null) {
    lyrics.push({
      time: currentTime + musicPlayerStore.lyricOffset,
      originalTime: currentTime,
      original: currentOriginal,
      translation: currentTranslation
    });
  }

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
  
  // 移除提前量，使用精确时间比对
  const adjustedTime = currentTime;
  
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
    <div class="overplay"></div>
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
              <div class="time-tag">{{ formatTime(line.originalTime) }}</div>
              <div>
                <div class="original-lyric">{{ line.original }}</div>
                <div class="translation-lyric">{{ line.translation }}</div>
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
.overplay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明遮罩，透明度可调整 */
  z-index: 1;
}
.SongBox {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  backdrop-filter: blur(1000px);
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
  font-size: 30px;
  font-weight: bold;
  margin: 15px 0;
  transform: translateY(0);
  border-radius: 4px;
  padding: 5px 10px;
}

.lyric-line.after-active {
  opacity: 0.6;
  font-size: 24px;
  transform: translateY(0);
} 

.original-lyric {
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.translation-lyric {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  transition: all 0.3s ease;
}

.lyric-line.active .original-lyric,
.lyric-line.active .translation-lyric {
  font-size: 1.2em;
  color: #ff3e3e;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 62, 62, 0.5);
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