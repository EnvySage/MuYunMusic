<template>
    <div class="playControlContainer" :style="{ 'backgroundColor': lyricStore.lyricPage ? 'transparent' : 'white' }">
        <div class="audioProgressShow" v-if="lyricStore.lyricPage">
            <el-slider v-model="progressValue" :min="0" :max="100" :step="1" @change="onProgressChange"
                @input="onProgressInput" />
        </div>
        <div class="albumContainer">
            <img :src="musicPlayerStore.currentSong.cover" alt="" @click="lyricStore.toggleLyricPage()"
                v-if="!lyricStore.lyricPage"
                :style="{ '--album-rotation-state': musicPlayerStore.isPlaying ? 'runing' : 'paused' }">
            <div class="album">
                <div class="albumInfo" v-if="!lyricStore.lyricPage">
                    <div class="albumName">{{ musicPlayerStore.currentSong.title }}</div>
                    -
                    <div class="albumAuthor">{{ musicPlayerStore.currentSong.artist }}</div>
                </div>
                <div class="albumFunction" :style="{ 'filter': lyricStore.lyricPage ? 'invert(100%)' : 'invert(0%)' }">
                    <div class="iconfont icon-shoucang1"></div>
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
            <div class="audioControl" >
                <div class="iconfont" :class="musicPlayerStore.currentSong.like? 'icon-xihuan':'icon-dianzan-xiankuang'" :style="{color:musicPlayerStore.currentSong.like? 'red': 'none'}"></div>
                <div class="iconfont icon-shangyiji" @click="switchplayer(0)"></div>
                <div class="iconfont" :class="musicPlayerStore.isPlaying ? 'icon-zanting1' : 'icon-bofang1'"
                    style="padding: 5px; background-color: red; border-radius: 50%; color: white;" @click="togglePlay"
                    >
                </div>
                <div class="iconfont icon-xiayiji" @click="switchplayer(1)"></div>
                <div class="iconfont" :class="playerStore.playModeIcon" @click="togglePlayMode"></div>
            </div>
            <div class="audioProgress" v-if="!lyricStore.lyricPage">
                <el-slider v-model="progressValue" :min="0" :max="100" :step="1" @change="onProgressChange"
                    @input="onProgressInput" />
                <div class="time-text">
                    {{ formattedCurrentTime }} / {{ formattedDuration }}
                </div>
            </div>
        </div>
        <div class="extraFunctionContainer">
            <div class="extraFunction" :style="{ 'filter': lyricStore.lyricPage ? 'invert(100%)' : 'invert(0%)' }">
                <div class="iconfont icon-geci" style="font-size: 2.5rem;" @click="lyricStore.toggleLyricPage()"></div>
                <div class="iconfont icon-yinxiao" style="font-size: 2rem;"></div>
                <div class="controlVolume">
                    <div class="volume-panel" v-show="showVolumePanel" ref="volumePanel">
                        <el-slider v-model="volumeValue" :min="0" :max="100" :vertical="true" height="100px"
                            @change="onVolumeChange" />
                    </div>
                    <div class="iconfont icon-yinliangxiao" @click="toggleVolumePanel" ref="volumeIcon"></div>
                </div>
                <div class="iconfont icon-bofangduilie" @click="playerStore.togglePlayer"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import { useLyricStore } from '@/stores/lyric'
import { usePlayerStore } from '@/stores/playerList'
const musicPlayerStore = useMusicPlayerStore()
const lyricStore = useLyricStore()
const playerStore = usePlayerStore()
// 音量控制相关
const showVolumePanel = ref(false)
const volumeValue = ref(musicPlayerStore.volume * 100)
const volumeIcon = ref(null)
const volumePanel = ref(null)


const switchplayer = (upAnddown) => {
    if (upAnddown === 0) {
        playerStore.prevSong()
    } else {
        playerStore.nextSong()
    }
    console.log('切换歌曲' + playerStore.currentSongIndex)
}

// 切换播放模式
const togglePlayMode = () => {
    playerStore.togglePlayMode()
}

// 切换音量面板显示
const toggleVolumePanel = (event) => {
    event.stopPropagation()
    showVolumePanel.value = !showVolumePanel.value
}

// 音量变化处理
const onVolumeChange = (value) => {
    volumeValue.value = value
    musicPlayerStore.volume = value / 100
    if (musicPlayerStore.audioElement) {
        musicPlayerStore.audioElement.volume = value / 100
    }
}

// 点击外部关闭音量面板
const handleClickOutside = (event) => {
    if (showVolumePanel.value &&
        volumeIcon.value &&
        volumePanel.value &&
        !volumeIcon.value.contains(event.target) &&
        !volumePanel.value.contains(event.target)) {
        showVolumePanel.value = false
    }
}

watch(() => musicPlayerStore.volume, (newVolume) => {
    volumeValue.value = newVolume * 100
})

// 挂载时添加事件监听器
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

// 卸载前移除事件监听器
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

// 格式化时间
const formatTime = (seconds) => {
    // 添加更完善的边界检查
    if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const formattedCurrentTime = computed(() => formatTime(musicPlayerStore.currentTime))
const formattedDuration = computed(() => formatTime(musicPlayerStore.duration))
const isDragging = ref(false)
const dragValue = ref(0)

const progressValue = computed({
    get: () => {
        // 添加边界检查
        if (!musicPlayerStore.duration || musicPlayerStore.duration <= 0) return 0
        if (isDragging.value) {
            return dragValue.value
        }
        const percent = (musicPlayerStore.currentTime / musicPlayerStore.duration) * 100
        return isNaN(percent) ? 0 : Math.min(100, Math.max(0, Math.round(percent * 10) / 10)) // 限制在0-100范围内
    },
    set: (value) => {
        // 不再在 set 中直接更新音频时间，只在拖动结束时更新
        isDragging.value = true
        dragValue.value = value
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

    // 添加音频元素存在性检查
    if (musicPlayerStore.audioElement && musicPlayerStore.duration > 0) {
        const seekTime = (value / 100) * musicPlayerStore.duration
        musicPlayerStore.audioElement.currentTime = seekTime
    }
}
// 监听音频元素变化，确保进度条正常工作
watch(() => musicPlayerStore.audioElement, (newAudioElement) => {
    if (newAudioElement) {
        // 确保音频元素状态同步
        musicPlayerStore.setPlayingState(!newAudioElement.paused)
        musicPlayerStore.setDuration(newAudioElement.duration || 0)
        musicPlayerStore.setCurrentTime(newAudioElement.currentTime || 0)
    }
}, { immediate: true })

</script>

<style lang="scss" scoped>
.playControlContainer {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: var(--spacing-md) var(--spacing-xl);
    border-top: 1px solid var(--border-color);
    background: var(--background-color-white);
    box-shadow: var(--shadow-md);
    position: relative;
    z-index: var(--z-index-fixed);

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
            --el-slider-main-bg-color: var(--primary-color);
            --el-slider-runway-bg-color: var(--border-color);

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
        width: 400px;
        flex-wrap: nowrap;

        img {
            width: 56px;
            height: 56px;
            object-fit: cover;
            border-radius: var(--border-radius-round);
            box-shadow: var(--shadow-sm);
            cursor: pointer;
            transition: var(--transition-all);
            animation: rotateAlbum 20s linear infinite;
            animation-play-state: var(--album-rotation-state, paused);

            &:hover {
                box-shadow: var(--shadow-md);
                transform: scale(1.05);
            }
        }

        @keyframes rotateAlbum {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .album {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);

            .albumInfo {
                display: flex;
                font-size: var(--font-size-sm);
                gap: var(--spacing-xs);
                align-items: center;

                .albumName {
                    color: var(--text-color);
                    font-weight: var(--font-weight-normal);
                    font-size: var(--font-size-sm);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                }

                .albumAuthor {
                    color: var(--text-color-lighter);
                    font-weight: var(--font-weight-normal);
                    font-size: var(--font-size-xs);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100px;
                }
            }

            .albumFunction {
                display: flex;
                gap: var(--spacing-md);
                align-items: center;

                .iconfont {
                    font-size: var(--icon-size-md);
                    color: var(--text-color-light);
                    cursor: pointer;
                    transition: var(--transition-all);
                    padding: var(--spacing-xs);
                    border-radius: var(--border-radius-sm);

                    &:hover {
                        color: var(--text-color);
                        background-color: var(--background-color-sider-hover);
                    }
                }

                .time-text {
                    font-size: var(--font-size-xs);
                    color: var(--text-color-lighter);
                    white-space: nowrap;
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
                font-size: var(--icon-size-lg);
                color: var(--text-color);
                transition: var(--transition-all);
                cursor: pointer;
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-sm);

                &:not(:nth-child(3)):hover {
                    color: var(--primary-color);
                    background-color: var(--background-color-sider-hover);
                }

                &:nth-child(3) {
                    color: var(--text-color-white);
                    background-color: var(--primary-color);
                    border-radius: var(--border-radius-round);
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:hover {
                        background-color: var(--primary-color-hover);
                        transform: scale(1.1);
                    }
                }
            }
        }

        .audioProgress {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            width: 100%;

            :deep(.el-slider) {
                --el-slider-main-bg-color: var(--primary-color);
                --el-slider-runway-bg-color: var(--border-color);
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
                font-size: var(--font-size-xs);
                color: var(--text-color-lighter);
                white-space: nowrap;
                min-width: 80px;
            }
        }
    }

    .extraFunctionContainer {
        display: flex;
        align-items: center;
        position: relative;

        .controlVolume {
            display: flex;
            gap: var(--spacing-md);
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .extraFunction {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);

            .iconfont {
                font-size: var(--icon-size-lg);
                color: var(--text-color-light);
                transition: var(--transition-all);
                cursor: pointer;
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-sm);

                &:hover {
                    color: var(--text-color);
                    background-color: var(--background-color-sider-hover);
                }
            }
        }

    }

    // 音量控制面板样式
    .volume-panel {
        position: absolute;
        bottom: 40px;
        background: var(--background-color-white);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-md) var(--spacing-xs);
        box-shadow: var(--shadow-lg);
        backdrop-filter: blur(10px);
        z-index: var(--z-index-popover);
        border: 1px solid var(--border-color);

        :deep(.el-slider) {
            --el-slider-main-bg-color: var(--primary-color);
            --el-slider-runway-bg-color: var(--border-color);

            .el-slider__runway {
                width: 6px;
            }

            .el-slider__bar {
                width: 6px;
            }

            .el-slider__button {
                width: 16px;
                height: 16px;
                border: none;
                background-color: white;
                border-radius: 50%;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            }
        }
    }
}
</style>