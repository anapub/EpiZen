<template>
  <div class="layout-container">
 
    <!-- Cabeçalho -->
    <header class="header-section">
      <h1>Cadastro de <span>EPIs</span></h1>
      <p>Gerencie os equipamentos de proteção individual disponíveis</p>
    </header>
 
    <main class="content">
 
      <!-- Formulário central -->
      <section class="card-form">
 
        <!-- Cabeçalho do formulário -->
        <div class="card-header">
          <div>
            <h3>
              {{ editandoId ? 'Editar Equipamento' : 'Informações do Equipamento' }}
            </h3>
            <p>Preencha todos os campos obrigatórios</p>
          </div>
        </div>
 
        <!-- Formulário de cadastro/edição -->
        <form @submit.prevent="salvar" class="main-form">
 
          <!-- LINHA 1 -->
          <div class="form-row">
            <div class="form-group">
              <label>Nome do EPI *</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Capacete de Segurança" required>
            </div>
            <div class="form-group">
              <label>Categoria *</label>
              <input v-model="form.categoria" type="text" placeholder="Ex: Proteção da Cabeça" required>
            </div>
          </div>
 
          <!-- LINHA 2 -->
          <div class="form-row">
            <div class="form-group">
              <label>Descrição/Observações</label>
              <input v-model="form.descricao" type="text" placeholder="Ex: Ajuste com elástico">
            </div>
            <div class="form-group">
              <label>Cor *</label>
              <input v-model="form.cor" type="text" placeholder="Ex: Azul">
            </div>
          </div>
 
          <!-- LINHA 3 -->
          <div class="form-row">
            <div class="form-group">
              <label>Quantidade em estoque *</label>
              <input v-model="form.quantidade" type="number" placeholder="0">
            </div>
            <div class="form-group">
              <label>Fornecedor *</label>
              <input v-model="form.fornecedor" type="text" placeholder="Ex: Delta Plus">
            </div>
          </div>
 
          <!-- FOTO -->
          <div class="form-group">
            <label>URL da Foto</label>
            <input v-model="form.foto" type="text" placeholder="Cole a URL da imagem">
          </div>
 
          <!-- Botões -->
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar Alterações' : 'Salvar EPI' }}
            </button>
            <button type="button" @click="cancelarEdicao" class="btn btn-outline">
              Limpar formulário
            </button>
          </div>
 
        </form>
      </section>
 
      <!-- Tabela de EPIs -->
      <section class="card-table">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>Categoria</th>
              <th>Qtd. em Estoque</th>
              <th>Descrição</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="epis.length === 0">
              <td colspan="5" style="text-align:center; padding: 2rem; color: #53736A;">
                Nenhum EPI cadastrado ainda.
              </td>
            </tr>
            <tr v-for="(e, index) in epis" :key="e.id ?? index">
              <td><strong>{{ e.nome }}</strong></td>
              <td><strong>{{ e.categoria }}</strong></td>
              <td><strong>{{ e.quantidade }}</strong></td>
              <td>{{ e.descricao }}</td>
              <td class="text-center">
                <button type="button" @click="prepararEdicao(e)" class="btn-action edit">
                  Editar
                </button>
                <button type="button" @click="excluir(e.id)" class="btn-action delete">
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
import { useSupabase } from '../composables/useSupabase'
 
const { supabase } = useSupabase()
 
const epis = ref([])
const editandoId = ref(null)
 
const defaultForm = () => ({
  nome: '',
  categoria: '',
  cor: '',
  quantidade: 0,
  fornecedor: '',
  descricao: '',
  foto: '',
})
 
const form = reactive(defaultForm())
 
const carregar = async () => {
  const { data, error } = await supabase
    .from('epis')
    .select('*')
    .order('nome')
 
  if (error) {
    console.error('Erro ao carregar:', error)
    return
  }
 
  epis.value = data || []
}
 
const salvar = async () => {
  const payload = {
    nome: form.nome,
    categoria: form.categoria,
    cor: form.cor,
    quantidade: Number(form.quantidade),
    fornecedor: form.fornecedor,
    descricao: form.descricao,
    foto: form.foto,
  }
 
  let error = null
 
  if (editandoId.value) {
    const response = await supabase
      .from('epis')
      .update(payload)
      .eq('id', editandoId.value)
    error = response.error
  } else {
    const response = await supabase
      .from('epis')
      .insert([payload])
    error = response.error
  }
 
  if (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar EPI')
    return
  }
 
  await carregar()
  cancelarEdicao()
  alert('EPI salvo com sucesso!')
}
 
const prepararEdicao = (e) => {
  editandoId.value = e.id
  Object.assign(form, {
    nome: e.nome || '',
    categoria: e.categoria || '',
    cor: e.cor || '',
    quantidade: e.quantidade || 0,
    fornecedor: e.fornecedor || '',
    descricao: e.descricao || '',
    foto: e.foto || '',
  })
}
 
const excluir = async (id) => {
  if (!id) {
    alert('ID inválido, não foi possível excluir.')
    return
  }
 
  const confirmar = confirm('Deseja excluir este EPI?')
  if (!confirmar) return
 
  const { error } = await supabase
    .from('epis')
    .delete()
    .eq('id', id)
 
  if (error) {
    console.error('Erro ao excluir:', error)
    alert(`Erro ao excluir EPI: ${error.message}`)
    return
  }
 
  await carregar()
}
 
const cancelarEdicao = () => {
  editandoId.value = null
  Object.assign(form, defaultForm())
}
 
onMounted(() => {
  carregar()
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
 
.card-form,
.card-table {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 0.1rem solid #EDEADC;
  margin-bottom: 2rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
 
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
 
.edit {
  color: #D1B54A;
  cursor: pointer;
  background: none;
  border: none;
  font-weight: bold;
  margin-right: 1rem;
}
 
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