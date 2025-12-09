<template>
    <div class="search-container" >
        <h2 class="searchValue">{{ searchValue }}</h2>
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
        <div class="songBox" v-else-if="songList.length">
            <div class="song-title">
                <div class="info">单曲</div>
                <el-icon>
                    <ArrowRight />
                </el-icon>
            </div>
            <div class="song">
                <songCard v-for="item in songList" :key="item.id" :coverUrl="item.coverUrl"
                    :songTitle="item.name" :artistName="item.artistName" :isVip="item.isVip"
                    :hasMv="item.hasMv" :isOriginal="item.isOriginal" />
                    
            </div>
        </div>
        <div class="playlistBox" v-else-if="playlist.length">
            <div class="playlist-title">
                <div class="info">歌单</div>
                <el-icon>
                    <ArrowRight />
                </el-icon>
            </div>
            <div class="playlist">
                <playlistCard v-for="item in playlist" :key="item.id" 
                    :bgImage="item.coverUrl" :songTitle="item.name" :songArtist="item.username"
                    :tracks="item.tracks" />
                    
            </div>
        </div>
        <div class="noResult" v-else>没有找到结果</div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight, Search, Close } from '@element-plus/icons-vue'
import artistCard from "@/components/search/artistCard.vue";
import songCard from "@/components/search/songCard.vue";
import playlistCard from "@/components/search/playlistCard.vue";
import { useSearchResultStore } from "@/stores/searchResultStore.js";
const searchStore = useSearchResultStore();
const route = useRoute();
const searchValue = ref(route.query.keyword || "");
const artistList = computed(() => searchStore.searchArtists);
const songList = computed(() => searchStore.searchSongs);
const playlist = computed(() => searchStore.searchPlaylists);
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

.searchValue {
    font-size: 30px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 24px;
}

.artistBox, .songBox, .playlistBox {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.artist-title, .song-title, .playlist-title {
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
    grid-template-columns: repeat(2,1fr);
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
        grid-template-columns: repeat(2, 1fr); /* 保持两列 */
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
        grid-template-columns: repeat(2, 1fr); /* 保持两列 */
    }
    
    .playlist {
        grid-template-columns: repeat(5, 1fr);
    }
}
</style>
