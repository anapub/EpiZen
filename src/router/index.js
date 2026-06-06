import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Contato from "../views/Contato.vue";

import Cadastro from "../views/cadastro.vue";
import Inventario from "../views/inventario.vue";
import Entrega from "../views/entrega.vue";
import Funcionario from "../views/funcionario.vue";
import Relatorio from "../views/relatorio.vue";

import Dashboard from "../components/dashboard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/contato",
    name: "Contato",
    component: Contato,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "cadastro",
        component: Cadastro,
      },
      {
        path: "entrega",
        component: Entrega,
      },
      {
        path: "inventario",
        component: Inventario,
      },
      {
        path: "funcionario",
        component: Funcionario,
      },
      {
        path: "relatorio",
        component: Relatorio,
      },
    ],
  },

  // Redireciona qualquer rota inválida para Home
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;