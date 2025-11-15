<template>
    <div class="collectorBox">
        <CollectorItem class="CollectorItem" v-for="collectorItem in collectorStore.collectorPlaylist" :collectorItem="collectorItem"/>
    </div>
</template>

<script setup>
import { onMounted,watch } from 'vue';
import CollectorItem from './CollectorItem.vue';
import { useCollectorStore } from '../../stores/CollectorStore';
const collectorStore = useCollectorStore();
const props = defineProps({
  playlistId: {
    type: String,
    default: ""
  }
  
})
onMounted(async() => {
     await collectorStore.getCollectorPlaylist(props.playlistId);
    console.log("收藏者获取",collectorStore.collectorPlaylist)
});
watch(() => props.playlistId, async (newId) => {
    await collectorStore.getCollectorPlaylist(newId);
    console.log("收藏者获取",collectorStore.collectorPlaylist)
});
</script>

<style lang="scss" scoped>

.collectorBox {
    margin: 20px 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* 6 列，每列等宽 */
    gap: 16px; /* 控制间距 */
    justify-content: space-around;
    .CollectorItem {
        min-width: 80px;
        max-width: 100%; /* 防止超出 */
        user-select: none;
    }
}
</style>