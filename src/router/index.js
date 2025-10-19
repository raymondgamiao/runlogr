import { createRouter, createWebHistory } from 'vue-router'
import RunsView from '@/views/RunsView.vue'
import Dashboard from '../views/DashboardView.vue' 

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/runs',
    name: 'runs',
    component: RunsView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
