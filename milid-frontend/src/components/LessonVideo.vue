
<template>
  <div class="lesson-video" :class="'theme-'+module.theme" :style="cssVars">  
    <h1 v-html="lesson.title" />
    <div class="player">
      <div class="lottie-container">
        <lottie-animation class="lottie-player" :path="lottiePath" :autoPlay="false" @AnimControl="setAnimController" />
      </div>
      <video ref="video"  playsinline  @click="onToggle" >
          <source :src="mediaUrl"  type='video/mp4'>
      </video>
      <div class="status" :class="{'loader':isLoading,'play':isPlaying}" @click="onToggle">
            <MILIDIcons name="podcast-play" width="40px" :theme="theme" />
      </div>
    </div>

    <div class="duration-container">
        <span class="primary-on-text" >{{elapsedStr}}/{{durationStr}}</span>
    </div>

    <div class="control">
        <div class="control-icons">
            <MILIDIcons name="podcast-rewind" width="35px" :theme="theme" @wasClicked="onSeekBackwards" />
            <MILIDIcons v-if="isPlaying" name="podcast-pause" width="35px" :theme="theme" @wasClicked="onPause"/>
            <MILIDIcons v-else name="podcast-play" width="35px" :theme="theme" @wasClicked="onPlay" />
            <MILIDIcons name="podcast-forward" width="35px" :theme="theme" @wasClicked="onSeekForwards"  />
        </div>
    </div>

    <!-- DONE -->
    <div class="col">
      <Quiz v-if="hasQuiz" :moduleId="moduleId" :lessonId="lessonId" />
      <CompletionButton :completed="completed" v-on:complete="onCompletionHandler" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .st2{fill:var(--primary);}
  .st1{fill:#fff;}
  .st0{fill:var(--tertiary);}

  h1{
    color: var(--primary);
  }
  
  .lottie-container{
    display: flex;
    justify-content: center;
    width:150%;
    min-height: 320px;
  }

  .lottie-player{
    position:relative;
    left: -17%;
  }

  .lesson-video{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

  }

  .player{
    position: relative;
    margin-left: -25px;
    margin-right: -25px;    
    width: 100vw;
    min-height: 450px;
    overflow: hidden;
    
    .video-edges{
      width: 100%;
      height: 100%;
      transform: scale(1.2);
    }

    
    video,
    canvas {
      width: calc( 100vw - 95px);
      height: calc( 100vw - 95px);
      border-radius: 60px;
      background-color: white;
      margin: auto;    
      position: absolute;
      left: 50%;
      top: 50%;    
      transform: translate3d(-50%,-50%,0);
    }
    .status{
      left: calc( 50% - 50px );
      top: calc( 50% - 50px );    
      margin: auto;    
      position: absolute;
      width: 80px;
      height: 80px;
      z-index: 0;
      svg{
        width: 100px;
        height: 100px;        
        opacity: .3;
      }
      &.loading,
      &.play{
        svg{
          display: none;
        }        
      }
    }

  }

  
  .col{
    width:100%;
    max-width: 640px;
    text-align: left;
  }
  
  .duration-container{
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      width: 100%;
      margin-top: -20px;
      z-index: 1;
      font-family: monospace;      
  }
  
  .control{
      display: flex;
      justify-content: center;
      width: 100%;
      transform: scale(.8);
      svg{
        width: 35px;
        height: 35px;
      }
  }

  .control-icons{
      display: flex;
      width:70%;
      height: 35px;
      justify-content: space-between;
      cursor:pointer;
  }
</style>


<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from 'vue-property-decorator';
import MILIDIcons from '../components/MILIDIcons.vue';
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import CompletionButton from './CompletionButton.vue'
import Quiz from './Quiz.vue';
import { $config, $module, $metric } from '@/services';
import { MILID } from '../models';
import { formatTime } from '../helpers/milidHelpers';

@Component({
  components: {
    Quiz,
    MILIDIcons,
    LottieAnimation,
    CompletionButton,
  },
})
export default class LessonVideo extends Vue {
  @Prop() readonly moduleId!:string;
  @Prop() readonly lessonId!:string;

  duration = 0;
  elapsed = "0";
  isPlaying = false;
  
  lottieController:any = null;
  lottieOptions:any = null;

  isReadyToPlay = false;
  isLoading = true;

  get lesson() {
    return $module.getLessonForModuleAndLessonId(this.moduleId,this.lessonId);
  }

  get module() {
    return $module.getModuleWithId(this.moduleId);    
  }

  get theme(){
      return $module.getModuleWithId(this.moduleId).theme;
  }
  
  get lottiePath(){
    return `lottie/video-theme-${this.moduleId}.json`;
  }

  get cssVars() {
    const theme = $config.store.config.themes[this.theme];

    return {
      '--primary': theme.primary,
      '--secondary': theme.secondary,
      '--tertiary': theme.tertiary
    }
  }  

  get mediaUrl() {
    // return "http://media.w3.org/2010/05/sintel/trailer.mp4";
    return this.lesson.media;
  }

  get completed(){
    return this.state == "done";
  }

  get state() {
    const metric = $metric.progressionState[this.lesson.id] || {};
    return metric.state || '';
  }

  get elapsedStr(){
      return formatTime(this.elapsed);
  }

  get durationStr(){
      return formatTime(this.duration);
  }

  get video(){
      return this.$refs.video as HTMLVideoElement;
  }

  get hasQuiz() {
    return !!this.lesson.quiz;
  }

  mounted(){
      this.video.addEventListener('ended', this.onTrackEnded);
      this.video.addEventListener('timeupdate', this.onTimeUpdate);
      this.video.addEventListener('loadedmetadata', this.onMetaLoaded);
      this.video.addEventListener('waiting', this.onWait);
      this.video.addEventListener('canplay', this.onCanPlay);
  }

  beforeDestroy(){
      this.video.removeEventListener('ended', this.onTrackEnded);
      this.video.removeEventListener('timeupdate', this.onTimeUpdate);
      this.video.removeEventListener('loadedmetadata', this.onMetaLoaded);
      this.video.removeEventListener('waiting', this.onWait);
      this.video.removeEventListener('canplay', this.onCanPlay);
  }

  onMetaLoaded(){
    this.duration = Math.floor(this.video.duration);
    this.elapsed = "0";

    // ISSUE on iOS
    // https://stackoverflow.com/questions/50051639/javascript-html5-video-event-canplay-not-firing-on-safari
    this.isLoading = false;
  }

  onTrackEnded(){
      this.isPlaying = false;
  }

  onTimeUpdate(){
      this.elapsed = `${Math.floor(this.video.currentTime)}`;
  }

  onToggle() {
    if(this.isPlaying) {
      this.onPause();
    } else {
      this.onPlay();
    }
  }

  // pause request
  onPause(){
    if(!this.isPlaying) return;

    this.video.pause();
    this.isPlaying = false;
    
    if(this.lottieController){
        this.lottieController.pause();
    }
  }

  // play request
  onPlay() {
    if(this.isPlaying) return;

    this.video.play();
    this.isPlaying = true;
    this.isReadyToPlay = true;

    if(this.lottieController){
        this.lottieController.play();
    }
  }

  onSeekForwards(){
    this.video.currentTime = Math.min(this.video.currentTime + 10, this.video.duration);
  }

  onSeekBackwards(){
    this.video.currentTime = Math.max(this.video.currentTime - 10, 0);
  }

  onloaded() {

  }

  onWait() {
    this.isReadyToPlay = false
    this.isLoading = true
    console.log('--DBG onWait for data')
  }

  onCanPlay() {
    this.isLoading = false
  }
  
  setAnimController(controller){
    this.lottieController = controller;
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