import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Contato from '../views/Contato.vue'

const routes = [
{ path: '/', component: Home },
{ path: '/Login', component: Login },
{ path: '/Contato', component: Contato }
]
const router = createRouter({
history: createWebHistory(),
routes
})
export default router