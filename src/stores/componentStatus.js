import { defineStore } from "pinia";
export const useComponentStatusStore = defineStore("componentStatus", {
  state: () => ({
    LoginComponent: false,
  }),
  actions: {
    showLoginComponent() {
      this.LoginComponent = true;
    },
    hideLoginComponent() {
      this.LoginComponent = false;
    },
    
  },
});