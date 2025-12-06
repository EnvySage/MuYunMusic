import { defineStore } from "pinia";
import avatar from '@/image/avatar.png'
export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
        id: "0",
        username: "未登录",
        nickname: "昵称",
        avatarUrl: avatar,
        favoritePlaylistId: "",
        token: "",
    },
    isLogin: false,
  }),
  getters: {
    getUser: (state) => state.user,
    getIsLogin: (state) => state.isLogin,
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setLogin(isLogin) {
      this.isLogin = isLogin;
    },
  },
});