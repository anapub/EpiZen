<template>

  <header class="navbar">

    <!-- Cód. da Img. Logo -->
    <div class="navbar_logo">
      <img src="../assets/Imagem-logo-sf.png" width="300" height="81">
    </div>

    <!-- Cód. para os Botões de acesso -->
    <nav aria-label="Menu principal">
      <ul class="navbar_button">
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/Contato">Contato</RouterLink>
        </li>
      </ul>
    </nav>
  </header>

  <div class="main-login">

    <!-- Cód. da Img. Banner Login -->
    <div class="banner-login">
      <img src="../assets/Imagem-login.png">
    </div>

    <!-- Caixa do formulário -->
    <div class="form-box">

      <!-- Título da página -->
      <h1 class="titulo">Sistema EpiZen</h1>
      <p class="subtitulo">Faça login para acessar o sistema</p>

      <!-- Cód. dos botões de selecão de usuário -->
      <div class="login-buttons">

        <!-- Formulário de login -->
        <form @submit.prevent="fazerLogin" class="formulario">

          <!-- Campo de e-mail -->
          <div class="form-group">
            <label for="email" class="label">E-mail</label>
            <input id="email" v-model="email" type="email" placeholder="seu@email.com" class="input" required />
          </div>

          <!-- Campo de senha -->
          <div class="form-group">
            <label for="senha" class="label">Senha</label>
            <input id="senha" v-model="senha" type="password" placeholder="Digite sua senha" class="input" required />
          </div>

          <!-- Mensagem de erro -->
          <div v-if="erro" class="mensagem-erro">
            <i class="fas fa-exclamation-circle"></i> {{ erro }}
          </div>

          <!-- Botão de envio -->
          <button type="submit" class="botao-entrar" :disabled="carregando">
            <i v-if="carregando" class="fas fa-spinner fa-spin"></i>
            <span v-else>Entrar</span>
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

// ===== IMPORTAÇÕES =====
import { ref } from 'vue'
import { useSupabase } from '../composables/useSupabase.js'
import { useRouter } from 'vue-router'

// ===== CONFIGURAÇÃO =====
const { supabase } = useSupabase()
const router = useRouter()

// ===== VARIÁVEIS REATIVAS =====
const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

// ===== FUNÇÃO PRINCIPAL: FAZER LOGIN =====
async function fazerLogin() {

  // ===== PASSO 3: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
  if (!email.value || !senha.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  // ===== PASSO 1: MOSTRAR QUE ESTÁ CARREGANDO =====
  carregando.value = true

  // ===== PASSO 2: TENTAR FAZER LOGIN COM O SUPABASE =====
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: senha.value
    })

    // ===== PASSO 3: VERIFICAR SE HOUVE ERRO =====
    if (error) {
      erro.value = 'E-mail ou senha incorretos. Tente novamente.'
      carregando.value = false
      return
    }

    // ===== PASSO 4: LOGIN BEM-SUCEDIDO - REDIRECIONAR =====
    router.push('/dashboard')
    carregando.value = false
  }

  // ===== PASSO 5: CAPTURAR ERROS INESPERADOS =====
  catch (err) {
    erro.value = 'Erro ao fazer login. Tente novamente mais tarde.'
    console.error('Erro ao fazer login:', err)
    carregando.value = false
  }
}   
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  height: 5.5rem;
  background: #ECE8D9;
  gap: 1rem;
}

.navbar_button {
  display: flex;
  list-style: none;
  gap: 1rem;
}

.navbar_button a {
  text-decoration: none;
  background: #53736A;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
}

/* ===== LAYOUT ===== */
.main-login {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(100vh - 5.5rem);
  overflow: hidden;
  background-color: #FFFFFF;
}

.banner-login {
  height: 100%;
  width: 45%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;   
  padding-left: 0;               
}

.banner-login img {
  height: 100%;
  width: auto;
  object-fit: contain;
  object-position: left center;  
}

/* ===== FORM BOX ===== */
.form-box {
  display: flex;
  flex-direction: column;
  width: 28rem;
  padding: 2rem;
  border-radius: 2rem;
  border: 0.2rem solid #EDEADC;
  background-color: #FFFFFF;
  margin-right: 20rem;
}

/* ===== TEXTOS ===== */
.titulo {
  font-size: 2rem;
  color: #024554;
  font-weight: 700;
  text-align: center;
}

.subtitulo {
  font-size: 1rem;
  color: #024554;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* ===== FORM ===== */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #53736A;
}

.input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 0.1rem solid #E2E8F0;
  border-radius: 2rem;
  font-size: 1rem;
  box-sizing: border-box;
}

/* FOCUS */
.input:focus {
  outline: none;
  border-color: #024554;
}

/* ===== ERRO ===== */
.mensagem-erro {
  padding: 0.5rem;
  background-color: #FEE2E2;
  border: 0.1rem solid #FECACA;
  border-radius: 0.4rem;
  color: #A44A3F;
  font-size: 0.8rem;
  text-align: center;
}

/* ===== BOTÃO ===== */
.botao-entrar {
  padding: 0.6rem;
  background-color: #024554;
  color: #FFFFFF;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.botao-entrar:hover:not(:disabled) {
  background-color: #01343f;
}

.botao-entrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== RESPONSIVO ===== */
@media (max-width: 900px) {
  .main-login {
    flex-direction: column;
    gap: 2rem;
  }

  .banner-login img {
    width: 18rem;
  }
}
</style>
