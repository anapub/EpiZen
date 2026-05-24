<template>

  <!-- LAYOUT PRINCIPAL -->
  <div class="layout-container">

    <!-- Cabeçalho principal -->
    <header class="header-section">
      <h1>Cadastro de <span>Funcionários</span></h1>
      <p>Gerencie o cadastro de colaboradores e organize por setores.</p>
    </header>

    <!-- Conteúdo principal -->
    <main class="content">

      <!-- Formulário -->
      <section class="card-form">

        <!-- Cabeçalho do formulário -->
        <div class="card-header">
          <div>
            <h3>{{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}</h3>
            <p>Preencha todos os campos obrigatórios</p>
          </div>
        </div>

        <!-- Formulário de cadastro/edição -->
        <form @submit.prevent="salvar" class="main-form">

          <!-- LINHA 1 -->
          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo *</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Ana Paula Uaquida Brito" required>
            </div>

            <div class="form-group">
              <label>Nº Matrícula *</label>
              <input v-model="form.matricula" type="text" placeholder="Ex: 082001" required>
            </div>

          </div>

          <!-- LINHA 2 -->
          <div class="form-row">
            <div class="form-group">
              <label>Setor *</label>
              <input v-model="form.setor" type="text" placeholder="Ex: Qualidade" required>
            </div>

            <div class="form-group">
              <label>Cargo *</label>
              <input v-model="form.cargo" type="text" placeholder="Ex: Analista de Qualidade" required>
            </div>

          </div>

          <!-- Botões de ação -->
          <div class="action-bar">

            <button type="submit" class="btn btn-primary">
              {{
                carregando
                  ? 'Salvando...'
                  : (editandoId
                    ? 'Atualizar Dados'
                    : 'Finalizar Cadastro')
              }}
            </button>

            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>

          </div>

        </form>

      </section>

      <!-- TABELA -->
      <section class="card-table">

        <table class="styled-table">

          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Matrícula</th>
              <th>Setor / Cargo</th>
              <th class="text-center">Gerenciar</th>
            </tr>
          </thead>

          <tbody>

            <tr v-for="f in funcionarios" :key="f.id">

              <td>
                <strong>{{ f.nome }}</strong>
              </td>

              <td>
                {{ f.matricula }}
              </td>

              <td>

                <span class="badge">
                  {{ f.setor }}
                </span>

                <span class="cargo-text">
                  {{ f.cargo }}
                </span>

              </td>

              <td class="text-center">

                <button @click="prepararEdicao(f)" class="btn-action edit">
                  Editar
                </button>

                <button @click="excluir(f.id)" class="btn-action delete">
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

const funcionarios = ref([])
const editandoId = ref(null)
const carregando = ref(false)

const form = reactive({
  nome: '',
  matricula: '',
  setor: '',
  cargo: ''
})

const carregar = async () => {

  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome')

  if (error) {
    console.error('Erro ao carregar:', error)
    return
  }

  funcionarios.value = data || []
}

const salvar = async () => {

  if (!form.nome || !form.matricula) {
    alert('Preencha os campos obrigatórios')
    return
  }

  carregando.value = true

  const dados = {
    nome: form.nome,
    matricula: form.matricula,
    setor: form.setor,
    cargo: form.cargo
  }

  let error

  if (editandoId.value) {

    ({ error } = await supabase
      .from('funcionarios')
      .update(dados)
      .eq('id', editandoId.value))

  } else {

    ({ error } = await supabase
      .from('funcionarios')
      .insert([dados]))
  }

  carregando.value = false

  if (error) {
    console.error(error)
    alert('Erro ao salvar')
    return
  }

  alert('Salvo com sucesso!')

  cancelarEdicao()
  carregar()
}

const prepararEdicao = (f) => {

  editandoId.value = f.id

  Object.assign(form, {
    nome: f.nome,
    matricula: f.matricula,
    setor: f.setor,
    cargo: f.cargo
  })
}

const excluir = async (id) => {

  if (!confirm('Deseja realmente remover este registro?')) return

  const { error } = await supabase
    .from('funcionarios')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    alert('Erro ao excluir')
    return
  }

  carregar()
}

const cancelarEdicao = () => {

  editandoId.value = null

  Object.assign(form, {
    nome: '',
    matricula: '',
    setor: '',
    cargo: ''
  })
}

onMounted(carregar)

</script>

<style scoped>

/* LAYOUT PRINCIPAL */
.layout-container {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem;
  border: 0.1rem solid #EDEADC;
  min-height: 20rem;
  background: #F8F9FA;
}

/* SEÇÃO DE CABEÇALHO */
.header-section {
  color: #024554;
  margin-bottom: 2rem;
}

/* SEÇÃO DE CABEÇALHO */
.header-section h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-section span {
  color: #A8B545;
}

.header-section p {
  margin-top: 0.3rem;
  color: #53736A;
}

/* CARDS */

.card-form,
.card-table {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 0.1rem solid #EDEADC;
  margin-bottom: 2rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* HEADER FORM */

.card-header {
  background: #EDEADC;
  color: #024554;
  padding: 1.2rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
}

.card-header p {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #53736A;
}

/* FORM */

.main-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #024554;
  margin-bottom: 0.35rem;
}

input {
  height: 2.7rem;
  border-radius: 0.5rem;
  border: 0.1rem solid #EDEADC;
  padding: 0 1rem;
  background: #ffffff;
  font-size: 0.95rem;
}

input:focus {
  outline: none;
  border-color: #A8B545;
  box-shadow: 0 0 0 0.1rem rgba(168, 181, 69, 0.2);
}

/* BOTÕES */

.action-bar {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  height: 2.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: none;
  font-weight: 600;
  padding: 0 1.5rem;
}

.btn-primary {
  background: #024554;
  color: white;
  flex: 1;
}

.btn-outline {
  background: transparent;
  border: 0.1rem solid #53736A;
  color: #53736A;
  flex: 1;
}

/* TABELA */

.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th {
  background: #EDEADC;
  padding: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #024554;
  text-transform: uppercase;
}

.styled-table td {
  text-align: center;
  height: 3.5rem;
  font-size: 0.9rem;
  border-bottom: 0.1rem solid #F1F1F1;
}

.badge {
  background: #D9F2E6;
  color: #024554;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  margin-right: 0.5rem;
}

.cargo-text {
  color: #000000;
  font-size: 0.85rem;
}

/* BOTÕES TABELA */

.btn-action {
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.edit {
  color: #D1B54A;
  margin-right: 1rem;
}

.delete {
  color: #A44A3F;
}

.text-center {
  text-align: center;
}

/* RESPONSIVO */

@media (max-width: 768px) {

  .form-row {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
  }

  .layout-container {
    padding: 1rem;
  }

}
</style>