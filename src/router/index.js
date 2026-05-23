import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Contato from '../views/Contato.vue'
import cadastro from '../views/cadastro.vue'
import inventario from '../views/inventario.vue'
import dashboard from '../components/dashboard.vue'
import entrega from '../views/entrega.vue'
import funcionario from '../views/funcionario.vue'
import relatorio from '../views/relatorio.vue'


const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/contato', component: Contato },

    {path: '/dashboard',
    component: dashboard,
    meta: { requiresAuth: true },
    children: [
    { path: 'cadastro', component: cadastro },
    { path: 'entrega', component: entrega },
    { path: 'inventario', component: inventario },
      { path: 'funcionario', component: funcionario },
      { path: 'relatorio', component: relatorio },
    ]
    }
]

const router = createRouter({
history: createWebHistory(),
routes
})
export default router