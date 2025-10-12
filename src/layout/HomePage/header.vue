<template>
    <div class="homeLayout">
        <div class="header">
            <div class="left">
                <div class="header-logo iconfont icon-wangyiyunyinle1" @click="goToIndex"></div>
                <div class="header-search">
                    <div class="search-back iconfont icon-down" @click="backPreview"></div>
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
                <div class="header-user_bucket" @click="handleLogin">
                    <div class="user_logo">
                        <img :src="user.avatarUrl" alt="用户图片" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                    </div>
                    <div class="user_name">{{user.username}}</div>
                    <div class="iconfont icon-down"></div>
                </div>
                <div class="header-user_function">
                    <div class="iconfont icon-youjian1"></div>
                    <div class="iconfont icon-shezhi"></div>
                    <div class="iconfont icon-gexinghua"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useUserStore } from '@/stores/user';
import { useComponentStatusStore } from '@/stores/componentStatus';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const userStore = useUserStore();
const componentStatusStore = useComponentStatusStore();
const user = computed(() => userStore.user);
const router=useRouter();
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
</script>

<style lang="scss" scoped>
.header{
    background: var(--primary-color);
    display: flex;
    justify-content: space-between;
    .left{
        display: flex;
        align-items: center;
        .header-logo{
            font-size: 30px;
            margin: 20px;
        }
        .header-search{
            display: flex;
            margin-left: 20px;
            gap: 10px;
            .search-back{
                border: 1px solid var(--third-color);
                padding: 5px 8px;
                border-radius: 10px;
            }
            .icon-down{
                font-size: var(--font-size-lg);
                transform: rotate(90deg);
            }
            .search-input{
                display: flex;
                align-items: center;
                padding: 4px 10px;
                width: 300px;
                height: 30px;
                border-radius: 10px;
                background: var(--third-color);
                input{
                    color: var(--text-color-light);
                    border: none;
                    outline: none;
                    background: transparent;
                    width: 100%;
                    height: 100%;
                    padding: 0 10px;
                }
            }
            .search-speak{
                display: flex;
                align-items: center;
                padding: 5px 8px;
                border: 1px solid var(--third-color);
                border-radius: 10px;
                .icon-maikefeng{
                    font-size: var(--icon-size-md);
                }
            }
        }
    }
    .right{
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        margin-right: 200px;
        .header-user_bucket{
            display: flex;
            align-items: center;
            .user_logo{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--third-color);
            }
            .user_name{
                color: var(--text-color-white);
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-light);
                margin-left: 10px;
            }   
        }
        .header-user_function{
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            .icon-youjian{
                font-size: var(--icon-size-lg);
            }
            .icon-shezhi{
                font-size: var(--icon-size-lg);
            }
            .icon-gexinghua{
                font-size: var(--icon-size-lg);
            }
        }
    }
}
</style>