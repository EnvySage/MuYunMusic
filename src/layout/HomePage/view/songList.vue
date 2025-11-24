<template>
    <div class="songListBox" v-if="!songListStore.loading" v-show="songListShow">
        <div class="header">
            <div class="imgBox">
                <img :src="currentSongList?.coverUrl || avatar" alt="">
            </div>
            <div class="headerInfo">
                <div class="titleBox">
                    <div class="title">{{ currentSongList?.name || "歌单名字" }}
                        <el-icon @click="handlePlaylistEdit()"><Edit /></el-icon>
                    </div>
                    <div class="subBox">
                        <div class="subImg">
                            <img :src="playlistUserData?.avatarUrl || avatar" alt="">
                        </div>
                        <div class="subText">{{ playlistUserData?.nickname || "未知用户" }} - {{ currentSongList?.createTime ||
                            "1145-14-13"}}</div>
                    </div>
                    <div class="desc">{{ currentSongList?.description || "null" }}</div>
                </div>
                <div class="functionBox">
                    <div class="playButton" @click="handlePlayAll()">播放全部</div>
                    <div v-if="!songListStore.loading && currentSongList && currentSongList.userId != userStore.user.id" class="collectButton" @click="handleCollect()">{{ isCollected?"取消收藏":"收藏" }}</div>
                    <div v-else class="deleteButton" @click="handleDelete()">删除歌单</div>
                </div>
            </div>
        </div>
        <div class="tab-container">
            <div class="tab-nav">
                <div v-for="tab in tabs" :key="tab.index" class="tab-item" :class="{ active: activeTab === tab.index }"
                    @click="handleTabSelect(tab.index)">
                    {{ tab.label }}
                    <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
                    <div class="tab-indicator" :class="{ active: activeTab === tab.index }"></div>
                </div>
            </div>
        </div>

        <!-- 对应的内容区域 -->
        <div class="tab-content">
            <div v-show="activeTab === '1'" class="tab-pane">
                <playlist-song :songs="songList" @row-click="handleRowClick" :playlistId="songListId"></playlist-song>
            </div>
            <div v-show="activeTab === '2'" class="tab-pane">
                <div class="comment-content">
                    <!-- 评论内容区域 -->
                    <playlist-comment :playlistId="songListId"></playlist-comment>
                </div>
            </div>
            <div v-show="activeTab === '3'" class="tab-pane">
                <div class="collector-content">
                    <playlist-collector :playlistId="songListId"></playlist-collector>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading">加载中...</div>
    <playlist-edit v-show="!songListShow"/>
</template>

<script setup>
import PlaylistSong from '@/components/playList/PlaylistSong.vue'
import PlaylistComment from '@/components/playList/PlaylistComment.vue'
import PlaylistCollector from '@/components/playList/PlaylistCollector.vue'
import PlaylistEdit from '@/components/PlaylistEdit.vue'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useSongListStore } from '@/stores/songList'
import { useSongMenuListStore } from '@/stores/songMenuList'
import { useRoute } from 'vue-router'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import request from '@/utils/http'
import avatar from '@/image/avatar.png'
import { usePlayerStore } from '@/stores/playerList'
import { useCommentStore } from '@/stores/commentStores'
import { useCollectorStore } from '@/stores/CollectorStore'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const router = useRouter()
const userStore = useUserStore()
const collectorStore = useCollectorStore()
const commentStore = useCommentStore()
const playerStore = usePlayerStore()
const route = useRoute()
const songListStore = useSongListStore()
const songMenuListStore = useSongMenuListStore()
const musicPlayerStore = useMusicPlayerStore()

const songListId = ref(String(route.params.id))
const playlistUserData = ref()
const isCollected = ref(false)


const songListShow = ref(true)
// 监听路由参数变化
watch(
  () => route.params.id,
  async (newId, oldId) => {
    console.log('路由ID变化:', oldId, '->', newId)
    if (newId && newId !== oldId) {
      songListId.value = String(newId)
      await loadData()
    }
  }
)

const loadData = async () => {
  try {
    console.log('开始加载数据，ID:', songListId.value);
    isCollected.value = false;
    
    // 标记开始加载
    songListStore.loading = true;

    // 1. 并行加载当前歌单的歌曲列表和歌单信息
    await songListStore.getAllSongList(songListId.value)
    
    // 2. 获取歌单创建者信息
    const currentSongList = songListStore.getCurrentSongList
    if (currentSongList?.userId) {
      const res = await request.get(`/playlist/getUserById/${currentSongList.userId}`)
      playlistUserData.value = res.data;
    }

    console.log('歌曲列表和用户数据加载完成==========',currentSongList);
    // 更新收藏状态
    isCollected.value = currentSongList?.isCollect || false;
    
  } catch (error) {
    console.error('数据加载失败:', error);
    // 可以设置一个错误状态，在界面显示错误信息
  } finally {
    songListStore.loading = false;
  }
}

// 初始化加载
onMounted(async () => {
    // 确保必要的数据已加载
    await loadData()
})

const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0:00'

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// tab 相关状态
const activeTab = ref('1')

// 从store中获取数据
const songList = computed(() => songListStore.getSongList)
const currentSongList = computed(() => songListStore.getCurrentSongList)

// tab 数据
const tabs = computed(() => [
    { index: '1', label: '歌曲', count: songList.value?.length || 0 },
    { index: '2', label: '评论', count: commentStore?.total||0 },
    { index: '3', label: '收藏者', count:  collectorStore?.collectorPlaylist.length || 0 }
])

// 处理 tab 选择
const handleTabSelect = (index) => {
    activeTab.value = index
}
const addSongList = () => {
    playerStore.addSong(songListStore.songList)
}
// 处理行点击
const handleRowClick = (row) => {
    const song = {
        title: row.name,
        artist: row.artistName,
        url: row.musicUrl,
        cover: row.coverUrl,
        id: row.id,
        like: row.like || false
    }
    const duration = row.duration
    musicPlayerStore.setCurrentSong(song)
    musicPlayerStore.setDuration(duration)
    musicPlayerStore.setLyricText(row.id)
    console.log('播放歌曲:', musicPlayerStore.currentSong)
    addSongList()
    setTimeout(() => {
        if (!musicPlayerStore.isPlaying) {
            musicPlayerStore.togglePlay()
        }
    }, 0)
}
const handlePlayAll = () => {
    console.log('播放全部')
    playerStore.addSong(songListStore.songList)
    musicPlayerStore.setCurrentSong(playerStore.createSongObject(songListStore.songList[0]))
    musicPlayerStore.setDuration(songListStore.songList[0].duration)
    musicPlayerStore.setLyricText(songListStore.songList[0].id)
    setTimeout(() => {
        musicPlayerStore.togglePlay()
    }, 100)
}

// 创建一个防抖定时器引用
const collectDebounceTimer = ref(null)

// 处理收藏 - 添加防抖功能
const handleCollect = () => {
    // 立即更新UI状态
    isCollected.value = !isCollected.value
    // 清除之前的定时器
    if (collectDebounceTimer.value) {
        clearTimeout(collectDebounceTimer.value)
    }
    
    // 设置新的定时器，延迟执行后端请求
    collectDebounceTimer.value = setTimeout(async () => {
        try {
            await collectorStore.addCollectorPlaylist(songListId.value)
            console.log('收藏成功', songListId.value)
            // 更新歌单列表
            await songMenuListStore.getAllCollectMenuList()
            await songMenuListStore.getAllSongMenuList()
        } catch (error) {
            // 如果请求失败，恢复原来的状态
            isCollected.value = !isCollected.value
            console.error('收藏操作失败:', error)
        }
    }, 2000) // 1秒防抖延迟，你可以根据需要调整时间
}
const handleDelete = async () => {
    try {
        await songListStore.deleteCurrentSongList(songListId.value)
        // 删除成功后，跳转到创建的歌单列表的第一个
        await songMenuListStore.getAllSongMenuList()
        if (songMenuListStore.songMenuList && songMenuListStore.songMenuList.length > 0) {
            router.push('/songList/' + songMenuListStore.songMenuList[0].id)
        } else {
            // 如果没有创建的歌单，则跳转到首页或其他默认页面
            router.push('/')
        }
    } catch (error) {
        console.error('删除歌单失败:', error)
    }
}
const handlePlaylistEdit = () => {
    songListShow.value = false
}
</script>

<style lang="scss" scoped>
.songListBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 40px 100px;
    background: linear-gradient(to bottom, rgba(224, 201, 201, 0.5) 1%, rgba(247, 249, 252, 0.5) 30%);
    gap: 30px;
    .header {
        width: 100%;
        display: flex;
        gap: 20px;

        .imgBox {
            width: 200px;
            height: 200px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 8px;
                object-fit: cover;
                object-position: center;
            }
        }

        .headerInfo {
            width: calc(100% - 220px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .titleBox {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .title {
                    font-weight: var(--font-weight-border);
                    font-size: var(--font-size-xl);
                    gap: 5px;
                    display: flex;
                    align-items: center;
                }

                .subBox {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .subImg {
                        width: 40px;
                        height: 40px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            object-fit: cover;
                            object-position: center;
                        }
                    }

                    .subText {
                        font-size: var(--font-size-md);
                        color: var(--text-color-light);
                    }
                }

                .desc {
                    font-size: var(--font-size-md);
                    color: var(--text-color-light);
                }

            }

            .functionBox {
                display: flex;
                gap: 10px;

                .playButton,
                .deleteButton,
                .collectButton {
                    padding: 20px;
                    height: 40px;
                    border-radius: var(--border-radius-sm);
                    background-color: var(--primary-color);
                    color: var(--text-color-white);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .collectButton, .deleteButton {
                    background-color: var(--button-color);
                    color: var(--text-color-white);
                }
            }
        }
    }

}

// 优化后的 tab 样式
.tab-container {
    .tab-nav {
        position: relative;
        display: flex;
        border-bottom: 1px solid var(--border-color);

        .tab-item {

            position: relative;
            padding: 12px 20px;
            cursor: pointer;
            color: var(--text-color-light);
            font-size: var(--font-size-md);
            transition: all 0.3s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                color: var(--text-color);
            }

            &.active {
                color: var(--primary-color);
                font-weight: var(--font-weight-bold);
            }

            .tab-count {
                font-size: var(--font-size-sm);
                color: var(--text-color-lighter);
                background-color: var(--background-color-sider);
                padding: 2px 6px;
                border-radius: 10px;
            }

            .tab-indicator.active {
                width: 30%;
                position: absolute;
                bottom: 0;
                left: 20%;
                height: 3px;
                background-color: var(--primary-color);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 3px 3px 0 0;
            }
        }

    }
}

.tab-content {
    padding-bottom: 110px;

    .tab-pane {
        height: 100%;

    }
}


// 响应式设计
@media (max-width: 768px) {
    .songListBox {
        padding: 10px;

        .header {
            flex-direction: column;

            .imgBox {
                width: 150px;
                height: 150px;
                margin: 0 auto;
            }

            .headerInfo {
                .functionBox {
                    justify-content: center;
                }
            }
        }

        .tab-container {
            .tab-nav {
                .tab-item {
                    padding: 10px 15px;
                    font-size: var(--font-size-sm);

                    .tab-count {
                        font-size: var(--font-size-xs);
                    }
                }
            }
        }
    }
}
</style>