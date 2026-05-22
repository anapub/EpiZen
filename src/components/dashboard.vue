<template>

  <!-- Container principal que divide a tela em Sidebar + Conteúdo -->
  <div class="shell">

    <!--SIDEBAR: Menu lateral fixo -->
    <aside class="sidebar">

      <!-- Logo/Título do sistema -->
      <div class="logo">
        <img src="../assets/Imagem-logo-sf.png" width="200" height="60">
      </div>

      <!-- Menu de navegação -->
      <nav class="menu">
        <RouterLink to="/dashboard/inventario" class="menu-item" active-class="active">
          <i class="fas fa-chart-bar"></i>
          <span>Inventário</span>
        </RouterLink>

        <RouterLink to="/dashboard/cadastro" class="menu-item" active-class="active">
          <i class="fas fa-chart-bar"></i>
          <span>Cadastro de EPIs</span>
        </RouterLink>

        <RouterLink to="/dashboard/entrega" class="menu-item" active-class="active">
          <i class="fas fa-box"></i>
          <span>Entrega de EPIs</span>
        </RouterLink>

        <RouterLink to="/dashboard/funcionario" class="menu-item" active-class="active">
          <i class="fas fa-users"></i>
          <span>Funcionários</span>
        </RouterLink>

        <RouterLink to="/dashboard/relatorio" class="menu-item" active-class="active">
          <i class="fas fa-chart-line"></i>
          <span>Relatórios</span>
        </RouterLink>

      </nav>

      <!-- Botão de logout -->
      <button @click="sair" class="botao-sair">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sair</span>
      </button>
    </aside>

    <!-- Conteúdo Central-->
    <main class="conteudo">
      <RouterView />
    </main>
    
  </div>
</template>

<script setup>

// Importações necessárias
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'

// Configurações para usar o Supabase e o Router
const { supabase } = useSupabase()
const router = useRouter()

// Função para sair (logout)
async function sair() {
  try {
    // PASSO 1: DESLOGAR O USUÁRIO
    await supabase.auth.signOut()

    // PASSO 2: REDIRECIONAR PARA A PÁGINA DE LOGIN
    router.push('/login')
  }

  // PASSO 3: TRATAR ERROS (SE HOUVER)
  catch (err) {
    console.error('Erro ao fazer logout:', err)
  }
}
</script>

<style scoped>
/* Estilos para o layout do Dashboard */
.shell {
  display: flex;
  height: 100vh;
  background-color: #FFFFFF;
}

/* SIDEBAR: Menu lateral fixo */
.sidebar {
  width: 15rem;
  background-color: #ECE8D9;
  color: #024554;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100dvh;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-y: auto;
}

/* Logo/Título do sistema */
.logo {
  margin-bottom: 2rem;
}

/* Menu de navegação dentro da Sidebar */
.menu {
  flex-grow: 1;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Itens do menu */
.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem 1rem;
  color: #024554;
  text-decoration: none;
  border-radius: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Quando passa o mouse no item do menu */
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Quando o item está ativo (a página atual) */
.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  border-left: 0.2rem solid #024554;
  padding-left: 0.2rem;
}

/* Ícone do menu */
.menu-item i {
  font-size: 2rem;
  width: 1rem;
  text-align: center;
}

/* Botão de logout */
.botao-sair {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);

  /* Fundo branco translúcido */
  color: #024554;
  border: none;
  padding: 0.5rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.5s ease;
  width: 100%;
}

/* Quando passa o mouse no botão Sair */
.botao-sair:hover {
  background-color: rgba(255, 255, 255, 0.519);
}

/* Quando clica no botão Sair */
.botao-sair:active {
  transform: scale(0.98);
}

/* Ícone do botão Sair */
.botao-sair i {
  font-size: 1.5rem;
}

/* ===== CONTEÚDO CENTRAL ===== */
.conteudo {
  flex-grow: 1;
  margin-left: 15rem;
  padding: 1.875rem;
  overflow-y: auto;
  background-color: #FFFFFF;
}

/*  RESPONSIVIDADE: Telas pequenas (celulares) */
@media (max-width: 48rem) {
  .sidebar {
    width: 12.5rem;
  }

  .conteudo {
    margin-left: 12.5rem;
    padding: 1.25rem;
  }

  .logo {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .menu-item {
    padding: 1rem 1rem;
    font-size: 1rem;
  }
}

/*  RESPONSIVIDADE: Telas muito pequenas (celulares muito pequenos) */
@media (max-width: 30rem) {
  .sidebar {
    width: 100%;
    position: absolute;
    height: auto;
  }

  .conteudo {
    margin-left: 0;
    padding: 0.9375rem;
  }
}
</style>
