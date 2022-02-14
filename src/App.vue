<template>
  <!-- App.vue -->
  <v-app id="entireApp">
    <notifications id="notifications" position="center middle"/>

    <v-container class="p-2">
      
    <Nav class='p-0'>
    </Nav>
    
    </v-container>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container class="contenedorPrinc" ma-0 pa-0 fill-height fluid>
        <router-view></router-view>
      <!-- If using vue-router -->
      </v-container>
    </v-main>

    <v-footer app></v-footer>
  </v-app>
</template>



<script>
require('moment/locale/es.js');
import Nav from "./components/Nav/Nav"
import login from "./components/Login/login"
export default {
  components: {Nav,login},
  props: {
    source: String,
    type: Object,
    default: () => ({}),
  },
  data: () => ({
    //drawer: false,
    //group: null,
    login: false,
  }),
  beforeCreate(){
    if(localStorage.Permisos.length > 0){
      
    } else {localStorage.Permisos = []}
  },
  mounted() {
    this.$vuetify.theme.dark = false;
    localStorage.login = false
  },
  methods:{
  }
};
</script>

<style scoped>
#app a {
  font-weight: bold;
  color: #236192;
  padding: 1rem;
}
#app a.router-link-exact-active {
  color: #42b983;
}
#entireApp {
  background-color: var(--v-background-base) !important;
}
.contenedorPrinc{
  min-width: 100%;
  max-width: 100%;
}
</style>