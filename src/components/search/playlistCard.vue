
<template>
    <div class="playlist-card">
        <div class="cover-container">
            <img :src="bgImage" alt="歌单封面" class="cover">
            <div class="play-count">
                <div class="play-button" @click="handlePlay">
                    <div class="iconfont icon-bofang1"></div>
                </div>
                {{ playCount }}
            </div>
            
            <!-- 遮罩层 -->
            <div class="overlay" @click="handlePlay">
                <div class="play-icon">
                    <div class="iconfont icon-bofang1"></div>
                </div>
            </div>
        </div>

        <div class="info-container">
            <div class="title" v-if="songTitle">{{ songTitle }}</div>
            <div class="artist" v-if="songArtist">{{ songArtist }}</div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    bgImage: {
        type: String,
        required: true
    },
    songTitle: {
        type: String,
        required: false
    },
    songArtist: {
        type: String,
        required: false
    },
    playCount: {
        type: String,
        default: '114'
    }
})

const handlePlay = () => {
    // 这里可以添加播放逻辑
    console.log('播放歌单:', props.songTitle)
}
</script>

<style lang="scss" scoped>
.playlist-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;

    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
}

.cover-container {
    position: relative;
    width: 100%;
    max-height: 300px;
    border-radius: 8px;
    overflow: hidden;
}

.cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-count {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 遮罩层样式 */
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    border-radius: 8px;
    
    .play-icon {
        margin: 20px;
        width: 50px;
        height: 50px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 20px;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
    }
}

/* 悬停状态下的遮罩层 */
.playlist-card:hover .overlay {
    opacity: 1;
}

.info-container {
    padding-left: 8px;
    background-color: #f7f9fc;
    border-radius: 0 0 8px 8px;
}

.title {
    font-size: 20px;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 4px;
    line-height: 1.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artist {
    font-size: 14px;
    color: var(--text-color-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>