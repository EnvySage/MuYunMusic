import { defineStore } from "pinia";
import request from "@/utils/http";

export const useAdminPlaylistStore = defineStore("adminPlaylist", {
  state: () => ({
    adminPlaylist1: [],
    loading: false,
    error: null
  }),
  
  getters: {
    // 修改 getters 以适应两个列表
    getAdminPlaylistCount: (state) => (listType = '1') => {
      return state[`adminPlaylist${listType}`].length;
    },
    getAdminPlaylist: (state) => (listType = '1') => {
      return state[`adminPlaylist${listType}`];
    },
  },
  
  actions: {
    // 修改获取歌单的方法，添加参数指定存储位置
    async getAdminPlaylistF(listType = '1', force = false) {
      if (this.loading && !force) return;
      this.loading = true;
      this.error = null;
      
      try {
        const response = await request.get("/playlist/getAdminPlaylist");
        // 根据参数存储到对应的列表
        this[`adminPlaylist${listType}`] = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    // 可选：清空指定列表的方法
    clearAdminPlaylist(listType = '1') {
      this[`adminPlaylist${listType}`] = [];
    }
  }
});