<template>
  <div class="menu-item" @click="handleClick" :class="{ 'selected': selected }" v-if="ItemType === 'img'">
    <div class="menu-icon">
      <img :src="icon" :alt="text" />
    </div>
    <div class="menu-text">{{ text }}</div>
    <div class="menu-badge" v-if="badge"></div>
  </div>
  <div class="menu-item" @click="handleClick" :class="{ 'selected': selected }" v-else-if="ItemType === 'iconfont'">
    <div class="menu-font">
      <div :class="['iconfont', iconfont]"></div>
    </div>
    <div class="menu-iconfont">{{ text }}</div>
    <div class="menu-badge" v-if="badge"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  ItemType: {
    type: String,
    default: 'img'
  },

  icon: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: true
  },
  badge: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  iconfont: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['click'])

const handleClick = () => {
  emits('click')
}
</script>

<style lang="scss" scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 10px;

  &:hover {
    background-color: var(--background-color-sider-hover);
  }

  &.selected {
    background-color: #ff4d4d;
    color: white;

    .menu-font {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg);
    }

    .menu-badge {
      background-color: white;
    }
  }
}

// 将文本截断样式移到这里，使其在所有状态下都生效
.menu-text {
  font-size: var(--font-size-lg);
  color: #333;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-iconfont {
  font-size: var(--font-size-sm);
  color: #333;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 选中状态下的文字颜色覆盖
.selected {
  .menu-text,
  .menu-iconfont {
    color: white;
  }
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  width: 40px;
  height: 40px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 10%;
    object-fit: contain;
  }
}

.menu-font {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);

  .iconfont {
    font-size: var(--font-size-xl);
  }
}

.menu-badge {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4d4d;
  margin-left: 4px;
}
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  width: 40px;
  height: 40px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 10%;
    object-fit: contain;
  }

}

.menu-font {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);

  .iconfont {
    font-size: var(--font-size-xl);
  }

}


.menu-text {
  font-size: var(--font-size-md);
  color: #333;
  flex: 1;
}

.menu-iconfont {
  font-size: var(--font-size-sm);
  color: #333;
  flex: 1;
}

.menu-badge {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4d4d;
  margin-left: 4px;
}
</style>