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
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-all);
  border-radius: var(--border-radius-md);
  position: relative;
  margin: 2px 0;

  &:hover {
    background-color: var(--background-color-sider-hover);
  }

  &.selected {
    background-color: var(--background-color-selected);
    color: var(--text-color-white);

    .menu-font {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg);
    }

    .menu-badge {
      background-color: var(--text-color-white);
    }

    .menu-text,
    .menu-iconfont {
      color: var(--text-color-white);
      font-weight: var(--font-weight-normal);
    }
  }
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--border-radius-sm);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
}

.menu-font {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  .iconfont {
    font-size: var(--icon-size-lg);
    color: var(--text-color);
    transition: var(--transition-all);
  }
}

.menu-item.selected .menu-font .iconfont {
  color: var(--text-color-white);
}

.menu-text {
  font-size: var(--font-size-sm);
  color: var(--text-color);
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: var(--transition-all);
}

.menu-iconfont {
  font-size: var(--font-size-sm);
  color: var(--text-color);
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: var(--transition-all);
}

.menu-badge {
  width: 6px;
  height: 6px;
  border-radius: var(--border-radius-round);
  background-color: var(--primary-color);
  margin-left: var(--spacing-xs);
  flex-shrink: 0;
}
</style>