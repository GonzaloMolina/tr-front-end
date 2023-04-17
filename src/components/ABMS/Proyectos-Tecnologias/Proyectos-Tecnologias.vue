<template>
<v-content>
<v-container style="width:26rem;margin-left: -1rem">
  <loader style="position: fixed;"/>
  <b-form-row>
    <b-col class="mr-n12">
    <h2 style="font-size:1.5rem;padding-left:1rem">Tecnologías</h2>
    </b-col>
    <b-col class="ml-n10">
      <v-btn  
        v-show="permisoEscrituraProyectoTecnologia()"
        :loading="!$attrs.proyectoFueGuardado"
        dark 
        fab 
        x-small 
        color="#2991c6"
        class="mb-2"
        @click="createItem()"
    >
    <v-icon dark>mdi-plus</v-icon>
    </v-btn>
  </b-col>
    </b-form-row>
    <v-data-table
        :headers="headersProyectosTecnologias"
        :items="proyectoTecnologias"
        sort-by="Proyecto_Tecnologia_Tecnologia"
        :return-object="true"
        :items-per-page="4"
        class="elevation-1"
        hide-default-footer
        style="min-width:10rem"
        >

        <template v-slot:top>
          <b-modal ref="editModal" title="Editar Tecnología">
            <v-autocomplete
              outlined
              v-model="proyectoTecnologia"
              :items="tecnologias"
              :search-input.sync="searchTecnologias"
              cache-items
              placeholder="Selecciona..."
              :return-object="true"
              item-text="Tecnologia_Descripcion"
            ></v-autocomplete>
            <v-text-field 
            v-model="proyectoTecnologiaSeleccionado.Proyecto_Tecnologia_Porcentaje"
            type="number"
            min="0"
            max="100"
            label="Porcentaje" 
            suffix="%" 
            class="float-right"
            style="max-width: 25%;">  
            </v-text-field>
          <template v-slot:modal-footer="{ ok, cancel }">
            <b-button variant="primary" @click="save"  :disabled="porcentajeInvalido">Aceptar</b-button>
            <b-button @click="close">Cancelar</b-button>
          </template>
        </b-modal>

        <b-modal ref="createModal" title="Crear Tecnología">
            <v-autocomplete
              outlined
              v-model="nuevoProyectoTecnologia.Tecnologia"
              :items="tecnologias"
              :search-input.sync="searchTecnologias"
              cache-items
              placeholder="Selecciona..."
              :return-object="true"
              item-text="Tecnologia_Descripcion"
            ></v-autocomplete>
            <v-text-field 
            type="number"
            min="0"
            max="100"
            v-model="nuevoProyectoTecnologia.Proyecto_Tecnologia_Porcentaje"
            label="Porcentaje" 
            suffix="%" 
            class="float-right"
            style="max-width: 25%;">
            </v-text-field>
          <template v-slot:modal-footer="{ ok, cancel }">
            <b-button variant="primary" @click="saveNew" :disabled="porcentajeInvalido">Aceptar</b-button>
            <b-button @click="close">Cancelar</b-button>
          </template>
        </b-modal>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon
            small
            class="mr-2"
            color="#2991c6"
            @click="editItem(item)"
            >
            mdi-pencil
            </v-icon>
            <v-icon
            small
            color="#2991c6"
            @click="deleteItem(item)"
            >
            mdi-delete
            </v-icon>
        </template>
        </v-data-table>
</v-container>
</v-content>
</template>

<style scoped>
.v-content{
    margin-top:-5rem;
    margin-right: 0rem;
}
</style>

<script>
import { BModal } from 'bootstrap-vue'
import axios from 'axios';
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
  export default {
    components: {loader},
    data: () => ({ 
      nuevoProyectoTecnologia:{
          Proyecto_Tecnologia_Proyecto:null,
          Proyecto_Tecnologia_Porcentaje: null,
          Proyecto_Tecnologia_Tecnologia: null,
          Tecnologia: {Tecnologia_Descripcion:null},
          Usuario_Creacion: null
        },


      headersProyectosTecnologias: [
        {
          text: "Tecnologia",
          align: "start",
          sortable: false,
          value: "Tecnologia.Tecnologia_Descripcion",
        },
        {
          text: "Porcentaje %",
          value: "Proyecto_Tecnologia_Porcentaje",
          width:'40%',
          sortable: false,
          align: "center",
        },
        { text: "Acciones", value: "actions", sortable: false,
        align: "end",},
      ],
        


      // Objeto Proyecto_Tecnologia seleccionado
      proyectoTecnologiaSeleccionado: {},
      // Tecnologia del Objeto Proyecto_Tecnologia seleccionado
      proyectoTecnologia: null, 
      // Lista de tecnologias usadas en el proyecto
      proyectoTecnologias: [],
      searchTecnologias: '',
      tecnologias: [],
      tecnologiasDescripciones: [],
      editedIndex: -1,
      model: null,
      search: null
      
    }),

    computed: {
      porcentajeInvalido() {
      return this.nuevoProyectoTecnologia.Proyecto_Tecnologia_Porcentaje > 100
    }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.loadProyectoTecnologias();
        this.loadTecnologias();

      },

      editItem(item) {
        this.proyectoTecnologiaSeleccionado = item
        this.proyectoTecnologia = item.Tecnologia
        this.$refs.editModal.show();
      },

      createItem(){
        this.$refs.createModal.show();
      },

      deleteItem (itemSelected) {
        const index = this.proyectoTecnologias.findIndex(item => item.Proyecto_Tecnologia_Key === itemSelected.Proyecto_Tecnologia_Key);
        if (index !== -1) {
          this.proyectoTecnologias.splice(index-1, 1);
        }
        this.$store.state.Tecnologias = this.proyectoTecnologias
      },

      close() {
        this.$nextTick(() => {
          this.$refs.editModal.hide();
          this.$refs.createModal.hide();
        })
      },

      save() {
        // Reemplaza los valores de la tecnologia en objeto Proyecto_tecnologia seleccionado
        this.proyectoTecnologiaSeleccionado.Proyecto_Tecnologia_Tecnologia = this.proyectoTecnologia.Tecnologia_Key
        this.proyectoTecnologiaSeleccionado.Tecnologia.Tecnologia_Descripcion = this.proyectoTecnologia.Tecnologia_Descripcion

        console.log('ARRAY ORIGINAL', this.proyectoTecnologias)
        // Reemplaza el objeto proyecto_tecnologia editado en el array de las tecnologias del proyecto
        const index = this.proyectoTecnologias.findIndex(item => item.Proyecto_Tecnologia_Key === this.proyectoTecnologiaSeleccionado.Proyecto_Tecnologia_Key);
        if (index !== -1) {
          this.proyectoTecnologias.splice(index-1, 1, this.proyectoTecnologiaSeleccionado);
        }

        this.$store.state.Tecnologias = this.proyectoTecnologias

        this.close()
      },

      saveNew() {

        this.nuevoProyectoTecnologiaLocal = {
          Proyecto_Tecnologia_Proyecto:this.nuevoProyectoTecnologia.Proyecto_Tecnologia_Proyecto,
          Proyecto_Tecnologia_Porcentaje:this.nuevoProyectoTecnologia.Proyecto_Tecnologia_Porcentaje,
          Proyecto_Tecnologia_Tecnologia:this.nuevoProyectoTecnologia.Proyecto_Tecnologia_Tecnologia,
          Tecnologia: this.nuevoProyectoTecnologia.Tecnologia,
          Usuario_Creacion: this.nuevoProyectoTecnologia.Usuario_Creacion
        },
    
        this.nuevoProyectoTecnologiaLocal.Proyecto_Tecnologia_Tecnologia = this.nuevoProyectoTecnologia.Tecnologia.Tecnologia_Key
        this.nuevoProyectoTecnologiaLocal.Proyecto_Tecnologia_Proyecto = this.$store.state.ProyectoKey

        this.proyectoTecnologias.push(this.nuevoProyectoTecnologiaLocal)
        this.$store.state.Tecnologias = this.proyectoTecnologias

        this.close()
      },

      loadTecnologias(){
        axios.get(ip+"/tecnologias/descripciones").then((response) => {
            this.tecnologias = response.data;
          });
      },

      loadProyectoTecnologias(){
          axios.get(ip+"/proyectos_tecnologias/tecnologias/"+this.$store.state.ProyectoKey).then((response) => {
            this.proyectoTecnologias = response.data
            this.$store.state.Tecnologias = this.proyectoTecnologias;
            console.log('Proyecto Tecnologias', response.data)
          });
        },


      permisoLecturaProyectoTecnologia(){
        return localStorage.Permisos.includes('P21')
      },
      permisoEscrituraProyectoTecnologia(){
        return localStorage.Permisos.includes('P22')
      },


       mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
        }}
        
}
</script>