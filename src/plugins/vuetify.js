import Vue from 'vue';
import Vuetify, { colors } from 'vuetify/lib';

 
Vue.use(Vuetify);
Vue.use(require('vue-moment'));

export default new Vuetify({
    theme: {
        themes: {
            light: {
                background: '#E9E9E9', //FONDO DE LA APLICACION
                primary: '#1976D2',
                warning: '#E3F2FD',
            }
        },
        options: {
            customProperties: true
        },
        icons: {
            iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
          },
    },
});
