<template>
  <div class="layout">
    <div class="playerListControll">
      <PlayerListControll></PlayerListControll>
    </div>
    <div class="showBox" v-if="!lyricStore.lyricPage">
      <div class="header">
        <Header></Header>
      </div>
      <el-splitter class="main-container">
        <el-splitter-panel size="12%" min="12%" max="50%" class="sider-panel">
          <Sider></Sider>
        </el-splitter-panel>
        <el-splitter-panel :min="800" class="content-panel">
          <router-view></router-view>
        </el-splitter-panel>
      </el-splitter>
    </div>
    <div class="LyricBox" v-else-if="lyricStore.lyricPage">
      <Lyric></Lyric>
    </div>
    <div class="footer">
      <Footer></Footer>
    </div>
    <!-- 添加全局音频元素 -->
    <audio 
      ref="audioElement" 
      :src="musicPlayerStore.currentSong.url" 
      @loadedmetadata="handleLoadedMetadata" 
      @timeupdate="handleTimeUpdate"
      @play="handlePlay" 
      @pause="handlePause" 
      @ended="handleEnded">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLyricStore } from '@/stores/lyric'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import Header from './header.vue';
import Sider from './sider.vue';
import Footer from './footer.vue';
import Lyric from '@/layout/MusicPage/Lyric.vue'
// import PlayerListControll from '@/components/playerList.vue'
const lyricStore = useLyricStore()
const musicPlayerStore = useMusicPlayerStore()
const audioElement = ref(null)

onMounted(() => {
  if (audioElement.value) {
    musicPlayerStore.setAudioElement(audioElement.value)
    // 初始化歌曲信息
    musicPlayerStore.setCurrentSong({
      title: '晚餐歌',
      artist: 'tuki.',
      url: music,
      cover: albumCover
    })
  }
})

const handleTimeUpdate = () => {
  musicPlayerStore.setCurrentTime(audioElement.value.currentTime)
}

const handleLoadedMetadata = () => {
  musicPlayerStore.setDuration(audioElement.value.duration)
}

const handlePlay = () => {
  musicPlayerStore.setPlayingState(true)
}

const handlePause = () => {
  musicPlayerStore.setPlayingState(false)
}

const handleEnded = () => {
  musicPlayerStore.setPlayingState(false)
  musicPlayerStore.setCurrentTime(0)
}

// 导入音乐和专辑封面
import music from '../../image/Music/晚餐歌.mp3'
import albumCover from '../../image/Music/晚餐歌.jpg'
</script>

<style lang="scss" scoped>
.layout  .showBox {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.playerListControll{
  position: fixed;
  right: 0;
  top: 15%;
  bottom: 15%;
  z-index: 10000;
}

.main-container {
  min-height: 0; // 关键修复：防止 Flex 容器溢出
  overflow-y: hidden;
}
.content-panel {
    overflow: hidden;
}

.footer {
  position: fixed;
    bottom: 0;
  width: 100%;
  height: 100px;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>