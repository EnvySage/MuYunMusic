<template>
    <div class="ItemBox" @mouseover="handleMouseOver" @mouseout="handleMouseOut">
        <div class="iconItem">
            <img :src="img" alt="">
        </div>
        <div class="textItem">
            <div class="textItem-title">{{ title }}</div>
            <div class="textItem-subTitle">
                <div class="power">
                    <i class="iconfont icon-VIP"></i>
                    <i class="iconfont icon-MV"></i>
                </div>
                <div class="textItem-subTitle-text">{{ artist }}</div>
            </div>
        </div>
        <div class="duration" v-if="!isHover">{{ formatDuration(duration) }}</div>
        <div class="functionIcon" v-else>
            <div class="iconfont icon-weixihuan" style="font-size: 30px;" @click="handleLove"></div>
            <div class="iconfont icon-shoucang1" style="font-size: 28px;"></div>
            <div class="iconfont icon-gengduo" style="font-size: 28px;"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';
const props = defineProps({
  img: String,
  title: String,
  artist: String,
  duration: Number,
});

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
const isHover = ref(false);
const handleMouseOver = () => {
  isHover.value = true;
};
const handleMouseOut = () => {
  isHover.value = false;
};
const handleLove = () => {
  console.log('点击了喜欢');
};
</script>

<style lang="scss" scoped>
.ItemBox {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  position: relative;
  
  .iconItem {
    width: 70px;
    height: 70px;
    flex-shrink: 0; // 防止在小屏幕上压缩
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      object-fit: cover; // 确保图片比例正确
    }
    
    .placeholder-image {
      width: 100%;
      height: 100%;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
  }
  
  .textItem {
    flex: 1;
    margin-left: 10px;
    min-width: 0; // 允许文本截断
    
    .textItem-title {
      font-size: 20px;
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 5px;
      
      // 单行文本截断
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .textItem-subTitle {
      display: flex;
      align-items: center;
      gap: 5px;
      
      .power {
        display: flex;
        align-items: center;
        gap: 5px;
        
        .iconfont {
          color: red;
        }
        
        .iconfont:nth-child(2) { 
          font-size: 21px;
        }
      }
      
      .textItem-subTitle-text {
        font-size: 14px;
        color: var(--text-color-light);
        
        // 单行文本截断
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  
  .duration {
    padding-left: 10px;
    color: var(--text-color-light);
    font-size: 18px;
    flex-shrink: 0;
  }
  .functionIcon {
    display: flex;
    gap: var(--spacing-unit);
    justify-content: center;
    align-items: center;
    .iconfont {
      color: var(--text-color-light);
    }
  }
}
.ItemBox:hover .iconItem::before{
    content: '▶';
    position: absolute;
    display: flex;
    left: 42%;
    top: 42%;
    color: white;
    z-index: 1000;
    pointer-events: none;
}
.ItemBox:hover::before  {
    content: "";
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    pointer-events: none;
}

</style>