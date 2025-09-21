<template>
    <div class="songListBox">
        <div class="header">
            <div class="imgBox">
                <img :src="playListData.coverUrl" alt="">
            </div>
            <div class="headerInfo">
                <div class="titleBox">
                    <div class="title">{{ playListData.name }}</div>
                    <div class="subBox">
                        <div class="subImg">
                            <img :src="songList.authorAvatar" alt="">
                        </div>
                        <div class="subText">{{ songList.author }} - {{ songList.date }}</div>
                    </div>
                    <div class="desc">{{ songList.description }}</div>
                </div>
                <div class="functionBox">
                    <div class="playButton">播放全部</div>
                    <div class="downloadButton">下载</div>
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
                <div class="song-list-content">
                    <el-table :data="songList" style="width: 100%"
                        :default-sort="{ prop: 'id', order: 'ascending' }" highlight-current-row
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
                                        <img :src="scope.row.icon" alt="专辑封面" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
                                    </div>
                                    <div class="song-details">
                                        <div class="song-title" style="font-weight: bolder; font-size: large;">{{ scope.row.name }}</div>
                                        <div class="song-meta">
                                            <span class="singer">{{ scope.row.artistId }}</span>
                                            <span class="album">{{ scope.row.musicUrl }}</span>
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
                                    <div class="iconfont icon-heart" :class="{ 'active': scope.row.isLiked }"
                                        @click.stop="handleLike(scope.row)"></div>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- 时长列 -->
                        <el-table-column prop="duration" label="时长" width="80" align="center">
                            <template #default="scope">
                                <div class="duration-cell">
                                    {{ scope.row.duration }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-show="activeTab === '2'" class="tab-pane">
                <div class="comment-content">
                    <!-- 评论内容区域 -->
                    <p>评论内容区域</p>
                </div>
            </div>
            <div v-show="activeTab === '3'" class="tab-pane">
                <div class="collector-content">
                    <!-- 收藏者内容区域 -->
                    <p>收藏者内容区域</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSongListStore } from '@/stores/songList'
import { useSongMenuListStore } from '@/stores/songMenuList'
import { useRoute } from 'vue-router'

const route = useRoute()
const songListStore = useSongListStore()
const songMenuListStore = useSongMenuListStore()
const songMenuList = computed(() => songMenuListStore.songMenuList)
const collectMenuList = computed(() => songMenuListStore.collectMenuList)

const totalList = computed(() => [...collectMenuList.value, ...songMenuList.value])
const totalListLength = computed(() => totalList.value.length)

const songListId = route.params.id
console.log('歌单ID:', songListId)
const playListData = computed(() => totalList.value.find(item => item.id === songListId))
console.log('歌单数据:', playListData.value)

const songList = ref([])
onMounted(async() => {
    await songListStore.getAllSongList(songListId)
    songList.value = songListStore.songList
    console.log('歌单列表:', songList.value)
})

// tab 相关状态
const activeTab = ref('1')

// tab 数据
const tabs = ref([
    { index: '1', label: '歌曲', count: 50 },
    { index: '2', label: '评论', count: 128 },
    { index: '3', label: '收藏者', count: 256 }
])


// 处理 tab 选择
const handleTabSelect = (index) => {
    activeTab.value = index
}

// 处理行点击
const handleRowClick = (row) => {
  console.log('点击歌曲:', row)
  // 这里可以添加播放逻辑
}

// 处理喜欢/取消喜欢
const handleLike = (row) => {
  row.isLiked = !row.isLiked
  console.log('喜欢状态:', row.isLiked)
}
</script>

<style lang="scss" scoped>
.songListBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 20px 20px;

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
                .downloadButton {
                    padding: 20px;
                    height: 40px;
                    border-radius: var(--border-radius-sm);
                    background-color: var(--primary-color);
                    color: var(--text-color-white);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .downloadButton {
                    background-color: var(--button-color);
                    color: var(--text-color-white);
                }
            }
        }
    }

}

// 优化后的 tab 样式
.tab-container {
    margin: 10px 0 0 0;

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