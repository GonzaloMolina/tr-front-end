import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggin:false,
    cliente: [],
    clienteFueGuardado: false,
    clienteTipo: 0,
    clienteFiscal: [],
    proyecto: [],
    empresa: [],
    colaborador: null,
    msalConfig: {
      auth: {
        clientId: '1c21317b-028d-4af7-90ec-d9563117a464',
        authority:
          'https://login.microsoftonline.com/common/',
      },
      cache: {
        cacheLocation: 'localStorage',
      },
    },
    accessToken: '',
  },
  mutations :{
    setAccessToken(state, token){
      state.accessToken = token;
    }
  },
  actions: {
  },
  modules: {
  }
})
