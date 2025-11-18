<template>
  <div class="user-nav-bar">
    <div
      v-for="(item, index) in navItems"
      :key="index"
      :class="['nav-item', { active: currentTab === item.key }]"
      @click="handleNavClick(item.key)"
    >
      <span class="nav-text">{{ item.label }}</span>
      <span class="nav-count" v-if="item.count !== undefined && item.count > 0">
        {{ item.count }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentTab: {
    type: String,
    default: 'playlist'
  },
  navItems: {
    type: Array,
    default: () => [
      { key: 'playlist', label: '歌单', count: undefined },
      { key: 'notes', label: '笔记', count: 6 },
      { key: 'podcast', label: '播客', count: 13 }
    ]
  }
})

const emit = defineEmits(['tab-change'])

const handleNavClick = (key) => {
  emit('tab-change', key)
}
</script>

<style lang="scss" scoped>
.user-nav-bar {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-lg) var(--spacing-xl);
  background-color: var(--background-color-white);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border-bottom: 2px solid transparent;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  color: var(--text-color);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  transition: var(--transition-all);
  position: relative;
  border-bottom: 2px solid transparent;
  margin-bottom: calc(-1 * var(--spacing-lg) - 2px);

  &:hover {
    color: var(--primary-color);
  }

  &.active {
    color: var(--primary-color);
    font-weight: var(--font-weight-bold);
    border-bottom-color: var(--primary-color);
  }
}

.nav-text {
  line-height: 1;
}

.nav-count {
  font-size: var(--font-size-xs);
  color: var(--text-color-lighter);
  vertical-align: super;
  line-height: 1;
  margin-left: 2px;
}

.nav-item.active .nav-count {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .user-nav-bar {
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .nav-item {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
}
</style>

