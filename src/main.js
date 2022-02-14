import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import moment from 'moment'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import Notifications from 'vue-notification'

Vue.config.devtools = true
Vue.use(VueLodash, {lodash: lodash })
Vue.prototype.moment = moment
Vue.use(BootstrapVue)
Vue.use(Notifications)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
require('moment/locale/es.js');

import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify';

Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API
//axios.defaults.baseURL = 'http://localhost:1337/api';
Vue.config.productionTip = false

//////////// OFFICE

import Emitter from 'tiny-emitter';
const msalInstance = {}
const emitter = new Emitter()

/////////////////////





new Vue({
  router,
  store,
  vuetify,
  data: {
    user: {},
    colaborador: {},
    userIsLogged: false,
  },
  msalInstance,
  emitter,
  render: h => h(App)
}).$mount('#app')
