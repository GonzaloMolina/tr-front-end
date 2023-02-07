<template>
  <v-content>
    <v-container>
      <loader :loader="loader" style="position: fixed;"/>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :items-per-page="20"
        :footer-props="footerProps"
        v-show="tableshow"
        :item-class="itemRowBackground"
        
        
        pageText= '{0}-{1} de {2}'
      >
        <template v-slot:top>
          <v-toolbar dense flat color="white">
            <v-toolbar-title>Usuarios</v-toolbar-title>
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
          </v-toolbar>
        </template>


        <template v-slot:[`item.actions`]="{ item }">
         
          <v-icon
            v-b-tooltip.hover title="Desactivar"
            v-if="permisoDesactivar() && item.Usuario_Habilitado == 'X'"
            medium
            color= "#2991c6"
            @click="enableorunable(item)"
          >
            mdi-eye-off
          </v-icon>
          
          <v-icon
            v-b-tooltip.hover title="Activar"
            v-else
            medium
            color="#2991c6"
            @click="enableorunable(item)"
          >
            mdi-eye
          </v-icon>

          <router-link to="/editUsuario">
          <v-icon        
            v-b-tooltip.hover title="Editar"
            medium
            color= "#2991c6"
            @click="sendUsuario(item)"
            style="margin-left: 1vw"
          >
            mdi-account-edit
          
          </v-icon>
        </router-link>
        </template>
      </v-data-table>

        <!-- <v-dialog v-model="dialogDelete" width="520px">
            <v-card>
              <v-card-title>Este elemento se desactivará. ¿Deseas continuar?</v-card-title>
              <v-card-actions>
              <v-btn @click="desactivarUsuario" color="#32b4dd" dark style="margin-left:18rem">OK</v-btn>
              <v-btn @click="closeDelete" color="#ffa025" dark style="margin-left:1rem">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->

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
          value: 'Usuario_Codigo',
        },
        { text: 'Nombre Completo', value: 'Usuario_Nombre_Completo'},
        { text: 'Descripción Rol', value: 'Rol.Rol_Descripcion'},
        { text: 'Tipo', value: 'Usuario_Tipo'},
        { text: 'Acciones', value: 'actions', sortable: false, align : 'center' },
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
      habilitado: {Usuario_Habilitado: ''},
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
      //this.cleanStore();
      this.$forceUpdate();
    },
    created(){
    },
    methods: {
      initialize () { //Pido todos los usuarios al backend
        axios.get(ip+"/usuarios")
        .then(response => {
          this.desserts = response.data
          this.loader = false
          this.tableshow = true
        })
      },
      permisoDesactivar(){
        if(localStorage.Permisos.includes("P34")){
          return true
        }
      },
      btnDesactivarVisualizacion(){
        if(this.habilitado = {Usuario_Habilitado: 'X'}){
          return true
        }
      },
      //nueva funcion para dar de baja a los usuarios 
      async enableorunable(colab){
      
    
      if(colab.Usuario_Habilitado == 'X'){
        var noVisible = {
          Usuario_Habilitado:'',
          Visible: '',
          Colaborador_Estado: 2}
        await axios.patch(ip+"/colaboradores/enableorunablecolaboratoranduser/"+colab.Usuario_Key, noVisible)
          .then((response) => {
            
      
        })
        
      } else {
        var visible = {
            Usuario_Habilitado:'X',
            Visible: 'X',
            Colaborador_Estado: 1}
        await axios.patch(ip+"/colaboradores/enableorunablecolaboratoranduser/"+colab.Usuario_Key, visible)
          .then((response) => {
           
            
        })
      }
      alert('Colaborador Actualizado')
      this.initialize()
      
      },
      
      async sendUsuario(item){
        this.$store.state.usuario_id = item.Usuario_Key;
        
      }
    
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
      },
      itemRowBackground(item) {
        if (item.Usuario_Habilitado == '') {
          
          return "grey";
        } else {
          return "orange";
        }
    },
    }
</script>