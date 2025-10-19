import { createRouter, createWebHistory } from 'vue-router'
import RunsView from '@/views/RunsView.vue'

const routes = [
  {
    path: '/',
    name: 'runs',
    component: RunsView,
  },
  // Optional: add a placeholder route for analytics or settings later
  // {
  //   path: '/analytics',
  //   name: 'analytics',
  //   component: () => import('@/views/AnalyticsView.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
