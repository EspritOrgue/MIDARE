<template>
    <div class="col" :class="'theme-'+theme" :style="cssVars" >
        <h1 class="primary-on-text" v-html="title"/>
        <div ref="text_root" v-html="textContent" />
        <div id="infography" ref="raw_root" v-html="svgContent" />
        <div id="loader" ref="loader"></div>
        <!-- DONE -->
        <CompletionButton :completed="completed" v-on:complete="onCompletionHandler" />

        <div class="footer" />
    </div>
</template>

<style scoped>
  .col{
    /* margin-left: 20px; */
    width:100%;
    max-width: 640px;
    text-align: left;
  }

  .footer{
    height: 80px;
  }

  .col /deep/ ._definition{
    color: var(--lesson-color);
    cursor:pointer;
    text-decoration: underline;
  }
#infography{
    display:none;
}
#loader {
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   max-width: 6rem;
   margin: 10rem auto;

 }
 #loader:before,
 #loader:after {
   content: "";
   position: absolute;
   border-radius: 50%;
   animation: pulsOut 1.8s ease-in-out infinite;
   filter: drop-shadow(0 0 1rem var(--lesson-color));
 }
 #loader:before {
   width: 100%;
   padding-bottom: 100%;
   box-shadow: inset 0 0 0 1rem var(--lesson-color);
   animation-name: pulsIn;
 }
 #loader:after {
   width: calc(100% - 2rem);
   padding-bottom: calc(100% - 2rem);
   box-shadow: 0 0 0 0 var(--lesson-color);
 }
 @keyframes pulsIn {
   0% {
     box-shadow: inset 0 0 0 1rem var(--lesson-color);
     opacity: 1;
   }
   50%, 100% {
     box-shadow: inset 0 0 0 0 var(--lesson-color);
     opacity: 0;
   }
 }

 @keyframes pulsOut {
   0%, 50% {
     box-shadow: 0 0 0 0 var(--lesson-color);
     opacity: 0;
   }
   100% {
     box-shadow: 0 0 0 1rem var(--lesson-color);
     opacity: 1;
   }
 }

</style>


<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from 'vue-property-decorator';

import { $config, $module, $metric } from '@/services';

import CompletionButton from './CompletionButton.vue';

import { getOffset } from '@/helpers/utils';
import { MILID } from '../models';

@Component({
  components: { CompletionButton },
})
export default class LessonInfographic extends Vue {
  @Prop() readonly moduleId!:string;
  @Prop() readonly lessonId!:string;
  svgContent = "";
  textContent = "";
  hasTextContent = false;

  interactives = new Map();

  definitions: any[] = [];

  beforeMount(){
    const lesson = $module.getLessonForModuleAndLessonId(this.moduleId, this.lessonId);
    console.log("lesson", lesson);
    this.svgContent = lesson.svg;
    this.textContent = lesson.html || "";
    this.hasTextContent = this.textContent !== "";
    this.definitions = $module.store.definitions;
  }

  mounted(){
      window.addEventListener('iconload', (e) => {
          this.setup()
          this.setupDefinitions();
          let loader = this.$refs.loader as HTMLElement;
          let svgElement = this.$refs.raw_root as HTMLElement;
          loader.remove()
          svgElement.id=""
      });
  }

  beforeDestroy(){
    this.cleanup();
    this.cleanupDefinitions();
  }
  get module() {
    return $module.getModuleWithId(this.moduleId);
  }

  get lesson(){
    return $module.getLessonForModuleAndLessonId(this.moduleId, this.lessonId);
  }

  get title(){
    return this.lesson.title;
  }

  get completed(){
    return this.state == "done";
  }

  get state() {
    const metric = $metric.progressionState[this.lesson.id] || {};
    return metric.state || '';
  }

  get cssVars(){
      return {
        '--lesson-color': $config.store.config.themes[this.module.theme].primary,
      };
  }

  get theme(){
    return this.module.theme;
  }

  hideAllOverlays(){
    for(let entry of this.interactives.values()){
      entry.overlay.classList.remove('infographic-overlay-visible');
    }
  }

  findNodeWithId(node){
    while(!node.id){
      node = node.parentNode;
    }

    return node.id;
  }

  enableTransitions(){
    for(let entry of this.interactives.values()){
      entry.overlay.classList.remove('disable-transitions');
    }
  }

  buttonClickHandler(e){
    // console.log(e.target);
    const id = this.findNodeWithId(e.target);
    console.log("id", id);
    this.hideAllOverlays();
    this.enableTransitions();
    this.interactives.get(id).overlay.classList.add('infographic-overlay-visible');
    e.stopPropagation();
  }

  overlayClickHandler(e){
    this.hideAllOverlays();
  }

  definitionClickHandler(e: any){
    const definitionId = e.target.dataset.definitionId;
    // const height = getOffset(e.target).top;
    const definition = this.definitions.find(def => def.id === definitionId).definition;
    this.$emit('popupRequest', { definition });
  }

  setupDefinitions(){
      const textRoot = this.$refs['text_root'] as HTMLElement;
      if(!textRoot) return;
      const definitionElements = textRoot.querySelectorAll('._definition');
      definitionElements.forEach(e => e.addEventListener('click', this.definitionClickHandler));
  }

  setup(){
      // const rawRoot = this.$refs['raw_root'] as HTMLElement;
      const buttons = Array.from(document.querySelectorAll('[id^="button"]'));
      const overlays = Array.from(document.querySelectorAll('[id^="overlay"]'));

      document.body.addEventListener('click', this.hideAllOverlays);

      for(let i = 0; i < buttons.length; i++){
        const button = buttons[i];
        const id = button.id;
        const index = id.substring(id.length - 2);

        const overlay:HTMLElement = overlays.find(overlay =>  overlay.id.endsWith(index)) as HTMLElement;

        if(overlay){
          overlay.classList.add('infographic-overlay');
          overlay.classList.add('disable-transitions'); // disable transitions for first paint

          button.addEventListener('click', this.buttonClickHandler);
          overlay.addEventListener('click', this.overlayClickHandler);
          this.interactives.set(id, {button, overlay});
        }
      }
  }

  cleanup(){
    document.body.removeEventListener('click', this.hideAllOverlays);

    for(let value of this.interactives.values()){
      value.button.removeEventListener('click', this.buttonClickHandler);
      value.overlay.removeEventListener('click', this.overlayClickHandler);
    }
  }

  cleanupDefinitions(){
      const rawRoot = this.$refs['raw_root'] as HTMLElement;
      const definitionElements = rawRoot.querySelectorAll('._definition');
      definitionElements.forEach(e => e.removeEventListener('click', this.definitionClickHandler));
  }

  onCompletionHandler(){
    const params = {
      lesson: this.lessonId,
      module: this.moduleId,
      state: MILID.LessonState.DONE
    };
    $metric.event(params);
  }

}
</script>
