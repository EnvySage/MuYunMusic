<script setup>
import { onMounted } from 'vue';
import request from './utils/http';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user'
import { useSongMenuListStore } from './stores/songMenuList';
import { useSongListStore } from './stores/songList';
const songListStore = useSongListStore()
const userStore = useUserStore()
const songMenuListStore = useSongMenuListStore()
onMounted(async()=>{
  await verifytoken()
  await initSongMenuList()
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
      token: res.data.token
    })
  } catch (error) {
    console.log('token验证失败', error)
    ElMessage.error('请重新登录')
    // 可能需要清除本地存储的token
    localStorage.removeItem('token')
  }
}
const initSongMenuList = async()=>{ 
  await songMenuListStore.getAllSongMenuList()
  await songMenuListStore.getAllCollectMenuList()

}
</script>

<template>
  <div class="app">

    <router-view></router-view>
  </div>
</template>

<style scoped>
.app{
  height: 100vh;
  overflow: hidden;
}
</style>
