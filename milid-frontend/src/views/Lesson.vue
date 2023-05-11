<template >
  <div v-if="module" :class="'theme-'+ module.theme" class="modal module">
    <!-- DEFAULT TOOLBAR -->
    <nav class="toolbar primary">
      <div class="toolbar-row">
        <div class="toolbar-section-start">
          <button class="start icon" @click="onBack()">
            <MILIDIcons name="back" color="white"/>
          </button>
        </div>

        <div v-if="isUniqueModule" class="toolbar-title title-left">
          <b>Leçon {{position}}</b><br/>
          <span v-html="currentLesson.title"></span>
        </div> 
         <div v-else class="toolbar-title title-left">
            <b>M{{ module.id }}</b>.{{ position }}<br/>
            <span v-html="currentLesson.title"></span>
          </div>       

        <div class="toolbar-section-end">
          <button class="end icon">
            <!-- <MILIDIcons name="parametres" color="white"/> -->
          </button>
        </div>
      </div>

      <div class="toolbar-row">
        <div class="toolbar-title tight">
          <ModuleProgress 
          :pipCount="count" 
          :pipTotal="count"
          :completedPips="position" 
          color="white" 
          :bkgdColor="config.themes[module.id].primary"
          v-bind:class="computeModuleProgressClass" />
        </div>
      </div>        

    </nav>

    <ContentSwipe :initial="$route.params.lesson_id - 1" :lessons="lessons" @changeCard="renderChange" ref="container">
      <section class="lesson rendered-item"          
          v-for="(lesson, index) in renderLessons" :key="index" :id="'ctn-'+index"          
          v-bind:index="index" ref="content">
        <LessonMarkdown v-if="lesson.type == 'MARKDOWN'" :moduleId="module.id" :lessonId="lesson.id" @popupRequest="onPopupRequest" />
        <LessonVideo v-else-if="lesson.type == 'VIDEO'" :moduleId="module.id" :lessonId="lesson.id"  />
        <LessonPodcast v-else-if="lesson.type == 'PODCAST'" :moduleId="module.id" :lessonId="lesson.id"  />
        <LessonInfographic v-else-if="lesson.type == 'INFOGRAPHIC'" :moduleId="module.id" :lessonId="lesson.id" @popupRequest="onPopupRequest" />
        <div v-else>
          <h3 class="title">{{lesson.title}}</h3>
          <div class="item type ">
            <MILIDIcons name="podcast" :theme="module.theme"/>
          </div>
        </div>
      </section>
    </ContentSwipe>
    <LessonSources :lessonId="currentLesson.id" :moduleId="module.id" />
    <DefinitionPopup 
      :open="showDefPopup" 
      :theme="module.theme" 
      v-on:closerequest="showDefPopup = false">
      {{definition}}
    </DefinitionPopup>
  </div>
  <!--- WHEN MODULE IS NOT READY -->
  <div v-else>    
    <h1>Le Module {{$route.params.module_id}} n'est pas disponible</h1>
  </div>

</template>

<style lang="scss" scoped>
  .modal.module{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: white;
    margin: 0;
    z-index: 2;
    height: 100vh;
    width: 100vw;    
    padding-top:0;    
  }

  
  .md-speed-dial.md-bottom-right {
    position: fixed;
    z-index: 2;
    right: calc( 50% - 30px );
    margin: auto;
  }

  section.lesson {
    margin-top: 95px;
    padding-bottom: 160px;
    // FIXME activating scroll, disable swipe 
    // overflow-y:auto;
    .title {
      text-align: left;
      color: var(--theme-1-primary);
      margin-top: 63px;      
      text-transform: uppercase;
      font-size: 13px;
      line-height: 15px;      
    }

    .type {
      padding: 80px;
    }

    &.active-card {
      opacity: 1;
      transition: opacity 1000ms;
    }    

    .content {
      height: calc( 100vh - 30px );
      width: 100vw;
    }

  }


</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route} from 'vue-router';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import { $config, $module, $metric, MILIDEvent, $user } from '../services';
import { MILID } from '../models';

import ContentSwipe from '../components/ContentSwipe.vue';
import MILIDIcons from '../components/MILIDIcons.vue';
import ModuleProgress from '../components/ModuleProgress.vue';


import LessonMarkdown from '../components/LessonMarkdown.vue';
import LessonVideo from '../components/LessonVideo.vue';
import LessonPodcast from '../components/LessonPodcast.vue';
import LessonInfographic from '../components/LessonInfographic.vue';

import LessonSources from '../components/LessonSources.vue';
import DefinitionPopup from '../components/DefinitionPopup.vue';


@Component({
  components: { 
    ContentSwipe, 
    MILIDIcons, 
    ModuleProgress, 
    LessonMarkdown, 
    LessonVideo, 
    LessonPodcast, 
    LessonInfographic,
    LessonSources,
    DefinitionPopup,
   }
})
export default class Lesson extends Vue {
  //private _observer: any;
  private renderLessons$: MILID.Lesson[] = [];
  private translateY = -1;
  test = [];

  showDefPopup = false;
  definition = "";

  //
  // vues methods
  beforeRouteEnter(to: Route, from: Route, next: any) {
    const load = [$config.get(),$module.getAll()];
    Promise.all(load).then(next);
  }

  beforeDestroy () {
    document.body.style.removeProperty("overflow-y");
    document.body.style.removeProperty("position");
    clearAllBodyScrollLocks();
  }

  mounted() {    
    document.body.style.setProperty("overflow-y", "hidden");
    document.body.style.setProperty("position", "fixed");
  }

  //
  // computed properties
  get count() {
    // return this.lessons.length + 1;
    return this.lessons.length;
  }

  get position(){
    return Number.parseInt(this.$route.params.lesson_id || "0");
  }

  get config(){
    return $config.store.config;
  }

  get module() {
    return $module.getModuleWithId(this.$route.params.module_id);    
  }

  get isUniqueModule(){
    return $module.getModuleCount() == 1
  }

  get lessons() {
    const lessons = this.module.lessons;
    return lessons;
  }

  get currentLesson() {
    return $module.getLessonForModuleAndLessonIndex(this.$route.params.module_id,this.$route.params.lesson_id);
  }

  get renderLessons() {
    if(!this.renderLessons$.length) {
      const lid = Number.parseInt(this.$route.params.lesson_id || "0");
      const lessons = this.module.lessons;
      // FIXME, findIndex can return -1 !
      const index =  lessons.findIndex(l => l.index == lid);
      const lastIndex = lessons.length - 1;
      const prevIndex = index === 0 ? lastIndex : index - 1;
      const nextIndex = index === lastIndex ? 0 : index + 1;

      this.renderLessons$ = [lessons[prevIndex],lessons[index],lessons[nextIndex]];
    }
    return this.renderLessons$;
  }  

  get computeModuleProgressClass(){
    const result = this.module.id == 2 ? 'progress-module-2' : 'progress';
    return result;
  }

  initScroll(container, content) {
    if(!content || !container) {
      return;
    }

    const section = content[1].firstChild || content[1];
    setTimeout(()=>{
      // const margin = 100;// toolbar
      // const overflow = (section.clientHeight > (window.innerHeight - margin)) ? 'auto':'hidden';
      container.$el.style.setProperty("overflow-y", 'auto');
      container.$el.scrollTop = 0;

      content[0].style.setProperty("overflow-y", 'hidden');
      content[1].style.removeProperty("overflow-y");
      content[2].style.setProperty("overflow-y", 'hidden');
      
      disableBodyScroll(container.$el);
      // console.log('----',section.clientHeight, window.innerHeight,content[0].style);
      // console.log('----',overflow);
    },200);
  }


  renderChange(renderLessons) {
    this.renderLessons$ = [...renderLessons];
    this.$router.replace({ path: `/module/${this.module.id}/lesson/${renderLessons[1].index}`}).catch(()=> {
      //
    }).then(()=>{
      // validate screen 
      // lock or unlock scroll (iOS body scroll issue)
      const container = this.$refs.container as any;
      const content = this.$refs.content as any;
      this.initScroll(container,content);

      //
      // event metric
      const params: MILIDEvent = {
        module:this.module.id,
        lesson:renderLessons[1].id,
        state:MILID.LessonState.DOING
      };
      $metric.event(params);
    });
  }

  themePrimary(theme) {
    return this.config.themes[theme].primary;
  }

  themeSecondary(theme) {
    return this.config.themes[theme].secondary;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  getSourceHtml(lesson: MILID.Lesson) {
    return lesson.sources || '';
  }

  onPopupRequest(payload){
    const { definition } = payload;
    this.definition = definition;
    this.showDefPopup = true;
  }


  onBack() {
    this.$router.go(-1);
    //this.$router.push({ path: `/module`});
  }
}
</script>
