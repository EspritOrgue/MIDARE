<template>
  <div class="landing">
    <!-- TOOLBAR -->
    <nav class="toolbar">
      <div class="toolbar-row">
        <div class="toolbar-section-start">
          <div class="version">v{{version}}</div>
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

    <div class="main">
      <!-- DESTOP -->
      <section class="desktop hide-sm">
        <img src="@/assets/MILID-logo-minimal.svg" />
        <p class="right" v-html="i18n('landind_desktop_h1')" />
        <p class="left" v-html="i18n('landind_desktop_h2')" />
        <p class="right" v-html="i18n('landind_desktop_h3')" />
        <button class="btn tertiary" @click="onInstall" v-show="!installed">{{i18n('landing_desktop_install')}}</button>
      </section>

      <section class="hide-md hide-lg" >
        <h3 v-html="i18n('landing_title1')" />
        <p v-html="i18n('landing_title2')" />
        <img  src="@/assets/MILID-logo-minimal.svg" />

        <button class="btn tertiary"
                @click="onInstall" v-show="!installed">{{i18n('landing_install')}}</button>
      </section>
      <section class="continue hide-md  hide-lg">
        <button class="" @click="onOpen">
          <MILIDIcons name="back" color="white"  class="back"/>
        </button>
        <p v-html="i18n('landing_continue_title')"></p>
      </section>
    </div>
    <section class="bottom " :class="{'open':open,'primary':!open}" @click="onOpen">
      <section class="form">
        <MILIDIcons name="user" color="#85e5ff" class="user"/>

        <input v-model="pseudo" @keypress.enter="onEnter" maxlength="25"
              placeholder="Pseudo (min 3 charactères)"  />

        <a class=""
          :class="{'waiting':(pseudo.length < 3)}"
          @click="onEnter">
          <div class="icon material-icons">check_circle_outline</div>
          <h4>{{i18n('landing_continue_go')}}</h4>
        </a>
      </section>
    </section>

  </div>
</template>
<style lang="scss" scoped>

  .landing{
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

    .version {
      opacity: .75;
      margin: 5px;
      padding: 2px;
      font-size: 13px;
      color: white;
    }

    .main{
      border-radius: 55px;
      padding: 0 10px;
      margin: 0 13px;
      min-height: calc( 100vh - 90px);
      height: 100%;
      color: white;
      background-color: var(--md-theme-default-secondary);

      >section.desktop {
        max-width: 80%;
        padding: 10px 100px;
        overflow:visible;
        background-image: url('../assets/rocket-static.svg');
        background-repeat: no-repeat;
        background-position-x: 20%;
        min-height: (80vh);
        p{
          margin: 30px 0;
          &.right{
            margin-left: calc( 50% - 64px);
          }
          &.left{
            margin-right: calc( 50% - 64px);
          }

        }
        button {
          margin-top: 40px;
          padding: 30px!important;
        }
      }

      >section{
        max-width: 100%;
        max-height: calc( 100vh - 80px );
        padding: 10px 30px;
        @media (max-width:330px) {
          padding: 10px 5px;
          transform: scale(.9);
        }

        p,h3{
          text-align: left;
        }
        img{
          text-align: center!important;
          padding: 26px;
          background-color: var(--md-theme-default-primary);
          border-radius: 23px;
          width: 80px;
          margin-top: 30px;
          margin-bottom: 50px;
          @media (max-width:376px) {
            margin-top: 10px;
            margin-bottom: 20px;
          }

        }
        @media (max-width: 376px) {
          max-width: 100%;
        }
     }

     section.continue {
      margin-top: 10px;
      @media (max-width:376px) {
        margin-top: 0px;
      }
       button{
        border: none;
        background: transparent;
        width: 65px;
        height: 65px;
        svg{
          transform: rotate(180deg);
        }
       }
        p{
          text-align: center;
          margin: 5px;
          font-size: 14px;
        }

     }
    }
  }

  .btn {
    border-radius: 50px;
    background: var(--md-theme-default-secondary);
    border: 4px solid white;
    color: white;
    text-align: center;
    padding: 10px 20px !important;
    margin: auto;
    font-size: 14px;
    outline: 0;
    display: block;
  }



  section.bottom {
    background-color: var(--md-theme-default-secondary);
    border:1px solid var(--md-theme-default-secondary);
    position: fixed;
    bottom: 0;
    left:0;
    height: calc(100vh - 100px);
    width: calc( 100vw - 10px );
    text-align: center;
    border-radius: 20px 20px 0 0;
    padding: 0 5px;
    transform: translateY(calc(100vh - 90px));
    transition: all 200ms;
    box-shadow: 0 2px 20px 8px rgba(0, 0, 0, 0.3);


    &.open {
      transform: translateY(10%);

      .form{
        color: white;
        padding: 20px 50px;
        button{
          min-width: 220px;
        }
        svg{
          width: 100px;
          margin-bottom: 30px;
          margin-top: 20px;
        }
        input {
          margin-bottom: 10px;
          line-height: 35px;
          height: 32px;
          font-size: 17px;
          color: #444;
          padding: 10px 15px;
          border-radius: 15px;
          border: 3px solid white;
          outline: 0;
          min-width: 240px;
        }
        a{
          display: block;
          .icon{
            font-size: 55px;
            margin-top: 20px;
          }
          h4{
            margin-top: 0;
          }
          &.waiting{
            opacity: .3;
          }
        }
      }

    }



  }



</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { $config, $user, $metric } from '../services';

import MILIDIcons from '../components/MILIDIcons.vue';
import ParametersPage from '../components/ParametersPage.vue';
import  cfg from '../../package.json';
import { MILID } from '../models';

@Component({
  components: {
    MILIDIcons,
    ParametersPage,
  },
})
export default class Landing extends Vue {
  open = false;
  deferredPrompt: any = {};
  pseudo = '';
  version = cfg.version;

  showParameters = false;

  isInstallAvailable = true;

  async mounted(){

    this.isInstallAvailable = ($config.isAndroid()|| ($config.isSafari() && $config.isIos()));
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();

      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });

    this.pseudo = this.user.name || '';

    const params = {
        lesson: 'landing',
        module: 'landing',
        state: MILID.LessonState.DONE
    };
    $metric.event(params);
  }

  get config(){
    return $config.store.config;
  }

  get user() {
    return $user.user;
  }

  get installed() {
    return $config.isInStandaloneMode();
  }

  beforeRouteEnter(to: any, from: any, next: any) {
    const all = [$config.get(),$user.get()]
    Promise.all(all).then(([config, user])=> {
      if(user && user.id && user.name && $config.isInStandaloneMode()) {
        return next('/module');
      }
      next();
    })
  }

  i18n(key) {
    return $config.i18n(key);
  }


  onEnter(){
    if(!this.pseudo || this.pseudo.length < 3){
      return;
    }
    $user.createUser(this.pseudo);
    this.$router.push({path:'/module' });
  }

  onOpen(){
    if($user.user.name) {
      return this.$router.push({path:'/module' });
    }
    this.open = true;
  }


  onInstall($event) {
    const deferredPrompt = this.deferredPrompt;
    // Show the prompt
    if($config.isIos()) {
      return window.dispatchEvent(new Event('installprompt'));
    }

    if(!deferredPrompt.prompt) {
      console.log('---DBG alternative install message',$event);
      $event.preventDefault();
      $event.stopPropagation();
      return;
    }

    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt', choiceResult);
      } else {
        console.log('User dismissed the A2HS prompt', choiceResult);
      }
      this.deferredPrompt = {};
    });

  }

}
</script>
