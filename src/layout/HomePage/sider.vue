<template>
  <div class="container">
    <div class="common">
      <song-item v-for="(item, index) in commonList" :key="`common_${index}`" ItemType="iconfont"
        :iconfont="item.iconfont" :text="item.text" :selected="selectedKey === `common_${index}`"
        @click="handleItemClick(`common_${index}`, item.id)" />
    </div>
    <div class="own">
      <div class="own-header">
        <span>我的</span>
        <div class="iconfont"></div>
      </div>
      <div class="func">
        <song-item v-for="(item, index) in ownList" :key="`own_${index}`" ItemType="iconfont" :iconfont="item.iconfont"
          :text="item.text" :selected="selectedKey === `own_${index}`"
          @click="handleOwnClick(`own_${index}`, item.routerName)" />
        <div class="more" @click="handleMore">
          <div class="iconfont icon-zhankai" :style="{ transform: isExpand ? 'rotate(180deg)' : 'none' }"></div>
          <span>{{ isExpand ? '收起' : '更多' }}</span>
        </div>
      </div>
    </div>
    <div class="song-menu">
      <div class="menu-header">
        <div class="titleBox">
          <span class="title">创建的歌单</span>
          <span class="menuNumber">{{ songMenuList.length }}</span>
          <div class="iconfont icon-zhankai" :style="{ transform: MenuStatue ? 'rotate(180deg)' : 'none' }" @click="toggleMenu"></div>
        </div>
        <el-icon @click="handleCreatePlaylist()">
          <Plus />
        </el-icon>
      </div>
      <div class="song-menu-list" v-if="MenuStatue">
        <song-item v-for="(item, index) in songMenuList" :key="`song_${index}`" ItemType="img"
          :icon="item?.coverUrl || avatar" :text="item.name" :selected="selectedKey === `song_${index}`"
          @click="handleItemClick(`song_${index}`, item.id)" />
      </div>
    </div>
    <div class="song-menu">
      <div class="menu-header" @click="toggleCollectedMenu">
        <div class="titleBox">
          <span class="title">收藏的歌单</span>
          <span class="menuNumber">{{ collectedSongMenuList.length }}</span>
          <div class="iconfont icon-zhankai" :style="{ transform: collectedMenuStatus ? 'rotate(180deg)' : 'none' }"></div>
        </div>
      </div>
      <div class="song-menu-list" v-if="collectedMenuStatus">
        <song-item v-for="(item, index) in collectedSongMenuList" :key="`collected_${index}`" ItemType="img"
          :icon="item.coverUrl" :text="item.name" :selected="selectedKey === `collected_${index}`"
          @click="handleItemClick(`collected_${index}`, item.id)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import songItem from '@/components/songItem.vue';
import { useRouter, useRoute } from 'vue-router';
import { useSongMenuListStore } from '@/stores/songMenuList';
import { useUserStore } from '@/stores/user';
import avatar from '@/image/avatar.png';
import { useComponentStatusStore } from '@/stores/componentStatus';
import { Plus } from '@element-plus/icons-vue';
const userStore = useUserStore();
const songMenuListStore = useSongMenuListStore();
const router = useRouter();
const route = useRoute();
const componentStatusStore = useComponentStatusStore();
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
  routerName: 'favorite',
}, {
  iconfont: 'icon-a-smlsicon_zuijinwenjian',
  text: '最近播放',
}, {
  iconfont: 'icon-guangbo',
  text: '我的博客',
}, {
  iconfont: 'icon-yunpan',
  text: '我的云盘',
}];
const songMenuList = ref([]);
const collectedSongMenuList = ref([]);
onMounted(() => {
  songMenuList.value.push(...songMenuListStore.songMenuList);
  collectedSongMenuList.value.push(...songMenuListStore.collectMenuList);
  console.log(songMenuList.value);
  console.log(collectedSongMenuList.value);
});

watch(
  () => songMenuListStore.songMenuList,
  (newList) => {
    songMenuList.value = [...newList];
  },
  { deep: true }
);

// 监听收藏歌单列表的变化，实现动态更新
watch(
  () => songMenuListStore.collectMenuList,
  (newList) => {
    collectedSongMenuList.value = [...newList];
  },
  { deep: true }
);

const selectedKey = ref('common_0');
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'recommend') {
      selectedKey.value = 'common_0';
    }
  },
  { immediate: true }
);

const listEnd = ref(8);
const commonList = computed(() => iconfontList.slice(0, 5));
const ownList = computed(() => iconfontList.slice(5, listEnd.value));


const isExpand = computed(() => listEnd.value > 8);

const handleMore = () => {
  if (isExpand.value) {
    listEnd.value = 8;
  } else {
    listEnd.value = iconfontList.length;
  }
};

const handleItemClick = (key, id) => {
  selectedKey.value = key;
  if (id !== undefined && id !== null) {
    console.log('跳转到歌单ID:', id);
    // 使用 name 跳转并传递 params
    router.push({
      name: 'songList',
      params: {
        id: id,
      },
    });
  } else {
    router.push({
      name: 'recommend',
    })
  }
};
const handleOwnClick = (key, routerName) => {
  selectedKey.value = key;
  if (routerName !== undefined && routerName !== null) {
    console.log('跳转:', routerName);
    router.push({
      name: routerName,
    });
  } else {
    router.push({
      name: 'recommend',
    })
  }
};

const MenuStatue = ref(true);
const toggleMenu = () => {
  MenuStatue.value = !MenuStatue.value;
};
const collectedMenuStatus = ref(true);
const toggleCollectedMenu = () => {
  collectedMenuStatus.value = !collectedMenuStatus.value;
};
const handleCreatePlaylist = () => {
  componentStatusStore.showCreatePlaylistComponent();
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
   background: linear-gradient(to bottom, rgba(224, 201, 201, 0.5) 1%, rgba(247, 249, 252, 0.5) 50%);
  padding: var(--spacing-md);
  overflow-y: auto;
  overflow-x: hidden;

  .common {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color-light);
    margin-bottom: var(--spacing-md);
  }
}

.own {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);

  .own-header {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-md);
    margin-bottom: var(--spacing-xs);

    span {
      color: var(--text-color-light);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .func {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .more {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--text-color-light);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: var(--transition-all);
      font-size: var(--font-size-sm);

      &:hover {
        color: var(--text-color);
        background-color: var(--background-color-sider-hover);

        .iconfont {
          opacity: 0.8;
        }
      }

      .iconfont {
        font-size: var(--icon-size-sm);
        transition: var(--transition-all);
      }
    }
  }
}

.song-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  border-top: 1px solid var(--border-color-light);

  .menu-header {
    display: flex;
    align-items: center;
    color: var(--text-color-light);
    padding: var(--spacing-xs) var(--spacing-md);
    gap: var(--spacing-xs);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: var(--transition-all);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
      color: var(--text-color);
      background-color: var(--background-color-sider-hover);

      .iconfont {
        opacity: 0.8;
      }
    }

    .titleBox {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);

      .menuNumber {
        font-size: var(--font-size-xs);
        opacity: 0.7;
      }

      .iconfont {
        font-size: var(--icon-size-xs);
        transition: var(--transition-all);
      }
    }
  }

  .song-menu-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}
</style>