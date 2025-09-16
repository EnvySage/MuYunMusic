import { defineStore } from "pinia";
import avatar from '@/image/avatar.png'
export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
        name: "未登录",
        avatar: avatar,
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