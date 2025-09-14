<template>
    <div class="playControlContainer" :style="{'backgroundColor': lyricStore.lyricPage ? 'transparent' : 'white'}">
        <div class="audioProgressShow" v-if="lyricStore.lyricPage">
            <el-slider v-model="progressValue" :min="0" :max="100" :step="1" @change="onProgressChange" @input="onProgressInput" />
        </div>
        <div class="albumContainer">
            <img :src="avatar" alt="" @click="lyricStore.toggleLyricPage()" v-if="!lyricStore.lyricPage">
            <div class="album">
                <div class="albumInfo" v-if="!lyricStore.lyricPage">
                    <div class="albumName">{{ currentSong.title }}</div>
                    -
                    <div class="albumAuthor">{{ currentSong.artist }}</div>
                </div>
                <div class="albumFunction" :style="{'filter': lyricStore.lyricPage ? 'invert(100%)' : 'invert(0%)' }">
                    <div class="iconfont icon-piliangguanli"></div>
                    <div class="iconfont icon-pinglun"></div>
                    <div class="iconfont icon-fenxiang"></div>
                    <div class="iconfont icon-xiazai"></div>
                                    <div class="time-text" v-if="lyricStore.lyricPage">
                    {{ formattedCurrentTime }} / {{ formattedDuration }}
                </div>
                </div>
            </div>
        </div>
        <div class="audioControllContainer">
            <div class="audioControl" :style="{'filter': lyricStore.lyricPage ? 'invert(100%)' : 'invert(0%)'}">
                <div class="iconfont icon-dianzan-xiankuang"></div>
                <div class="iconfont icon-shangyiji"></div>
                <div class="iconfont" :class="isPlaying ? 'icon-zanting1' : 'icon-bofang1'"
                    style="padding: 5px; background-color: red; border-radius: 50%; color: white;" @click="togglePlay"
                    :style="{'filter': lyricStore.lyricPage ? 'invert(100%)' : 'invert(0%)'}">
                </div>
                <div class="iconfont icon-xiayiji"></div>
                <div class="iconfont icon-suijibofang"></div>
            </div>
            <div class="audioProgress" v-if="!lyricStore.lyricPage">
                <el-slider v-model="progressValue" :min="0" :max="100" :step="1" @change="onProgressChange" @input="onProgressInput" />
                <div class="time-text">
                    {{ formattedCurrentTime }} / {{ formattedDuration }}
                </div>
            </div>
        </div>
        <div class="extraFunctionContainer">
            <div class="extraFunction" :style="{'filter': lyricStore.lyricPage ? 'invert(100%)' : 'invert(0%)'}">
                <div class="iconfont icon-geci" style="font-size: 2.5rem;" @click="lyricStore.toggleLyricPage()"></div>
                <div class="iconfont icon-yinxiao" style="font-size: 2rem;"></div>
                <div class="iconfont icon-yinliangxiao"></div>
                <div class="iconfont icon-bofangduilie"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import avatar from '@/image/avatar.png'
import { ref, computed } from 'vue'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import { useLyricStore } from '@/stores/lyric'

const musicPlayerStore = useMusicPlayerStore()
const lyricStore = useLyricStore()

// 计算属性
const isPlaying = computed(() => musicPlayerStore.isPlaying)
const currentTime = computed(() => musicPlayerStore.currentTime)
const duration = computed(() => musicPlayerStore.duration)

// 格式化时间
const formatTime = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))
const isDragging = ref(false)
const dragValue = ref(0) 
const progressValue = computed({
  get: () => {
    if (!duration.value) return 0
        if (isDragging.value) {
      return dragValue.value
    }
    const percent = (currentTime.value / duration.value) * 100
    return Math.round(percent * 10) / 10 // 保留一位小数
  },
  set: (value) => {
        if (isDragging.value) {
      dragValue.value = value
      return
    }
  if (!isDragging.value && musicPlayerStore.audioElement) {
    const seekTime = (value / 100) * duration.value
    // 只有当变化超过 0.1 秒时才更新
    if (Math.abs(seekTime - currentTime.value) > 0.1) {
      musicPlayerStore.audioElement.currentTime = seekTime
    }
  }
}
})

// 播放/暂停切换
const togglePlay = () => {
    musicPlayerStore.togglePlay()
}

const onProgressInput = (value) => {
  isDragging.value = true
  dragValue.value = value
}

const onProgressChange = (value) => {
  isDragging.value = false
    dragValue.value = value
  
  // 在这里直接更新音频位置，而不是依赖 progressValue.set
  if (musicPlayerStore.audioElement && duration.value) {
    const seekTime = (value / 100) * duration.value
    musicPlayerStore.audioElement.currentTime = seekTime
  }
}

// 歌曲信息（示例）
const currentSong = ref({
    title: '晚餐歌',
    artist: 'tuki.'
})

</script>
<style lang="scss" scoped>
.playControlContainer {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 20px 40px;
    border-top: 1px solid var(--color-border);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: relative;
    backdrop-filter: blur(10px);

    .audioProgressShow {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 85px;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        width: 100%;
        :deep(.el-slider) {
            --el-slider-main-bg-color: red;
            --el-slider-runway-bg-color: #ddd;

            .el-slider__runway {
                height: 8px;
                margin: 10px 0;
            }

            .el-slider__bar {
                height: 8px;
            }

            .el-slider__button {
                width: 18px;
                height: 16px;
                border: none;
                background-color: white;
                border-radius: 50%;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
                transform: translateX(-50%);
            }

            .el-slider__button-wrapper {
                width: 12px;
                height: 12px;
                top: 0;
                transform: translateY(-50%);
            }
        }

        .time-text {
            display: flex;
        }
    }

    .albumContainer {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;

        img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 50%;
            box-shadow: 0 0 0 10px black;
        }

        .album {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);

            .albumInfo {
                display: flex;
                font-size: var(--font-size-xl);
                gap: var(--spacing-xs);
                align-items: center;

                .albumName {
                    color: var(--text-color-light);
                    font-weight: var(--font-weight-bold);
                }

                .albumAuthor {
                    color: var(--text-color-lighter);
                    font-weight: var(--font-weight-light);
                }
            }

            .albumFunction {
                display: flex;
                gap: var(--spacing-md);
                align-items: center;
                .iconfont {
                    font-size: var(--font-size-xl);
                    filter: invert(50%)
                }

                .iconfont:hover {
                    filter: invert(0)
                }
            }
        }
    }

    .audioControllContainer {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        width: 30%;

        .audioControl {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: var(--spacing-lg);

            .iconfont {
                font-size: var(--font-size-xl);
                transition: all 0.3s ease;
            }

            .iconfont:not(:nth-child(3)):hover {
                filter: invert(50%);
            }

            .iconfont:nth-child(3):hover {
                transform: scale(1.1);
            }
        }

        .audioProgress {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            width: 100%;

            :deep(.el-slider) {
                --el-slider-main-bg-color: red;
                --el-slider-runway-bg-color: #ddd;
                width: 80%;

                .el-slider__runway {
                    height: 8px;
                    margin: 10px 0;
                }

                .el-slider__bar {
                    height: 8px;
                }

                .el-slider__button {
                    width: 18px;
                    height: 16px;
                    border: none;
                    background-color: white;
                    border-radius: 50%;
                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
                    transform: translateX(-50%);
                }

                .el-slider__button-wrapper {
                    width: 12px;
                    height: 12px;
                    top: 0;
                    transform: translateY(-50%);
                }
            }

            .time-text {
                display: flex;
            }
        }
    }

    .extraFunctionContainer {
        display: flex;
        align-items: center;

        .extraFunction {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);

            .iconfont {
                font-size: var(--font-size-xl);
                filter: invert(50%);
                transition: all 0.3s ease;
            }

            .iconfont:hover {
                filter: invert(0);
            }
        }
    }
}
</style>