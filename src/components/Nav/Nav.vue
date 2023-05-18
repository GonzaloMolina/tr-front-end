<template>
<v-content class="p-0">
    <v-navigation-drawer v-if="checkNavBar  && this.$route.path != '/help'" v-model="drawer" bottom temporary app>
      <v-list dense nav >
        <v-list-item-group v-model="group" v-if="menuHamburguesaShow">
          <!-- Nueva carga de horas -->
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-calendar-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <router-link to="/Grid">Cargar Horas</router-link>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>


          <v-list-group
            :value="true"
            prepend-icon="mdi-account-circle"
            v-if="accesoPanelColaborador()"
            no-action
              >             
              <template v-slot:activator >
                <v-list-item-content>
                  <v-list-item-title>Colaborador</v-list-item-title>
                </v-list-item-content>
              </template>
              
        <v-list-item link v-if="checkSeguridad('P104')">
                <v-list-item-action >
                  <v-icon>mdi-table-account</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/categorias">Categorias</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
                <v-list-item link v-if="checkSeguridad('P41')">
                  <v-list-item-action>
                    <v-icon>mdi-clipboard-account</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title> <router-link to="/colaboradoresHierarchy">Colaboradores</router-link> </v-list-item-title>
                  </v-list-item-content>
                </v-list-item> 
                  <v-list-item link v-if="checkSeguridad('P114')">
                  <v-list-item-action>
                    <v-icon>mdi-account-settings</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title style="white-space: normal;"> 
                      <router-link to="/funciones">Funciones</router-link>
                    </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item link v-if="checkSeguridad('P99')">
                <v-list-item-action>
                  <v-icon>mdi-smart-card</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/puestos">Puestos</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P109')">
                <v-list-item-action>
                  <v-icon>mdi-map-marker-account-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/tiposcolaboradores">Tipos de Colaboradores</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item> 
            <v-list-item link v-if="checkSeguridad('P40')">
                <v-list-item-action>
                  <v-icon>mdi-account-key</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> <router-link to="/usuariosTable">Usuarios</router-link> </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            </v-list-group>

            <v-list-group
            :value="true"
            prepend-icon="mdi-layers-triple"
            v-if="accesoPanelProyectos()"
            no-action>
              <template v-slot:activator>
                <v-list-item-title>Proyectos</v-list-item-title>
              </template>
              <v-list-item link v-if="checkSeguridad('P79')"> 
                <v-list-item-action>
                  <v-icon>mdi-arrow-decision</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/alcances">Alcances</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>   
              <v-list-item link v-if="checkSeguridad('P9')">
              <v-list-item-action>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <router-link to="/clientesTable">Clientes</router-link>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P17')">
                <v-list-item-action>
                  <v-icon>mdi-home-modern</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> <router-link to="/empresasTable">Empresas</router-link> </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P17')">
                <v-list-item-action>
                  <v-icon>mdi-home-city-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title  style="white-space: normal;"> <router-link to="/empresasTipos">Tipos de empresas</router-link> </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P94')">
                <v-list-item-action>
                  <v-icon>mdi-factory</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/industrias">Industrias</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P84')">
                <v-list-item-action>
                  <v-icon>mdi-currency-usd</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/monedas">Monedas</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item> 
            <v-list-item link v-if="checkSeguridad('P89')">
                <v-list-item-action>
                  <v-icon>mdi-map</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/regiones">Regiones</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item> 

            <v-list-item link v-if="checkSeguridad('P49')">
                <v-list-item-action>
                  <v-icon>mdi-tools</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> <router-link to="/tecnologias">Tecnologías</router-link> </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P69')">
                <v-list-item-action>
                  <v-icon>mdi-ballot</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/proyectostipos">Tipos de Proyectos</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P65')">
                <v-list-item-action>
                  <v-icon>mdi-briefcase</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/unidadesnegocio">Unidades de Negocio</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            </v-list-group>

            <v-list-group
            :value="true"
            prepend-icon="mdi-office-building"
            v-if="accesoPanelOrganizacion()"
            no-action>
              <template v-slot:activator>
                <v-list-item-title>Organización</v-list-item-title>
              </template>
              
            <v-list-item link v-if="checkSeguridad('P74')">
                <v-list-item-action>
                  <v-icon>mdi-domain</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"> 
                    <router-link to="/areas">Areas</router-link>
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P54')">
                <v-list-item-action>
                  <v-icon>mdi mdi-checkbook</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> <router-link to="/cecos">CECO</router-link> </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P25')">
                <v-list-item-action>
                  <v-icon>mdi-calendar</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> <router-link to="/tiemposCalendar">Tiempos</router-link> </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-if="checkSeguridad('P59')">
                <v-list-item-action>
                  <v-icon>mdi-earth</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> <router-link to="/paises">Paises</router-link> </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            </v-list-group>



            <!--v-show="SeguridadAdministracionUsuarios()"-->


            <v-list-item link
            v-if="SeguridadAdministracionTareas()">
              <v-list-item-action>
                <v-icon>mdi-note-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <router-link to="/Tareas">Tareas</router-link>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark color="#1A5E86" app>
      <v-app-bar-nav-icon v-if="this.$route.path != '/login' && this.$route.path != '/help'" @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
      <v-avatar size="42" tile>
        <img
          src="https://res.cloudinary.com/dpe3qq10k/image/upload/v1600779562/IconoBlanco_m2yto9.png"
          alt="Logo Blanco"
        />
      </v-avatar>

      <v-toolbar-title color="white" style="margin-left:0.5rem;">SEIDOR Analytics</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="this.$route.path == '/login'" icon @click="goToHelp" title="Ayuda">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>


      <v-layout v-if="this.$route.path != '/login' && this.$route.path != '/help'" justify-end>
        <v-card @click="userPage" style="background: white;" >
          <v-title style="padding-right:1rem; padding-left:1.2rem; color:black;">{{colaboradorLogged}}</v-title>
          <v-avatar
            
            size="40"
            style="border-radius: 100%; background:#1A5E86; margin: 0.1rem;  margin-right:0.5rem" 
          >
            <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" alt="Imagen Usuario" />
          </v-avatar>
        </v-card>
        <v-btn style="position:relative; top:6px;left: 10px" light fab x-small><v-icon @click="logout" style="color:red">mdi-power</v-icon></v-btn>
      </v-layout>
    </v-app-bar>
    </v-content>
</template>

<script>
export default {
    data: () =>({
        drawer: false,
        group: null,
        colaborador: {Colaborador_Descripcion: "Ingrese Usuario"},
        login: false,
        nombre_colaborador: '',
    }),
    methods:{
      goToHelp() {
        this.$router.push('/help');
      },

      logout(){
        localStorage.clear();
        localStorage.Permisos = []
        localStorage.nombre_colaborador = ''
        this.nombre_colaborador= ''
        this.$router.push('/login')
      },
      userPage(){
        this.$router.push('/Usuario')
      },

      menuHamburguesaShow(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P1')
      },

      accesoPanelColaborador(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P104') || localStorage.Permisos.includes('P41')
        ||  localStorage.Permisos.includes('P114') ||  localStorage.Permisos.includes('P99') ||
        localStorage.Permisos.includes('P109') ||  localStorage.Permisos.includes('P40')
      },

      accesoPanelProyectos(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P79') || localStorage.Permisos.includes('P9')
        ||  localStorage.Permisos.includes('P17') ||  localStorage.Permisos.includes('P94') ||
        localStorage.Permisos.includes('P84') ||  localStorage.Permisos.includes('P89') ||
        localStorage.Permisos.includes('P49') || localStorage.Permisos.includes('P69') ||
        localStorage.Permisos.includes('P65')
      },

      accesoPanelOrganizacion(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P74') || localStorage.Permisos.includes('P54')
        ||  localStorage.Permisos.includes('P25') ||  localStorage.Permisos.includes('P59') 
      },

      checkSeguridad(codigo){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes(codigo)
      },

      SeguridadAdministracionTareas(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('PX')
      },

      SeguridadAdministracionTiempos(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P25') || localStorage.Permisos.includes('P26') ||
        localStorage.Permisos.includes('P27') || localStorage.Permisos.includes('P28') ||
        localStorage.Permisos.includes('P29') || localStorage.Permisos.includes('P30') ||
        localStorage.Permisos.includes('P31') || localStorage.Permisos.includes('P32')
      },

      SeguridadAdministracionUsuarios(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P40') || localStorage.Permisos.includes('P44') 
               
      },

      SeguridadColaboradores(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P41') || localStorage.Permisos.includes('P42') 
               
      },

      SeguridadAdministracionTecnologias(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P49') || localStorage.Permisos.includes('P50') 
               
      },

      SeguridadAdministracionUnidadesNegocios(){
        if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P64') || localStorage.Permisos.includes('P65') 
               
      },

      /*
      SeguridadAdministracionSuperUsuario(){
        if(typeof localStorage.Permisos === undefined){
          return false
        } else
        return localStorage.Permisos.includes('P5') && localStorage.Permisos.includes('P6') &&
        localStorage.Permisos.includes('P7') && localStorage.Permisos.includes('P8') &&
        localStorage.Permisos.includes('P9') && localStorage.Permisos.includes('P10') &&
        localStorage.Permisos.includes('P11') && localStorage.Permisos.includes('P12') &&
        localStorage.Permisos.includes('P13') && localStorage.Permisos.includes('P14') &&
        localStorage.Permisos.includes('P15') && localStorage.Permisos.includes('P16') &&
        localStorage.Permisos.includes('P17') && localStorage.Permisos.includes('P18') && 
        localStorage.Permisos.includes('P19') && localStorage.Permisos.includes('P20') && 
        localStorage.Permisos.includes('P21') &&
        localStorage.Permisos.includes('P22') && localStorage.Permisos.includes('P23') &&
        localStorage.Permisos.includes('P24') && localStorage.Permisos.includes('P25') && 
        localStorage.Permisos.includes('P26') &&
        localStorage.Permisos.includes('P27') && localStorage.Permisos.includes('P28') &&
        localStorage.Permisos.includes('P29') && localStorage.Permisos.includes('P30') &&
        localStorage.Permisos.includes('P31') && localStorage.Permisos.includes('P32') &&
        localStorage.Permisos.includes('P33') && localStorage.Permisos.includes('P34')
      },
      */
      loginTrue(){
        return localStorage.login
      },

      checkNavBar(){
        return localStorage.Permisos.includes('P1')      
      },


      async SignOut() {
        await this.$msalInstance.logout({}).then(() => {
            this.logout()
            })
            .catch(error => {
              console.error(error);
            });
        },
        
            
    },
    computed:{
      colaboradorLogged: function (){ 
        return this.nombre_colaborador
      },
    },

    created(){
      this.login = localStorage.getItem('login')
      this.$forceUpdate()
    },

    beforeMount() {
      this.nombre_colaborador = localStorage.nombre_colaborador
    },

    beforeUpdate(){
      this.nombre_colaborador = localStorage.nombre_colaborador

    },
    mounted(){
        window.addEventListener('login', (event) => {
          this.nombre_colaborador = event.detail.storage;
      })
    }
  }
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
</style>
