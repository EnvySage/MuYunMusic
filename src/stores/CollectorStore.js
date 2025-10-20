import { defineStore } from "pinia";
import http from "@/utils/http";
import { ref } from "vue";
export const useCollectorStore = defineStore("collector", () => {
    const collectorPlaylist = ref([]);

    const getCollectorPlaylist = async (playlistId) => {
        try {
            const response = await http.get(`/collector/getCollectorById/2/${playlistId}`);
            collectorPlaylist.value = response.data;
        } catch (error) {
            console.error("Failed to fetch collector playlists:", error);
        }
    }

    const addCollectorPlaylist = async (playlistId) => {
        try {
            const response = await http.get(`/collector/addCollector/2/${playlistId}`);
        } catch (error) {
            console.error("Failed to fetch collector playlists:", error);
        }
    }

    return { collectorPlaylist, getCollectorPlaylist,addCollectorPlaylist };
});