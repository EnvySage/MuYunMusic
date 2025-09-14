<template>
  <div class="layout">
    <div class="showBox" v-if="!lyricStore.lyricPage">
      <div class="header">
        <Header></Header>
      </div>
      <el-splitter class="main-container">
        <el-splitter-panel size="12%" min="12%" max="50%">
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
  </div>
</template>

<script setup>
import { useLyricStore } from '@/stores/lyric'
import Header from './header.vue';
import Sider from './sider.vue';
import Footer from './footer.vue';
import Lyric from '@/layout/MusicPage/Lyric.vue'

const lyricStore = useLyricStore()

</script>

<style lang="scss" scoped>
.layout  .showBox {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.main-container {
  min-height: 0; // 关键修复：防止 Flex 容器溢出
  overflow-y: auto;
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