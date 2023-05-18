<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
        <v-toolbar color="white" elevation="1">
            <v-toolbar-title>Paises</v-toolbar-title>
            <v-btn class="ml-3" dark fab x-small color="#2991c6" @click="crear()" v-if="permisoCreacionPais()">
                  <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
        </v-toolbar>
        <v-data-table 
        :headers="headers"
        :items="paises"
        :footer-props="footerProps"
        :search="search"
        :items-per-page="20">
          <template v-slot:[`item.acciones`]="{ item }">
            <div v-if="!item.New && !item.Edit && permisoEscrituraTabla()">
              <b-form-row no-gutters>
              <b-col cols="8">
                <v-icon  @click="disablePais(item)" v-b-tooltip.hover title="Desactivar" v-if="item.Visible == 'X'" dissa medium color="#2991c6">mdi-eye-off</v-icon>
                <v-icon  @click="enablePais(item)" v-b-tooltip.hover title="Activar" v-else medium color="#2991c6">mdi-eye</v-icon>
              </b-col>
              <b-col cols="2" v-if="permisoEscrituraPais()">
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
          <template v-slot:item.Pais_Codigo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                    <v-text-field v-model="item.Pais_Codigo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                </template>
                <template v-else>
                <div>{{ item.Pais_Codigo }}</div>
                </template>
            </td>
            </template>
          <template v-slot:item.Pais_Descripcion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Pais_Descripcion" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                    </b-col>
                </b-form-row>
                </template>
                <template v-else>
                <div>{{ item.Pais_Descripcion }}</div>
                </template>
            </td>
            </template>
            <template v-slot:item.Pais_Descripcion_EN="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Pais_Descripcion_EN" hide-details :rules="[rules.checkEmpty]"></v-text-field>
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
                <div>{{ item.Pais_Descripcion_EN }}</div>
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
          { text: "Código", value: "Pais_Codigo" },
          { text: "Descripción", value: "Pais_Descripcion" },
          { text: "Description", value: "Pais_Descripcion_EN" },
          { text: "Activado", value: "Visible", align:"center"},
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Paises por página:',},
        
        paises: [],
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
        return this.paises.every(item => item.Pais_Descripcion && item.Pais_Descripcion.length > 0 
                                            && item.Pais_Codigo && item.Pais_Codigo.length > 0
                                            && item.Pais_Descripcion_EN && item.Pais_Descripcion_EN.length > 0)
      }
    },
    watch: {
      isValid() {
        this.isFormValid = this.paises.every(item => item.Pais_Descripcion && item.Pais_Descripcion.length > 0 
                                                        && item.Pais_Codigo && item.Pais_Codigo.length > 0
                                                        && item.Pais_Descripcion_EN && item.Pais_Descripcion_EN.length > 0)
      }
    },
    methods: {
        initialize(){
            axios.get(ip+"/paises").then(response => {
                this.paises = response.data.map(item => ({
                    ...item,
                    Edit: false,
                    New: false
                }))
                this.loader = false
            })
        },
        edit(item){       
            this.codigo = item.Pais_Codigo
            this.Desc = item.Pais_Descripcion
            this.DescENG = item.Pais_Descripcion_EN
            item.Edit = true
        },
        cancelChanges(item){

            item.Pais_Codigo = this.codigo
            item.Pais_Descripcion = this.Desc
            item.Pais_Descripcion_EN = this.DescENG
            item.Edit = false

        },
        saveChanges(item){
          if(!this.checkifExists(item)){
            item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/paises/"+item.Pais_Key, item).then(
                item.Edit = false
            )
          }
          else{
            window.alert("Ya existe un Pais con ese código o descripción");
          }
            
        },
        saveNew(item){
          if(!this.checkifExists(item)){
            item.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/paises/",item).then(
              item.New = false
            )
          }
          else{
            window.alert("Ya existe un Pais con ese código o descripción");
          }
        },
        cancelNew(item){
          item.New = false
          this.paises.splice(this.paises.indexOf(item), 1); 
        },
        crear() {
          const nuevoPais = {
            Pais_Codigo: "",
            Pais_Descripcion: "",
            Visible: 'X',
            New: true,
          };
          this.paises.unshift(nuevoPais);
        },
        checkifExists(item){
          const matchesCode = this.paises.filter((i) => i.Pais_Codigo === item.Pais_Codigo);
          const matchesDesc = this.paises.filter((i) => i.Pais_Descripcion === item.Pais_Descripcion);
          const matchesDescENG = this.paises.filter((i) => i.Pais_Descripcion_EN === item.Pais_Descripcion_EN);
          const exists = matchesCode.length > 1 || matchesDesc.length > 1 || matchesDescENG.length > 1 ;
          return exists
        },
        enablePais(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = 'X'
          axios.patch(ip+"/paises/"+item.Pais_Key, item)
        }, 
        disablePais(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = ''
          axios.patch(ip+"/paises/"+item.Pais_Key, item)
        },

        // PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes('P59')
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes('P60')
        },
        permisoEscrituraPais(){
          return localStorage.Permisos.includes('P62')
        },
        permisoCreacionPais(){
          return localStorage.Permisos.includes('P63')
        }
        
    }
  };
</script>