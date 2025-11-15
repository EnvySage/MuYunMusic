<template>
  <div class="playlist-comment">
    <div class="headerBox">
      <div class="title">
        <span class="title-text">全部评论</span>
      </div>
    </div>
    <!-- 评论输入区域 -->
    <div class="comment-input-container">
      <!-- 回复信息显示 -->
      <div v-if="replyTo" class="reply-info">
        <span class="reply-to">回复 @{{ replyTo.username }}</span>
        <span class="cancel-reply" @click="cancelReply">取消</span>
      </div>
      
      <!-- 内嵌功能按钮和文本输入框 -->
      <div class="comment-input-wrapper">
        <!-- 功能按钮区域 -->

        <!-- 文本输入框 -->
        <textarea
          ref="textInput"
          v-model="commentText"
          class="comment-input"
          :placeholder="inputPlaceholder"
          @input="handleInput"
          @keydown="handleKeydown"
          @click="handleInputClick"
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
            {{ replyTo ? '回复' : '发布' }}
          </button>
        </div>
      </div>
    </div>
    <!-- 评论列表区域 -->
    <div class="comment-list">
      <div class="CommentTitle">精彩评论</div>
      <div v-if="commentStore.commentList.length > 0">
        <CommentItem v-for="CommentItem in commentStore.commentList" :key="CommentItem.id" :commentItem="CommentItem" @reply="handleReply"/>
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
import { ref, computed, onMounted,watch,nextTick } from 'vue'
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
const replyTo = ref(null) // 回复目标 {username, id}

// 计算字符数和评论是否有效
const characterCount = computed(() => commentText.value.length)
const isCommentValid = computed(() => characterCount.value > 0 && characterCount.value <= 1000)

// 计算输入框的提示文字
const inputPlaceholder = computed(() => {
  if (replyTo.value) {
    return `回复 @${replyTo.value.username}:`
  }
  return '说点什么吧'
})

// 更新字符计数器
const updateCharacterCount = () => {
  // 由于使用了v-model，无需手动更新characterCount
  // 这里可以添加额外的逻辑，例如字符限制提示
  if (characterCount.value > 1000) {
    // 截断文本至1000字
    commentText.value = commentText.value.substring(0, 1000)
  }
}

// 处理输入事件
const handleInput = (event) => {
  const inputValue = event.target.value
  
  // 如果在回复模式下，确保前缀不被删除
  if (replyTo.value) {
    const prefix = `回复 @${replyTo.value.username} `
    if (!inputValue.startsWith(prefix)) {
      // 将光标移到末尾
      nextTick(() => {
        const textInput = document.querySelector('.comment-input')
        if (textInput) {
          textInput.setSelectionRange(commentText.value.length, commentText.value.length)
        }
      })
    }
  }
  
  updateCharacterCount()
}

// 处理键盘事件，防止删除前缀
const handleKeydown = (event) => {
  if (!replyTo.value) return
  
  const prefix = `回复 @${replyTo.value.username} `
  const selectionStart = event.target.selectionStart
  const selectionEnd = event.target.selectionEnd
  
  // 如果光标在前缀内或者选择了前缀的一部分，阻止删除操作
  if ((selectionStart < prefix.length || selectionEnd < prefix.length) && 
      (event.key === 'Backspace' || event.key === 'Delete')) {
    event.preventDefault()
  }
  
  // 防止光标移动到前缀内部
  if (event.key === 'ArrowLeft' && selectionStart <= prefix.length) {
    event.preventDefault()
    // 将光标定位到前缀末尾
    event.target.setSelectionRange(prefix.length, prefix.length)
  }
  
  if (event.key === 'ArrowRight' && selectionStart < prefix.length) {
    event.preventDefault()
    // 将光标定位到前缀末尾
    event.target.setSelectionRange(prefix.length, prefix.length)
  }
  
  // 处理 Home 键
  if (event.key === 'Home') {
    event.preventDefault()
    // 将光标定位到前缀末尾
    event.target.setSelectionRange(prefix.length, prefix.length)
  }
}

// 处理鼠标点击事件
const handleInputClick = (event) => {
  if (!replyTo.value) return
  
  const prefix = `回复 @${replyTo.value.username} `
  const selectionStart = event.target.selectionStart
  
  // 如果点击位置在前缀内，将光标移到前缀末尾
  if (selectionStart < prefix.length) {
    nextTick(() => {
      event.target.setSelectionRange(prefix.length, prefix.length)
    })
  }
}

// 处理回复事件
const handleReply = (data) => {
  replyTo.value = data
  const prefix = `回复 @${data.username} `
  commentText.value = prefix
  console.log('回复目标:', data)
  // 聚焦到输入框并将光标移到末尾
  nextTick(() => {
    const textInput = document.querySelector('.comment-input')
    if (textInput) {
      textInput.focus()
      textInput.setSelectionRange(commentText.value.length, commentText.value.length)
    }
  })
}

// 取消回复
const cancelReply = () => {
  replyTo.value = null
  commentText.value = ''
}

// 提交评论的方法
const submitComment = async() => {
  if (!isCommentValid.value) return
  
  let content = commentText.value
  if (replyTo.value) {
    // 如果是回复，提取实际内容（去除前缀）
    const prefix = `回复 @${replyTo.value.username} `
    content = commentText.value.substring(prefix.length)
    
    // 添加回复评论
    await commentStore.addReplyComment(
      2, 
      props.playlistId, 
      content, 
      replyTo.value.rootId,
      replyTo.value.parentId? replyTo.value.parentId :  replyTo.value.rootId
    )
  } else {
    // 添加根评论
    await commentStore.addRootComment(2, props.playlistId, content)
  }
  
  console.log('提交的评论:', content)
  // 清空输入框和回复状态
  commentText.value = ''
  replyTo.value = null
  
  // 重新获取评论列表以更新显示
  await commentStore.getCommentList(2, props.playlistId)
}

watch(()=>props.playlistId,async(newVal,oldVal)=>{
  if(newVal!==oldVal){
    await commentStore.getCommentList(2, props.playlistId)
  }
  cancelReply()
})

onMounted(async() => {
  await commentStore.getCommentList(2, props.playlistId)
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
  position: relative;
}

.reply-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 8px;
  font-size: 12px;
  
  .reply-to {
    color: #1890ff;
  }
  
  .cancel-reply {
    color: #ff4d4f;
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
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