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
      <div class="song-list" v-if="tracks.length > 0">
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
    default: ""
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
  width: 100%;
  aspect-ratio: 4 / 5;
  position: relative;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-md);
  background: var(--background-color-white);
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  z-index: 2;
}

.hover-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
  backdrop-filter: blur(15px);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%);
  color: var(--text-color-white);
  padding: var(--spacing-md);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.5s ease, backdrop-filter 0.5s ease;
  overflow: hidden;
}

.show {
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 80%, transparent 100%);
  backdrop-filter: blur(25px);
  justify-content: space-between;
}

.song-info {
  margin-bottom: 0;
  opacity: 1;
  transform: translateY(0);
  transition: margin-bottom 0.3s ease 0.2s;
}

.show .song-info {
  margin-bottom: var(--spacing-md);
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
  flex: 1;
  margin-bottom: var(--spacing-md);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: translateY(10px);
  transition: opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s, max-height 0.5s ease 0.3s, margin-bottom 0.3s ease 0.3s;
}

.show .song-list {
  opacity: 1;
  transform: translateY(0);
  max-height: 300px;
  margin-bottom: var(--spacing-md);
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
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--primary-color);
  border-radius: var(--border-radius-round);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-md);
  z-index: 10;
  opacity: 0;
  transform: scale(0.8);

  .iconfont {
    color: var(--text-color-white);
    font-size: var(--icon-size-lg);
    margin-left: 2px;
  }

  &:hover {
    background: var(--primary-color-hover);
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
  }
}

.show .play-button {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s ease 0.4s, transform 0.3s ease 0.4s;
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
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  z-index: 7;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}



</style>