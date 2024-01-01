import { createApp } from 'vue'
import { createRouter, createWebHistory  } from 'vue-router'
import App from './App.vue'
import About from './components/pages/About.vue'
import Game from './components/pages/Game.vue'
import Landing from './components/pages/Landing.vue'
import PixiDemo from './components/pages/PixiDemo.vue'
import './style.css'

const routes = [
    { path: '/', component: Landing },
    // { path: '/about', component: About },
    { path: '/game', component: Game },
    // { path: '/pixi-demo', component: PixiDemo },
    
]

const router = createRouter({
    history: createWebHistory (),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')