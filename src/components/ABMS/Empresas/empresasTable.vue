<template>
  <v-content>
    <v-container>
      <loader style="position: fixed;"/>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        sort-by="Empresa_Codigo"
        class="elevation-1"
        items-per-page-text= "Empresas por página:"
        pageText= '{0}-{1} de {2}'
        v-show="tableshow"
      >
        <template v-slot:top>
          <v-toolbar dense flat color="white">
            <v-toolbar-title>Empresas</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              dense
              hide-details
              class="shrink"
              style="margin-right:20rem"
              ></v-text-field>
              <router-link to="/createEmpresa">
                <v-btn @click="sendEmpresaVacio" v-if="permisoCrearEmpresa()" dark fab x-small color="#2991c6">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                </router-link>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <router-link to="/editEmpresa">
          <v-icon
            v-b-tooltip.hover title="Ver más"
            v-if=" item.Visible == 'X' "
            small
            color="#2991c6"
            class="mr-2"
            @click="sendEmpresa(item)"
          >
            mdi-sunglasses
          </v-icon>
          </router-link>
          <v-icon
            v-b-tooltip.hover title="Desactivar"
            v-if="permisoDesactivar() && item.Visible == 'X'"
            small
            color="#2991c6"
            @click="desactivarEmpresa(item)"
          >
            mdi-eye-off
          </v-icon>
          <v-icon
            v-b-tooltip.hover title="Activar"
            v-if=" item.Visible == '' "
            small
            color="#2991c6"
            @click="activarEmpresa(item)"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-data-table>
    </v-container>
  </v-content>
</template>

<style scoped>
.shrink{
      width: 200px;
}
.container{
  margin-left:5rem;
}
</style>

<script>
import axios from 'axios';
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
  export default {
    components: {loader},
    data: () => ({
      search: '',
      tableshow: false,
      //Diseño del datatable
      headers: [
        {
          text: 'Código',
          align: 'start',
          sortable: true,
          value: 'Empresa_Codigo',
        },
        { text: 'Descripción', value: 'Empresa_Descripcion'},
        { text: 'Tipo', value: 'TipoEmpresa.Tipo_Empresa_Descripcion' },
        { text: 'Activado', value: 'Visible', align: 'center' },
        { text: 'Acciones', value: 'actions', sortable: false, align : 'end' },
      ],
      //Elementos del datatable
      desserts: [],
      //AUTOCOMPLETE
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      visible: {Visible: ''},
      footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Empresas por página:',},
    }),

    mounted(){
      this.initialize();
       
      if(!localStorage.login){
        this.$router.push("/login");
      }
        
    },

    methods: {
      initialize () {
        axios.get(ip+"/empresas")
        .then(response => {
          this.desserts = response.data
          this.loader = false
          this.tableshow = true
        })
      },

      sendEmpresa(item){
        this.$store.state.empresa[0] = item
      },

      sendEmpresaVacia(){
        this.$store.state.empresa[0]= {
          Empresa_Codigo: '',
          Empresa_Descripcion: '',
          Empresa_Tipo: null,
          Empresa_Region: null,
          Empresa_Unidad_Negocio: null,
          Empresa_Identificador_Laboral: '',
          Empresa_Referente: '',
          Empresa_Mail: '',
          Empresa_Telefono: '',
          Empresa_Logo: '',
          Empresa_Observacion: '',
          Usuario_Creacion: 1,
          Usuario_Modificacion: 1,
        }
      },

       permisoDesactivar(){
        if(localStorage.Permisos.includes("P14")){
          return true
        }
      },

      permisoCrearEmpresa(){
        return localStorage.Permisos.includes("P13")
      },

      desactivarEmpresa(item) {
        const index = this.desserts.indexOf(item)
        var visible = {Visible: ''}
        item.Visible = ''
        && this.desserts.splice(index, 1, item)
        &&
        axios.patch(ip+"/Empresas/"+item.Empresa_Codigo, visible)
        .then(response => {
          console.log(response)
        })
      },

      activarEmpresa(item) {
        const index = this.desserts.indexOf(item)
        var visible = {Visible: 'X'}
        item.Visible = 'X'
        this.desserts.splice(index, 1, item)
        axios.patch(ip+"/Empresas/"+item.Empresa_Codigo, visible)
        .then(response => {
          console.log(response)
        })
      },
    }
}
</script>