import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'theme',
        storage: localStorage,
      },
    ],
  },
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    },
    setTheme(isDark) {
      this.isDark = isDark;
      this.applyTheme();
    },
    applyTheme() {
      if (this.isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    initTheme() {
      this.applyTheme();
    },
  },
});

