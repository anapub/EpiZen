<template>
  <div class="inventario-page">

    <header class="top-section">
     <h1>Estoque de <span>EPIs</span></h1>
    </header>

    <!-- GRID DOS CARDS -->
    <div class="grid-cards">

      <div
        v-for="epi in epis"
        :key="epi.id"
        class="card-epi"
      >

        <!-- IMAGEM -->
        <div class="card-image">
          <img
            :src="epi.foto"
            :alt="epi.nome || 'EPI'"
            loading="lazy"
          />
        </div>

        <!-- CONTEÚDO -->
        <div class="card-body">

          <!-- TOPO -->
          <div class="top-info">

            <div class="equipamento-info">

              <h3>{{ epi.nome }}</h3>

              <p class="categoria">
                {{ epi.categoria }}
              </p>

            </div>

            <div
              class="status"
              :class="{
                indisponivel: (epi.quantidade || 0) <= 0
              }"
            >
              {{
                (epi.quantidade || 0) > 0
                  ? 'Disponível'
                  : 'Indisponível'
              }}
            </div>

          </div>

          <!-- COR + ESTOQUE -->
          <div class="card-info-row">

            <!-- COR -->
            <div class="info-item">

              <div class="info-content">

                <img
                  class="info-icon"
                  src="../assets/cor.png"
                  alt="Ícone cor"
                />

                <div class="info-text">

                  <span class="label">
                    Cor
                  </span>

                  <strong>
                    {{ epi.cor || 'Não informado' }}
                  </strong>

                </div>

              </div>

            </div>

            <!-- ESTOQUE -->
            <div class="info-item">

              <div class="info-content">

                <img
                  class="info-icon"
                  src="../assets/estoque-pronto.png"
                  alt="Ícone estoque"
                />

                <div class="info-text">

                  <span class="label">
                    Qtd. Estoque
                  </span>

                  <strong>
                    {{ epi.quantidade || 0 }} unidades
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

const epis = ref([])

const carregarEPIs = async () => {

  const { data, error } = await supabase
    .from('epis')
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  epis.value = data
}

onMounted(() => {
  carregarEPIs()
})

</script>

<style scoped>

.inventario-page {
  padding: 1rem;
}

/* TOPO */

.top-section {
  margin-bottom: 1.8rem;
}

.top-section h1 {
  font-size: 2.3rem;
  font-weight: 700;
  color: #024554;
}

.top-section span {
  color: #A8B545;
  font-weight: bold;
}

/* GRID */

.grid-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* CARD */

.card-epi {
  background: #ffffff;
  border: 1px solid #EDEADC;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.08);
  transition: 0.25s ease;
}

.card-epi:hover {
  transform: translateY(-0.3rem);
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.10);
}

/* IMAGEM */

.card-image {
  width: 100%;
  height: 210px;
  padding: 1rem;
  background: #F8F9FA;
  border-bottom: 1px solid #eeeeee;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.9rem;
}

/* BODY */

.card-body {
  padding: 1rem;
}

/* TOPO INFO */

.top-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
}

.equipamento-info {
  flex: 1;
}

/* NOME */

.card-body h3 {
  font-size: 1rem;
  color: #111111;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

/* CATEGORIA */

.categoria {
  font-size: 0.85rem;
  color: #777777;
  margin-top: 0.2rem;
}

/* STATUS */

.status {
  background: #d9f7e5;
  color: #119543;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  white-space: nowrap;
}

.status.indisponivel {
  background: #ffdede;
  color: #d11a2a;
}

/* LINHA INFO */

.card-info-row {
  display: flex;
  gap: 0.6rem;
}

/* BOX */

.info-item {
  flex: 1;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #f7f7f7;
  border: 1px solid #ececec;
  border-radius: 0.9rem;
  padding: 0.9rem;
  height: 100%;
}

/* ÍCONES */

.info-icon {
  width: 1.6rem;
  height: 1.6rem;
  object-fit: contain;
  flex-shrink: 0;
}

/* TEXTO */

.info-text {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.78rem;
  color: #000000;
  font-weight: 700;
  margin-bottom: 0.15rem;
}

.info-item strong {
  font-size: 0.82rem;
  color: #666666;
  font-weight: 500;
  line-height: 1.2;
}

/* RESPONSIVO */

@media (max-width: 1400px) {

  .grid-cards {
    grid-template-columns: repeat(3, 1fr);
  }

}

@media (max-width: 1000px) {

  .grid-cards {
    grid-template-columns: repeat(2, 1fr);
  }

}

@media (max-width: 700px) {

  .grid-cards {
    grid-template-columns: 1fr;
  }

  .top-section h1 {
    font-size: 2rem;
  }

  .card-info-row {
    flex-direction: column;
  }

}

</style>