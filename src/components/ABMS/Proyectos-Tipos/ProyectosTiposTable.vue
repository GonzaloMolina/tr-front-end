<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
            <v-toolbar color="white" elevation="1">
                <v-toolbar-title>Tipos de Proyectos</v-toolbar-title>
                <router-link to="/createProyectosTipo">
                <v-btn class="ml-3" dark fab x-small color="#2991c6" v-if="permisoCreacionTipoProyecto()">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </router-link>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
            </v-toolbar>
            <v-data-table 
            :headers="headers"
            :items="proyectostipos"
            :footer-props="footerProps"
            :items-per-page="20"
            :search="search">
            <template v-slot:[`item.acciones`]="{ item }">
                <b-row no-gutters>
                  <b-col v-if="permisoEscrituraTabla()" cols="8">
                    <v-icon @click="disableTipoProyecto(item)" v-b-tooltip.hover title="Desactivar" v-if="item.Visible == 'X'" dissa medium color="#2991c6">mdi-eye-off</v-icon>
                    <v-icon @click="enableTipoProyecto(item)" v-b-tooltip.hover title="Activar" v-else medium color="#2991c6">mdi-eye</v-icon>
                  </b-col>
                  <b-col v-if="permisoLecturaTabla() || permisoEscrituraTabla()" cols="4">
                    <v-icon @click="editTipoProyecto(item)" v-b-tooltip.hover title="Editar" v-if="item.Visible == 'X'" medium color="#2991c6" style="margin-left: 1vw">mdi-pencil</v-icon>
                    <v-icon v-b-tooltip.hover title="Activar para editar" v-if="item.Visible != 'X'" medium color="grey" style="margin-left: 1vw">mdi-pencil-off</v-icon>
                  </b-col>
                </b-row>
            </template>
            <template v-slot:[`item.Visible`]="{ item }">
                <v-icon v-if="item.Visible == 'X'"  color="green">mdi-check</v-icon>
                <v-icon v-else color="red">mdi-close</v-icon>
            </template>
            </v-data-table>
        </div>
      </v-container>
    </v-content>
</template>
  
<script>
  import axios from 'axios';
  const ip = require('../../../ip/ip')
  import loader from '../../Estado/loader'
  export default {
    components: {loader},
    data() {
      return {
        search: "",
        headers: [
          { text: "Código", value: "Proyecto_Tipo_Codigo" },
          { text: "Descripción", value: "Proyecto_Tipo_Descripcion" },
          { text: "Grupo", value: "Proyecto_Tipo_Grupo" },
          { text: "Beneficio", value: "Proyecto_Tipo_Beneficio" },
          { text: "Activado", value: "Visible", align:"center"},
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Tipos de proyectos por página:',},
        
        proyectos: [],
        loader:true
      };
    }, 
    created(){
        this.initialize()
    },
    methods: {
        initialize(){
            axios.get(ip+"/proyectos_tipos").then(response => {
                this.proyectostipos = response.data
                this.loader = false;
            })
        }, 

        enableTipoProyecto(item){
            item.Usuario_Modificacion = localStorage.usuario_id
            item.Visible = 'X'
            axios.patch(ip+"/proyectos_tipos/"+item.Proyecto_Tipo_Key, item)
        },

        disableTipoProyecto(item){
            item.Usuario_Modificacion = localStorage.usuario_id
            item.Visible = ''
            axios.patch(ip+"/proyectos_tipos/"+item.Proyecto_Tipo_Key, item)
        },

        editTipoProyecto(item){
            this.$router.push({name: 'editProyectosTipo', params:{id: item.Proyecto_Tipo_Key}})
        }, 

        //PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes("P69")
        },
        permisoLecturaTipoProyecto(){
          return localStorage.Permisos.includes("P71")
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes("P70")
        },
        permisoCreacionTipoProyecto(){
          return localStorage.Permisos.includes("P73")
        },

    }
  };
</script>
  