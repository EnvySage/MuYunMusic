<template>
  <div class="container">
    <div class="common">
      <song-item 
        v-for="(item, index) in commonList" 
        :key="`common_${index}`" 
        ItemType="iconfont" 
        :iconfont="item.iconfont"
        :text="item.text" 
        :selected="selectedKey === `common_${index}`" 
        @click="handleItemClick(`common_${index}`)" 
      />
    </div>
    <div class="own">
      <div class="own-header">
        <span>我的</span>
        <div class="iconfont"></div>
      </div>
      <div class="func">
        <song-item 
          v-for="(item, index) in ownList" 
          :key="`own_${index}`" 
          ItemType="iconfont" 
          :iconfont="item.iconfont"
          :text="item.text" 
          :selected="selectedKey === `own_${index}`" 
          @click="handleItemClick(`own_${index}`)" 
        />
        <div class="more" @click="handleMore">
          <div class="iconfont icon-zhankai"
          :style="{transform: isExpand ? 'rotate(180deg)' : 'none'}"></div>
          <span>{{ isExpand ? '收起' : '更多' }}</span>
        </div>
      </div>
    </div>
    <div class="song-menu">
      <div class="menu-header" @click="toggleMenu">
        <span class="title">创建的歌单</span>
        <span class="menuNumber">{{ songMenuList.length }}</span>
        <div class="iconfont icon-zhankai" :style="{transform : MenuStatue ? 'rotate(180deg)' : 'none'}"></div>
      </div>
      <div class="song-menu-list" v-if="MenuStatue"> 
        <song-item 
          v-for="(item, index) in songMenuList" 
          :key="`song_${index}`" 
          ItemType="img" 
          :icon="item.icon" 
          :text="item.text" 
          :selected="selectedKey === `song_${index}`" 
          @click="handleItemClick(`song_${index}`)" 
        />
      </div>
    </div>
        <div class="song-menu">
      <div class="menu-header" @click="toggleCollectedMenu">
        <span class="title">收藏的歌单</span>
        <span class="menuNumber">{{ collectedSongMenuList.length }}</span>
        <div class="iconfont icon-zhankai" :style="{transform : collectedMenuStatus ? 'rotate(180deg)' : 'none'}"></div>
      </div>
      <div class="song-menu-list" v-if="collectedMenuStatus"> 
        <song-item 
          v-for="(item, index) in collectedSongMenuList" 
          :key="`collected_${index}`" 
          ItemType="img" 
          :icon="item.icon" 
          :text="item.text" 
          :selected="selectedKey === `collected_${index}`" 
          @click="handleItemClick(`collected_${index}`)" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import songItem from '@/components/songItem.vue';
import avatar from '@/image/avatar.png';

const iconfontList = [{
  iconfont: 'icon-home_fill_light',
  text: '推荐',
}, {
  iconfont: 'icon-yinlewenjianjia',
  text: '精选',
}, {
  iconfont: 'icon-guangbo1',
  text: '播客',
}, {
  iconfont: 'icon-shouyinji',
  text: '漫游',
}, {
  iconfont: 'icon-xiaoxi',
  text: '朋友',
}, {
  iconfont: 'icon-xiai',
  text: '我的喜欢的音乐',
}, {
  iconfont: 'icon-a-smlsicon_zuijinwenjian',
  text: '最近播放',
}, {
  iconfont: 'icon-guangbo',
  text: '我的博客',
},{
  iconfont: 'icon-yunpan',
  text: '我的云盘',
}];

const songMenuList = [{
  icon: avatar,
  text: '东方',
}];
const collectedSongMenuList = [{
  icon: avatar,
  text: '古典音乐精选',
}, {
  icon: avatar,
  text: '电影原声大赏',
}];
const listEnd = ref(8);
const commonList = computed(() => iconfontList.slice(0, 5));
const ownList = computed(() => iconfontList.slice(5, listEnd.value));

const selectedKey = ref('common_0');

const isExpand = computed(() => listEnd.value > 8);

const handleMore = () => {
  if (isExpand.value) {
    listEnd.value = 8;
  } else {
    listEnd.value = iconfontList.length;
  }
};

const handleItemClick = (key) => {
  selectedKey.value = key;
};
const MenuStatue = ref(true);
const toggleMenu = () => {
  MenuStatue.value = !MenuStatue.value;
};
const collectedMenuStatus = ref(true);
const toggleCollectedMenu = () => {
  collectedMenuStatus.value = !collectedMenuStatus.value;
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 1000px;
  background-color: var(--background-color-sider);
  padding: 10px;  

  .common {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    border-bottom: 1px solid var(--border-color);
  }
}

.infinite-list {
  padding: 0;
  margin: 25px 0;
  list-style: none;
  scroll-snap-type: none;

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px; // 增加滚动条宽度
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; // 修改滚动条背景色
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888; // 修改滚动条颜色
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555; // 滚动条悬停颜色保持不变
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

.infinite-list .infinite-list-item+.list-item {
  margin-top: 10px;
}


.own {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md) 0;
  gap: var(--spacing-xs);
  .own-header {
    display: flex;

    span {
      color: var(--text-color-light);
      padding-left: 14px;
    }
  }
  .func{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    .more{
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--text-color-light);
      padding-left: 14px;
      &:hover{
        color: var(--text-color-primary);
        cursor: pointer;
        transition: all 0.3s;
        & .iconfont{
          filter: brightness(0.5);
        }
      }
    }
  }
}
.song-menu{
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md) 0;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  .menu-header{
    display: flex;
    align-items: center;
    color: var(--text-color-light);
    padding-left: 14px;
    gap: var(--spacing-xs);
    &:hover{
      color: var(--text-color-primary);
      cursor: pointer;
      transition: all 0.3s;
      & .iconfont{
        filter: brightness(0.5);
      }
    }
  }
}
</style>