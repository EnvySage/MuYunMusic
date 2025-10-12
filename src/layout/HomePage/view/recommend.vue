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
                <song-menu-card v-for="songListItem in songCardList1" :CardTitle="songListItem.name" :bg-image=songListItem.coverUrl :song-title="songListItem.description" song-artist="来自官方"
                    :tracks="songListItem.tracks" :show-play-button="true" @click="navigatoPlaylist(songListItem.id)"></song-menu-card>
            </div>
        </div>
        <div class="recommendSongSpecial">
            <div class="CardList-title">推荐歌单</div>
            <div class="CardList">
                <song-menu-card v-for="songListItem in songCardList2" :CardTitle="songListItem.name" :bg-image=songListItem.coverUrl :song-title="songListItem.description" song-artist="来自官方"
                    :tracks="songListItem.tracks" :show-play-button="true" @click="navigatoPlaylist(songListItem.id)"></song-menu-card>
            </div>
        </div>
        <div class="rankList">
            <div class="CardList-title">排行榜</div>
            <div class="CardList">
                <rankList v-for="(rank, index) in rankLists" :key="index" :title="rank.title"
                    :update-frequency="rank.updateFrequency" :songs="rank.songs" />
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
import RecommendCard from '@/components/recommendCard.vue'
import SongMenuCard from '@/components/songMenuCard.vue'
import rankList from '@/components/rankList.vue'
import avatar from '@/image/avatar.png'
import { useAdminPlaylistStore } from '@/stores/AdminPlaylist'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const adminPlaylistStore = useAdminPlaylistStore();
const songCardData = computed(() => {
    return [...adminPlaylistStore.adminPlaylist1];
});
const songCardList1 = computed(() => {
    return songCardData.value.slice(0, 6);
});
const songCardList2 = computed(() => {
    return songCardData.value.slice(6, 14);
});
const navigatoPlaylist = (id) => {
  if (id !== undefined && id !== null) {
    console.log('跳转到歌单ID:', id);
    router.push({
      name: 'songList',
      params: {
        id: id,
      },
    });
  }
}
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
const songsData = [
    {
        id: 1,
        name: '沦陷',
        artist: '李嘉格',
        cover: avatar,
        isNew: false
    },
    {
        id: 2,
        name: '晨昏线',
        artist: '梓渝',
        cover: avatar,
        isNew: true
    },
    {
        id: 3,
        name: '时间就是伤口',
        artist: '范世錡',
        cover: avatar,
        isNew: true
    }
]
const rankLists = [
    { title: '飙升榜', updateFrequency: '每天更新', songs: songsData },
    { title: '新歌榜', updateFrequency: '每天更新', songs: songsData },
    { title: '热歌榜', updateFrequency: '每天更新', songs: songsData },
    { title: '原创榜', updateFrequency: '每周四更新', songs: songsData },
    { title: '数字专辑畅销榜', updateFrequency: '每30分钟更新', songs: songsData },
    { title: '歌曲畅销指数榜', updateFrequency: '每1小时更新', songs: songsData }
];
const handlePlay = (song) => {
    console.log('Playing song:', song);
};
</script>

<style lang="scss" scoped>
.container {
    margin: 1% 5%;
    width: 90%;
    // overflow: hidden;
    background-color: var(--background-color);
    padding-bottom: 100px;
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
        width: 50%;
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
        gap: var(--spacing-xl);
    }
}

.rankList {
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
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-xl);
        width: 100%;

        // 平板设备
        @media (max-width: 1200px) {
            grid-template-columns: repeat(2, 1fr);
        }

        // 手机设备
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }
}
</style>