import { defineStore } from "pinia";
import { ref } from "vue";
import http from '@/utils/http'
export const useCommentStore = defineStore("comment", () => {
    const commentList = ref([]);
    const total = ref(0);
    const currentId = ref(null);
    const getCommentList = async (type, id) => {
        currentId.value = id;
        try {
            const res = await http.get(`/comment/getComment/${type}/${id}`) || []
            commentList.value = res.data
            total.value = commentList.value.length
            console.log("commentList:",commentList.value)
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    }
    return {
        commentList,
        total,
        currentId,
        getCommentList
    }
})