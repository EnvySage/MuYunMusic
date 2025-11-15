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
    const addRootComment = async (type,targetId,content) => {
        try {
            const data = {
                targetType: type,
                targetId: targetId,
                content: content,
            }
            const res = await http.post('/comment/addComment', data)
            console.log("addRootComment:",res)
        } catch (error) {
            console.error("Failed to addRootComment:", error);
        }
    }

    const addReplyComment = async (type,targetId,content,rootId,parentId) => {
        try {
            const data = {
                targetType: type,
                targetId: targetId,
                content: content,
                rootId: rootId,
                parentId: parentId
            }
            const res = await http.post('/comment/addComment', data)
            console.log("addReplyComment:",res)
        } catch (error) {
            console.error("Failed to addReplyComment:", error);
        } 
    }
    return {
        commentList,
        total,
        currentId,
        getCommentList,
        addRootComment,
        addReplyComment
    }
})