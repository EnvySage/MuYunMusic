import { defineStore } from "pinia";

export const useComponentStatusStore = defineStore("componentStatus", {
  state: () => ({
    LoginComponent: false,
    CollectComponent: false, // 添加收藏组件状态
    CreatePlaylistComponent: false, // 创建歌单组件状态
  }),
  actions: {
    showLoginComponent() {
      this.LoginComponent = true;
    },
    hideLoginComponent() {
      this.LoginComponent = false;
    },
    
    // 添加收藏组件的显示和隐藏方法
    showCollectComponent() {
      this.CollectComponent = true;
    },
    hideCollectComponent() {
      this.CollectComponent = false;
    },
    // 创建歌单组件的显示和隐藏方法
    showCreatePlaylistComponent() {
      this.CreatePlaylistComponent = true;
    },
    hideCreatePlaylistComponent() {
      this.CreatePlaylistComponent = false;
    }
  },
});