import { 
  createRouter,
  createWebHashHistory
} from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    component: () => import('./pages/Home')
  }, {
    path: '/blank',
    component: () => import('./pages/Blank')
  }]
})
