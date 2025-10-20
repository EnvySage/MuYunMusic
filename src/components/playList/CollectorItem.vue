<template>
    <div class="collectorItemBox">
        <div class="headerImg">
            <img :src="collectorData.collectorItem?.avatarUrl || avatar" alt="">
        </div>
        <div class="info">
            <div class="name">{{ collectorData.collectorItem?.nickName || "未知用户"}}</div>
            <div class="sign">{{ collectorData.collectorItem?.signature || "未知" }}</div>
        </div>
    </div>
</template>

<script setup>
import avatar from '@/image/avatar.png'
const collectorData = defineProps({
    collectorItem: {
        type: Object,
        default: () => ({
            avatarUrl: avatar,
            name: '未知',
            sign: '未知'
        })
    }
})
console.log("collectorData",collectorData)
</script>

<style lang="scss" scoped>
.collectorItemBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: #fff;
    position: relative;
    overflow: hidden;
    padding: 20px 0;
    &:hover {
        background-color: #f5f5f5;
        border-radius: 10px;
    }
    .headerImg {
        width: 70%;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        border: 2px solid #cc3737; /* 黄色边框 */
        box-shadow: 0 0 10px rgba(179, 55, 55, 0.5);

        img {
            width: 100%;
            object-fit: cover;
            object-position: center;
            aspect-ratio: 1/1;
        }
    }

    .info {
        text-align: center;
        color: #333;

        .name {
            font-size: var(--font-size-md);
            font-weight: bold;
            margin-bottom: 5px;
        }

        .sign {
            font-size: var(--font-size-sm);
            color: #666;
        }
    }
}

</style>