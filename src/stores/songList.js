// src/stores/songList.js
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { useSongMenuListStore } from "./songMenuList";
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
    clearSongList() {
      this.songList = [];
      this.currentSongList = null;
    },
    async getAllSongList(id) {
      this.clearSongList();
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
    async getFavoriteSongList() {
      this.clearSongList();
      this.loading = true;
      try{
        const favoritePlaylist = await request.get(`/playlist/getFavoriteByUserId`);
        this.songList = favoritePlaylist.data;
      }catch(error){
        console.error("获取喜欢的歌单失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    setSongList(songList) {
      this.songList = songList;
    },
    setCurrentSongList(playlist) {
      this.currentSongList = playlist;
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
    },

    async createPlaylist(playlist) {
      try {
        const response = await request.post("/playlist/create", playlist);
        if (response.success) {
          ElMessage.success("创建歌单成功");
          const songMenuListStore = useSongMenuListStore();
          songMenuListStore.songMenuList.push(response.data);
        }
      } catch (error) {
        console.error("创建歌单失败:", error);
        throw error;
      }
    },
    async uploadCoverImage(fileData) {
      try {
        const response = await request.post('/oss/upload/image', fileData)
        return response.data;
      } catch (error) {
        console.error("上传封面失败:", error);
        throw error;
      }
    },

    async updatePlaylist(playlist) {
      try {
        const response = await request.put('/playlist/editPlaylist', playlist)
        if (response.success) {
          ElMessage.success("更新歌单成功");
          this.currentSongList = response.data;
        }
      } catch (error) {
        console.error("更新歌单失败:", error);
        throw error;
      }
    }
  },
});