<template>
    <div class="artist-card">
        <div class="avatar-container">
            <img :src="avatarUrl" alt="歌手头像" class="avatar">
        </div>
        
        <div class="info-container">
            <div class="artist-name">
                歌手：{{ artistName }}
            </div>
            
            <div class="stats">
                <span class="stat-item">
                    <span class="stat-label">单曲：</span>
                    <span class="stat-value">{{ songCount }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    avatarUrl: {
        type: String,
        required: true
    },
    artistName: {
        type: String,
        required: true
    },
    songCount: {
        type: Number,
        required: true,
        default:1145
    },
})
</script>

<style lang="scss" scoped>
.artist-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border-bottom: 1px solid var(--border-color-light);
    
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color:white;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        transition: all 0.2s ease;
    }
}

.avatar-container {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--background-color-secondary);
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info-container {
    flex: 1;
}

.artist-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 8px;
}

.stats {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: var(--text-color-light);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat-label {
    font-weight: 500;
}

.stat-value {
    font-weight: 500;
    color: var(--primary-color);
}
</style>