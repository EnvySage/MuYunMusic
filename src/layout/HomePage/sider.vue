<template>
  <div class="container">
    <div class="common">
      <song-item
      :icon=avatar
      text="歌单"
      :selected=true
      />
      <song-item
      ItemType="iconfont"  
      iconfont="icon-home_fill_light"
      text="歌单"
      :selected=true
      />
    </div>
    
  </div>
</template>

<script setup>
import songItem from '@/components/songItem.vue';
import avatar from '@/image/avatar.png';
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 1000px;
  background-color: var(--background-color-sider);
  .common {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
.infinite-list {
  padding: 0;
  margin: 25px 0;
  list-style: none;
  scroll-snap-type: none;
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px; // 滚动条宽度
  }
  
  &::-webkit-scrollbar-track {
    background: var(--secondary-color); // 滚动条背景色
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c7c7c7; // 滚动条颜色
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555; // 滚动条悬停颜色
  }
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  background-color: red;
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>