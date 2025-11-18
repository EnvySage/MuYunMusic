import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import persist from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import '@/style/main.css'

const app = createApp(App)
const pinia = createPinia()
// pinia.use(persist)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')


