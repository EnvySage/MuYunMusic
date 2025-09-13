<template>
    <div class="playControlContainer">
        <div class="albumContainer">
            <img :src=avatar alt=""></img>
            <div class="album">
                <div class="albumInfo">
                    <div class="albumName">夏恋</div>
                    -
                    <div class="albumAuthor">Otokaze</div>
                </div>
                <div class="albumFunction">
                    <div class="iconfont icon-piliangguanli"></div>
                    <div class="iconfont icon-pinglun"></div>
                    <div class="iconfont icon-fenxiang"></div>
                    <div class="iconfont icon-xiazai"></div>
                </div>
            </div>
        </div>
        <div class="audioControllContainer">
            <div class="audioControl">
                <div class="iconfont icon-dianzan-xiankuang"></div>
                <div class="iconfont icon-shangyiji"></div>
                <div class="iconfont icon-bofang1"
                    style="padding: 5px; background-color: red; border-radius: 50%; color: white;"></div>
                <div class="iconfont icon-xiayiji"></div>
                <div class="iconfont icon-suijibofang"></div>
            </div>
            <div class="audioProgress">
                <el-slider v-model="progressValue" :min="0" :max="100" :step="1" @change="onProgressChange" />
                <div class="time-text">2:30</div>
            </div>
        </div>

        <div class="extraFunctionContainer">
            <div class="extraFunction">
                <div class="iconfont icon-geci" style="font-size: 2.5rem;"></div>
                <div class="iconfont icon-yinxiao" style="font-size: 2rem;"></div>
                <div class="iconfont icon-yinliangxiao"></div>
                <div class="iconfont icon-bofangduilie"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import avatar from '@/image/avatar.png'
import { ref } from 'vue'
const progressValue = ref(50)

const onProgressChange = (value) => {
    console.log('进度改变:', value)
    // 处理进度改变的逻辑
}
</script>

<style lang="scss" scoped>
.playControlContainer {
    width: 100%;
    height: 80px;
    background-color: #fafafa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-top: 1px solid var(--color-border);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    .albumContainer {
        display: flex;
        gap: var(--spacing-md);

        img {
            width: 60px;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 50%;
            border: 10px solid black;
        }

        .album {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);

            .albumInfo {
                display: flex;
                font-size: var(--font-size-xl);
                gap: var(--spacing-xs);

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
        gap: var(--spacing-md);
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
  gap: var(--spacing-xs);

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
      transform: translateY(-100%);
    }
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