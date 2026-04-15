<template>

  <header class="navbar">

   <!-- Cód. da Img. Logo -->
   <div class="navbar_logo">
     <img src="../assets/Imagem-logo-sf.png" width="300" height="81">
   </div>

   <!-- Cód. para os Botões de acesso -->
   <nav aria-label="Menu principal">
     <ul class="navbar_button">
       <li><RouterLink to="/">Home</RouterLink></li> 
       <li><RouterLink to="/Contato">Contato</RouterLink></li> 
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
      
         
        <div class="radio-group">

          <div class ="label">
            <p>Tipo de Usuário</p>
          </div>

          <div class="tipo">
            <label>
              <input type="radio" v-model="tipo" value="aluno"> Aluno
            </label>
  
            <label>
              <input type="radio" v-model="tipo" value="funcionario"> Funcionário
            </label>
          </div>

        </div>

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
          <button
            type="submit" class="botao-entrar" :disabled="carregando">
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
  const tipo = ref('')
  const carregando = ref(false)

  // ===== FUNÇÃO PRINCIPAL: FAZER LOGIN =====
  async function fazerLogin() {

     // ===== PASSO 1: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
    if (!tipo.value) {
      erro.value = 'Selecione o tipo de usuário'
    return }

    // ===== PASSO 2: LIMPAR ERROS ANTERIORES ===== 
    erro.value = ''

    // ===== PASSO 3: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
    if (!email.value || !senha.value) {
      erro.value = 'Por favor, preencha todos os campos'
    return }

    // ===== PASSO 4: MOSTRAR QUE ESTÁ CARREGANDO =====
    carregando.value = true

    // ===== PASSO 5: TENTAR FAZER LOGIN COM O SUPABASE =====
    try {
      const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: senha.value })
    
      // ===== PASSO 6: VERIFICAR SE HOUVE ERRO =====
      if (error) {
       erro.value = 'E-mail ou senha incorretos. Tente novamente.'
        carregando.value = false
      return }

      // ===== PASSO 7: LOGIN BEM-SUCEDIDO - REDIRECIONAR =====
      router.push('/Sidebar')
      carregando.value = false
    }

    // ===== PASSO 8: CAPTURAR ERROS INESPERADOS =====
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

  .main-login {
   display: flex;
    align-items: center;
    gap:19rem;
  }

  .banner-login img {
    width: 29rem;
    height: auto;
  }

  .form-box  {
    display: flex;
    flex-direction: column;
    height: 30rem;
    width: 30rem;
    border-radius: 2rem;
    border: 0.2rem solid #EDEADC;
    background-color: #FFFFFF;
  }

  .login-buttons {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .titulo {
    font-size: 2rem;
    color: #024554;
    font-weight: 700;
    text-align: center;
    padding-top: 1rem;
  }

  .subtitulo {
    font-size: 1.25rem;
    color: #024554;
    text-align: center;
  }

  .radio-group {
    display: flex;
    flex-direction: column; 
    margin-bottom: 1rem;
    padding-top: 1rem;
    padding-right: 11rem;
  }

   .tipo {
    display: flex;
    gap: 1rem;  
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 1rem;
    font-weight: 600;
    color: #53736A;
  }

  .input {
    display: flex;
    padding-inline: 4.8rem;
    padding-block: 0.5rem;
    border: 0.1rem solid #E2E8F0;
    border-radius: 30rem;
    font-weight: 500;
    font-size: 1rem;
    color: #1A1A1A;
    background-color: #FFFFFF;
    transition: all 0.3s ease;
  }

/* Quando o usuário clica no input, muda a borda para azul */
.input:focus {
  outline: none;
  border-color: #003D99;
}

/* ===== MENSAGEM DE ERRO ===== */
/* Estilo da mensagem de erro */
.mensagem-erro {
  padding: 12px 16px;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 4px;
  color: #DC2626;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Ícone de erro */
.mensagem-erro i {
  font-size: 18px;
}

/* ===== BOTÃO DE ENTRAR ===== */
/* Estilo do botão de login */
.botao-entrar {
  padding: 12px 24px;
  background-color: #003D99;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
}

/* Quando passa o mouse no botão, muda a cor */
.botao-entrar:hover:not(:disabled) {
  background-color: #002D73;
}

/* Quando o botão está desabilitado (carregando), muda a aparência */
.botao-entrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== RESPONSIVIDADE ===== */
/* Em telas pequenas (celulares), reduz o tamanho do formulário */
@media (max-width: 600px) {
  .form-box {
    padding: 30px 20px;
  }

  .titulo {
    font-size: 24px;
  }

  .subtitulo {
    font-size: 14px;
  }
}
</style>
