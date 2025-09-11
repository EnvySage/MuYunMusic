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
                <router-view></router-view>
            </el-splitter-panel>
        </el-splitter>
        <div class="footer">
            
        </div>
    </div>
</template>

<script setup>
import Header from './header.vue';
import Sider from './sider.vue';
</script>

<style lang="scss" scoped>
</style>