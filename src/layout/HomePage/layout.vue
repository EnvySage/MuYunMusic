<template>
  <div class="layout">
    <div class="loginBox">
      <login></login>
    </div>
    <div class="playerListControll">
      <el-drawer v-model="playerStore.player" lock-scroll direction="rtl" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <h1 :id="titleId" :class="titleClass" style="font-size: var(--font-size-xl); ">播放列表</h1>
          <div class="functionBox">
            <div class="collectBox" style="display: flex; align-items: center; ">
              <div class="iconfont icon-shoucang" style="font-size: larger;"></div>
              <div class="box-info">收藏全部</div>
            </div>
            <div class="deleteBox" style="display: flex; align-items: center; gap: var(--spacing-unit);">
              <div class="iconfont icon-qingkong"></div>
              <div class="box-info">删除全部</div>
            </div>
          </div>
        </template>
        <div class="playList">
          <playListItem @click="handleListPlay(playerItem)" v-for="playerItem in playerList" :img="playerItem.coverUrl" :title="playerItem.name" :artist="playerItem.artistName" :duration="playerItem.duration" ></playListItem>
        </div>
      </el-drawer>
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
    <div class="footer" v-show="musicPlayerStore.currentSong.title !== '未选择歌曲'">
      <Footer></Footer>
    </div>
    <!-- 添加全局音频元素 -->
    <audio ref="audioElement" :src="musicPlayerStore.currentSong.url" @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate" @play="handlePlay" @pause="handlePause" @ended="handleEnded">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { useLyricStore } from '@/stores/lyric'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import { usePlayerStore } from '@/stores/playerList';
import Header from './header.vue';
import Sider from './sider.vue';
import Footer from './footer.vue';
import Lyric from '@/layout/MusicPage/Lyric.vue'
import playListItem from '@/components/playListItem.vue';
import login from '@/components/login.vue';
const lyricStore = useLyricStore()
const musicPlayerStore = useMusicPlayerStore()
const playerStore = usePlayerStore()
const audioElement = ref(null)
 
onMounted(() => {
  if (audioElement.value) {
    musicPlayerStore.setAudioElement(audioElement.value)
    // 初始化歌曲信息
    // musicPlayerStore.setCurrentSong({
    //   title: '晚餐歌',
    //   artist: 'tuki.',
    //   url: music,
    //   cover: albumCover
    // })
  }
})
const handleListPlay = (item) => {
  const song = {
    title: item.name,
    artist: item.artistName,
    url: item.musicUrl,
    cover: item.coverUrl
  }
  const duration = item.duration
  musicPlayerStore.setCurrentSong(song)
  musicPlayerStore.setDuration(duration)
  musicPlayerStore.setLyricText(item.id)
}

const playerList = computed(() => {
  return playerStore.getPlayerList()
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
  musicPlayerStore.setCurrentTime(0)
  // 先获取下一首歌曲
  const nextSong = playerStore.nextSong()
  
  // 如果有下一首歌曲，则播放它
  if (nextSong && musicPlayerStore.audioElement) {
    // 重置播放状态
    musicPlayerStore.setPlayingState(false)
    setTimeout(() => {
      musicPlayerStore.togglePlay()
    }, 100)
  } else {

    musicPlayerStore.setPlayingState(false)
  }
}

// 导入音乐和专辑封面
import music from '../../image/Music/晚餐歌.mp3'
import albumCover from '../../image/Music/晚餐歌.jpg'
</script>

<style lang="scss" scoped>
.layout .showBox {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  background-color: var(--background-color);
}

.playerListControll {
  position: fixed;
  right: 0;
  top: 15%;
  bottom: 15%;
  z-index: 10000;

  .functionBox {
    display: flex;
    gap: var(--spacing-lg);
  }

  :deep(.el-overlay) {
    background-color: transparent;
  }

  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }

  :deep(.el-drawer__body) {
    padding-right: 0;
    padding-left: 0;
  }

  :deep(.el-drawer.rtl) {
    top: 10%;
    height: 80%;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

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