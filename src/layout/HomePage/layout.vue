<template>
    <div class="layout">
        <div class="header">
            <Header></Header>
        </div>
        <el-splitter class="main">
            <el-splitter-panel size="12%" min="12%" max="50%">
                <Sider></Sider>
            </el-splitter-panel>
            <el-splitter-panel :min="800">
                
                <MenuCard 
        :bg-image=Card1
        song-title="今天《雪の降らない星》差sdasadssdasdadsdsaadssdas"
        song-artist="不経耳"
        :tracks="[
        { name: 'おしんこ' },
        { name: '雪の降らない星' },
        { name: 'すずめ feat.十明' }
        ]"
        />
            </el-splitter-panel>
        </el-splitter>
        <div class="footer">
        </div>
    </div>
</template>

<script setup>
import Header from './header.vue';
import Sider from './sider.vue';
import Card1 from "@/image/SongMenuImg/Card1.jpg"
import MenuCard from '@/components/songMenuCard.vue'
</script>

<style lang="scss" scoped>
</style>