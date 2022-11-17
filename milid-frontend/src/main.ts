
import './ts/class-component-hooks.ts';

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  Vue,
  dsn: "https://47922795b7ee4dee98951a7e280351d0@o593182.ingest.sentry.io/5793422",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  logErrors: true,
  tracingOptions: {
    trackComponents: true,
  },
});

Vue.config.productionTip = false

import '@/main.scss'

import { $config, $module, $metric, $user } from '@/services';
const load = [$config.get(), $module.getAll(),$user.get()];

Promise.all(load).
then(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
.catch(e => {
  console.log("error", e);
})
