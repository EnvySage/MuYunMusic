<template>
    <div class="search-container">
        <div class="tab-container">
            <div class="tab-item" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">综合</div>
            <div class="tab-item" :class="{ active: activeTab === 'song' }" @click="activeTab = 'song'">单曲</div>
            <div class="tab-item" :class="{ active: activeTab === 'playlist' }" @click="activeTab = 'playlist'">歌单</div>
            <div class="tab-item" :class="{ active: activeTab === 'artist' }" @click="activeTab = 'artist'">歌手</div>
        </div>
        <div class="integrate" v-if="(activeTab === 'all')">
            <div class="artistBox" v-if="artistList.length">
                <div class="artist-title">
                    <div class="info">歌手</div>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
                <div class="artist">
                    <artistCard v-for="item in artistList" :key="item.id" :avatarUrl="item.avatarUrl"
                        :artistName="item.name" />
                </div>
            </div>
            <div class="songBox" v-if="songList.length">
                <div class="song-title">
                    <div class="info">单曲</div>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
                <div class="song">
                    <songCard v-for="item in songList" :key="item.id" :song="item" />
                </div>
            </div>
            <div class="playlistBox" v-if="playlist.length">
                <div class="playlist-title">
                    <div class="info">歌单</div>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
                <div class="playlist">
                    <playlistCard v-for="item in playlist" :key="item.id" :bgImage="item.coverUrl"
                        :songTitle="item.name" :songArtist="item.username" :tracks="item.tracks"
                        @click="navigatoPlaylist(item.id)" />
                </div>
            </div>
        </div>
        <div v-else-if="activeTab === 'song' && songList.length" class="result-table">
            <el-table :data="songList" style="width: 100%" @row-click="handlePlaySong">
                <el-table-column type="index" width="50" label="#" />
                <el-table-column prop="name" label="标题" width="750">
                    <template #default="{ row }">
                        <div class="table-item">
                            <img :src="row.coverUrl" alt="歌曲封面" class="cover-img">
                            <span class="title">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="album" label="专辑" width="550">
                    <template #default="{ row }">
                        {{ row?.album || '无专辑' }}
                    </template>
                </el-table-column>
                <el-table-column prop="playCount" label="播放量" width="120">
                    <template #default="{ row }">
                        {{ row.playCount || '1145' }}万
                    </template>
                </el-table-column>
                <el-table-column prop="like" label="喜欢" width="150">
                    <template #default="{ row }">
                        <div class="likeBox" @click.stop="handleLike(row)">
                            <div class="iconfont" :class="row.like ? 'icon-xihuan' : 'icon-dianzan-xiankuang'"
                                style="font-size: 20px; cursor: pointer;"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="收藏" width="60" align="center">
                    <template #default="{ row }">
                        <div class="collect-cell" @click.stop="handleCollect(row)">
                            <div class="iconfont icon-shoucang1" style="font-size: 20px; cursor: pointer;"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="duration" label="时长" width="80" align="center">
                    <template #default="{ row }">
                        <div class="duration-cell">
                            {{ formatDuration(row.duration) }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else-if="activeTab === 'playlist' && playlist.length" class="result-table">
            <el-table :data="playlist" style="width: 100%" @row-click="navigatoPlaylist" align="center">
                <el-table-column type="index" width="50" label="#" />
                <el-table-column prop="name" label="标题" width="700">
                    <template #default="{ row }">
                        <div class="table-item">
                            <img :src="row.coverUrl" alt="封面" class="cover-img">
                            <span class="title">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" width="550">
                    <template #default="{ row }">
                        {{ row.description || '无描述' }}
                    </template>
                </el-table-column>
                <el-table-column prop="tracks" label="歌曲数" width="120">
                    <template #default="{ row }">
                        {{ row.songCount }}首
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="创建者" width="200" />
                <el-table-column prop="playCount" label="播放量" width="120">
                    <template #default="{ row }">
                        {{ row.playCount || '0' }}万
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else-if="activeTab === 'artist' && artistList.length" class="result-table">
            <el-table :data="artistList" style="width: 100%" align="center">
                <el-table-column type="index" width="50" label="#" />
                <el-table-column prop="name" label="标题" width="1300">
                    <template #default="{ row }">
                        <div class="table-item">
                            <img :src="row.avatarUrl" alt="头像" class="cover-img">
                            <span class="title">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="followCount" label="粉丝数" width="200">
                    <template #default="{ row }">
                        {{ row.followCount || '325' }}万
                    </template>
                </el-table-column>
                <el-table-column prop="playCount" label="播放量" width="200">
                    <template #default="{ row }">
                        {{ row.playCount || '1145' }}万
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="noResult" v-else>没有找到结果</div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight, Search, Close } from '@element-plus/icons-vue'
import artistCard from "@/components/search/artistCard.vue";
import songCard from "@/components/search/songCard.vue";
import playlistCard from "@/components/search/playlistCard.vue";
import { useSearchResultStore } from "@/stores/searchResultStore.js";
import { useMusicPlayerStore } from "@/stores/musicPlayer";
import { useComponentStatusStore } from "@/stores/componentStatus";
import { useSongListStore } from "@/stores/songList";
import { useCollectorStore } from "@/stores/CollectorStore";
const collectorStore = useCollectorStore();
const songListStore = useSongListStore();
const componentStatusStore = useComponentStatusStore();
const musicPlayerStore = useMusicPlayerStore();
const searchStore = useSearchResultStore();
const route = useRoute();
const router = useRouter();
const searchValue = ref(route.query.keyword || "");
const artistList = computed(() => searchStore.searchArtists);
const songList = computed(() => searchStore.searchSongs);
const playlist = computed(() => searchStore.searchPlaylists);

watch(() => route.query.keyword, (newValue) => {
    searchValue.value = newValue;
    searchStore.getSearchResult(newValue);
});
onMounted(() => {
    searchStore.getSearchResult(searchValue.value);
});
const activeTab = ref('all');
const navigatoPlaylist = (row) => {
    let id = row.id;
    if (row.id !== undefined && row.id !== null){
        id = row.id;
    }else{
        id = row
    }
    if (id !== undefined && id !== null) {
        console.log('跳转到歌单ID:', id);
        router.push({
            name: 'songList',
            params: {
                id: id,
            },
        });
    }
}
const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0:00'

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
const handlePlaySong = (row) => {
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
    setTimeout(() => {
        if (!musicPlayerStore.isPlaying) {
            musicPlayerStore.togglePlay()
        }
    }, 100)
}
// 判断是否为当前播放的歌曲
const isCurrentSong = (row) => {
    return musicPlayerStore.currentSong.id === row.id
}

// 处理喜欢/取消喜欢
const handleLike = async (row) => {
    await collectorStore.addLikeSong(row.id)
    await searchStore.getSearchResult(route.query.keyword);
    // 同步更新当前播放歌曲的收藏状态
    if (musicPlayerStore.currentSong.id === row.id) {
        musicPlayerStore.setCurrentSongLike(!row.like)
    }
}
// 处理收藏
const handleCollect = (song) => {
    collectorStore.currentSong.push(song);

    if (!componentStatusStore.CollectComponent) {
        componentStatusStore.showCollectComponent();
    } else {
        componentStatusStore.hideCollectComponent();
    }
}
</script>

<style lang="scss" scoped>
.search-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 50px;
    background: linear-gradient(to bottom, rgba(224, 201, 201, 0.5) 0%, rgba(247, 249, 252, 0.5) 50%);
    min-height: calc(100vh - 200px);
}

.tab-container {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 24px;

    .tab-item {
        padding: 8px 0;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);

        &.active {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
        }
    }
}

.icon-xihuan {
    color: red !important;
}

.searchValue {
    font-size: 30px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 24px;
}

.artistBox,
.songBox,
.playlistBox {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.artist-title,
.song-title,
.playlist-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
}

.info {
    font-weight: 500;
}

.artist {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    max-height: 100px;
    overflow: hidden;

    // 只显示前两个歌手
    >* {
        &:nth-child(n+3) {
            display: none;
        }
    }
}

.song {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    max-height: 300px;
    overflow: hidden;

    // 最多显示三行
    >* {
        &:nth-child(n+7) {
            display: none;
        }
    }
}

.playlist {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    width: 100%;
    max-height: 500px;
    overflow: hidden;

    // 最多显示一排五个
    >* {
        &:nth-child(n+6) {
            display: none;
        }
    }
}

@media (min-width: 1200px) {
    .artist {
        grid-template-columns: repeat(2, 1fr);
    }

    .song {
        grid-template-columns: repeat(2, 1fr);
        /* 保持两列 */
    }

    .playlist {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (min-width: 1600px) {
    .artist {
        grid-template-columns: repeat(2, 1fr);
    }

    .song {
        grid-template-columns: repeat(2, 1fr);
        /* 保持两列 */
    }

    .playlist {
        grid-template-columns: repeat(5, 1fr);
    }
}

.result-table {
    .el-table {
        .table-item {
            display: flex;
            align-items: center;
            gap: 12px;

            .cover-img {
                width: 80px;
                height: 80px;
                border-radius: 4px;
                object-fit: cover;
            }

            .title {
                font-size: 14px;
                color: var(--text-color);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 400px;
            }
        }

        th {
            background-color: var(--bg-color-light);
            font-weight: 500;
            color: var(--text-color-secondary);
        }

        td {
            padding: 12px 0;
        }

        .cell {
            font-size: 14px;
            color: var(--text-color);
        }
    }
}
</style>
