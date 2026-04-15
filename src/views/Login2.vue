<template>

<!-- Cód. da Img. Logo -->
<header class="navbar">
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


<section class="login-section">

<!-- Cód. da Img. Banner Login -->
<div class="banner-login">
  <img src="../assets/Imagem-login.png">
</div>
  
<div class="login-div">
   
<!-- Cód. dos botões de selecão de usuário -->
<div class="login-buttons">
    
<p>Tipo de Usuário</p>
<div class="radio-group">
  <label>
  <input type="radio" name="tipo" value="aluno"> Aluno
  </label>
  
  <label>
  <input type="radio" name="tipo" value="funcionario"> Funcionário
  </label>
</div>

  <!-- Formulário de login -->
    
      <form @submit.prevent="fazerLogin" class="formulario">
        
        <!-- Campo de e-mail -->
        <div class="form-group">
          <label for="email" class="label">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="input"
            required
          />
        </div>

        <!-- Campo de senha -->
        <!-- v-model="senha" = vincula o valor do input com a variável senha -->
        <div class="form-group">
          <label for="senha" class="label">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="Digite sua senha"
            class="input"
            required
          />
        </div>

        <!-- Mensagem de erro -->
        <!-- v-if="erro" = só mostra a mensagem se houver um erro -->
        <div v-if="erro" class="mensagem-erro">
          <i class="fas fa-exclamation-circle"></i>
          {{ erro }}
        </div>

        <!-- Botão de envio -->
        <!-- :disabled="carregando" = desabilita o botão enquanto está fazendo login -->
        <!-- Isso evita que o usuário clique múltiplas vezes -->
        <button
          type="submit"
          class="botao-entrar"
          :disabled="carregando"
        >
          <!-- Mostra um spinner enquanto está carregando -->
          <i v-if="carregando" class="fas fa-spinner fa-spin"></i>
          <!-- Mostra o texto normal quando não está carregando -->
          <span v-else>Entrar</span>
        </button>
      </form>       
</div>
</div>
</section>

</template>

<!-- JavaScript (Supabase) -->
<script>
  import { ref } from 'vue'
  import { useSupabase } from '../composables/useSupabase'
  import { useRouter } from 'vue-router'

  const { supabase } = useSupabase()
  const router = useRouter()
  const email = ref('')
  const senha = ref('')
  const erro = ref('')
  const carregando = ref(false)

  async function fazerLogin() {
    erro.value = ''

    if (!email.value || !senha.value) {
      erro.value = 'Por favor, preencha todos os campos'
    return}

    carregando.value = true

    try {
      const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: senha.value
    })

    if (error) {
      erro.value = 'E-mail ou senha incorretos. Tente novamente.'
      carregando.value = false
    return }

    router.push('/Sidebar')
    }

    catch (err) {
     erro.value = 'Erro ao fazer login. Tente novamente mais tarde.'
      console.error('Erro ao fazer login:', err)
      carregando.value = false
    }
  } 
</script>

<style scoped>

p {
  margin-bottom: 0.5rem;
}

  .navbar {
   display: flex;
    align-items: center;
   justify-content: space-between;
    padding: 0 1rem;
    height: 5.5rem;
    background: #EBE8D7;
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

  .banner-login img {
    display: flex;
    width: 100%;
    height: auto;
  }

  .login-div{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .login-buttons {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
  }

.radio-group {
  display: flex;
  gap: 4rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 1rem;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 1rem;
  border-radius: 30rem;
  border: none;
  background: #95a5a0;
}

.forgot {
  text-align: center;
  font-size: 0.8rem;
  margin-bottom: 2rem;
}

.btn {
  display: block;
  margin: 0 auto;
  padding: 1rem 2rem;
  border-radius: 30rem;
  border: none;
  background: #53736A;
  color: white;
  cursor: pointer;
}

.login-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

</style>