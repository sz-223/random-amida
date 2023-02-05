import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SelectView from '../views/SelectView.vue'
import GameView from '../views/GameView.vue'
import ResultView from '../views/ResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SelectView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    }
  ]
})

export default router
