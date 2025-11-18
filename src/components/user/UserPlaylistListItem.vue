<template>
  <div class="playlist-list-item" @click="handleClick">
    <div class="item-number">{{ formatNumber(index) }}</div>
    <div class="item-cover">
      <img :src="coverUrl" :alt="title" />
    </div>
    <div class="item-title">{{ title }}</div>
    <div class="item-song-count">{{ formatSongCount(songCount) }}</div>
    <div class="item-creator">{{ creator }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  coverUrl: {
    type: String,
    default: 'https://via.placeholder.com/50x50?text=Cover'
  },
  title: {
    type: String,
    default: '歌单标题'
  },
  songCount: {
    type: Number,
    default: 0
  },
  creator: {
    type: String,
    default: '创建者'
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}

const formatNumber = (num) => {
  return String(num + 1).padStart(2, '0')
}

const formatSongCount = (count) => {
  if (count >= 10000) {
    return `累计听歌${count}首`
  }
  return `${count}首`
}
</script>

<style lang="scss" scoped>
.playlist-list-item {
  display: grid;
  grid-template-columns: 50px 50px 1fr 150px 120px;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md) var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition-all);
  border-radius: var(--border-radius-sm);

  &:hover {
    background-color: var(--background-color-secondary);
  }
}

.item-number {
  font-size: var(--font-size-sm);
  color: var(--text-color-lighter);
  text-align: center;
  font-weight: var(--font-weight-normal);
}

.item-cover {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--background-color-secondary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-title {
  font-size: var(--font-size-sm);
  color: var(--text-color);
  font-weight: var(--font-weight-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-song-count {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  text-align: left;
}

.item-creator {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .playlist-list-item {
    grid-template-columns: 40px 40px 1fr 100px 80px;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }

  .item-cover {
    width: 40px;
    height: 40px;
  }
}
</style>

