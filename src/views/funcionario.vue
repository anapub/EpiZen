<template>
  <div class="layout-container">

    <header class="header-section">
      <h1> Controle de <span>Funcionários</span> </h1>
      <p>Gerencie o cadastro de colaboradores e organize por setores.</p>
    </header>

    <main class="content">

      <!-- FORM -->
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}</h3>
        </div>

        <form @submit.prevent="salvar" class="main-form">

          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Ana Paula Uaquida Brito" required>
            </div>

            <div class="form-group">
              <label>Nº Matrícula</label>
              <input v-model="form.matricula" type="text" placeholder="Ex: 082001" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Setor</label>
              <input v-model="form.setor" type="text" placeholder="Ex: Qualidade" required>
            </div>

            <div class="form-group">
              <label>Cargo</label>
              <input v-model="form.cargo" type="text" placeholder="Ex: Analista de Qualidade" required>
            </div>
          </div>

          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ carregando ? 'Salvando...' : (editandoId ? 'Atualizar Dados' : 'Finalizar Cadastro') }}
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
              <td><span class="text-bold">{{ f.nome }}</span></td>
              <td>{{ f.matricula }}</td>

              <td>
                <span class="badge">{{ f.setor }}</span>
                <span class="cargo-text">{{ f.cargo }}</span>
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

/* =========================
   CARREGAR DADOS
========================= */
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

/* =========================
   SALVAR
========================= */
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

/* =========================
   EDITAR
========================= */
const prepararEdicao = (f) => {
  editandoId.value = f.id

  Object.assign(form, {
    nome: f.nome,
    matricula: f.matricula,
    setor: f.setor,
    cargo: f.cargo
  })
}

/* =========================
   EXCLUIR
========================= */
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

/* =========================
   RESET
========================= */
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
.layout-container {
  max-width: 60rem;
  margin: 0 auto;
  padding: 2rem;
  border: 0.1rem solid #EDEADC;
  min-height: 20rem;
  background: #FFFFFF;
}

.header-section {
  color: #024554;
  margin-bottom: 2rem;
}

.header-section span {
  color: #A8B545;
}

.header-section h1 {
  font-size: 1.8rem;
}

.header-section p {
  color: #53736A;
}

/* CARDS */
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
  padding: 1rem;
  font-weight: bold;
}

/* FORM */
.main-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #024554;
}

input {
  padding: 0.6rem;
  border: 1px solid #EDEADC;
  border-radius: 0.4rem;
  font-size: 0.9rem;
}

input:focus {
  outline: none;
  border-color: #024554;
}

/* BOTÕES */
.action-bar {
  display: flex;
  gap: 0.8rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
  border: none;
  font-weight: bold;
}

.btn-primary {
  background: #024554;
  color: white;
}

.btn-outline {
  background: #EDEADC;
  color: #64748b;
}

/* TABELA */
.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th {
  background: #EDEADC;
  padding: 0.8rem;
  text-align: center;
  font-size: 0.7rem;
  color: #024554;
  text-transform: uppercase;
}

.styled-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #EDEADC;
  font-size: 0.85rem;
  text-align: center;
}

.text-bold {
  font-weight: bold;
}

/* BADGE (SETOR) */
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

.cargo-text {
  color: black;
  font-size: 0.8rem;
}

/* AÇÕES */
.btn-action {
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.edit {
  color: #D1B54A;
  margin-right: 0.5rem;
}

.delete {
  color: #A44A3F;
}

.text-center {
  text-align: center;
}

/* RESPONSIVO */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>