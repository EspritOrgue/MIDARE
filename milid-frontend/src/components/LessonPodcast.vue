<template>
  <div class="col" :class="'theme-' + theme">
    <h1 class="primary-on-text" v-html="title" />

    <audio ref="audioPlayer" :src="mediaUrl" ></audio>

    <div class="lottie-container">
      <lottie-animation
        class="lottie-player"
        :path="lottiePath"
        :autoPlay="false"
        @AnimControl="setAnimController"
      />
      <div
        class="status "
        :class="{ play: isReadyToPlay }"
        @click="onToggle">
      </div>
    </div>

    <div class="duration-container">
      <span class="primary-on-text">{{ elapsedStr }}/{{ durationStr }}</span>
    </div>

    <div class="control">
      <div class="control-icons">
        <MILIDIcons
          name="podcast-rewind"
          width="35px"
          :theme="theme"
          @wasClicked="seekBackwards"
        />
        <MILIDIcons
          v-if="isPlaying"
          width="35px"
          name="podcast-pause"
          :theme="theme"
          @wasClicked="pause"
        />
        <MILIDIcons
          v-else
          name="podcast-play"
          width="35px"
          :theme="theme"
          @wasClicked="play"
        />
        <MILIDIcons
          name="podcast-forward"
          width="35px"
          :theme="theme"
          @wasClicked="seekForwards"
        />
      </div>
    </div>
    <Quiz v-if="hasQuiz" :moduleId="moduleId" :lessonId="lessonId" />
    
    <!-- DONE -->
    <CompletionButton
      :completed="completed"
      v-on:complete="onCompletionHandler"
    />
    <div style="height: 50px" />
  </div>
</template>


<style lang="scss" scoped>
.col {
  width: 100%;
  max-width: 640px;
  text-align: left;
}

h1 {
  text-transform: uppercase;
}

.lottie-container {
  display: flex;
  justify-content: center;
  min-height: 320px;
  -margin-left: 15px;
  position: relative;
  .status {
    left: calc(50% - 90px);
    top: calc(50% - 72px);
    margin: auto;
    position: absolute;
    width: 94px;
    height: 94px;
    z-index: 0;
    svg {
      width: 100px;
      height: 100px;
      opacity: 0.3;
    }
    &.loader{
      border-left: 1.0em solid #eee;
      border-top:1.0em solid transparent;
      border-right:1.0em solid transparent;
      border-bottom:1.0em solid transparent;
    }
    &.loading,
    &.play {
      svg {
        display: none;
      }
    }
  }
}

.lottie-player {
  position: relative;
}

.duration-container {
  display: flex;
  justify-content: center;
  margin-top: -40px;
  margin-bottom: 20px;
}

.control {
  display: flex;
  justify-content: center;
}

.control-icons {
  display: flex;
  width: 70%;
  height: 35px;
  justify-content: space-between;
  cursor: pointer;
}
.control-icons svg {
  width: 35px;
  height: 35px;
}
</style>


<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";
import MILIDIcons from "./MILIDIcons.vue";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import CompletionButton from "./CompletionButton.vue";
import Quiz from './Quiz.vue';
import { $config, $module, $metric } from "@/services";
import { MILID } from "../models";
import { formatTime } from "../helpers/milidHelpers";

@Component({
  components: {
    Quiz,
    MILIDIcons,
    LottieAnimation,
    CompletionButton,
  },
})
export default class LessonPodcast extends Vue {
  @Prop() readonly moduleId!: string;
  @Prop() readonly lessonId!: string;

  lottieController: any = null;
  lottieOptions: any = null;

  elapsed = "";
  duration: any = "";

  isPlaying = false;

  isReadyToPlay = false;
  isLoading = true;

  get lesson() {
    return $module.getLessonForModuleAndLessonId(this.moduleId, this.lessonId);
  }

  get theme() {
    return $module.getModuleWithId(this.moduleId).theme;
  }

  get hasQuiz() {
    return !!this.lesson.quiz;
  }

  get lottiePath() {
    return `lottie/podcast-theme-${this.moduleId}.json`;
  }

  get title() {
    return this.lesson.title;
  }

  get completed() {
    return this.state == "done";
  }

  get state() {
    const metric = $metric.progressionState[this.lesson.id] || {};
    return metric.state || "";
  }

  get mediaUrl() {
    return this.lesson.media;
  }

  get done() {
    return $metric.progressionState[this.lessonId];
  }

  get elapsedStr() {
    return formatTime(this.elapsed);
  }

  get durationStr() {
    return formatTime(this.duration);
  }

  setAnimController(controller) {
    this.lottieController = controller;
  }

  async beforeMount() {}

  get audioPlayer() {
    return this.$refs.audioPlayer as HTMLAudioElement;
  }

  mounted() {
    this.audioPlayer.addEventListener("ended", this.onTrackEnded);
    this.audioPlayer.addEventListener("timeupdate", this.onTimeUpdate);
    this.audioPlayer.addEventListener("loadedmetadata", this.onMetaLoaded);
    this.audioPlayer.addEventListener("canplay", this.onCanPlay);
  }

  beforeDestroy() {
    this.audioPlayer.removeEventListener("ended", this.onTrackEnded);
    this.audioPlayer.removeEventListener("timeupdate", this.onTimeUpdate);
    this.audioPlayer.removeEventListener("loadedmetadata", this.onMetaLoaded);
    this.audioPlayer.removeEventListener("canplay", this.onCanPlay);
  }

  pause() {
    if (!this.isPlaying) return;

    this.audioPlayer.pause();
    this.isPlaying = false;

    if (this.lottieController) {
      this.lottieController.pause();
    }
  }

  play() {
    if (this.isPlaying) return;

    this.audioPlayer.play().catch(err => console.log('---DBG',err));
    this.isPlaying = true;
    this.isReadyToPlay = true;
    if (this.lottieController) {
      this.lottieController.play();
    }
  }

  seekForwards() {
    this.audioPlayer.currentTime = Math.min(
      this.audioPlayer.currentTime + 10,
      this.audioPlayer.duration
    );
  }

  seekBackwards() {
    this.audioPlayer.currentTime = Math.max(
      this.audioPlayer.currentTime - 10,
      0
    );
  }

  onToggle() {
    this.isPlaying ? this.pause() : this.play();
  }

  onCompletionHandler() {
    const params = {
      lesson: this.lessonId,
      module: this.moduleId,
      state: MILID.LessonState.DONE,
    };
    $metric.event(params);
  }

  onCanPlay() {
    // ISSUE on iOS
    // https://stackoverflow.com/questions/50051639/javascript-html5-video-event-canplay-not-firing-on-safari
    this.isLoading = false;
  }

  onMetaLoaded() {
    this.isLoading = false;
    this.duration = Math.floor(this.audioPlayer.duration);
    this.elapsed = "0";
  }

  onTrackEnded() {
    this.isPlaying = false;
    this.lottieController.pause();
  }

  onTimeUpdate() {
    this.elapsed = `${Math.floor(this.audioPlayer.currentTime)}`;
  }

}
</script>
