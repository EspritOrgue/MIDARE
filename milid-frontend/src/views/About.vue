<template>
  <div class="about">
    <!-- TOOLBAR -->
    <nav class="toolbar">
      <div class="toolbar-row">
        <div class="toolbar-section-start">
          <button class="start icon" @click="onBack()">
            <MILIDIcons name="back" color="white"/>
          </button>
        </div>

        <div class="toolbar-title">
          <MILIDIcons name="logo" width="80" color="white"/>
        </div>

        <div class="toolbar-section-end">
          <button class="icon end">
            <MILIDIcons name="parametres" color="white" @wasClicked="showParameters = true"/>
          </button>
        </div>
      </div>
    </nav>

    <ParametersPage :open="showParameters" v-on:closerequest="showParameters = false" />

    <div class="about-content">

      <h1>À propos</h1>
      <p>MIDARE acronyme de « Microlearning Information Droits d’Auteur Ressources Education » a vu le jour à la suite d’une commande de la part de la direction de la HEG-Genève auprès de sa filière Information Science (IS). Celle-ci a formulée la demande de la création d’un dispositif de formation en microlearning ayant pour finalité d’accompagner les membres du PER de la HEG-Genève sur le droit d’auteur et son utilisation. En effet, suite au développement d’une politique open science et open education des hautes écoles suisses, savoir utiliser les licences creative commons est nécessaire afin de favoriser ces mouvements.</p>

      <p>La HEG-Genève (Haute Ecole de Gestion de Genève) regroupe quatre filières d’études reliées au domaine de l’économie et des services : économie d’entreprise, informatique de gestion, information science (anciennement information documentaire) et international business management.</p>

      <p>Le projet a été réalisé sous la supervision de René Schneider (Professeur et Responsable de la filière IS). Le contenu a été créé par Joseph Baud-Grasset (Assistant HES) et Eloïse Morisod (Assistante HES). Le design et les médias ont été créés par Joseph Baud-Grasset, Eloïse Morisod et Vincent de Vevey (Information & Learning Designer). Amir Alwash (Développeur Web/ DevOps) a adapté la partie informatique. Pierre Guanzini (Assistant HES) a assisté et prêté sa voix pour l’enregistrement audio. Tous sont membres de la HEG-Genève.</p>

      <p>Nous vous souhaitons une agréable expérience d’apprentissage !</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>

  .about{
    background: white;
    color: #333;
    position: absolute;
    width: 100vw;
    height: auto;
    padding-top: 80px;
    .toolbar{
      transform: translateY(0);
      transition: all 200ms;
      top:0px;
      background-color: var(--md-theme-default-primary);
      height: 69px;
      -box-shadow: 0 2px 3px -1px rgba(0,0,0,.1);
      &.exited {
        transform: translateY(69px);
      }

      .toolbar-title{
        img.logo{
          width: 60px;
          transform: translateY(-25px);
          margin-top: 25px;
        }
      }
    }
  }

  .about-content
  {
    margin: 20px;
    text-align: left;
  }
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import MILIDIcons from '../components/MILIDIcons.vue';
import ParametersPage from '../components/ParametersPage.vue';
import  cfg from '../../package.json';

@Component({
  components: {
    MILIDIcons,
    ParametersPage,
  },
})
export default class About extends Vue {

  version = cfg.version;

  showParameters = false;

  onBack() {
    this.$router.go(-1);
    //this.$router.push({ path: `/module`});
  }

}
</script>
