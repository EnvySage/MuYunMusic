import { defineStore } from "pinia";
import request from "@/utils/http";
import { useUserStore } from "@/stores/user";

export const useSongMenuListStore = defineStore("songMenuList", {
  state: () => ({
    songMenuList: [],
    collectMenuList: [],
    favoritePlaylist : {},

    loading: false,
    collectLoading: false,
    error: null,
    collectError: null
  }),
  
  getters: {
    getMenuListCount: (state) => state.songMenuList.length,
    getMenuList: (state) => state.songMenuList,
    getCollectMenuList: (state) => state.collectMenuList,
    getCollectMenuListCount: (state) => state.collectMenuList.length,
  },
  
  actions: {
    async getAllSongMenuList(force = false) {
      // 避免重复请求
      if (this.loading && !force) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.user || !userStore.user.id) {
          throw new Error('用户未登录');
        }
        const userId = userStore.user.id;
        const response = await request.get("/playlist/getAll", { userId: userId });
        this.songMenuList = (response.data || []).filter(playlist => {
          if (playlist.id === userStore.user.favoritePlaylistId) {
            this.favoritePlaylist = playlist
            return false
          }
          return true;
        });
        console.log(userId + "获取歌单列表成功songMenuList", this.songMenuList);
        return this.songMenuList;
      } catch (error) {
        this.error = error.message || '获取歌单列表失败';
        console.error('获取歌单列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getAllCollectMenuList(force = false) {
      // 避免重复请求
      if (this.collectLoading && !force) return;
      
      this.collectLoading = true;
      this.collectError = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.user || !userStore.user.id) {
          throw new Error('用户未登录');
        }
        
        const userId = userStore.user.id;
        console.log(userId + "获取收藏歌单列表成功");
        const response = await request.get("/playlist/getAllCollect", { userId: userId });
        this.collectMenuList = response.data || [];
        return this.collectMenuList;
      } catch (error) {
        this.collectError = error.message || '获取收藏歌单列表失败';
        console.error('获取收藏歌单列表失败:', error);
        throw error;
      } finally {
        this.collectLoading = false;
      }
    },
    async refreshAllSongMenuList() {
      await this.getAllSongMenuList(true);
      await this.getAllCollectMenuList(true);
    },
    // 清空歌单列表
    clearSongMenuList() {
      this.songMenuList = [];
      this.error = null;
    },
    
    // 清空收藏歌单列表
    clearCollectMenuList() {
      this.collectMenuList = [];
      this.collectError = null;
    }
  }
});