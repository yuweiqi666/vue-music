import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/login')
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('../views/dashboard'),
    redirect: '/dashboard/recommend',
    children: [
      {
        name: 'recommend',
        path: 'recommend',
        component: () => import('../views/recommend'),
        children: [
          {
            name: 'songListDetail',
            path: 'songListDetail/:id',
            component: () => import('../views/songListDetail')
          }
        ]
      },
      {
        name: 'singer',
        path: 'singer',
        component: () => import('../views/singer'),
        children: [
          {
            name: 'song',
            path: 'song/:id',
            component: () => import('../views/song')
          }
        ]
      },
      {
        name: 'rank',
        path: 'rank',
        component: () => import('../views/rank'),
        children: [
          {
            name: 'rankDetail',
            path: 'rankDetail/:id',
            component: () => import('../views/rankDetail')
          }
        ]
      },
      {
        name: 'search',
        path: 'search',
        component: () => import('../views/search')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
