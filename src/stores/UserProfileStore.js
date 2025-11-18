import { defineStore } from "pinia";
import { ref } from "vue";
import http from '@/utils/http.js'
const useUserProfileStore = defineStore("userProfile", () => {
    // 用户信息
    const userInfo = ref({});
    const getUserById = async (id) => { 
        const res = await http.get(`/user/info/${id}`)
        userInfo.value = res.data;
    };

    //歌单数据
    const songList = ref([]);
    const getUserPlaylists = async (id) => { 
        const res = await http.get("/playlist/getAll",{ userId: id })
        songList.value = res.data;
    };
    return { userInfo, getUserById, songList, getUserPlaylists };
});
export default useUserProfileStore;