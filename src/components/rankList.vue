<template>
  <div class="music-chart-card white-theme">
    <!-- 卡片头部 -->
    <div class="card-header">
      <h3 class="chart-title">{{ title }}</h3>
      <span class="update-frequency" v-if="updateFrequency">{{ updateFrequency }}</span>
    </div>

    <!-- 歌曲列表 -->
    <div class="song-list">
      <div 
        v-for="(song, index) in songs" 
        :key="song.id || index" 
        class="song-item"
      >
        <div class="song-rank">
          <span class="rank-number">{{ index + 1 }}</span>
        </div>
        
        <div class="song-info">
          <div class="album-cover-container">
            <img :src="song.cover" alt="专辑封面" class="album-cover">
          </div>
          
          <div class="song-details">
            <div class="song-name">{{ song.name }}</div>
            <div class="artist-name">{{ song.artist }}</div>
          </div>
        </div>
        
        <span class="new-badge" v-if="song.isNew">新</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import avatar from '@/image/avatar.png'
defineProps({
  title: {
    type: String,
    required: true,
    default: '飙升榜'
  },
  updateFrequency: {
    type: String,
    default: '每天更新'
  },
  songs: {
    type: Array,
    required: true,
    default: () => [
      {
        id: 1,
        name: '沦陷',
        artist: '李嘉格',
        cover: avatar,
        isNew: false
      },
      {
        id: 2,
        name: '晨昏线',
        artist: '梓渝',
        cover: avatar,
        isNew: true
      },
      {
        id: 3,
        name: '时间就是伤口',
        artist: '范世錡',
        cover: avatar,
        isNew: true
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.music-chart-card {
  width: 100%;
  min-width: 300px;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #333333;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &.white-theme {
    background: #ffffff;
    
    .card-header {
      border-bottom: 1px solid #e0e0e0;
      
      &::after {
        background: linear-gradient(90deg, 
          transparent, 
          #1ecd8d, 
          #1ecd8d, 
          transparent);
      }
    }
    
    .chart-title {
      color: #333333;
    }
    
    .update-frequency {
      color: #666666;
    }
    
    .song-item {
      border-bottom: 1px solid #f0f0f0;
      
      &:hover {
        background-color: #f8f8f8;
      }
    }
    
    .rank-number {
      color: #333333;
    }
    
    .song-name {
      color: #333333;
    }
    
    .artist-name {
      color: #666666;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    opacity: 0.6;
  }
}

.chart-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.update-frequency {
  font-size: 12px;
  font-weight: 400;
}

.song-list {
  .song-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    position: relative;
    transition: all 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      border-radius: 6px;
    }
  }

  .song-rank {
    width: 30px;
    text-align: center;
    margin-right: 16px;
    
    .rank-number {
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
    }
  }

  .song-info {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 12px;
  }

  .album-cover-container {
    width: 45px;
    height: 45px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .album-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  .song-details {
    flex: 1;
  }

  .song-name {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .artist-name {
    font-size: 13px;
  }

  .new-badge {
    background: #ff4444;
    color: white;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: bold;
    margin-left: 8px;
  }
}

// 前三名特殊样式
.song-item:nth-child(1) .rank-number {
  color: #1ecd8d;
  font-size: 20px;
}

.song-item:nth-child(2) .rank-number {
  color: #1ecd8d;
}

.song-item:nth-child(3) .rank-number {
  color: #1ecd8d;
}

@media (max-width: 768px) {
  .music-chart-card {
    padding: 16px;
    border-radius: 10px;
  }
  
  .song-item {
    padding: 10px 0;
  }
  
  .album-cover-container {
    width: 40px;
    height: 40px;
  }
  
  .song-rank {
    width: 28px;
    margin-right: 12px;
  }
  
  .song-name {
    font-size: 14px;
  }
  
  .artist-name {
    font-size: 12px;
  }
}
</style>