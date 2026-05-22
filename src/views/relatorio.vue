<template>

  <div class="layout-container">

    <!-- HEADER -->
    <header class="header-section">

      <h1>
        Relatório <span>de Retiradas</span>
      </h1>

      <p>
        Consulte e exporte registros de retiradas de EPIs.
      </p>

    </header>

    <!-- FILTROS -->
    <section class="card">

      <div class="card-header">

        <h3>Filtros</h3>

      </div>

      <div class="form-row">

        <!-- FUNCIONÁRIO -->
        <div class="form-group">

          <label>Funcionário</label>

          <select v-model="filtros.funcionario">

            <option value="">
              Todos
            </option>

            <option
              v-for="func in funcionarios"
              :key="func.nome"
              :value="func.nome"
            >
              {{ func.nome }}
            </option>

          </select>

        </div>

        <!-- DATA INICIAL -->
        <div class="form-group">

          <label>Data Inicial</label>

          <input
            type="date"
            v-model="filtros.data_inicio"
          >

        </div>

        <!-- DATA FINAL -->
        <div class="form-group">

          <label>Data Final</label>

          <input
            type="date"
            v-model="filtros.data_fim"
          >

        </div>

      </div>

      <!-- BOTÕES -->
      <div class="action-bar">

        <button
          class="btn btn-primary"
          @click="buscarRelatorio"
        >
          Buscar Registros
        </button>

        <button
          class="btn btn-pdf"
          @click="exportarPDF"
          :disabled="registros.length === 0"
        >
          Gerar PDF
        </button>

      </div>

    </section>

    <!-- TABELA -->
    <section class="card table-card">

      <div class="card-header">

        <h3>
          Registros Encontrados
        </h3>

      </div>

      <table class="styled-table">

        <thead>

          <tr>

            <th>Data</th>
            <th>Funcionário</th>
            <th>EPI</th>
            <th>Quantidade</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="item in registros"
            :key="item.id"
          >

            <td>
              {{ formatarData(item.data_log) }}
            </td>

            <td>
              {{ item.funcionario }}
            </td>

            <td>
              {{ item.nome_epi }}
            </td>

            <td>
              {{ item.quantidade }}
            </td>

          </tr>

          <tr v-if="registros.length === 0">

            <td
              colspan="4"
              class="empty-message"
            >
              Nenhum registro encontrado.
            </td>

          </tr>

        </tbody>

      </table>

    </section>

  </div>

</template>

<script setup>

import {
  ref,
  onMounted
} from 'vue'

import { useSupabase }
from '../composables/useSupabase'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const { supabase } = useSupabase()

/* STATES */

const registros = ref([])
const funcionarios = ref([])

const filtros = ref({

  funcionario: '',
  data_inicio: '',
  data_fim: ''

})

/* CARREGAR FUNCIONÁRIOS */

const carregarFuncionarios = async () => {

  const {
    data,
    error
  } = await supabase

    .from('funcionarios')

    .select('nome')

    .order('nome')

  if (error) {

    console.error(error)
    return

  }

  funcionarios.value = data || []

}

/* BUSCAR RELATÓRIO */

const buscarRelatorio = async () => {

  let query = supabase

    .from('log_retiradas')

    .select('*')

    .order('data_log', {
      ascending: false
    })

  /* FILTRO FUNCIONÁRIO */

  if (filtros.value.funcionario) {

    query = query.eq(
      'funcionario',
      filtros.value.funcionario
    )

  }

  /* DATA INICIAL */

  if (filtros.value.data_inicio) {

    query = query.gte(
      'data_log',
      filtros.value.data_inicio
    )

  }

  /* DATA FINAL */

  if (filtros.value.data_fim) {

    query = query.lte(
      'data_log',
      filtros.value.data_fim
    )

  }

  const {
    data,
    error
  } = await query

  if (error) {

    console.error(error)
    alert('Erro ao buscar relatório')
    return

  }

  registros.value = data || []

}

/* EXPORTAR PDF */

const exportarPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    'Relatório de Retiradas de EPIs',
    14,
    20
  )

  doc.setFontSize(10)

  doc.text(

    `Gerado em: ${
      new Date().toLocaleString('pt-BR')
    }`,

    14,
    28

  )

  autoTable(doc, {

    startY: 35,

    head: [[
      'Data',
      'Funcionário',
      'EPI',
      'Quantidade'
    ]],

    body: registros.value.map(item => [

      formatarData(item.data_log),

      item.funcionario,

      item.nome_epi,

      item.quantidade

    ]),

    theme: 'grid',

    headStyles: {

      fillColor: [2, 69, 84]

    }

  })

  doc.save('relatorio-epis.pdf')

}

/* FORMATAR DATA */

const formatarData = (data) => {

  if (!data) return '—'

  return new Date(data)

    .toLocaleDateString(
      'pt-BR',
      {
        timeZone: 'UTC'
      }
    )

}

/* INIT */

onMounted(() => {

  carregarFuncionarios()

  buscarRelatorio()

})

</script>

<style scoped>

.layout-container {

  max-width: 75rem;

  margin: 0 auto;

  padding: 2rem;

  border: 0.1rem solid #EDEADC;

  background: #F8F9FA;

  min-height: 100vh;

}

/* HEADER */

.header-section {

  margin-bottom: 2rem;

  color: #024554;

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

  margin-top: 0.4rem;

  color: #53736A;

}

/* CARD */

.card {

  background: #ffffff;

  border-radius: 0.75rem;

  border: 0.1rem solid #EDEADC;

  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.04);

  overflow: hidden;

  margin-bottom: 1.5rem;

}

/* HEADER CARD */

.card-header {

  background: #EDEADC;

  padding: 1rem 1.2rem;

}

.card-header h3 {

  margin: 0;

  color: #024554;

  font-size: 1rem;

}

/* FORM */

.form-row {

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(12rem, 1fr));

  gap: 1rem;

  padding: 1.5rem;

}

.form-group {

  display: flex;

  flex-direction: column;

}

label {

  font-size: 0.8rem;

  font-weight: 700;

  color: #024554;

  margin-bottom: 0.35rem;

}

input,
select {

  height: 2.7rem;

  border-radius: 0.5rem;

  border: 0.1rem solid #EDEADC;

  padding: 0 1rem;

  background: #ffffff;

  font-size: 0.95rem;

}

input:focus,
select:focus {

  outline: none;

  border-color: #A8B545;

  box-shadow:
    0 0 0 0.1rem
    rgba(168, 181, 69, 0.2);

}

/* BOTÕES */

.action-bar {

  display: flex;

  gap: 1rem;

  padding:
    0 1.5rem 1.5rem;

}

.btn {

  flex: 1;

  height: 2.8rem;

  border: none;

  border-radius: 0.5rem;

  cursor: pointer;

  font-weight: 600;

}

.btn-primary {

  background: #024554;

  color: white;

}

.btn-pdf {

  background: #A8B545;

  color: white;

}

.btn:hover {

  opacity: 0.92;

}

/* TABLE */

.styled-table {

  width: 100%;

  border-collapse: collapse;

}

.styled-table thead {

  background: #EDEADC;

}

.styled-table th {

  padding: 1rem;

  text-align: left;

  color: #024554;

  font-size: 0.8rem;

}

.styled-table td {

  padding: 1rem;

  border-top:
    0.1rem solid #F1EFE7;

}

.styled-table tbody tr:hover {

  background: #FAFBF8;

}

.empty-message {

  text-align: center;

  color: #53736A;

  padding: 2rem;

}

/* RESPONSIVO */

@media (max-width: 768px) {

  .layout-container {

    padding: 1rem;

  }

  .action-bar {

    flex-direction: column;

  }

}

</style>