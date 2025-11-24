// src/stores/songList.js
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
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
        const songs = await request.get(`/playlist/getById/${id}`);
        this.songList = songs.data;
        const playlist = await request.get(`/playlist/getPlaylistById/${id}`);
        this.currentSongList = playlist.data;
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
    },

    async deleteCurrentSongList(playlistId) {
      try {
        const response = await request.delete(`/playlist/deletePlaylist/${playlistId}`);
        if (response.success) {
          // this.currentSongList = this.songList[0]
          ElMessage.success("删除歌单成功");
        }
      } catch (error) {
        console.error("删除歌单失败:", error);
        throw error;
      }
    }
  },
});