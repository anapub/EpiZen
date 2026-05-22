import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import contato from '../views/contato.vue'
import cadastro from '../views/cadastro.vue'
import inventario from '../views/inventario.vue'
import dashboard from '../components/dashboard.vue'
import entrega from '../views/entrega.vue'
import funcionario from '../views/funcionario.vue'
import relatorio from '../views/relatorio.vue'


const routes = [
    { path: '/', component: home },
    { path: '/login', component: login },
    { path: '/contato', component: contato },

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