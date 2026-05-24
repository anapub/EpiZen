<template>
  <div class="layout-container">
    <!-- Cabeçalho -->
    <header class="header-section">
      <h1>Relatório <span>de Retiradas</span></h1>
      <p>Consulte e exporte registros de retiradas de EPIs do estoque.</p>
    </header>

    <main class="content">
      <!-- Filtros centralizados no estilo do formulário -->
      <section class="card-form">
        <!-- Cabeçalho dos filtros -->
        <div class="card-header">
          <div>
            <h3>Filtros de Pesquisa</h3>
            <p>Utilize os campos abaixo para refinar os registros encontrados</p>
          </div>
        </div>

        <!-- Formulário de busca -->
        <div class="main-form">
          <!-- ÚNICA LINHA COM OS TRÊS FILTROS -->
          <div class="form-row">
            <div class="form-group">
              <label>Funcionário</label>
              <select v-model="filtros.funcionario">
                <option value="">Todos os funcionários</option>
                <option v-for="func in funcionarios" :key="func.nome" :value="func.nome">
                  {{ func.nome }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Data Inicial</label>
              <input type="date" v-model="filtros.data_inicio">
            </div>

            <div class="form-group">
              <label>Data Final</label>
              <input type="date" v-model="filtros.data_fim">
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="action-bar">
            <button class="btn btn-primary" @click="buscarRelatorio">
              Buscar Registros
            </button>
            <button class="btn btn-outline" @click="exportarPDF" :disabled="registros.length === 0">
              Gerar PDF
            </button>
          </div>
        </div>
      </section>

      <!-- Tabela de Resultados -->
      <section class="card-form table-card">
        <div class="card-header">
          <div>
            <h3>Registros Encontrados</h3>
            <p>Histórico detalhado baseado nos filtros aplicados</p>
          </div>
        </div>

        <div class="table-container">
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
              <tr v-for="item in registros" :key="item.id">
                <td>{{ formatarData(item.data_log) }}</td>
                <td>{{ item.funcionario }}</td>
                <td>{{ item.nome_epi }}</td>
                <td>{{ item.quantidade }}</td>
              </tr>
              <tr v-if="registros.length === 0">
                <td colspan="4" class="empty-message">
                  Nenhum registro encontrado para a pesquisa atual.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const { supabase } = useSupabase()

const registros = ref([])
const funcionarios = ref([])
const filtros = ref({
  funcionario: '',
  data_inicio: '',
  data_fim: ''
})

const carregarFuncionarios = async () => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('nome')
    .order('nome')

  if (error) {
    console.error(error)
    return
  }
  funcionarios.value = data || []
}

const buscarRelatorio = async () => {
  let query = supabase
    .from('log_retiradas')
    .select('*')
    .order('data_log', { ascending: false })

  if (filtros.value.funcionario) {
    query = query.eq('funcionario', filtros.value.funcionario)
  }
  if (filtros.value.data_inicio) {
    query = query.gte('data_log', filtros.value.data_inicio)
  }
  if (filtros.value.data_fim) {
    query = query.lte('data_log', filtros.value.data_fim)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    alert('Erro ao buscar relatório')
    return
  }
  registros.value = data || []
}

const exportarPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Relatório de Retiradas de EPIs', 14, 20)

  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 28)

  autoTable(doc, {
    startY: 35,
    head: [['Data', 'Funcionário', 'EPI', 'Quantidade']],
    body: registros.value.map(item => [
      formatarData(item.data_log),
      item.funcionario,
      item.nome_epi,
      item.quantidade
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [2, 69, 84],
      halign: 'center'
    },
    bodyStyles: {
      halign: 'center'
    }
  })

  doc.save('relatorio-epis.pdf')
}

const formatarData = (data) => {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

onMounted(() => {
  carregarFuncionarios()
  buscarRelatorio()
})
</script>

<style scoped>
/* LAYOUT - Fundo da página */
.layout-container {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem;
  border: 0.1rem solid #EDEADC;
  min-height: 20rem;
  background: #F8F9FA;
}

/* CABEÇALHO - Nome da Página */
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

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* CARD - Estrutura central baseada no formulário de registro */
.card-form {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 0.1rem solid #EDEADC;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Cabeçalho do card */
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

/* Área interna do card */
.main-form {
  padding: 2rem;
}

/* Linhas do formulário alterada para três colunas */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

/* Grupos de campos */
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

input, select {
  height: 2.7rem;
  border-radius: 0.5rem;
  border: 0.1rem solid #EDEADC;
  padding: 0 1rem;
  background: #ffffff;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: #A8B545;
  box-shadow: 0 0 0 0.1rem rgba(168, 181, 69, 0.2);
}

/* Botões de ação seguindo o padrão full-width/flex do registro */
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
  flex: 1;
}

.btn-primary {
  background: #024554;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 0.1rem solid #53736A;
  color: #53736A;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  opacity: 0.92;
}

/* TABELA - Cabeçalho estilizado em caixa bege */
.table-container {
  padding: 2rem;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table thead {
  background: #EDEADC;
}

.styled-table thead tr th:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.styled-table thead tr th:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.styled-table th {
  padding: 1rem;
  text-align: center;
  color: #024554;
  font-size: 0.85rem;
  font-weight: 700;
}

.styled-table td {
  padding: 1rem;
  border-top: 0.1rem solid #F1EFE7;
  color: #2c3e50;
  font-size: 0.95rem;
  text-align: center;
}

.styled-table tbody tr:hover {
  background: #FAFBF8;
}

.empty-message {
  text-align: center;
  color: #53736A;
  padding: 3rem !important;
}

/* RESPONSIVIDADE */
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

  .table-container {
    padding: 1rem;
    overflow-x: auto;
  }
}
</style>