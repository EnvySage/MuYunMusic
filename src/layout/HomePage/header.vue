<template>
    <div class="homeLayout">
        <div class="header">
            <div class="left">
                <div class="header-logo iconfont icon-wangyiyunyinle1" @click="goToIndex"></div>
                <div class="header-search">
                    <div class="search-back iconfont icon-down" @click="backPreview" style="transform: rotate(90deg);"></div>
                    <div class="search-input">
                        <div class="iconfont icon-sousuosearch"></div>
                        <input type="text" placeholder="搜索音乐、歌单、专辑" />
                    </div>
                    <div class="search-speak">
                        <div class="iconfont icon-maikefeng"></div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="header-user_bucket" @click="UserPage">
                    <div class="user_logo">
                        <img :src="user.avatarUrl" alt="用户图片" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                    </div>
                    <div class="user_name">{{user.username}}</div>
                    <div class="iconfont icon-down"></div>
                </div>
                <div class="header-user_function">
                    <div class="iconfont icon-youjian1"></div>
                    <div class="iconfont icon-shezhi" @click="handleLogin"></div>
                    <div class="iconfont icon-gexinghua" @click="toggleTheme"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useComponentStatusStore } from '@/stores/componentStatus';
import { useThemeStore } from '@/stores/theme';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const componentStatusStore = useComponentStatusStore();
const themeStore = useThemeStore();
const user = computed(() => userStore.user);
const router = useRouter();

onMounted(() => {
  themeStore.initTheme();
});

const goToIndex = () => {
    router.push('/');
}

const handleLogin = () => {
    if(!userStore.isLogin){
        componentStatusStore.showLoginComponent();
    }
}

const backPreview = () => {
    router.back();
}

const toggleTheme = () => {
    themeStore.toggleTheme();
}

 const UserPage = () => {
    router.push('/userProfile/' + userStore.user.id);
 }
</script>

<style lang="scss" scoped>
.header {
    background: var(--primary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    position: relative;
    z-index: var(--z-index-fixed);

    .left {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);

        .header-logo {
            font-size: 32px;
            color: var(--text-color-white);
            cursor: pointer;
            transition: var(--transition-all);
            
            &:hover {
                opacity: 0.8;
                transform: scale(1.05);
            }
        }

        .header-search {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);

            .search-back {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: var(--border-radius-md);
                background: rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: var(--transition-all);
                color: var(--text-color-white);

                &:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .icon-down {
                    font-size: var(--font-size-md);
                    transform: rotate(90deg);
                }
            }

            .search-input {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                padding: 0 var(--spacing-md);
                width: 320px;
                height: 36px;
                border-radius: var(--border-radius-lg);
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: var(--transition-all);

                &:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                &:focus-within {
                    background: rgba(255, 255, 255, 0.25);
                    border-color: rgba(255, 255, 255, 0.4);
                }

                .iconfont {
                    font-size: var(--icon-size-md);
                    color: rgba(255, 255, 255, 0.8);
                }

                input {
                    flex: 1;
                    color: var(--text-color-white);
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: var(--font-size-sm);
                    height: 100%;

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.6);
                    }
                }
            }

            .search-speak {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: var(--border-radius-md);
                background: rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: var(--transition-all);
                color: var(--text-color-white);

                &:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .icon-maikefeng {
                    font-size: var(--icon-size-md);
                }
            }
        }
    }

    .right {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        margin-right: var(--spacing-xl);

        .header-user_bucket {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--border-radius-lg);
            cursor: pointer;
            transition: var(--transition-all);

            &:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .user_logo {
                width: 36px;
                height: 36px;
                border-radius: var(--border-radius-round);
                background: var(--third-color);
                overflow: hidden;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }

            .user_name {
                color: var(--text-color-white);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-normal);
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .icon-down {
                font-size: var(--icon-size-sm);
                color: rgba(255, 255, 255, 0.8);
                transition: var(--transition-all);
            }

            &:hover .icon-down {
                color: var(--text-color-white);
            }
        }

        .header-user_function {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);

            .iconfont {
                font-size: var(--icon-size-lg);
                color: rgba(255, 255, 255, 0.9);
                cursor: pointer;
                transition: var(--transition-all);
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-sm);

                &:hover {
                    color: var(--text-color-white);
                    background: rgba(255, 255, 255, 0.1);
                }
            }
        }
    }
}
</style>