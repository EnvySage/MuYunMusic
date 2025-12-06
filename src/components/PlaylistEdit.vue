<template>
  <div class="playlist-edit-container">
    <h2 class="title">编辑歌单信息</h2>
    
    <el-form 
      :model="playlist" 
      label-position="left" 
      label-width="80px"
      class="form-content"
    >
    <div class="input-group">
        
        <el-form-item 
          label="名称：" 
          prop="name"
          :rules="[{ required: true, message: '请输入歌单名称', trigger: 'blur' }]"
        >
          <el-input 
            v-model="playlist.name" 
            placeholder="请输入歌单名称"
            maxlength="40"
            show-word-limit
            class="input-field"
          />
        </el-form-item>
        
        <!-- 简介输入 -->
        <el-form-item 
          label="简介：" 
          prop="description"
        >
          <el-input 
            v-model="playlist.description" 
            type="textarea"
            :rows="5"
            placeholder="请输入歌单简介"
            maxlength="1000"
            show-word-limit
            class="textarea-field"
          />
        </el-form-item>
        <!-- 隐私歌单 -->
         <el-form-item 
          label="隐私：" 
          prop="isPrivate"
        >
          <el-switch v-model="playlist.isPrivate" />
        </el-form-item>
    </div>
      
      <!-- 封面图片 -->
      <el-form-item 
        label="封面："
        prop="coverUrl"
      >
        <div class="cover-section">
          <img 
            :src="playlist.coverUrl" 
            alt="歌单封面" 
            class="cover-image"
          >
          <div class="upload-btn">
            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              @change="handleCoverChange"
              :limit="1"
              class="upload-demo"
            >
              <el-button size="small" type="primary">更换封面</el-button>
            </el-upload>
          </div>
        </div>
      </el-form-item>
      
      <!-- 按钮组 -->
      <el-form-item>
        <el-button 
          type="primary" 
          class="save-btn"
          @click="handleSave"
        >
          保存
        </el-button>
        <el-button 
          class="cancel-btn"
          @click="handlePlaylistEdit"
        >
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive,watch } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { useSongListStore } from '@/stores/songList'
import { useSongMenuListStore } from '@/stores/songMenuList'
const songMenuListStore = useSongMenuListStore()
const songListStore = useSongListStore()

// 歌单数据
const playlist = reactive({
  id: songListStore.currentSongList?.id || null,
  name: songListStore.currentSongList?.name || '',
  description: songListStore.currentSongList?.description || '',
  coverUrl: songListStore.currentSongList?.coverUrl || '',
  isPrivate: songListStore.currentSongList?.isPrivate || false
})

watch(
  () => songListStore.currentSongList,
  (newSongList) => {
    if (newSongList) {
      playlist.id = newSongList.id || null
      playlist.name = newSongList.name || ''
      playlist.description = newSongList.description || ''
      playlist.coverUrl = newSongList.coverUrl || ''
      playlist.isPrivate = newSongList.isPrivate || false
    }
  },
  { immediate: true }
)
// 处理封面图片上传
const handleCoverChange = (file) => {
  if (file.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      playlist.coverUrl = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
}

// 保存处理
const handleSave = async() => {
  try{
    let cover = playlist.coverUrl
    const coverData = ref({
      "fileSource": cover,
      "dirName": "upload/playlist_cover",
      "fileNamePrefix" : "coverImage"
    })
    if(cover.startsWith('data:')){
      cover = await songListStore.uploadCoverImage(coverData.value)
      playlist.coverUrl = cover
      await songListStore.updatePlaylist(playlist)
      await songMenuListStore.refreshAllSongMenuList()
    }
  }catch(error){
    console.error('上传封面失败:', error);
    throw error;
  }
  ElMessage.success('歌单信息已保存')
}
const emit = defineEmits(['cancel-edit'])
// 取消处理
const handlePlaylistEdit = () => {
  playlist.value={}
  emit('cancel-edit')
}
</script>

<style lang="scss" scoped>
.playlist-edit-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 50px;
   background: linear-gradient(to bottom, rgba(224, 201, 201, 0.5) 1%, rgba(247, 249, 252, 0.5) 20%);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  
  .input-group {
    width: 50%;
  }
  .title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-color);
    margin-bottom: 30px;
  }
  
  .form-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .cover-section {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .cover-image {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
    }
    
    .upload-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: var(--transition-all);
      
      &:hover {
        border-color: var(--primary-color);
        background-color: rgba(var(--primary-rgb), 0.05);
      }
    }
  }
  
  .button-group {
    display: flex;
    gap: 16px;
    margin-top: 30px;
    
    .save-btn {
      padding: 12px 24px;
      font-size: var(--font-size-base);
      border-radius: var(--border-radius-md);
      background-color: var(--primary-color);
      color: var(--text-color-white);
      border: none;
      transition: var(--transition-all);
      
      &:hover {
        background-color: var(--primary-color-hover);
      }
    }
    
    .cancel-btn {
      padding: 12px 24px;
      font-size: var(--font-size-base);
      border-radius: var(--border-radius-md);
      background-color: transparent;
      color: var(--text-color);
      border: 1px solid var(--border-color-light);
      transition: var(--transition-all);
      
      &:hover {
        background-color: var(--background-color-secondary);
      }
    }
  }
}
</style>