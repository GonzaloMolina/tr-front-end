<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
        <v-toolbar color="white" elevation="1">
            <v-toolbar-title>Categorías</v-toolbar-title>
            <v-btn class="ml-3" dark fab x-small color="#2991c6" @click="crear()" v-if="permisoCreacion()">
                  <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
        </v-toolbar>
        <v-data-table 
        :headers="headers"
        :items="colaboradores_categorias"
        :footer-props="footerProps"
        :search="search"
        :items-per-page="20">
          <template v-slot:[`item.acciones`]="{ item }">
            <div v-if="!item.New && !item.Edit && permisoEscrituraTabla()">
              <b-form-row no-gutters>
              <b-col cols="9">
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
          <template v-slot:item.Colaborador_Categoria_Codigo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                    <v-text-field v-model="item.Colaborador_Categoria_Codigo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                </template>
                <template v-else>
                <div>{{ item.Colaborador_Categoria_Codigo }}</div>
                </template>
            </td>
            </template>
            <template v-slot:item.Colaborador_Categoria_Descripcion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Colaborador_Categoria_Descripcion" hide-details :rules="[rules.checkEmpty]"></v-text-field>
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
                <div>{{ item.Colaborador_Categoria_Descripcion }}</div>
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
          { text: "Código", value: "Colaborador_Categoria_Codigo" },
          { text: "Descripción", value: "Colaborador_Categoria_Descripcion" },
          { text: "Activado", value: "Visible", align:"center"},
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Categorías por página:',},
        
        colaboradores_categorias: [],
        loader:true,
        isFormValid: true,
        codigo: null,
        Desc: null,
      };
    },
    created(){
        this.initialize()
    },
    computed: {
      isValid() {
        return this.colaboradores_categorias.every(item => item.Colaborador_Categoria_Descripcion && item.Colaborador_Categoria_Descripcion.length > 0 
                                            && item.Colaborador_Categoria_Codigo && item.Colaborador_Categoria_Codigo.length > 0)
      }
    },
    watch: {
      isValid() {
        this.isFormValid = this.colaboradores_categorias.every(item => item.Colaborador_Categoria_Descripcion && item.Colaborador_Categoria_Descripcion.length > 0 
                                                        && item.Colaborador_Categoria_Codigo && item.Colaborador_Categoria_Codigo.length > 0)
  
      }
    },
    methods: {
        initialize(){
            axios.get(ip+"/colaboradores_categorias").then(response => {
                this.colaboradores_categorias = response.data.map(item => ({
                    ...item,
                    Edit: false,
                    New: false
                }))
                this.loader = false
            })
        },
        edit(item){       
            this.codigo = item.Colaborador_Categoria_Codigo
            this.Desc = item.Colaborador_Categoria_Descripcion
            item.Edit = true
        },
        cancelChanges(item){
  
            item.Colaborador_Categoria_Codigo = this.codigo
            item.Colaborador_Categoria_Descripcion = this.Desc
            item.Edit = false
  
        },
        saveChanges(item){
          if(!this.checkifExists(item)){
            item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/colaboradores_categorias/"+item.Colaborador_Categoria_Key, item).then(
                item.Edit = false
            )
          }
          else{
            window.alert("Ya existe una función con ese código o descripción");
          }
            
        },
        saveNew(item){
          if(!this.checkifExists(item)){
            item.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/colaboradores_categorias/",item).then(
              item.New = false
            )
          }
          else{
            window.alert("Ya existe una función con ese código o descripción");
          }
        },
        cancelNew(item){
          item.New = false
          this.colaboradores_categorias.splice(this.colaboradores_categorias.indexOf(item), 1); 
        },
        crear() {
          const nuevoPais = {
            Colaborador_Categoria_Codigo: "",
            Colaborador_Categoria_Descripcion: "",
            Visible: 'X',
            New: true,
          };
          this.colaboradores_categorias.unshift(nuevoPais);
        },
        checkifExists(item){
          const matchesCode = this.colaboradores_categorias.filter((i) => i.Colaborador_Categoria_Codigo === item.Colaborador_Categoria_Codigo);
          const matchesDesc = this.colaboradores_categorias.filter((i) => i.Colaborador_Categoria_Descripcion === item.Colaborador_Categoria_Descripcion);
          const exists = matchesCode.length > 1 || matchesDesc.length > 1 
          return exists
        },
        enable(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = 'X'
          axios.patch(ip+"/colaboradores_categorias/"+item.Colaborador_Categoria_Key, item)
        }, 
        disable(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = null
          axios.patch(ip+"/colaboradores_categorias/"+item.Colaborador_Categoria_Key, item)
        },
  
        // PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes('P104')
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes('P105')
        },
        permisoEscrituraABM(){
          return localStorage.Permisos.includes('P107')
        },
        permisoCreacion(){
          return localStorage.Permisos.includes('P108')
        }
        
    }
  };
  </script>