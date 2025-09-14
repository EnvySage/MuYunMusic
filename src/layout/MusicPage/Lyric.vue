<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import { useLyricStore } from '@/stores/lyric'
import music from '../../image/Music/晚餐歌.mp3'
// 响应式状态
const musicPlayerStore = useMusicPlayerStore()
const lyricStore = useLyricStore()
const audioElement = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isLoading = ref(false)
const lyricOffset = ref(0) // 可调整的歌词偏移量

// 音频文件路径
const audioUrl = music
onMounted(() => {
  if (audioElement.value) {
    musicPlayerStore.setAudioElement(audioElement.value)
  }
})
// LRC 歌词文本
const lrcText = ref(`[00:00.000]作词 : tuki.
[00:00.490]作曲 : tuki.
[00:00.980]编曲 : tuki.
[00:01.470]晚餐歌 (弾き語りver) - tuki.
[00:05.270]词：tuki.
[00:06.210]曲：tuki.
[00:10.230]君を泣かすから
[00:10.230]因为我会让你哭泣
[00:11.830]だから一緒には居れないな
[00:11.830]所以我才没有办法与你在一起
[00:14.830]君を泣かすから
[00:14.830]因为我会让你哭泣
[00:16.560]早く忘れて欲しいんだ
[00:16.560]所以希我才希望你快点忘记我
[00:19.640]人間だからね
[00:19.640]正因为是人啊
[00:21.690]たまには違うものも食べたいね
[00:21.690]所以偶尔也会想尝试些不同的食物
[00:24.490]君を泣かすから
[00:24.490]因为我会让你哭泣
[00:26.530]そう君を泣かすから
[00:26.530]はあ 请不要再哭泣了
[00:28.680]でも味気ないないないんだよね
[00:28.680]但你我也都觉得索然无味了吧
[00:31.620]会い会い会いたくなんだよね
[00:31.620]也愈发想去见除对方以外的人了吧
[00:34.010]君以外会いたくないんだよね
[00:34.010]我却在抗拒见除你以外的人
[00:36.320]なんて勝手だね
[00:36.320]真是何等自私的一份爱啊
[00:38.960]大体曖昧なんだよね
[00:38.960]感情就是这样模糊不清的
[00:41.240]愛の存在証明なんて
[00:41.240]但这份爱确切存在着の证明
[00:44.060]君が教えてくれないか
[00:44.060]可以请你告诉我吗
[00:48.380]何十回の夜を過ごしたって
[00:48.380]哪怕经历几十次夜晚降临の煎熬
[00:51.490]得られぬような
[00:51.490]我也无法得到
[00:53.720]愛してるを並べてみて
[00:53.720]排列出の"我爱你"三个字
[00:58.340]何十回の夜を過ごしたって
[00:58.340]哪怕经历几十次夜晚降临の煎熬
[01:01.360]得られぬような
[01:01.360]我也无法得到
[01:03.520]最高のフルコースを頂戴
[01:03.520]赐予我的那样美好的盛宴
[01:18.410]君を泣かすから
[01:18.410]因为我会让你哭泣
[01:20.240]きっと一生は無理だよね
[01:20.240]所以一直在一起も一定是不行の吧
[01:23.260]君を泣かすから
[01:23.260]因为我会让你哭泣
[01:25.000]胸がとても痛くなんだ
[01:25.000]所以这颗心才会疼痛无比
[01:28.100]人間だからね
[01:28.100]正因为は人啊
[01:30.180]たまには分かり合えなくなって
[01:30.180]所以偶尔也会无法相互理解
[01:32.860]君を泣かすから
[01:32.860]因为我会让你哭泣
[01:34.980]また君を泣かすから
[01:34.980]はあ 我又害你哭泣了
[01:37.150]でも自信がないないないんだよね
[01:37.150]但是你我都对自己没有自信
[01:40.170]変わりたくないないないんだよね
[01:40.170]希望着当下的一切都不要改变
[01:42.530]君以外会いたくないんだよね
[01:42.530]我又在抗拒着見除你以外の人
[01:44.880]なんて勝手だね
[01:44.880]这份愛果然很自私あ
[01:47.610]大体曖昧だったよね
[01:47.610]感情就是这样模糊不清の
[01:49.740]愛の存在証明なんて
[01:49.740]但这份愛确切存在着の证明
[01:52.580]君がそこに居るのにね
[01:52.580]は明明近在我身边的你吗
[01:56.860]何百回の夜を過ごしたって
[01:56.860]哪怕经历数百次夜晚降临の煎熬
[01:59.940]得られぬような
[02:02.030]愛してるを並べてみて
[02:02.030]排列出の"我爱你"三个字
[02:06.650]何百回の夜を過ごしたって
[02:06.650]哪怕经历数百次夜晚降临の煎熬
[02:09.680]得られぬような
[02:09.680]我也无法得到
[02:11.880]最高のフルコースを頂戴
[02:11.880]赐予我的那样美好的盛宴
[02:16.890]離れないで 傍に居てくれたのは
[02:16.890]不曾离去の 在我身旁陪伴着の
[02:21.890]結局君一人だったよね
[02:21.890]只剩着你一直愛着我
[02:26.850]涙のスパイスは君の胸に
[02:26.850]如辛香料般的泪水渗入你的心
[02:31.880]残ってしまうだろうけど
[02:31.880]会在那里留下余香吗
[02:36.600]何千回の夜を過ごしたって
[02:36.600]哪怕经历成千次夜晚降临の煎熬
[02:39.830]得られぬような
[02:39.830]我也无法忘却
[03:02.040]愛してるを並べるから
[03:02.040]排列出の"我爱你"三个字
[03:06.730]何千回の夜を過ごしたって
[03:06.730]哪怕经历成千次夜晚降临の煎熬
[03:09.760]得られぬような
[03:09.760]我也无法忘却
[03:11.940]最高のフルコースを
[03:11.940]那样美好的盛宴あ
[02:56.840]何万回の夜を過ごしたって
[02:56.840]哪怕经历上万次夜晚降临の煎熬
[02:59.840]忘れぬような
[03:02.040]愛してるを並べるから
[03:02.040]排列出の"我爱你"三个字
[03:06.730]何万回の夜を過ごしたって
[03:06.730]哪怕经历上万次夜晚降临の煎熬
[03:09.760]忘れぬような
[03:09.760]我也无法忘却
[03:11.940]最高のフルコースを頂戴
[03:11.940]赐予我的那样美好的盛宴`
)

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
        time: currentTime + lyricOffset.value,
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
const currentLyricIndex = computed(() => findCurrentLyricIndex(parsedLyrics.value, currentTime.value))
const progressPercentage = computed(() => (currentTime.value / duration.value) * 100 || 0)
const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

// 歌曲信息
const songInfo = computed(() => {
  const titleMatch = lrcText.value.match(/\[.*?\](.+?)\s*-/)
  return {
    title: titleMatch ? titleMatch[1].trim() : '晚餐歌',
    artist: 'tuki.'
  }
})



const handleTimeUpdate = () => {
  currentTime.value = audioElement.value.currentTime
  musicPlayerStore.setCurrentTime(currentTime.value) // 更新store
}

const handleLoadedMetadata = () => {
  duration.value = audioElement.value.duration
  musicPlayerStore.setDuration(duration.value) // 更新store
  isLoading.value = false
}

const handlePlay = () => {
  isPlaying.value = true
  musicPlayerStore.setPlayingState(true) // 更新store的状态
}

const handlePause = () => {
  isPlaying.value = false
  musicPlayerStore.setPlayingState(false)
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const handleLoadStart = () => {
  isLoading.value = true
}

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
})

// 调整歌词偏移量
const adjustLyricOffset = (delta) => {
  lyricOffset.value += delta
  console.log(`歌词偏移量調整为: ${lyricOffset.value.toFixed(2)}秒`)
}

import albumCover from '@/image/Music/晚餐歌.jpg'
</script>

<template>
  <div class="LyricBox" :style="{ backgroundImage: `url(${albumCover})` }">
    <div class="playerHeader">
      <div class="iconfont icon-fanhui" @click="lyricStore.hideLyricPage()"></div>
    </div>
    <div class="SongBox">
      <div class="albumBox">
        <div class="album-cover">
          <img :src="albumCover" alt="专辑封面" :style="{'--album-rotation-state' : isPlaying ? 'runing' : 'paused'}">
        </div>
      </div>
      <div class="playerBox">
        <div class="music-player">
          <!-- 隐藏の音频元素 -->
          <audio ref="audioElement" :src="audioUrl" @loadedmetadata="handleLoadedMetadata" @timeupdate="handleTimeUpdate"
            @play="handlePlay" @pause="handlePause" @ended="handleEnded" @loadstart="handleLoadStart"></audio>
  
          <div class="song-info">
            <h1 class="song-title">{{ songInfo.title }}</h1>
            <div class="song-artist">{{ songInfo.artist }}</div>
            <div class="lyric-offset-control">
              <button @click="adjustLyricOffset(-0.1)">-0.1s</button>
              <span>偏移: {{ lyricOffset.toFixed(2) }}s</span>
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