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
    
    
    //处理添加歌曲到收藏歌单的逻辑
    const currentSong = ref([]);// 当前要添加的歌曲
    const addSongToCollectorPlaylist = async (IdList) => { //idList[{playlistId,songId}]
        //去除相同的歌曲
        IdList = IdList.filter((item, index, self) => {
            return self.findIndex(i => i.songId === item.songId) === index;
        });
        try {
            const res = await http.post('/playlist/add',IdList)
            return res;
        }catch (error) {
            console.error("Failed to fetch collector playlists:", error);
            return error;
        }
    };
    return { collectorPlaylist, getCollectorPlaylist,addCollectorPlaylist,addLikeSong,currentSong, addSongToCollectorPlaylist };
});