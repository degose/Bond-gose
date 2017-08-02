import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from './components/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { 
      path: '/', name: 'home', 
      components: {
        default: Home,
        gnb: Navigation
      }
    },
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // }
  ]
})