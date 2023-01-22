
<template>
  <div class="col" :style="cssVars" :class="'theme-'+theme">
    <div ref="raw_root" v-html="lessonContent" ></div>
    <Quiz v-if="hasQuiz" :moduleId="moduleId" :lessonId="lessonId" />

    <!-- DONE -->
    <CompletionButton :completed="completed" v-on:complete="onCompletionHandler" />
  </div>
</template>

<style scoped>
  .col{
    /* margin-left: 20px; */
    width:100%;
    max-width: 100vw;
    text-align: left;
    height: auto;
    padding-bottom: 50px;
  }

  .scrollDisabled{
    touch-action: none;
  }

  .col /deep/ img{
    width:80%;
    display:block;
    margin-left:auto;
    margin-right:auto;
    min-height: 160px;
  }

  .col /deep/ li::marker {
    color: var(--lesson-color);
    /* content: "• "; */
  }

  .col /deep/ strong{
    color: var(--lesson-color);
  }

  .col /deep/ ._definition{
    color: var(--lesson-color);
    cursor:pointer;
    text-decoration: underline dashed;
  }

  .col /deep/ h1{
    color: var(--lesson-color);
  }

</style>


<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from 'vue-property-decorator';
import Quiz from './Quiz.vue';

import CompletionButton from './CompletionButton.vue';

import { $config, $module, $metric } from '@/services';

import { getOffset } from '@/helpers/utils';
import { MILID } from '../models';

@Component({
  components: { Quiz, CompletionButton },
})
export default class LessonMarkdown extends Vue {
  @Prop() readonly moduleId!:string;
  @Prop() readonly lessonId!:string;
  lessonContent = "";
  definitions: any[] = [];

  get theme(){
      return $module.getModuleWithId(this.moduleId).theme;
  }

  beforeMount(){
    this.lessonContent = this.lesson.html;
    this.definitions = $module.store.definitions;
  }

  mounted(){
    this.setupDefinitions();
    this.setupImages();
  }

  beforeDestroy(){
    this.cleanupDefinitions();
  }

  // add support for live updating of component
  // the case occurs in module 4 where 2 markdown lessons follow each other
  beforeUpdate(){
    this.cleanupDefinitions();
    this.lessonContent = this.lesson.html;
    this.definitions = $module.store.definitions;
  }

  updated(){
    this.setupDefinitions();
    this.setupImages();
  }


  get module() {
    return $module.getModuleWithId(this.moduleId);
  }

  get lesson(){
    return $module.getLessonForModuleAndLessonId(this.moduleId, this.lessonId);
  }

  get completed(){
      return this.state == "done";
  }

  get state() {
      const metric = $metric.progressionState[this.lesson.id] || {};
      return metric.state || '';
  }

  get hasQuiz(){
    return !!this.lesson.quiz;
  }

  get cssVars(){
      return {
        '--lesson-color': $config.store.config.themes[this.module.theme].primary,
      };
  }

  definitionClickHandler(e: any){
    const definitionId = e.target.dataset.definitionId;
    // const height = getOffset(e.target).top;
    const definition = this.definitions.find(def => def.id === definitionId).definition;
    this.$emit('popupRequest', { definition });
  }

  setupDefinitions(){
      const rawRoot = this.$refs['raw_root'] as HTMLElement;
      const definitionElements = rawRoot.querySelectorAll('._definition');
      definitionElements.forEach(e => e.addEventListener('click', this.definitionClickHandler));
  }

  setupImages(){
      const rawRoot = this.$refs['raw_root'] as HTMLElement;
      const imgElements = rawRoot.querySelectorAll('img');

      imgElements.forEach((imgElement) => {
        if(imgElement.dataset.size){
          imgElement.style.width = imgElement.dataset.size;
        }
      });
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
