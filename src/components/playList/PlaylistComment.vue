<template>
  <div class="playlist-comment">
    <div class="headerBox">
      <div class="title">
        <span class="title-text">全部评论</span>
        <span class="comment-count">111条评论</span>
      </div>
    </div>
    <!-- 评论输入区域 -->
    <div class="comment-input-container">
      <!-- 内嵌功能按钮和文本输入框 -->
      <div class="comment-input-wrapper">
        <!-- 功能按钮区域 -->

        <!-- 文本输入框 -->
        <textarea
          ref="textInput"
          v-model="commentText"
          class="comment-input"
          placeholder="说点什么吧"
          @input="updateCharacterCount"
        ></textarea>
      </div>
      <!-- 字符计数器和发布按钮 -->
      <div class="input-footer">
        <span class="character-count">{{ characterCount }} / 1000</span>
        <div class="rightBox">
          <div class="input-actions">
            <button class="action-btn emoji-btn">😊</button>
            <button class="action-btn image-btn">🖼️</button>
          </div>
          <button
            :disabled="!isCommentValid"
            class="send-btn"
            @click="submitComment"
          >
            发布
          </button>
        </div>
      </div>
    </div>
    <!-- 评论列表区域 -->
    <div class="comment-list">
      <div class="CommentTitle">精彩评论</div>
      <div v-if="commentStore.commentList.length > 0">
        <CommentItem v-for="CommentItem in commentStore.commentList" :commentItem="CommentItem" />
      </div>
      <div v-else>
        <div class="NOComment" style="text-align: center; padding: 80px; color: #888;">
          暂无评论，快来抢沙发吧~
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue'
import CommentItem from './CommentItem.vue'
import {useCommentStore} from "@/stores/commentStores"
import { defineProps } from 'vue'
const props = defineProps({
  playlistId: {
    type: String,
    default: ""
  }
})
const commentStore = useCommentStore()

// 定义响应式变量
const commentText = ref('') // 用户输入的评论内容


// 计算字符数和评论是否有效
const characterCount = computed(() => commentText.value.length)
const isCommentValid = computed(() => characterCount.value > 0 && characterCount.value <= 1000)

// 更新字符计数器
const updateCharacterCount = () => {
  // 由于使用了v-model，无需手动更新characterCount
  // 这里可以添加额外的逻辑，例如字符限制提示
  if (characterCount.value > 1000) {
    // 截断文本至1000字
    commentText.value = commentText.value.substring(0, 1000)
  }
}

// 提交评论的方法
const submitComment = () => {
  if (!isCommentValid.value) return
  // 这里添加提交评论的逻辑，例如发送到服务器
  console.log('提交的评论:', commentText.value)
  // 清空输入框
  commentText.value = ''

}
watch(()=>props.playlistId,async(newVal,oldVal)=>{
  if(newVal!==oldVal){
    await commentStore.getCommentList(2, props.playlistId)
    console.log("评论获取",commentStore.commentList)
  }
})

onMounted(async() => {
  await commentStore.getCommentList(2, props.playlistId)
  console.log("评论获取",commentStore.commentList)

})
</script>

<style lang="scss" scoped>
.playlist-comment {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px; /* 圆角 */
  overflow: hidden; /* 隐藏溢出内容 */
}

.headerBox {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;

  .title {
    display: flex;
    align-items: center;
    gap: 8px; /* 标题和评论数之间的间隙 */
  }

  .title-text {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .comment-count {
    font-size: 14px;
    color: #888;
  }
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f0f2f4;
  border-radius: 10px;
}

.comment-input-wrapper {
  position: relative;
  display: flex;
}
.rightBox {
  display: flex;
}
.input-actions {
  display: flex;
  align-items: center;
  padding-right: 8px;
  z-index: 1; /* 确保按钮在输入框上方 */
}

.action-btn {
  background: none;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  margin-left: 4px;

  &:hover {
    background-color: #f0f0f0;
  }
}

.comment-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none; /* 禁止调整大小 */
  font-size: 14px;
  padding: 8px 12px;
  margin-left: -8px; /* 抵消padding使文本更贴近按钮 */
  margin-right: -8px; /* 抵消padding使文本更贴近按钮 */
  background-color: transparent;

  &:focus {
    outline: none;
  }
}

.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.character-count {
  font-size: 12px;
  color: #888;
}

.send-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}
</style>