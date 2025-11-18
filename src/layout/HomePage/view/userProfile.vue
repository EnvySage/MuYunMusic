<template>
  <div class="user-profile-container">
    <!-- 用户信息卡片 -->
    <UserInfoCard
      :avatar-url="userInfo.avatarUrl"
      :username="userInfo.username"
      :bio="userInfo.bio"
      :location="userInfo.location"
      :social-accounts="userInfo.socialAccounts"
    />

    <!-- 导航栏 -->
    <UserNavBar :current-tab="currentTab" :nav-items="navItems" @tab-change="handleTabChange" />

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 歌单标签页 -->
      <div v-show="currentTab === 'playlist'" class="playlist-section">
        <div class="section-header">
          <h3 class="section-title">我创建的歌单</h3>
          <div class="view-controls">
            <span class="view-icon" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" title="网格视图">☰</span>
            <span class="view-icon" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="列表视图">☷</span>
          </div>
        </div>
        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="playlist-list-container">
          <div class="playlist-list-header">
            <div class="header-number">#</div>
            <div class="header-cover"></div>
            <div class="header-title">标题</div>
            <div class="header-song-count">歌曲数</div>
            <div class="header-creator">创建者</div>
          </div>
          <div class="playlist-list-body">
            <UserPlaylistListItem
              v-for="(playlist, index) in playlists"
              :key="index"
              :index="index"
              :cover-url="playlist.coverUrl"
              :title="playlist.name"
              :creator="userInfo.nickname"
              @click="handlePlaylistClick(playlist)"
            />
          </div>
        </div>
        <!-- 网格视图 -->
        <div v-else class="playlist-grid">
          <UserPlaylistCard
            v-for="(playlist, index) in playlists"
            :key="index"
            :cover-url="playlist.coverUrl"
            :title="playlist.name"
            :song-count="playlist.songCount"
            :play-count="playlist.playCount"
            @click="handlePlaylistClick(playlist)"
            @play="handlePlaylistPlay(playlist)"
          />
        </div>
      </div>

      <!-- 笔记标签页 -->
      <div v-show="currentTab === 'notes'" class="notes-section">
        <div class="empty-state">
          <p>暂无笔记内容</p>
        </div>
      </div>

      <!-- 播客标签页 -->
      <div v-show="currentTab === 'podcast'" class="podcast-section">
        <div class="empty-state">
          <p>暂无播客内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted,computed} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import UserInfoCard from '@/components/user/UserInfoCard.vue'
import UserNavBar from '@/components/user/UserNavBar.vue'
import UserPlaylistCard from '@/components/user/UserPlaylistCard.vue'
import UserPlaylistListItem from '@/components/user/UserPlaylistListItem.vue'
import useUserProfileStore from '@/stores/UserProfileStore'
const route = useRoute()
const router = useRouter()
const userProfileStore = useUserProfileStore()
const currentTab = ref('playlist')
const viewMode = ref('list')

const navItems = ref([
  { key: 'playlist', label: '歌单', count: userProfileStore.songList.length },
  { key: 'notes', label: '笔记', count: 6 },
  { key: 'podcast', label: '播客', count: 13 }
])
onMounted(async() => {
  await userProfileStore.getUserById(route.params.id)
  await userProfileStore.getUserPlaylists(route.params.id)
})

const userInfo = reactive({
 avatarUrl: computed(() => userProfileStore.userInfo?.avatarUrl || 'https://via.placeholder.com/120x120?text=Avatar'),
  username: computed(() => userProfileStore.userInfo?.nickname || '未知用户'),
  bio: computed(() => userProfileStore.userInfo?.sign || '这个人很懒,什么都没留下。'),
  // vipLevel: 'VIP-绿',
  // level: 9,
  // gender: 'male',
  // following: 37,
  // followers: 11,
  location: '广东省深圳市',
  // socialAccounts: [
  //   { icon: 'iconfont icon-weibo', url: '', name: '微博' }
  // ]
})

// 模拟歌单数据
const playlists = computed(() => userProfileStore.songList)

const handleTabChange = (tab) => {
  currentTab.value = tab
}

const handlePlaylistClick = (playlist) => {
  console.log('点击歌单:', playlist)
  router.push({ name: 'songList', params: { id: playlist.id } })
}

const handlePlaylistPlay = (playlist) => {
  console.log('播放歌单:', playlist)
  // 可以添加播放逻辑
}
</script>

<style lang="scss" scoped>
.user-profile-container {
  width: 100%;
  background-color: var(--background-color);
  padding: calc(var(--spacing-xl) + 18px);
  padding-bottom: 120px;
  height: 100%;
}

.content-area {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  margin: 0;
}

.view-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.view-icon {
  font-size: var(--icon-size-lg);
  color: var(--text-color-light);
  cursor: pointer;
  transition: var(--transition-all);
  padding: var(--spacing-xs);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  user-select: none;

  &:hover {
    color: var(--primary-color);
    background-color: var(--background-color-secondary);
  }

  &.active {
    color: var(--primary-color);
    background-color: var(--background-color-secondary);
  }
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-xl);
  width: 100%;


  @media (min-width: 1600px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (min-width: 1200px) and (max-width: 1599px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 900px) and (max-width: 1199px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 600px) and (max-width: 899px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 599px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

.playlist-list-container {
  background-color: var(--background-color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.playlist-list-header {
  display: grid;
  grid-template-columns: 50px 50px 1fr 150px 120px;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md) var(--spacing-sm);
  background-color: var(--background-color-secondary);
  border-bottom: 1px solid var(--border-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.header-number,
.header-cover,
.header-title,
.header-song-count,
.header-creator {
  text-align: left;
}

.header-number {
  text-align: center;
}

.playlist-list-body {
  max-height: 600px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: var(--text-color-light);
  font-size: var(--font-size-md);
}

.notes-section,
.podcast-section {
  width: 100%;
}
</style>

