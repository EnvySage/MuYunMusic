// src/stores/songList.js
import { defineStore } from "pinia";
import request from "@/utils/http";
export const useSongListStore = defineStore("songList", {
  state: () => ({
    songList: [],
    currentSongList: null, // 当前歌单详情
    loading: false,        // 加载状态
  }),
  
  getters: {
    getSongList: (state) => state.songList,
    getCurrentSongList: (state) => state.currentSongList,
    isLoading: (state) => state.loading,
  },
  
  actions: {
    async getAllSongList(id) {
      this.loading = true;
      try {
        const res = await request.get(`/playlist/getById/${id}`);
        this.currentSongList = res.data;
        this.songList = res.data;
        console.log(res)
        return res.data;
      } catch (error) {
        console.error("获取歌单失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    setSongList(songList) {
      this.songList = songList;
    },
    
    clearSongList() {
      this.songList = [];
      this.currentSongList = null;
    }
  },
});