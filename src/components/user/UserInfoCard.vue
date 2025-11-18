<template>
  <div class="user-info-card">
    <div class="user-avatar">
      <img :src="avatarUrl" alt="用户头像" />
    </div>
    <div class="user-details">
      <div class="user-header">
        <h2 class="username">{{ username }}</h2>
      </div>
      <div class="user-bio" v-if="bio">
        <span class="bio-label">简介:</span>
        <span class="bio-content">{{ bio }}</span>
      </div>
      <div class="user-location" v-if="location">
        <span class="location-label">地区:</span>
        <span class="location-content">{{ location }}</span>
      </div>
      <div class="user-social" v-if="socialAccounts && socialAccounts.length > 0">
        <span class="social-label">社交账号:</span>
        <div class="social-icons">
          <span v-for="(account, index) in socialAccounts" :key="index" class="social-icon" :title="account.name || ''">
            <i :class="account.icon" v-if="account.icon"></i>
            <span v-else>{{ account.name || '🔗' }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  avatarUrl: {
    type: String,
    default: 'https://via.placeholder.com/120x120?text=Avatar'
  },
  username: {
    type: String,
    default: '用户名'
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  socialAccounts: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.user-info-card {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  background-color: var(--background-color-white);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.user-avatar {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-round);
  overflow: hidden;
  border: 3px solid #d4a574;
  box-shadow: var(--shadow-md);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.user-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.username {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color-primary);
  margin: 0;
}

.user-badges {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.vip-badge {
  padding: 2px 8px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #8b6914;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--border-radius-sm);
  border: 1px solid #d4a574;
}

.level-badge {
  padding: 2px 8px;
  background-color: var(--primary-color);
  color: var(--text-color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--border-radius-sm);
}

.gender-icon {
  display: flex;
  align-items: center;
  color: var(--text-color-light);
  font-size: var(--font-size-md);
}

.user-stats {
  display: flex;
  gap: var(--spacing-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-color);
  font-size: var(--font-size-sm);
}

.stat-label {
  color: var(--text-color-light);
}

.stat-value {
  color: var(--text-color-primary);
  font-weight: var(--font-weight-bold);
}

.user-bio,
.user-location,
.user-social {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-color);
  line-height: 1.5;
}

.bio-label,
.location-label,
.social-label {
  color: var(--text-color-light);
  flex-shrink: 0;
}

.bio-content,
.location-content {
  color: var(--text-color);
  flex: 1;
}

.social-icons {
  display: flex;
  gap: var(--spacing-sm);
}

.social-icon {
  display: flex;
  align-items: center;
  color: var(--text-color-light);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: var(--transition-all);

  &:hover {
    color: var(--primary-color);
  }
}

@media (max-width: 768px) {
  .user-info-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-header {
    justify-content: center;
  }

  .user-stats {
    justify-content: center;
  }
}
</style>

