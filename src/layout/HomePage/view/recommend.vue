<template>
    <div class="container">
        <div class="header">
            <el-carousel :interval="5000" arrow="always" class="carousel">
                <el-carousel-item v-for="(item, index) in carouselData" :key="index">
                    <img :src=item alt="">
                </el-carousel-item>
            </el-carousel>
            <div class="header-recently">
                <div class="title">
                    <div class="greet" style="font-size: var(--font-size-xl);"><b>早上好，</b></div>
                    <div class="desc">猜你最近喜欢听</div>
                </div>
                <div class="recommend-cards">
                    <RecommendCard v-for="(card, index) in recommendCards" :key="index" :image-src="card.imageSrc"
                        :title="card.title" :subtitle="card.subtitle" @click="handleCardClick(card.type)" />
                </div>
            </div>
        </div>
        <div class="recommendSongSpecial">
            <div class="CardList-title">精选推荐</div>
            <div class="CardList">
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>

            </div>
        </div>
        <div class="recommendSongSpecial">
            <div class="CardList-title">精选推荐</div>
            <div class="CardList">
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>
                <song-menu-card CardTitle="每日推荐" :bg-image=Card1 song-title="断捨離 (feat. りりあ。)" song-artist="来自日推"
                    :tracks="[
                        { name: 'おしんこ' },
                        { name: '雪の降らない星' },
                        { name: 'すずめ feat.十明' }
                    ]" :show-play-button="true" @play="handlePlay"></song-menu-card>

            </div>
        </div>

    </div>
</template>

<script setup>
import pic1 from '@/image/Carousel/pic1.png'
import pic2 from '@/image/Carousel/pic2.png'
import pic3 from '@/image/Carousel/pic3.png'
import pic4 from '@/image/Carousel/pic4.png'
import pic5 from '@/image/Carousel/pic5.png'
import Card1 from '@/image/SongMenuImg/Card1.jpg'
import RecommendCard from '@/components/recommendCard.vue'
import SongMenuCard from '@/components/songMenuCard.vue'
const carouselData = [
    pic1,
    pic2,
    pic3,
    pic4,
    pic5
]
const recommendCards = [
    {
        type: 'redHeart',
        imageSrc: pic1,
        title: '红心歌单',
        subtitle: 'AOMONATSU'
    },
    {
        type: 'story',
        imageSrc: pic2,
        title: '大凯故事会：奇闻怪谈、鬼故事...',
        subtitle: '有声书'
    },
    {
        type: 'private',
        imageSrc: pic3,
        title: '私人雷达',
        subtitle: '歌单'
    },
    {
        type: 'life',
        imageSrc: pic4,
        title: '人生勿近 | 30年冬年·都市传奇...',
        subtitle: '播客'
    }
];
</script>

<style lang="scss" scoped>
.container {
    margin: 1% 5%;
    width: 90%;
    height: 100%;
    background-color: var(--background-color-sider);
}

.header {
    display: flex;
    justify-content: flex-start;
    gap: var(--spacing-xl);

    .carousel {
        width: 40%;
        height: 250px;
        border-radius: 15px;

        img {
            width: 100%;
            height: 100%;

        }
    }

    .header-recently {
        width: 40%;
        padding: 10px 20px;
        background-color: white;
        border-radius: 10px;

        .title {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
        }

        .recommend-cards {
            display: flex;
            gap: 16px;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 16px 0;
        }
    }
}

.recommendSongSpecial {
    width: 100%;
    display: flex;
    flex-direction: column;

    .CardList-title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-border);
        color: var(--text-color-light);
        margin: 20px 0;
    }

    .CardList {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }
}
</style>