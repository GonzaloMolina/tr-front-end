<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
        <v-toolbar color="white" elevation="1">
            <v-toolbar-title>Industrias</v-toolbar-title>
            <v-btn class="ml-3" dark fab x-small color="#2991c6" @click="crear()" v-if="permisoCreacion()">
                  <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
        </v-toolbar>
        <v-data-table 
        :headers="headers"
        :items="industrias"
        :footer-props="footerProps"
        :search="search"
        :items-per-page="20">
          <template v-slot:[`item.acciones`]="{ item }">
            <div v-if="!item.New && !item.Edit && permisoEscrituraTabla()">
              <b-form-row no-gutters>
              <b-col cols="8">
                <v-icon  @click="disable(item)" v-b-tooltip.hover title="Desactivar" v-if="item.Visible == 'X'" dissa medium color="#2991c6">mdi-eye-off</v-icon>
                <v-icon  @click="enable(item)" v-b-tooltip.hover title="Activar" v-else medium color="#2991c6">mdi-eye</v-icon>
              </b-col>
              <b-col cols="2" v-if="permisoEscrituraABM()">
                <v-icon  @click="edit(item)" v-b-tooltip.hover title="Editar" v-if="item.Visible == 'X'" medium color="#2991c6" style="margin-left: 1vw">mdi-pencil</v-icon>
                <v-icon v-b-tooltip.hover title="Activar para editar" v-else medium color="grey" style="margin-left: 1vw">mdi-pencil-off</v-icon>
              </b-col>
              </b-form-row>
            </div>
          </template>
          <template v-slot:[`item.Visible`]="{ item }">
              <v-icon v-if="item.Visible == 'X'"  color="green">mdi-check</v-icon>
              <v-icon v-else color="red">mdi-close</v-icon>
          </template>
          <template v-slot:item.Industria_Codigo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                    <v-text-field v-model="item.Industria_Codigo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                </template>
                <template v-else>
                <div>{{ item.Industria_Codigo }}</div>
                </template>
            </td>
            </template>
          <template v-slot:item.Industria_Descripcion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Industria_Descripcion" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                    </b-col>
                </b-form-row>
                </template>
                <template v-else>
                <div>{{ item.Industria_Descripcion }}</div>
                </template>
            </td>
            </template>
            <template v-slot:item.Industria_Descripcion_EN="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Industria_Descripcion_EN" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                    </b-col>
                    <b-col class="mt-3">
                        <v-icon v-if="item.Edit && isFormValid" color="green" @click="saveChanges(item)">mdi-check</v-icon>
                        <v-icon v-if="item.New && isFormValid" color="green" @click="saveNew(item)">mdi-check</v-icon>
                    </b-col>
                    <b-col class="mt-3 ml-4"> 
                        <v-icon v-if="item.Edit" color="red" @click="cancelChanges(item)">mdi-close</v-icon>
                        <v-icon v-if="item.New" color="red" @click="cancelNew(item)">mdi-close</v-icon>
                    </b-col>
                </b-form-row>
                </template>
                <template v-else>
                <div>{{ item.Industria_Descripcion_EN }}</div>
                </template>
            </td>
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
  import {isFieldEmpty} from '../../../validations/validations'
  export default {
    components: {loader},
    data() {
      return {
        search: "",
        rules: {checkEmpty: isFieldEmpty},
        headers: [
          { text: "Código", value: "Industria_Codigo" },
          { text: "Descripción", value: "Industria_Descripcion" },
          { text: "Description", value: "Industria_Descripcion_EN" },
          { text: "Activado", value: "Visible", align:"center"},
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Industrias por página:',},
        
        industrias: [],
        loader:true,
        isFormValid: true,
        codigo: null,
        Desc: null,
        DescENG: null
      };
    },
    created(){
        this.initialize()
    },
    computed: {
      isValid() {
        return this.industrias.every(item => item.Industria_Descripcion && item.Industria_Descripcion.length > 0 
                                            && item.Industria_Codigo && item.Industria_Codigo.length > 0
                                            && item.Industria_Descripcion_EN && item.Industria_Descripcion_EN.length > 0)
      }
    },
    watch: {
      isValid() {
        this.isFormValid = this.industrias.every(item => item.Industria_Descripcion && item.Industria_Descripcion.length > 0 
                                                        && item.Industria_Codigo && item.Industria_Codigo.length > 0
                                                        && item.Industria_Descripcion_EN && item.Industria_Descripcion_EN.length > 0)
      }
    },
    methods: {
        initialize(){
            axios.get(ip+"/industrias").then(response => {
                this.industrias = response.data.map(item => ({
                    ...item,
                    Edit: false,
                    New: false
                }))
                this.loader = false
            })
        },
        edit(item){       
            this.codigo = item.Industria_Codigo
            this.Desc = item.Industria_Descripcion
            this.DescENG = item.Industria_Descripcion_EN
            item.Edit = true
        },
        cancelChanges(item){

            item.Industria_Codigo = this.codigo
            item.Industria_Descripcion = this.Desc
            item.Industria_Descripcion_EN = this.DescENG
            item.Edit = false

        },
        saveChanges(item){
          if(!this.checkifExists(item)){
            item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/industrias/"+item.Industria_Key, item).then(
                item.Edit = false
            )
          }
          else{
            window.alert("Ya existe una Industria con ese código o descripción");
          }
            
        },
        saveNew(item){
          if(!this.checkifExists(item)){
            item.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/industrias/",item).then(
              item.New = false
            )
          }
          else{
            window.alert("Ya existe una Industria con ese código o descripción");
          }
        },
        cancelNew(item){
          item.New = false
          this.industrias.splice(this.industrias.indexOf(item), 1); 
        },
        crear() {
          const nuevoIndustria = {
            Industria_Codigo: "",
            Industria_Descripcion: "",
            Visible: 'X',
            New: true,
          };
          this.industrias.unshift(nuevoIndustria);
        },
        checkifExists(item){
          const matchesCode = this.industrias.filter((i) => i.Industria_Codigo === item.Industria_Codigo);
          const matchesDesc = this.industrias.filter((i) => i.Industria_Descripcion === item.Industria_Descripcion);
          const matchesDescENG = this.industrias.filter((i) => i.Industria_Descripcion_EN === item.Industria_Descripcion_EN);
          const exists = matchesCode.length > 1 || matchesDesc.length > 1 || matchesDescENG.length > 1 ;
          return exists
        },
        enable(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = 'X'
          axios.patch(ip+"/industrias/"+item.Industria_Key, item)
        }, 
        disable(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = ''
          axios.patch(ip+"/industrias/"+item.Industria_Key, item)
        },

        // PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes('P94')
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes('P95')
        },
        permisoEscrituraABM(){
          return localStorage.Permisos.includes('P97')
        },
        permisoCreacion(){
          return localStorage.Permisos.includes('P98')
        }
    }
  };
</script>