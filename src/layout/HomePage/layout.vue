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
            <Footer></Footer>
        </div>
    </div>
</template>

<script setup>
import Header from './header.vue';
import Sider from './sider.vue';
import Footer from './footer.vue';
</script>

<style lang="scss" scoped>
.layout {
    transform: translate(0,0);
}
.footer {
  position: fixed;
  bottom: 0;
  width: 98%;
  max-width: 100vw;
  z-index: 1000;
  right: 0;
  left: 0;
  box-sizing: border-box;
}
</style>