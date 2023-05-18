<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
        <v-toolbar color="white" elevation="1">
            <v-toolbar-title>Tipos de Empresas</v-toolbar-title>
            <v-btn class="ml-3" dark fab x-small color="#2991c6" @click="crear()" v-if="permisoCreacionTipo_Empresa()">
                  <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
        </v-toolbar>
        <v-data-table 
        :headers="headers"
        :items="tipos_empresas"
        :footer-props="footerProps"
        :search="search"
        :items-per-page="20">
          <template v-slot:[`item.acciones`]="{ item }">
            <div v-if="!item.New && !item.Edit && permisoEscrituraTabla()">
              <b-form-row no-gutters>
              <b-col cols="12" v-if="permisoEscrituraTipo_Empresa()">
                <v-icon  @click="edit(item)" v-b-tooltip.hover title="Editar"  medium color="#2991c6" style="margin-left: 1vw">mdi-pencil</v-icon>
              </b-col>
              </b-form-row>
            </div>
          </template>

          <template v-slot:item.Tipo_Empresa_Codigo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                    <v-text-field v-model="item.Tipo_Empresa_Codigo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                </template>
                <template v-else>
                <div>{{ item.Tipo_Empresa_Codigo }}</div>
                </template>
            </td>
            </template>
          <template v-slot:item.Tipo_Empresa_Descripcion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Tipo_Empresa_Descripcion" hide-details :rules="[rules.checkEmpty]"></v-text-field>
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
                <div>{{ item.Tipo_Empresa_Descripcion }}</div>
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
          { text: "Código", value: "Tipo_Empresa_Codigo" },
          { text: "Descripción", value: "Tipo_Empresa_Descripcion" },
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Tipos de Empresas por página:',},
        
        tipos_empresas: [],
        loader:true,
        isFormValid: true,
        codigo: null,
        Desc: null,
        simbolo: null
      };
    },
    created(){
        this.initialize()
    },
    computed: {
      isValid() {
        return this.tipos_empresas.every(item => item.Tipo_Empresa_Descripcion && item.Tipo_Empresa_Descripcion.length > 0 
                                            && item.Tipo_Empresa_Codigo && item.Tipo_Empresa_Codigo.length > 0)
      }
    },
    watch: {
      isValid() {
        this.isFormValid = this.tipos_empresas.every(item => item.Tipo_Empresa_Descripcion && item.Tipo_Empresa_Descripcion.length > 0 
                                                        && item.Tipo_Empresa_Codigo && item.Tipo_Empresa_Codigo.length > 0)
      }
    },
    methods: {
        initialize(){
            axios.get(ip+"/tipos_empresas/").then(response => {
                this.tipos_empresas = response.data.map(item => ({
                    ...item,
                    Edit: false,
                    New: false
                }))
                console.log(this.tipos_empresas)
                this.loader = false
            })
        },
        edit(item){       
            this.codigo = item.Tipo_Empresa_Codigo
            this.Desc = item.Tipo_Empresa_Descripcion
            this.simbolo = item.Tipo_Empresa_Descripcion_EN
            item.Edit = true
        },
        cancelChanges(item){

            item.Tipo_Empresa_Codigo = this.codigo
            item.Tipo_Empresa_Descripcion = this.Desc
            item.Tipo_Empresa_Descripcion_EN = this.simbolo
            item.Edit = false

        },
        saveChanges(item){
          if(!this.checkifExists(item)){
            item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/tipos_empresas/"+item.Tipo_Empresa_Key, item).then(
                item.Edit = false
            )
          }
          else{
            window.alert("Ya existe un Tipo de Empresa con ese código o descripción");
          }
            
        },
        saveNew(item){
          if(!this.checkifExists(item)){
            item.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/tipos_empresas/",item).then(
              item.New = false
            )
          }
          else{
            window.alert("Ya existe un Tipo de Empresa con ese código o descripción");
          }
        },
        cancelNew(item){
          item.New = false
          this.tipos_empresas.splice(this.tipos_empresas.indexOf(item), 1); 
        },
        crear() {
          const nuevoTipo_Empresa = {
            Tipo_Empresa_Codigo: "",
            Tipo_Empresa_Descripcion: "",
            New: true,
          };
          this.tipos_empresas.unshift(nuevoTipo_Empresa);
        },
        checkifExists(item){
          const matchesCode = this.tipos_empresas.filter((i) => i.Tipo_Empresa_Codigo === item.Tipo_Empresa_Codigo);
          const matchesDesc = this.tipos_empresas.filter((i) => i.Tipo_Empresa_Descripcion === item.Tipo_Empresa_Descripcion);
          const exists = matchesCode.length > 1 || matchesDesc.length > 1;
          return exists
        },


        // PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes('P119')
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes('P120')
        },
        permisoEscrituraTipo_Empresa(){
          return localStorage.Permisos.includes('P122')
        },
        permisoCreacionTipo_Empresa(){
          return localStorage.Permisos.includes('P123')
        }
        
    }
  };
</script>