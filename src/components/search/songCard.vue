<template>
    <div class="song-card">
        <div class="cover-container">
            <img :src="coverUrl" alt="歌曲封面" class="cover">
        </div>
        
        <div class="info-container">
            <div class="song-title">
                {{ songTitle }}
            </div>
            
            <div class="artist-info">
                <span class="artist-name">{{ artistName }}</span>
                <span v-if="isVip" class="vip-badge">VIP</span>
                <span v-if="hasMv" class="mv-badge">MV</span>
                <span v-if="isOriginal" class="original-badge">原唱</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    coverUrl: {
        type: String,
        required: true
    },
    songTitle: {
        type: String,
        required: true
    },
    artistName: {
        type: String,
        required: true
    },
    isVip: {
        type: Boolean,
        default: true
    },
    hasMv: {
        type: Boolean,
        default: false
    },
    isOriginal: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss" scoped>
.song-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 10px;
    border-bottom: 1px solid var(--border-color-light);
    width: 100%;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color:white;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        transition: all 0.2s ease;
    }
}

.cover-container {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--background-color-secondary);
}

.cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info-container {
    flex: 1;
    min-width: 0;
}

.song-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 8px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
}

.artist-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-color-light);
}

.artist-name {
    font-weight: 500;
}
.vip-badge {
    background-color: #ff3a3a;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.mv-badge {
    background-color: #3d99f8;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.original-badge {
    background-color: #87d068;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}
</style>