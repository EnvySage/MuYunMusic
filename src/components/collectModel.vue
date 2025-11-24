<template>
  <el-dialog v-model="dialogVisible" title="收藏到歌单" width="500px" :close-on-click-modal="true" :show-close="true"
    @close="handleClose" class="collect-dialog">
    <div class="dialog-content">
      <div class="sort-tabs">
        <span class="tab-item" :class="{ active: sortType === 'default' }" @click="sortType = 'default'">
          默认排序
        </span>
        <span class="tab-item" :class="{ active: sortType === 'popular' }" @click="sortType = 'popular'">
          常用优先
        </span>
      </div>

      <div class="playlist-list">
        <div class="create-playlist" @click="handleCreatePlaylist">
          <div class="icon-wrapper">
            <el-icon>
              <Plus />
            </el-icon>
          </div>
          <div class="text">创建新歌单</div>
        </div>

        <div v-for="(playlist, index) in playlists" :key="index" class="playlist-item"
          @click="handleSelectPlaylist(playlist)">
          <div class="cover">
            <img :src="playlist.coverUrl" alt="封面" />
          </div>
          <div class="info">
            <div class="title">{{ playlist.name }}</div>
            <div class="count">{{ playlist.songCount }}首</div>
          </div>
        </div>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useComponentStatusStore } from '@/stores/componentStatus';
import { useSongMenuListStore } from '@/stores/songMenuList';
import { useCollectorStore } from '@/stores/CollectorStore';
const songMenuListStore = useSongMenuListStore();
const collectorStore = useCollectorStore();
// 获取组件状态管理实例
const componentStatusStore = useComponentStatusStore();

const dialogVisible = computed({
  get: () => componentStatusStore.CollectComponent,
  set: (value) => {
    if (value) {
      componentStatusStore.showCollectComponent();
    } else {
      componentStatusStore.hideCollectComponent();
    }
  }
});

// 排序类型
const sortType = ref('default');

// 歌单列表数据
const playlists = computed(() => {
  let list = songMenuListStore.songMenuList;
  if (sortType.value === 'popular') {
    // 假设有一个字段表示使用频率，这里用 songCount 代替
    return [...list].sort((a, b) => b.songCount - a.songCount);
  }
  return list;
});


// 关闭模态框的方法
const handleClose = () => {
  componentStatusStore.hideCollectComponent();
};

// 创建新歌单
const handleCreatePlaylist = () => {
  componentStatusStore.showCreatePlaylistComponent();
  // 关闭当前收藏模态框
  componentStatusStore.hideCollectComponent();
};
const createIdList = (playlistId) => {
  return collectorStore.currentSong.map(song => ({ playlistId: playlistId, songId: song.id }));
}
// 选择歌单
const handleSelectPlaylist = async (playlist) => {
  const IdList = createIdList(playlist.id);

  try {
    const res = await collectorStore.addSongToCollectorPlaylist(IdList);
    collectorStore.currentSong = [];
    if (res.success) {
      ElMessage.success(`已将歌曲收藏到歌单：${playlist.name}`);
    } else {
      ElMessage.error(`${res.msg}`);
    }
  } catch (error) {
    ElMessage.error('收藏失败');
  }

  // 关闭模态框
  componentStatusStore.hideCollectComponent();
};
</script>

<style lang="scss" scoped>
.collect-dialog {
  .dialog-content {
    max-height: 800px;
    overflow-y: auto;

    .sort-tabs {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      .tab-item {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #666;

        &.active {
          background-color: #f5f5f5;
          color: #333;
          font-weight: bold;
        }
      }
    }


    .playlist-list {
      .create-playlist {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: 1px dashed #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background-color: #f5f5f5;
        }

        .icon-wrapper {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          color: #666;

          svg {
            width: 18px;
            height: 18px;
          }
        }

        .text {
          font-size: 14px;
          color: #333;
        }
      }

      .playlist-item {
        display: flex;
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background-color: #f5f5f5;
        }

        .cover {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 12px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .info {
          flex: 1;

          .title {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }

          .count {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }

}
</style>