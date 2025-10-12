<template>
  <div class="music-card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="card-title" v-show="CardTitle">{{ CardTitle ? CardTitle : ''  }}</div>
    <!-- 背景图 -->
    <div class="card-background" :style="{ backgroundImage: `url(${bgImage})` }"></div>
    
    <!-- 悬停时显示的内容 -->
    <div :class="['hover-content', isHovered ? 'show' : '']">
      <div class="song-info">
        <div class="song-title">{{ songTitle }}</div>
        <div class="song-artist">{{ songArtist }}</div>
      </div>
      
      <!-- 歌曲列表 -->
      <div class="song-list">
        <div v-for="(track, index) in tracks" :key="index" class="track-item">
          <span class="track-number">{{ index + 1 }}.</span>
          <span class="track-name">{{ track.name }}</span>
        </div>
      </div>
      
      <!-- 播放按钮 -->
      <div class="play-button" @click="handlePlay">
        <div class="iconfont icon-bofang1"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  CardTitle: {
    type: String,
    default: ''
  },
  bgImage: {
    type: String,
    default: ''
  },
  songTitle: {
    type: String,
    default: '歌单名字'
  },
  songArtist: {
    type: String,
    default: '歌单作者'
  },
  tracks: {
    type: Array,
    default: () => [
      { name: 'おしんこ' },
      { name: '雪の降らない星' },
      { name: 'すずめ feat.十明' }
    ]
  }
});
const isHovered = ref(false);
const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
};

const handlePlay = () => {
  console.log('播放歌曲');
  // 这里可以添加实际的播放逻辑
};
</script>

<style scoped>
.music-card {
  width: 200px;
  height: 250px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.music-card:hover {
  transform: scale(1.02);
}

.card-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.card-background::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  backdrop-filter: blur(100px);
  z-index: 2;
}

.hover-content {
  position: absolute;
  top: calc(100% - 145px);
  left: 0;
  right: 0;
  bottom: -80%;
  backdrop-filter: blur(30px);
  -webkit-mask: linear-gradient(to top, black 70%, transparent);
  mask: linear-gradient(to top, black 70%, transparent);
  color: var(--text-color-white);
  padding: 16px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.5s ease;
  padding-top: 50%;
}
.show {
  top: 0;
  bottom: 0;
}

.song-info {
  margin-bottom: 16px;
}

.song-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.song-artist {
  font-size: 12px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.song-list {
  flex-grow: 1;
  margin-bottom: 16px;
}

.track-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.track-number {
  width: 20px;
  font-size: 12px;
  opacity: 0.8;
  margin-right: 8px;
}

.track-name {
  font-size: 12px;
  opacity: 0.9;
}

.play-button {
  position: absolute;
  bottom: 5%;
  right: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.8);
}

.icon-play {
  width: 16px;
  height: 16px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="white"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}
.card-title { 
  position: absolute;
  color: var(--text-color-white);
  font-weight: bolder;
  z-index: 7;
  width: 100%;
  padding: 10px;
  background:linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 90%, transparent);
}



</style>