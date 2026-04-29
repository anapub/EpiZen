<template>
  <div class="layout-container">

    <!-- Tabela de cadastro de EPIs, com formulário para adicionar/editar e tabela para listar os EPIs cadastrados -->
    <header class="header-section">
      <h1> Cadastro de <span>EPIs</span> </h1>
      <p>Preencha os dados para cadastrar um novo EPI.</p>
    </header>

    <!-- Conteúdo principal com formulário e tabela -->
    <main class="content">

      <!-- Formulário de cadastro -->
      <section class="card-form">

        <div class="card-header">
          <h3>{{ editandoId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        </div>

        <form @submit.prevent="salvar" class="main-form">

          <div class="form-row">

            <div class="form-group">
              <label>Nome do EPI</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Bota de Segurança" required>
            </div>

            <div class="form-group">
              <label>C.A. (Certificado de Aprovação)</label>
              <input v-model="form.ca" type="text" placeholder="Ex: 12345" required>
            </div>

          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label>Descrição</label>
            <input v-model="form.descricao" type="text" placeholder="Ex: Biqueira de aço, solado antiderrapante"
              required>
          </div>

          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar Alterações' : 'Cadastrar EPI' }}
            </button>

            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>
          </div>

        </form>
      </section>

      <!-- Tabela de EPIs cadastrados -->
      <section class="card-table">

        <!-- Configuração do cabeçalho da tabela inferior, onde os títulos das colunas são definidos -->
        <table class="styled-table">
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>C.A.</th>
              <th>Descrição</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>

          <!-- Configuração do corpo da tabela inferior, onde os EPIs cadastrados são listados -->
          <tbody>
            <tr v-for="e in epis" :key="e.id">
              <td><strong>{{ e.nome }}</strong></td>
              <td><span class="badge">{{ e.ca }}</span></td>
              <td>{{ e.descricao }}</td>

              <!-- Ações de editar e excluir para cada EPI -->
              <td class="text-center">
                <button @click="prepararEdicao(e)" class="btn-action edit">
                  Editar
                </button>

                <button @click="excluir(e.id)" class="btn-action delete">
                  Excluir
                </button>

              </td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase.js'

const { supabase } = useSupabase()

const epis = ref([])
const editandoId = ref(null)

const form = reactive({
  nome: '',
  ca: '',
  descricao: ''
})

const carregar = async () => {
  const { data, error } = await supabase
    .from('epis')
    .select('*')
    .order('nome')

  if (error) console.error(error)

  epis.value = data || []
}

const salvar = async () => {

  const dados = {
    nome: form.nome,
    ca: form.ca,
    descricao: form.descricao
  }

  if (editandoId.value) {
    await supabase
      .from('epis')
      .update(dados)
      .eq('id', editandoId.value)
  } else {
    await supabase
      .from('epis')
      .insert([dados])
  }

  cancelarEdicao()
  carregar()
}

const prepararEdicao = (e) => {
  editandoId.value = e.id
  Object.assign(form, {
    nome: e.nome,
    ca: e.ca,
    descricao: e.descricao
  })
}

const excluir = async (id) => {
  if (confirm('Deseja excluir este equipamento?')) {
    await supabase
      .from('epis')
      .delete()
      .eq('id', id)

    carregar()
  }
}

const cancelarEdicao = () => {
  editandoId.value = null
  Object.assign(form, {
    nome: '',
    ca: '',
    descricao: ''
  })
}

onMounted(carregar)
</script>

<style scoped>
.layout-container {
  max-width: 60rem;
  margin: 0 auto;
  padding: 2rem;
  border: 0.1rem solid #EDEADC;
  min-height: 20rem;
}

.header-section {
  color: #024554;
  margin-bottom: 2rem;
}

.header-section span {
  color: #A8B545;
}

.card-form,
.card-table {
  background: #fff;
  border-radius: 0.5rem;
  border: 0.1rem solid #EDEADC;
  margin-bottom: 2rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: #EDEADC;
  color: #024554;
  padding: 1rem 1rem;
  font-weight: bold;

}

.main-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Configuração dos rótulos (labels) dos campos do formulário */
label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #024554;
}

/* Configuração dos campos de entrada do formulário (nome, CA, descrição) */
input {
  padding: 0.625rem;
  border: 0, 0625 solid #EDEADC;
  border-radius: 0.375rem;
}

/* Configuração dos botões do formulário (Salvar e Cancelar) */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: none;
  font-weight: bold;
}

/* Configuração da barra de ações (botões) no formulário */
.action-bar {
  display: flex;
  gap: 1rem;
}

/* Botão para cadastrar (Salvar) */
.btn-primary {
  background: #024554;
  color: white;
}

/* Botão para cancelar edição */
.btn-outline {
  background: #53736A;
  text-align: center;
  font-size: 0.75rem;
  color: white;
}

/* Tabela inferior que mostra a lista de EPIs */
.styled-table {
  width: 100%;
  border-collapse: collapse;
}

/* Tabela inferior que mostra a lista de EPIs - ESCRITO */
.styled-table th {
  background: #EDEADC;
  padding: 1rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #024554;
  text-transform: uppercase;
  border-bottom: 0.1rem solid #EDEADC;
}

.badge {
   background: #D9F2E6;
  text-align: center;
  color: #024554;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
  margin-right: 0.5rem;
}

/* Configuração do corpo da tabela inferior */
.styled-table td {
  text-align: center;
  height: 3rem;
  border-bottom: 0rem solid #EDEADC;
  font-size: 0.9rem;
}

/* Configuração do botão edição */
.edit {
  color: #D1B54A;
  cursor: pointer;
  background: none;
  border: none;
  font-weight: bold;
  margin-right: 10px;
}

/* Configuração do botão exclusão */
.delete {
  color: #A44A3F;
  cursor: pointer;
  background: none;
  border: none;
  font-weight: bold;
}

.text-center {
  text-align: center;
}
</style>