<template>
  <div class="table-container">
    <el-table :data="songs" style="width: 100%" :show-header="false" row-class-name="song-table-row"
      @row-click="handleRowClick">
      <el-table-column prop="index" label="" width="40">
        <template #default="scope">
          <div class="index-cell" style="cursor: pointer;">
            {{ scope.$index + 1 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌曲" min-width="300">
        <template #default="scope">
          <div class="song-info" style="display: flex; align-items: center; gap: 10px;">
            <div class="album-cover" style="width: 40px; height: 40px; flex-shrink: 0;">
              <img :src="scope.row.coverUrl" alt="专辑封面" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
            </div>
            <div class="song-details" style="display: flex; flex-direction: column;">
              <span class="song-title" :class="{ 'playing': isCurrentSong(scope.row) }" style="font-weight: bolder; font-size: larger;">{{ scope.row?.name || ""}}</span>
              <span class="singer" style="font-weight: bolder; font-size: larger;">{{ scope.row?.artistName || ""}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="albumName" label="专辑" min-width="150" />
      <el-table-column label="收藏" width="60" align="center">
        <template #default="scope">
          <div class="like-cell" @click.stop="handleLike(scope.row)">
            <div class="iconfont" :class="scope.row.like ? 'icon-xihuan' : 'icon-dianzan-xiankuang'"
              style="font-size: 20px; cursor: pointer;"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="时长" width="80" align="center">
        <template #default="scope">
          <div class="duration-cell">
            {{ formatDuration(scope.row.duration) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSongListStore } from '@/stores/songList'
import { useCollectorStore } from '@/stores/CollectorStore'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
const songListStore = useSongListStore()
const collectorStore = useCollectorStore()
const musicPlayerStore = useMusicPlayerStore()
const props = defineProps({
  songs: {
    type: Array,
    required: true
  },
  playlistId:{
    type:String,
    required:true
  }
})
const emits = defineEmits(['row-click'])

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleRowClick = (row) => {
  emits('row-click', row)
}

// 判断是否为当前播放的歌曲
const isCurrentSong = (row) => {
  return musicPlayerStore.currentSong.id === row.id
}

// 处理喜欢/取消喜欢
const handleLike = async(row) => {
  await collectorStore.addLikeSong(row.id)
  songListStore.getAllSongList(props.playlistId)
  // 同步更新当前播放歌曲的收藏状态
  if (musicPlayerStore.currentSong.id === row.id) {
    musicPlayerStore.setCurrentSongLike(!row.like)
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  :deep(.el-table) {
    background-color: transparent;

    .song-table-row {
      background-color: var(--background-color-white);
      cursor: pointer;

      &:hover {
        background-color: var(--background-color-hover) !important;
      }

      &.playing {
        color: var(--primary-color);
      }
    }

    .el-table__inner-wrapper::before {
      height: 0;
    }

    .el-table__row {
      height: 80px;

      .cell {
        padding: 0 5px;
      }
    }
  }
}

.index-cell {
  text-align: center;
  color: var(--text-color-lighter);
  font-size: var(--font-size-sm);
}

.song-info {
  .song-title {
    font-weight: var(--font-weight-bold);
    margin-bottom: 4px;
    color: var(--text-color);
    
    &.playing {
      color: var(--primary-color);
    }
  }
  
  .singer {
    font-size: var(--font-size-sm);
    color: var(--text-color-light);
  }
}

.like-cell {
  .iconfont {
    color: var(--text-color-light);
    transition: all 0.3s ease;
    
    &.icon-xihuan {
      color: var(--primary-color);
    }
    
    &:hover {
      transform: scale(1.1);
    }
  }
}

.duration-cell {
  color: var(--text-color-light);
  font-size: var(--font-size-sm);
}
</style>