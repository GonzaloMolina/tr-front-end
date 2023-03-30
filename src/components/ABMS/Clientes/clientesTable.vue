<template>
  <v-content>
    <v-container>
      <loader :loader="loader" style="position: fixed;"/>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :items-per-page="7"
        :footer-props="footerProps"
        v-show="tableshow"
        
        pageText= '{0}-{1} de {2}'
      >
        <template v-slot:top>
          <v-toolbar dense flat color="white">
            <v-toolbar-title>Clientes</v-toolbar-title>
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
              <router-link to="/createCliente">
                <v-btn v-if="permisoCrearCliente()" @click="sendClienteVacio" dark fab x-small color="#2991c6">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </router-link>
            
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <router-link to="editCliente/">
          <v-icon
            v-b-tooltip.hover title="Ver más"
            v-if=" item.Visible == 'X' "
            small
            color="#2991c6"
            class="mr-2"
            @click="sendCliente(item)"
          >
            mdi-sunglasses
          </v-icon>
           </router-link>
          <v-icon
            v-b-tooltip.hover title="Desactivar"
            v-if="permisoDesactivar() && item.Visible == 'X'"
            small
            color= "#2991c6"
            @click="desactivarCliente(item)"
          >
            mdi-eye-off
          </v-icon>
          <v-icon
            v-b-tooltip.hover title="Activar"
            v-if="item.Visible == ''"
            small
            color="#2991c6"
            @click="activarCliente(item)"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-data-table>

        <v-dialog v-model="dialogDelete" width="520px">
            <v-card>
              <v-card-title>Este elemento se desactivará. ¿Deseas continuar?</v-card-title>
              <v-card-actions>
              <v-btn @click="desactivarCliente" color="#32b4dd" dark style="margin-left:18rem">OK</v-btn>
              <v-btn @click="closeDelete" color="#ffa025" dark style="margin-left:1rem">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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

.v-application--is-ltr .v-data-footer__select{
  display: none;
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
      dialogDelete: false,
      indice: 0,
      elementoEditado: {},
      //Diseño del datatable
      headers: [
        {
          text: 'Código',
          align: 'start',
          sortable: true,
          value: 'Cliente_Codigo',
        },
        { text: 'Descripción', value: 'Cliente_Descripcion'},
        { text: 'Región', value: 'Region.Region_Descripcion'},
        { text: 'Industria', value: 'Industria.Industria_Descripcion' },
        { text: 'Cant. Proyectos', value: 'Proyectos.length', align : 'center'},
        { text: 'Acciones', value: 'actions', sortable: false, align : 'end' },
      ],
      //Elementos del datatable
      desserts: [],
      tableshow: false,
      //AUTOCOMPLETE
      entries: [],
      eyeOffIcon: false,
      isLoading: false,
      model: null,
      search: null,
      visible: {Visible: ''},
      footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Clientes por página:',},
      loader: true,
    }),

    watch:{
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    beforeMount(){
      this.initialize()
      this.cleanStore();
      this.$forceUpdate();
    },

    created(){
    },

    methods: {
      initialize () { //Pido todos los clientes al backend
        axios.get(ip+"/clientes/clientesGrid")
        .then(response => {
          this.desserts = response.data
          this.tableshow = true
          this.loader = false
        })
      },

      permisoDesactivar(){
        if(localStorage.Permisos.includes("P6")){
          return true
        }
      },

      permisoCrearCliente(){
        return localStorage.Permisos.includes("P5")
      },

      cleanStore(){ //Limpio el store de vuex ya que estoy en la pantalla principal
      this.$store.replaceState({
        cliente: [],
        clienteTipo:0,
        proyecto: [],
        clienteFiscal: [],
        empresa:[]})
      }, 

      sendClienteVacio(){ 
        //Se envia un cliente vacio a la pantalla de nuevo cliente para que los datatable de 
        //proyectos y clientes fiscales carguen correctamente
        this.$store.state.cliente[0]= {
          Cliente_Codigo: "",
          Cliente_Descripcion: "",
          Cliente_Region: "",
          Cliente_Industria: "",
          Cliente_Empresa: "",
          Cliente_Moneda_Principal: "",
          Cliente_Observacion: "",
          Cliente_Logo: '',
          Proyectos: [],
          ClientesFiscales: [],
          Usuario_Creacion: null,
          Usuario_Modificacion: null,
        }
      },

      sendCliente(item){//Se envia el cliente al store de vuex para editarlo
        this.$store.state.cliente[0] = item
      },

      desactivarCliente(item) { //Boton de borrado logico. Quita la marca visible del cliente
        const index = this.desserts.indexOf(item)
        // this.elementoEditado = Object.assign({}, item)
        // const item = this.elementoEditado
        if(item.Proyectos.filter(proyecto => proyecto.Visible === 'X').length > 0){
          alert('No se puede desactivar el cliente porque tiene al menos un proyecto activo')
        } else {
          var visible = {Visible: ''}
          item.Visible = ''
          this.desserts.splice(index, 1, item)
          axios.patch(ip+"/Clientes/"+item.Cliente_Codigo, visible)
          .then(response => {
         
          })
        }
      } ,

      btnDesactivarVisualizacion(){
        if(this.visible = {Visible: 'X'}){
          return true
        }
      },

      activarCliente(item) { //Activa el cliente si se encuentra desactivado.
        const index = this.desserts.indexOf(item)
        var visible = {Visible: 'X'}
        item.Visible = 'X'
        this.desserts.splice(index, 1, item)
        axios.patch(ip+"/Clientes/"+item.Cliente_Codigo, visible)
        .then(response => {
          
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.elementoEditado= {}
        this.indice = 0
      },
      mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
        
    }}
  
}
</script>