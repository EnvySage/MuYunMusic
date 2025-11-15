import { defineStore } from "pinia";
import http from "@/utils/http";
import { ref } from "vue";
export const useCollectorStore = defineStore("collector", () => {
    const collectorPlaylist = ref([]);

    const getCollectorPlaylist = async (playlistId) => {
        try {
            const response = await http.get(`/collector/getCollectorById/1/${playlistId}`);
            collectorPlaylist.value = response.data;
            console.log("获取到歌单",playlistId,"收藏者",collectorPlaylist.value);
        } catch (error) {
            console.error("Failed to fetch collector playlists:", error);
        }
    }

    const addCollectorPlaylist = async (playlistId) => {
        try {
            const response = await http.get(`/collector/addCollector/1/${playlistId}`);
        } catch (error) {
            console.error("Failed to fetch collector playlists:", error);
        }
    }

    const addLikeSong = async (songId) => {
        try {
            const response = await http.put(`/collector/likeSong/${songId}`);
        } catch (error) {
            console.error("Failed to fetch collector playlists:", error);
        }
    }
    return { collectorPlaylist, getCollectorPlaylist,addCollectorPlaylist,addLikeSong };
});