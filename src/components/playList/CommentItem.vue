<template>
  <div class="CommentItemBox" :class="{ 'reply-comment': props.commentItem.parentId }">
    <div class="Container">
      <div class="userBox">
        <div class="avatar">
          <img :src="props.commentItem?.avatarUrl || avatar" alt="">
        </div>
        <div class="userinfo">
          <div class="username">{{props.commentItem?.username || '未知用户'}}</div>
          <div class="comment">
            {{ props.commentItem?.content || '未知评论' }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 回复内容 -->
    <div v-if="props.commentItem.parentId" class="replyCommentList">
      <div class="CommentBox">
        <div class="replyComment">
          <span>@{{props.commentItem.parentUsername || '未知回复用户'}}</span>
          {{ props.commentItem.parentContent || '未知评论' }}
        </div>
      </div>
    </div>
    
    <!-- 子评论 -->
    <div v-if="props.commentItem.childComments && props.commentItem.childComments.length > 0" class="childComments">
      <comment-item 
        v-for="childComment in visibleChildComments" 
        :key="childComment.id"
        :commentItem="childComment"
        class="childCommentBox"
        @reply="handleChildReply"
      />
      
      
      <!-- 查看更多按钮 -->
    </div>
    <div class="info">
      <div class="time">{{relativeTime}}</div>
      <div class="function">
        <div v-if="hasMoreComments" class="show-more-btn">
          <span v-if="!showMore||(visibleChildComments.length<props.commentItem.childComments.length)" @click="toggleShowMore">查看更多</span>
          <span v-if="showMore"  @click="showMore= !showMore,Offset=0">收起</span>
        </div>
        <div class="like">like</div>
        <div class="reply" @click="handleReply">reply</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import avatar from "@/image/avatar.png"
import CommentItem from '@/components/playList/CommentItem.vue'
const replyStatue = ref(false)
const props = defineProps({
  commentItem: {
    type: Object,
    default: () => ({})
  },
})

const emits = defineEmits(['reply'])
const handleReply = ()=>{
  console.log(props.commentItem)
  emits('reply',
    {
      username:props.commentItem.username,
      rootId:props.commentItem.rootId,
      parentId:props.commentItem.parentId===null? 0:props.commentItem.id,
    }
  )
}

const handleChildReply = (data) => {
  emits('reply', data)
}
const relativeTime = computed(() => {
  const createTime = props.commentItem?.createTime
  if (!createTime) return ''
  
  const now = new Date()
  const createDate = new Date(createTime) 
  
  // 计算时间差（毫秒）
  const diffInMs = now - createDate
  
  // 转换为分钟
  const minutesDiff = Math.floor(diffInMs / (1000 * 60))
  
  if (minutesDiff < 1) {
    return '刚刚'
  } else if (minutesDiff < 60) {
    return `${minutesDiff}分钟前`
  }
  
  // 转换为小时
  const hoursDiff = Math.floor(minutesDiff / 60)
  if (hoursDiff < 24) {
    return `${hoursDiff}小时前`
  }
  
  // 转换为天数
  const daysDiff = Math.floor(hoursDiff / 24)
  if (daysDiff === 1) {
    return '昨天'
  } else if (daysDiff < 7) {
    return `${daysDiff}天前`
  }
  
  // 转换为周数
  const weeksDiff = Math.floor(daysDiff / 7)
  if (weeksDiff < 4) {
    return `${weeksDiff}周前`
  }
  
  // 转换为月数
  const monthsDiff = Math.floor(daysDiff / 30)
  if (monthsDiff < 12) {
    return `${monthsDiff}月前`
  }
  
  // 转换为年数
  const yearsDiff = Math.floor(monthsDiff / 12)
  return `${yearsDiff}年前`
})

// 控制显示的子评论数量
const showMore = ref(false)
const visibleCount = ref(1) // 默认显示1条
const maxVisibleCount = 5 // 最大显示5条
const Offset = ref(0)

// 计算要显示的子评论
const visibleChildComments = computed(() => {
  if (!props.commentItem.childComments || props.commentItem.childComments.length === 0) {
    return []
  }
  
  const count = showMore.value ? Math.min(props.commentItem.childComments.length, maxVisibleCount*Offset.value) : visibleCount.value
  return props.commentItem.childComments.slice(0, count)
})

// 显示更多评论
const toggleShowMore = () => {
  if(Offset.value*maxVisibleCount < props.commentItem.childComments.length){
    console.log("Offset:",Offset.value)
    Offset.value += 1
    showMore.value = true
  }else{
    showMore.value = !showMore.value
    Offset.value = 0
  }
}

// 是否有更多评论可以显示
const hasMoreComments = computed(() => {
  return props.commentItem.childComments && props.commentItem.childComments.length > visibleCount.value
})
</script>
<style lang="scss" scoped>
.CommentItemBox {
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  // 增加层级缩进
  &.reply-comment {
    margin-left: 40px;
    padding-left: 20px;
    border-left: 2px solid #e0e0e0;
    background-color: rgba($color: #f0f0f0, $alpha: 0.3);
    border-radius: 10px;
  }
  
  .childComments {
    width: 95%;
    position: relative;
    
  }
  
  .Container {
    display: flex;
    height: 100%;
    gap: 10px;
    
    .userBox {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      
      .avatar {
        width: 40px;
        height: 40px;
        aspect-ratio: 1 / 1;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      
      .userinfo {
        display: flex;
        width: calc(100% - 50px);
        flex-direction: column;
        gap: 5px;
        
        .username {
          font-size: 14px;
          font-weight: bold;
        }
        
        .comment {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
  
  // 回复内容样式
  .replyCommentList {
    margin-top: 8px;
    .CommentBox {
      margin-left: 30px;
      padding-left: 10px;
      border-left: 2px solid #e0e0e0;
      
      .replyComment {
        width: 80%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 13px;
        color: #999;
        
        span {
          color: #738bcc;
          font-weight: bold;
          cursor: pointer;
          margin-right: 5px;
          font-size: 13px;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  .info { 
    color: #999;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 50px;
    font-size: 12px;
    
    .function{
      display: flex;
      gap: 10px;
      font-size: 12px;
      align-items: center;
      .show-more-btn {
        display: flex;
        cursor: pointer;
        color: #738bcc;
        gap: 5px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>