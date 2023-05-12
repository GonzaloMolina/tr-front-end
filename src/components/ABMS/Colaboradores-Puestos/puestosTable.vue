<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
            <v-toolbar color="white" elevation="1">
                <v-toolbar-title>Puestos</v-toolbar-title>
                <router-link to="/createPuesto">
                <v-btn class="ml-3" dark fab x-small color="#2991c6" v-if="permisoCreacionPuesto()">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </router-link>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
            </v-toolbar>
            <v-data-table 
            :headers="headers"
            :items="puestos"
            :footer-props="footerProps"
            :items-per-page="20"
            :search="search">
            <template v-slot:[`item.acciones`]="{ item }">
                <b-row no-gutters>
                  <b-col v-if="permisoEscrituraTabla()" cols="8">
                    <v-icon @click="disablePuesto(item)" v-b-tooltip.hover title="Desactivar" v-if="item.Visible == 'X'" dissa medium color="#2991c6">mdi-eye-off</v-icon>
                    <v-icon @click="enablePuesto(item)" v-b-tooltip.hover title="Activar" v-else medium color="#2991c6">mdi-eye</v-icon>
                  </b-col>
                  <b-col v-if="permisoLecturaTabla() || permisoEscrituraTabla()" cols="4">
                    <v-icon @click="editPuesto(item)" v-b-tooltip.hover title="Editar" v-if="item.Visible == 'X'" medium color="#2991c6" style="margin-left: 1vw">mdi-pencil</v-icon>
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
          { text: "Código", value: "Colaborador_Puesto_Codigo" },
          { text: "Descripción", value: "Colaborador_Puesto_Descripcion" },
          { text: "Padre", value: "Padre"},
          { text: "Activado", value: "Visible", align:"center"},
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Puestos por página:',},
        
        proyectos: [],
        loader:true
      };
    }, 
    created(){
        this.initialize()
    },
    methods: {
        initialize(){
            axios.get(ip+"/colaboradores_puestos").then(response => {
                this.puestos = response.data
                this.getPuestoPadre();
                this.loader = false;
            })
        }, 

        getPuestoPadre() {
            for (let i = 0; i < this.puestos.length; i++) {
                const parentPuesto = this.puestos.find(p => p.Colaborador_Puesto_Codigo == this.puestos[i].Colaborador_Puesto_Padre);
                if(parentPuesto){
                    this.puestos[i].Padre = parentPuesto.Colaborador_Puesto_Descripcion
                }
                else{
                    this.puestos[i].Padre = 'N/A'
                }
            }
        },

        enablePuesto(item){
            item.Usuario_Modificacion = localStorage.usuario_id
            item.Visible = 'X'
            axios.patch(ip+"/colaboradores_puestos/"+item.Colaborador_Puesto_Key, item)
        },

        disablePuesto(item){
            item.Usuario_Modificacion = localStorage.usuario_id
            item.Visible = null
            axios.patch(ip+"/colaboradores_puestos/"+item.Colaborador_Puesto_Key, item)
        },

        editPuesto(item){
            this.$router.push({name: 'editPuesto', params:{id: item.Colaborador_Puesto_Key}})
        }, 

        //PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes("P99")
        },
        permisoLecturaPuesto(){
          return localStorage.Permisos.includes("P101")
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes("P100")
        },
        permisoCreacionPuesto(){
          return localStorage.Permisos.includes("P103")
        },

    }
  };
</script>
  