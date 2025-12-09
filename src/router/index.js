import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/layout/HomePage/layout.vue'),
      children: [
        {
          path: '',
          name: 'recommend',
          component: () => import('@/layout/HomePage/view/recommend.vue'),
        },{
          path: 'songList/:id',
          name: 'songList',
          component: () => import('@/layout/HomePage/view/songList.vue'),
        },{
          path: 'userProfile/:id',
          name: 'userProfile',
          component: () => import('@/layout/HomePage/view/userProfile.vue'),
        },{
          path: 'favorite',
          name: 'favorite',
          component: () => import('@/layout/HomePage/view/songList.vue'),
        },{
          path: 'search',
          name: 'search',
          component: () => import('@/layout/HomePage/view/search.vue'),
        }],
    }
  ],
})

export default router
