<template>

  <!-- Parte superior com logo e menu -->
  <header class="navbar">
    <div class="navbar_logo">
      <img src="../assets/Imagem-logo-sf.png" width="300" height="81">
    </div>

    <!-- Menu de navegação -->
    <nav>
      <ul class="navbar_button">
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
      </ul>
    </nav>
  </header>

  <!-- Seção principal com texto e formulário -->
  <main class="fale_conosco">

    <!-- Mensagem principal - Informação -->
    <div class="texto">
      <h1>
        Entre em contato e um dos <br>
        <span>nossos especialistas</span><br>
        irá atendê-lo:
      </h1>
    </div>

    <!-- Imagem lateral -->
    <div class="img-contato">
      <img src="../assets/Imagem-contato-sf.png" width="190" height="390">
    </div>

    <!-- Formulário de contato -->
    <form class="form">


      <div class="form-group">
        <input type="text" placeholder="Nome" v-model="form.nome" required>
      </div>

      <!-- EMAIL -->
      <div class="form-group">
        <input type="email" placeholder="E-mail" v-model="form.email" required>
      </div>

      <!-- CELULAR -->
      <div class="form-group">
        <input type="text" placeholder="Celular" v-model="form.celular">
      </div>

      <!-- PREFERÊNCIA DE CONTATO -->
      <div class="radio-group">
        <b class="titulo-radio">Como prefere ser contatado?</b>

        <!-- Opções de contato 1 -->
        <div class="radio-labels">
          <label>
            <input type="radio" value="WhatsApp" v-model="form.preferencia">
            WhatsApp
          </label>

          <!-- Opções de contato 2 -->
          <label>
            <input type="radio" value="E-mail" v-model="form.preferencia">
            E-mail
          </label>
        </div>
      </div>

      <!-- MENSAGEM -->
      <div class="form-group">
        <textarea placeholder="Mensagem (Motivo do contato)" v-model="form.mensagem"></textarea>
      </div>

      <!-- BOTÃO -->
      <button type="submit">Enviar</button>

    </form>

  </main>

</template>

<script setup>
import { reactive } from 'vue'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

const form = reactive({
  nome: '',
  email: '',
  celular: '',
  preferencia: '',
  mensagem: ''
})

const enviar = async () => {
  try {
    const { data, error } = await supabase
      .from('contatos')
      .insert([
        {
          nome: form.nome,
          email: form.email,
          celular: form.celular,
          preferencia: form.preferencia,
          mensagem: form.mensagem
        }
      ])
      .select()

    console.log('DATA:', data)
    console.log('ERROR:', error)

    if (error) {
      throw error
    }

    alert('Mensagem enviada com sucesso!')

    form.nome = ''
    form.email = ''
    form.celular = ''
    form.preferencia = ''
    form.mensagem = ''

  } catch (error) {
    console.error('Erro ao enviar:', error)
    alert(`Erro ao enviar mensagem: ${error.message}`)
  }
}
</script>

<style scoped>

/* Parte superior com logo e menu */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 5.5rem;
  background: #EDEADC;
  gap: 1rem;
}

/* Menu de navegação */
.navbar_button {
  display: flex;
  gap: 1rem;
  list-style: none;
}

/* Botão do menu */
.navbar_button a {
  background: #53736A;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  text-decoration: none;
}

/* Seção principal com texto e formulário */
.fale_conosco {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5rem;
  padding-top: 4rem;
  gap: 2rem;
}

/* Titulo principal */
.texto h1 {
  font-size: 2.5rem;
}

/* Destaque em verde */
.texto span {
  color: #A8B545;
}

/* Formulário de contato */
.form {
  background: #EDEADC;
  padding: 2rem;
  border-radius: 1rem;
  width: 35rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Campos do formulário */
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #EDEADC;
  border-radius: 6px;
  background-color: #FFFFFF;
}

/* Área de texto */
textarea {
  height: 6rem;
  resize: none;
}

/* Opções de contato alinhadas */
.radio-group {
  display: flex;
  gap: 0.5rem;
  color: black;
  flex-direction: column;
  font-size: 0.9rem;
}

/* Alinhamento dos rótulos das opções de contato */
.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Botão de envio */
button {
  padding: 10px;
  background-color: #024554;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

/* Efeito no botão */
button:hover {
  opacity: 0.9;
}
</style>