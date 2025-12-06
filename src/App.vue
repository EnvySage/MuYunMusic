<script setup>
import { onMounted,ref } from 'vue';
import request from './utils/http';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user'
import { useSongMenuListStore } from './stores/songMenuList';
import { useSongListStore } from './stores/songList';
import { useAdminPlaylistStore } from './stores/AdminPlaylist';
import { useThemeStore } from '@/stores/theme';

const adminPlaylistStore = useAdminPlaylistStore()
const songListStore = useSongListStore()
const userStore = useUserStore()
const songMenuListStore = useSongMenuListStore()
const themeStore = useThemeStore()
const initializing = ref(true)

onMounted(async()=>{
  // 初始化主题
  themeStore.initTheme()
  await verifytoken()
  await initList()
   initializing.value = false
})
const verifytoken = async()=>{
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('未找到token')
    ElMessage.error('请先登录')
    return
  }
  
  try {
    const res = await request.post('/user/token',{},{params:{token}})
    console.log('token验证结果:', res)
    console.log('token验证成功')
    userStore.setUser({
      id: res.data.id,
      username: res.data.username,
      nickname: res.data.nickname,
      avatarUrl: res.data.avatarUrl,
      token: res.data.token,
      favoritePlaylistId: res.data.favoritePlaylistId
    })
  } catch (error) {
    console.log('token验证失败', error)
    ElMessage.error('请重新登录')
    // 可能需要清除本地存储的token
    localStorage.removeItem('token')
  }
}
const initList = async()=>{ 
  console.log('开始初始化数据...')
  try {
    console.log('开始获取歌单列表...')
    await songMenuListStore.getAllSongMenuList()
    console.log('歌单列表获取完成')
    
    console.log('开始获取收藏列表...')
    await songMenuListStore.getAllCollectMenuList()
    console.log('收藏列表获取完成')
    
    console.log('开始获取管理员播放列表1...')
    await adminPlaylistStore.getAdminPlaylistF(1)
    console.log('管理员播放列表1获取完成')
    
    console.log('开始获取管理员播放列表2...')
    await adminPlaylistStore.getAdminPlaylistF(2)
    console.log('管理员播放列表2获取完成')
    
    console.log('所有数据初始化完成')
  } catch (error) {
    console.error('初始化过程中发生错误:', error)
  } finally {
    initializing.value = false
  }
}
</script>

<template>
  <div class="app">
    <!-- 添加加载状态显示 -->
    <div v-if="initializing" class="loading-container">
      <div class="loading-spinner">加载中...</div>
    </div>
    <!-- 初始化完成后渲染主内容 -->
    <div v-else class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.app{
  height: 100vh;
  overflow: hidden;
}
</style>
