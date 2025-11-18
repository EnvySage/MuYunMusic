<template>
  <div class="user-playlist-card" @click="handleClick">
    <div class="playlist-cover">
      <img :src="coverUrl" :alt="title" />
      <div class="play-count" v-if="playCount">
        <i class="iconfont icon-bofang1"></i>
        <span>{{ formatPlayCount(playCount) }}</span>
      </div>
      <div class="play-button" @click.stop="handlePlay">
        <i class="iconfont icon-bofang1"></i>
      </div>
    </div>
    <div class="playlist-info">
      <div class="playlist-title">{{ title }}</div>
      <div class="playlist-count">{{ songCount }} 首</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  coverUrl: {
    type: String,
    default: 'https://via.placeholder.com/200x200?text=Cover'
  },
  title: {
    type: String,
    default: '歌单标题'
  },
  songCount: {
    type: Number,
    default: 0
  },
  playCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click', 'play'])

const handleClick = () => {
  emit('click')
}

const handlePlay = () => {
  emit('play')
}

const formatPlayCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}
</script>

<style lang="scss" scoped>
.user-playlist-card {
  cursor: pointer;
  transition: var(--transition-all);
  border-radius: var(--border-radius-md);
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    
    .play-button {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.playlist-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--background-color-secondary);
  margin-bottom: var(--spacing-sm);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition-all);
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.play-count {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: var(--border-radius-sm);
  color: var(--text-color-white);
  font-size: var(--font-size-xs);
  backdrop-filter: blur(4px);

  i {
    font-size: var(--font-size-xs);
  }
}

.play-button {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  border-radius: var(--border-radius-round);
  color: var(--text-color-white);
  opacity: 0;
  transform: scale(0.8);
  transition: var(--transition-all);
  box-shadow: var(--shadow-md);
  cursor: pointer;

  i {
    font-size: var(--icon-size-md);
    margin-left: 2px;
  }

  &:hover {
    background-color: var(--primary-color-hover);
    transform: scale(1.1);
  }
}

.playlist-info {
  padding: 0 var(--spacing-xs);
}

.playlist-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--text-color);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 1.5em;
}

.playlist-count {
  font-size: var(--font-size-xs);
  color: var(--text-color-lighter);
}
</style>

