<template>
<!--- TOP -->
<svg v-if="name == 'top'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1080 136.66">
  <defs>
    <clipPath id="clippath">
      <rect style="fill:none;" x="0" width="1080" height="136.66"/>
    </clipPath>
  </defs>
  <g style="clip-path:url(#clippath);">
    <path style="fill:#ff6f66;" d="m0,136.66C0,87.64,2.2,71.82,61.27,58.48c26.37-5.96,61.94-29.22,117.13-31.3,33.47-1.26,73.68,18,120.86,17.58,35.71-.32,75.57-20.47,120.31-20.53,36.81-.05,76.87,19.95,120.43,19.95s83.62-20,120.44-19.95c44.74.07,84.6,20.21,120.31,20.53,47.18.42,87.38-18.84,120.85-17.58,55.19,2.08,90.76,25.35,117.13,31.3,59.06,13.34,61.27,29.16,61.27,78.18l-35.54-35.97L33.64,113.11,0,136.66Z"/>
    <path style="fill:#fff;" d="m0,140.22c0-36.27,27.81-65.68,62.12-65.68h955.77c34.31,0,62.12,29.41,62.12,65.68H0Z"/>
  </g>
</svg>

<!--- BTTOM -->
<svg v-else-if="name == 'bottom'"
   xmlns="http://www.w3.org/2000/svg"
   :viewBox="viewBox" preserveAspectRatio="none" >

<path
   class="t2"
   d="m 0,68.36 v 27.28 c 9.7,14.66 21.2,25.08 34.71,30.55 346.34,140.31 415.96,14.18 715.14,37.3 140.8,10.88 251.6,45.38 330.14,79.42 v -7.38 C 1031.82,202.72 888.51,118.82 660.91,101.24 383.83,79.83 318.34,195.97 0,68.36 Z"
   id="path6"
   :style="{ fill: colorTertiary, opacity: .5 }" />
<path
   class="t1"
   d="m 0,68.36 c 318.34,127.61 383.83,11.47 660.92,32.88 227.6,17.58 370.91,101.48 419.08,134.29 V 0 H 0 Z"
   id="path8"
   :style="{ fill: colorTertiary }" />

</svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MILIDWave extends Vue {
  @Prop({ default : 'top'}) private name!: string;
  @Prop({ default : '1'}) private theme!: string;
  @Prop({ default : '1000'}) private width!: string;
  @Prop({ default : '235'}) private height!: string;
  @Prop({ default : {}}) private config!: any;


  get viewBox() {
    return "0 0 "+this.width+" "+this.height;
  }

  get colorPrimary() {
    return this.config.themes[this.theme].primary;
  }

  get colorSecondary() {
    return this.config.themes[this.theme].secondary;
  }

  get colorTertiary() {
    return this.config.themes[this.theme].tertiary;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .st0{fill:#6900FF;}
  .st1{fill:#8761FF;}
  .st2{fill:#BBB8FF;}
  .st3{fill:#260063;}
  .st4{fill:#4700B7;}
  .st5{fill:none;}
  .st6{opacity:0.5;fill:#BBB8FF;}
</style>
