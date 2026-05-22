<template>
  <div class="layout-container">

    <!-- HEADER -->
    <header class="header-section">
      <h1>Registrar <span>Retirada de EPIs</span></h1>

      <p>
        Registre quando um funcionário retirar um EPI do estoque.
      </p>
    </header>

    <main class="content">

      <!-- FORM -->
      <section class="card-form">

        <div class="card-header">

          <div>
            <h3>Informações da Retirada</h3>

            <p>
              Preencha todos os campos obrigatórios
            </p>
          </div>

        </div>

        <form
          @submit.prevent="registrarRetirada"
          class="main-form"
        >

          <!-- LINHA 1 -->
          <div class="form-row">

            <!-- FUNCIONÁRIO -->
            <div class="form-group">

              <label>Funcionário *</label>

              <select
                v-model="form.funcionario"
                required
              >

                <option disabled value="">
                  Selecione o funcionário
                </option>

                <option
                  v-for="func in funcionarios"
                  :key="func.id"
                  :value="func.nome"
                >
                  {{ func.nome }}
                </option>

              </select>

            </div>

            <!-- EPI -->
            <div class="form-group">

              <label>EPI a ser retirado *</label>

              <select
                v-model.number="form.epi_id"
                required
              >

                <option disabled value="">
                  Selecione o EPI
                </option>

                <option
                  v-for="epi in epis"
                  :key="epi.id"
                  :value="epi.id"
                  :disabled="epi.quantidade <= 0"
                >
                  {{ epi.nome }}
                </option>

              </select>

            </div>

          </div>

          <!-- LINHA 2 -->
          <div class="form-row">

            <!-- ESTOQUE -->
            <div class="form-group">

              <label>Estoque disponível</label>

              <input
                type="text"
                :value="epiSelecionado?.quantidade ?? 0"
                disabled
              >

            </div>

            <!-- QUANTIDADE -->
            <div class="form-group">

              <label>Quantidade a retirar *</label>

              <input
                v-model.number="form.quantidade"
                type="number"
                min="1"
                :max="epiSelecionado?.quantidade || 1"
                required
              >

            </div>

          </div>

          <!-- LINHA 3 -->
          <div class="form-row">

            <!-- DATA -->
            <div class="form-group">

              <label>Data da retirada *</label>

              <input
                v-model="form.data_retirada"
                type="date"
                required
              >

            </div>

            <!-- HORÁRIO -->
            <div class="form-group">

              <label>Horário da retirada *</label>

              <input
                v-model="form.horario_retirada"
                type="time"
                required
              >

            </div>

          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea v-model="form.observacoes"
              placeholder="Adicione observações sobre a retirada do EPI...">
            </textarea>
          </div>

          <!-- BOTÕES -->
          <div class="action-bar">

            <button
              type="submit"
              class="btn btn-primary"
            >
              Registrar Retirada
            </button>

            <button
              type="button"
              class="btn btn-outline"
              @click="limparFormulario"
            >
              Limpar formulário
            </button>

          </div>

        </form>

      </section>

    </main>

  </div>
</template>

<script setup>

import {
  ref,
  reactive,
  computed,
  onMounted
} from 'vue'

import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

const epis = ref([])
const funcionarios = ref([])
const defaultForm = () => ({

  funcionario: '',
  epi_id: '',
  quantidade: 1,
  data_retirada: '',
  horario_retirada: '',
  observacoes: ''

})

const form = reactive(defaultForm())

/* EPI SELECIONADO */
const epiSelecionado = computed(() => {
  return epis.value.find(
    e => e.id === form.epi_id
  )

})

/* RESET FORM */
const resetForm = () => {
  Object.assign(form, defaultForm())
  const agora = new Date()
  form.data_retirada =
    agora.toISOString().split('T')[0]
  form.horario_retirada =
    agora.toTimeString().slice(0, 5)
}

/* CARREGAR EPIS */
const carregarEPIs = async () => {
  const { data, error } = await supabase
    .from('epis')
    .select('*')
    .order('nome')
  if (error) {
    console.error(error)
    alert('Erro ao carregar EPIs')
    return
  }

  epis.value = (data || []).map(e => ({
    ...e,
    quantidade: Number(e.quantidade)
  }))

}

/* CARREGAR FUNCIONÁRIOS */
const carregarFuncionarios = async () => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('id, nome')
    .order('nome')
  if (error) {
    console.error(error)
    alert('Erro ao carregar funcionários')
    return
  }

  funcionarios.value = data || []
}

/* REGISTRAR RETIRADA */
const registrarRetirada = async () => {
  if (!epiSelecionado.value) {
    alert('Selecione um EPI válido')
    return
  }

  if (
    form.quantidade >
    epiSelecionado.value.quantidade
  ) {
    alert('Quantidade maior que o estoque')
    return
  }
  try {

    /* CHAMAR FUNCTION */
    const { error } = await supabase.rpc(
      'registrar_retirada',
      {
        p_funcionario: form.funcionario,
        p_epi_id: form.epi_id,
        p_quantidade: form.quantidade,
        p_observacoes: form.observacoes
      }
    )
    if (error)
      throw error
    alert('Retirada registrada com sucesso!')
    resetForm()
    await carregarEPIs()
  } catch (err) {
    console.error(err)
    alert(
      err.message ||
      'Erro ao registrar retirada'
    )
  }
}

/* LIMPAR FORMULÁRIO */
const limparFormulario = () => {
  resetForm()
}

/* INIT */
onMounted(() => {
  resetForm()
  carregarEPIs()
  carregarFuncionarios()
})

</script>

<style scoped>

.layout-container {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem;
  border: 0.1rem solid #EDEADC;
  min-height: 20rem;
  background: #F8F9FA;
}

/* HEADER */

.header-section {
  color: #024554;
  margin-bottom: 2rem;
}

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

/* CARD */

.card-form {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 0.1rem solid #EDEADC;
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

input,
select,
textarea{
  height: 2.7rem;
  border-radius: 0.5rem;
  border: 0.1rem solid #EDEADC;
  padding: 0 1rem;
  background: #ffffff;
  font-size: 0.95rem;
}

textarea {
  min-height: 10rem;
  padding-top: 1rem;
  resize: none;
}

input:focus,
select:focus,
textarea:focus {
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