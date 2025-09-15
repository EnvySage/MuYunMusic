<template>
  <div class="recommend-card" @click="handleClick">
    <!-- 封面图 -->
    <div class="card-image">
      <img :src="imageSrc" :alt="title" />
      <!-- 悬停时显示的播放按钮 -->
      <div class="play-overlay" v-if="showPlayButton">
        <div class="play-button">▶</div>
      </div>
    </div>
    
    <!-- 卡片信息 -->
    <div class="card-info">
      <div class="card-title">{{ title }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  showPlayButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.recommend-card {
    position: relative;
  width: 100%;
    height: 140px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

.card-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recommend-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  font-size: 24px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%; 
  padding: 5px 10px; 
  color: var(--text-color-white);
  top:0;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

</style>