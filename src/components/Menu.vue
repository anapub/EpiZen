<template>

  <!-- Cód. da Img. Logo -->
  <header class="navbar">
    <div class="navbar_logo">
      <img src="../assets/Imagem-logo-sf.png" width="300" height="81">
    </div>

    <!-- Cód. para os Botões de acesso-->
    <nav aria-label="Menu principal">
      <ul class="navbar_button">
        <li>
          <RouterLink to="/Login">Login</RouterLink>
        </li>
        <li>
          <RouterLink to="/Contato">Contato</RouterLink>
        </li>
      </ul>
    </nav>
  </header>

  <!-- Cód. da Img Home - Banner -->
  <div class="banner">
    <img src="../assets/Imagem-home.svg">
  </div>

  <!-- Cód. p/ Frase -->
  <section class="intro">
    <h1>
      O que é a
      <img src="../assets/Escrita-logo-sf.png" width="170" height="55">
      <span>?</span>
    </h1>

    <p>Organize seus EPIs. Simplifique sua rotina.</p>
  </section>

  <!-- Cód. p/ Cards -->
  <section class="cards">

    <div class="card">
      <p>Controle inteligente de EPIs</p>
      <img src="../assets/Imagem-controle.png" class="card_icon">
    </div>

    <div class="card">
      <p>Gestão de EPIs no modo Zen</p>
      <img src="../assets/Imagem-gestão.png" class="card_icon">
    </div>

    <div class="card">
      <p>Monitore e consulte facil</p>
      <img src="../assets/Imagem-monitore.png" class="card_icon">
    </div>

    <div class="card">
      <p>Relatórios em tempo real</p>
      <img src="../assets/Imagem-relatório.png" class="card_icon">
    </div>

  </section>

  <!-- Cód. p/ EPIs Monitorados -->
  <section class="epi">

    <div class="epis">
      <h1><span>EPIs</span> Monitorados</h1>
    </div>

    <div class="epi-grid">

      <div class="card-epi">
        <img src="../assets/oculos-de-sol (1).png" class="epi_icon">
        <p>Óculos</p>
      </div>

      <div class="card-epi">
        <img src="../assets/sapato.png" class="epi_icon">
        <p>Botas</p>
      </div>

      <div class="card-epi">
        <img src="../assets/luvas.png" class="epi_icon">
        <p>Luvas</p>
      </div>

      <div class="card-epi">
        <img src="../assets/protetor-auricular.png" class="epi_icon">
        <p>Protetor Auditivo</p>
      </div>

      <div class="card-epi">
        <img src="../assets/capacete.png" class="epi_icon">
        <p>Capacete</p>
      </div>

      <div class="card-epi">
        <img src="../assets/colete-de-construcao.png" class="epi_icon">
        <p>Colete</p>
      </div>

    </div>

  </section>

</template>

<script>
export default {
  name: 'Menu'
}
</script>

<style scoped>
/* Estilo a barra de navegação */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 5.5rem;
  background: #EDEADC;
  gap: 1rem;
}

/* Estilo dos botões de acesso */
.navbar_button {
  display: flex;
  list-style: none;
  gap: 1rem;
}

/* Estilo dos textos dentro dos botões de acesso */
.navbar_button a {
  text-decoration: none;
  background: #53736A;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
}

/* Estilo do banner */
.banner img {
  width: 100%;
  display: block;
  object-fit: cover;
}

/* Estilo da seção de introdução */
.intro {
  text-align: center;
  margin-top: 2rem;
}

/* Estilo do título da introdução */
.intro h1 {
  font-size: 3rem;
  color: #024554;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Estilo do destaque no título da introdução */
.intro span {
  color: #A8B545;
  font-weight: bold;
}

/* Estilo do parágrafo da introdução */
.intro p {
  font-size: 2rem;
  color: #024554;
  margin-top: 0rem;
}

/* Estilo da seção de cards */
.cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 2rem;
}

/* Estilo dos cards */
.card {
  background: #024554;
  color: white;
  width: 21rem;
  height: 12rem;
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  font-size: 1.2rem;
  transition: 0.3s;
}

/* Efeito das transições nos cards */
.card:hover {
  transform: translateY(-0.3rem);
}

/* Estilo das imagens dentro dos cards */
.card_icon {
  width: 9rem;
  height: auto;
}

/* Estilo da seção de EPIs monitorados */
.epi {
  background: #EDEADC;
  padding-bottom: 4rem;
}

/* Estilo da parte superior da seção de EPIs monitorados */
.epis {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  padding-top: 2rem;
  background: #EDEADC;
}

/* Estilo do título da seção de EPIs monitorados */
.epis p {
  font-size: 3rem;
  color: #024554;
}

/* Estilo do destaque no título da seção de EPIs monitorados */
.epi span {
  color: #A8B545;
  font-weight: bold;
}

/* Estilo da grade de EPIs monitorados */
.epi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;
  padding: 2rem 8rem;
}

/* Estilo dos cards de EPIs monitorados */
.card-epi {
  background: #AEB8AC;
  width: 16rem;
  height: 10rem;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
}

/* Efeito das transições nos cards de EPIs monitorados */
.card-epi:hover {
  transform: translateY(-0.3rem);
}

/* Estilo dos textos dentro dos cards de EPIs monitorados */
.card-epi p {
  color: #024554;
  font-size: 1.3rem;
  margin-top: 0.5rem;
}

/* Estilo das imagens dentro dos cards de EPIs monitorados */
.epi_icon {
  width: 4.5rem;
  height: auto;
}
</style>