<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建歌单"
    width="500px"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose"
    class="create-playlist-dialog"
  >
    <div class="dialog-content">
      <div class="input-group">
        <el-input
          v-model="playlistName"
          placeholder="输入歌单标题"
          maxlength="40"
          show-word-limit
          clearable
        />
      </div>
      
      <div class="checkbox-group">
        <el-checkbox v-model="isPrivate">设为隐私歌单</el-checkbox>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useComponentStatusStore } from '@/stores/componentStatus';
import { useSongListStore } from '@/stores/songList';
const songListStore = useSongListStore();
const componentStatusStore = useComponentStatusStore();
// 模态框显示状态
const dialogVisible = computed({
  get: () => componentStatusStore.CreatePlaylistComponent,
  set: (value) => {
    if (!value) {
      componentStatusStore.hideCreatePlaylistComponent();
    }else{
      componentStatusStore.showCreatePlaylistComponent();
    }
  }
}); 

// 歌单名称
const playlistName = ref('');

// 是否为私密歌单
const isPrivate = ref(false);

// 关闭模态框的方法
const handleClose = () => {
  // 清理表单数据
  playlistName.value = '';
  isPrivate.value = false;
};

// 创建歌单
const handleCreate = async() => {
  if (!playlistName.value.trim()) {
    ElMessage.warning('请输入歌单标题');
    return;
  }
  await songListStore.createPlaylist({
    name: playlistName.value,
    isPublic: isPrivate.value ? 0 : 1,
  });
  // 这里可以添加实际的创建歌单逻辑
  ElMessage.success(`已创建歌单：${playlistName.value}`);
  
  // 关闭模态框
  dialogVisible.value = false;
};

</script>

<style lang="scss" scoped>
.create-playlist-dialog {
  .dialog-content {
    max-height: 300px;
    overflow-y: auto;
    
    .input-group {
      margin-bottom: 20px;
      
      :deep(.el-input) {
        width: 100%;
      }
    }
    
    .checkbox-group {
      margin-bottom: 20px;
      
      :deep(.el-checkbox) {
        font-size: 14px;
      }
    }
  }
  
  .dialog-footer {
    text-align: right;
  }
}
</style>