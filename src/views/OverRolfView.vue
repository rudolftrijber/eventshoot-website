<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Over Rolf Trijber | Eventshoot.nl',
    description: 'Eventfotograaf en videograaf met 40+ jaar ervaring in beeldproductie. Gespecialiseerd in zakelijke events: congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten.',
    url: 'https://eventshoot.nl/over-rolf',
  })
})
</script>

<template>
  <main>

    <!-- Hero -->
    <section class="over-hero">
      <div class="over-hero__bg">
        <img src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_werk.jpg" alt="Rolf Trijber aan het werk als eventfotograaf" />
        <div class="over-hero__overlay"></div>
      </div>
      <div class="container over-hero__content">
        <h1>Rolf Trijber, achter Eventshoot.nl.</h1>
        <p>Eventfotograaf en videograaf. Gespecialiseerd in zakelijke evenementen door heel Nederland.</p>
        <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">Vrijblijvend kennismaken</RouterLink>
      </div>
    </section>

    <!-- Origin story -->
    <section class="story section">
      <div class="container story__grid">
        <div class="story__text">
          <h2 class="story__motto">Jouw event is een goudmijn aan content.</h2>
          <p>Op mijn twaalfde had ik een eigen donkere kamer. Niet omdat het moest, maar omdat ik niet kon stoppen met fotograferen. Op mijn zestiende verkocht ik mijn eerste foto's. Sindsdien ben ik nooit gestopt.</p>
          <p>Meer dan 40 jaar later is die gedrevenheid er nog steeds, alleen schiet ik nu op conferenties, jaarcongressen en productpresentaties in plaats van op de straten van mijn woonplaats. De essentie is dezelfde: het goede moment zien, en vastleggen voordat het voorbij is.</p>
        </div>
        <div class="story__photo">
          <img src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_team.jpg" alt="Rolf Trijber in actie op een event" />
        </div>
      </div>
    </section>

    <!-- Meer dan een fotograaf -->
    <section class="meer section section--blue">
      <div class="container meer__grid">
        <div class="meer__photo">
          <img src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_eventshoot.jpg" alt="Rolf Trijber in actie op een congres" />
        </div>
        <div class="meer__text">
          <h2>Meer dan een fotograaf.</h2>
          <p>Ik ben van origine grafisch vormgever. Compositie, kleur en typografie zitten er bij mij ingebakken, dat merk je terug in elke foto en elke video die ik lever.</p>
          <p>Organiseren staat op mijn voorhoofd geschreven. Ik stem vooraf af met locatie en techniek, ik ken het programma, en ik weet precies wanneer de groepsfoto moet worden gemaakt voordat de eerste gasten vertrekken. Een eventfotograaf moet niet alleen kunnen fotograferen, hij moet ook honderd mensen in beweging kunnen krijgen voor een memorabele groepsopname. Met overtuiging, niet met geroep.</p>
        </div>
      </div>
    </section>

    <!-- Langetermijnrelaties -->
    <section class="relaties section">
      <div class="container relaties__grid">
        <div class="relaties__text">
          <h2>Langetermijnrelaties, geen eenmalige klussen.</h2>
          <p>Het gaat mij niet om zoveel mogelijk opdrachten. Het gaat mij om het opbouwen van een echte werkrelatie.</p>
          <p>GBL Alliance vertrouwt mij al bijna negen jaar de contentproductie van hun conferenties toe. In die tijd ben ik niet alleen hun vaste fotograaf geworden, ik denk ook mee over de opzet en vormgeving van hun evenementen, zodat mijn beelden er elk jaar beter uit gaan zien. Dat is de samenwerking waar ik het voor doe.</p>
          <p class="relaties__cta-tekst">Als jij een partner zoekt die je event jaar na jaar beter maakt, dan passen we waarschijnlijk goed bij elkaar.</p>
        </div>
        <div class="relaties__photo">
          <img src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_interview.jpg" alt="Rolf Trijber bij een interview op locatie" />
        </div>
      </div>
    </section>

    <!-- Buiten de lens -->
    <section class="buiten section">
      <div class="container buiten__inner">
        <h2 class="buiten__title">Rolf buiten de lens.</h2>
        <p class="buiten__text">Naast mijn werk vaar ik als vrijwillige schipper met mensen met een beperking. Die ervaring, goed zijn met mensen, schakelen op elk niveau en echt aanwezig zijn, neem ik mee naar elk evenement waar ik kom. Benieuwd naar de fotografie buiten het eventcircuit?</p>
        <p class="buiten__link-wrap">
          <RouterLink to="/gallery" class="buiten__link">Bekijk mijn persoonlijk gallery →</RouterLink>
        </p>
      </div>
    </section>

    <!-- Actie kaarten -->
    <section class="actie section">
      <div class="container">
        <h2 class="actie__title">Wat kan ik voor jou doen?</h2>
        <div class="actie__grid">
          <div class="actie__card">
            <h3>Last-minute boeking</h3>
            <p>Event aanstaande week en nog geen fotograaf? Bel direct: 06 251 777 28. Ik probeer altijd iets te regelen.</p>
            <a href="tel:+31625177728" class="btn btn--primary">Bel Rolf</a>
          </div>
          <div class="actie__card">
            <h3>Groot congres</h3>
            <p>Jaarcongres of ledendag met 200+ deelnemers? Het Headline of Heroes pakket is hiervoor gemaakt, inclusief aftermovie en interviews.</p>
            <RouterLink to="/tarieven" class="btn btn--primary">Bekijk pakketten</RouterLink>
          </div>
          <div class="actie__card">
            <h3>Ook video nodig?</h3>
            <p>Foto én video in één productiedag. Geen tweede leverancier, geen afstemming. Eén aanspreekpunt, één stijl, één factuur.</p>
            <RouterLink to="/eventvideo" class="btn btn--primary">Meer over video</RouterLink>
          </div>
        </div>
      </div>
    </section>


  </main>
</template>

<style scoped>
/* Hero */
.over-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.over-hero__bg {
  position: absolute;
  inset: 0;
}

.over-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.over-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 100%);
}

.over-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.over-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.over-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 2rem;
  line-height: 1.75;
}

/* Origin story */
.story__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.story__motto {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  font-style: italic;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.story__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.85;
  margin-bottom: 1rem;
}

.story__photo img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 16/9;
}

/* Meer dan een fotograaf */
.meer__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.meer__photo {
  display: flex;
  justify-content: center;
}

.meer__photo img {
  width: 80%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 4/5;
}

.meer__text h2 {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.meer__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.85;
  margin-bottom: 1rem;
}

/* Langetermijnrelaties */
.relaties__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.relaties__text h2 {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.relaties__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.85;
  margin-bottom: 1rem;
}

.relaties__cta-tekst {
  color: #fff !important;
  font-weight: 600;
}

.relaties__photo img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 4/5;
}

/* Buiten de lens */
.buiten {
  background: rgba(255, 140, 0, 0.42) !important;
}

.buiten__inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.buiten__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
}

.buiten__text {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
  line-height: 1.85;
  margin-bottom: 1.25rem;
}

.buiten__passie {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.buiten__link-wrap {
  margin-top: 1.5rem;
}

.buiten__link {
  color: #fff;
  text-decoration: underline;
  font-weight: 600;
}
.buiten__link:hover {
  opacity: 0.8;
}

/* Actie kaarten */
.actie__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
}

.actie__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.actie__card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actie__card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.actie__card p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.65;
  flex: 1;
}

@media (max-width: 900px) {
  .story__grid,
  .meer__grid,
  .relaties__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .meer__photo { order: -1; }
}

@media (max-width: 768px) {
  .actie__grid { grid-template-columns: 1fr; }
}
</style>
