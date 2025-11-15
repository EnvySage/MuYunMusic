<!-- src/components/SongListContent.vue -->
<template>
  <div class="song-list-content">
    <el-table :data="songs" style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      highlight-current-row
      @row-click="handleRowClick">
      <el-table-column prop="id" label="#" width="60" sortable align="center" fixed>
        <template #default="scope">
          <div class="index-cell">
            {{ scope.$index + 1 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="300" prop="name" label="标题" show-overflow-tooltip>
        <template #default="scope">
          <div class="song-info" style="display: flex; gap: 10px;">
            <div class="song-cover" style="width: 60px; height: 60px;">
              <img :src="scope.row.coverUrl" alt="专辑封面" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
            </div>
            <div class="song-details">
              <div class="song-title" style="font-weight: bolder; font-size: large;">{{ scope.row.name }}</div>
              <div class="song-meta" style="display: flex; gap: 15px; color: gray">
                <span class="singer" style="font-weight: bolder; font-size: larger;">{{ scope.row?.artistName || ""}}</span>
                <span class="album">{{ scope.row.album }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="album" label="专辑" min-width="150" show-overflow-tooltip>
        <template #default="scope">
          <div class="album-cell">
            {{ scope.row.album }}
          </div>
        </template>
      </el-table-column>
      <!-- 喜欢列 -->
      <el-table-column label="喜欢" width="80" align="center">
        <template #default="scope">
          <div class="like-cell">
            <div class="iconfont" :class="scope.row.like ? 'icon-xihuan' : 'icon-weixihuan'" 
              @click.stop="handleLike(scope.row)"></div>
          </div>
        </template>
      </el-table-column>
      <!-- 时长列 -->
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
import { useCollectorStore } from '@/stores/CollectorStore'
import { useSongListStore } from '@/stores/songList'
const emit = defineEmits(['row-click'])
const collectorStore = useCollectorStore()
const songListStore = useSongListStore()
const props = defineProps({
  songs: {
    type: Array,
    required: true
  },
  playlistId: {
    type: String,
    default: ""
  }
})


// 处理行点击
const handleRowClick = (row) => {
  emit('row-click', row)
}

// 处理喜欢/取消喜欢
const handleLike = async(row) => {
  await collectorStore.addLikeSong(row.id)
  songListStore.getAllSongList(props.playlistId)
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.song-list-content {
  margin-top: 10px;
}
.iconfont {
  font-size: 20px;
}
</style>