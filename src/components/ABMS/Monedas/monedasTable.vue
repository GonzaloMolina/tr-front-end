<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
        <v-toolbar color="white" elevation="1">
            <v-toolbar-title>Monedas</v-toolbar-title>
            <v-btn class="ml-3" dark fab x-small color="#2991c6" @click="crear()" v-if="permisoCreacionMoneda()">
                  <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
        </v-toolbar>
        <v-data-table 
        :headers="headers"
        :items="monedas"
        :footer-props="footerProps"
        :search="search"
        :items-per-page="20">
          <template v-slot:[`item.acciones`]="{ item }">
            <div v-if="!item.New && !item.Edit && permisoEscrituraTabla()">
              <b-form-row no-gutters>
              <b-col cols="12" v-if="permisoEscrituraMoneda()">
                <v-icon  @click="edit(item)" v-b-tooltip.hover title="Editar"  medium color="#2991c6" style="margin-left: 1vw">mdi-pencil</v-icon>
              </b-col>
              </b-form-row>
            </div>
          </template>

          <template v-slot:item.Moneda_Codigo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                    <v-text-field v-model="item.Moneda_Codigo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                </template>
                <template v-else>
                <div>{{ item.Moneda_Codigo }}</div>
                </template>
            </td>
            </template>
          <template v-slot:item.Moneda_Descripcion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Moneda_Descripcion" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                    </b-col>
                </b-form-row>
                </template>
                <template v-else>
                <div>{{ item.Moneda_Descripcion }}</div>
                </template>
            </td>
            </template>
            <template v-slot:item.Moneda_Simbolo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Moneda_Simbolo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
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
                <div>{{ item.Moneda_Simbolo }}</div>
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
          { text: "Código", value: "Moneda_Codigo" },
          { text: "Descripción", value: "Moneda_Descripcion" },
          { text: "Símbolo", value: "Moneda_Simbolo" },
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'Monedas por página:',},
        
        monedas: [],
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
        return this.monedas.every(item => item.Moneda_Descripcion && item.Moneda_Descripcion.length > 0 
                                            && item.Moneda_Codigo && item.Moneda_Codigo.length > 0
                                            && item.Moneda_Simbolo && item.Moneda_Simbolo.length > 0)
      }
    },
    watch: {
      isValid() {
        this.isFormValid = this.monedas.every(item => item.Moneda_Descripcion && item.Moneda_Descripcion.length > 0 
                                                        && item.Moneda_Codigo && item.Moneda_Codigo.length > 0
                                                        && item.Moneda_Simbolo && item.Moneda_Simbolo.length > 0)
      }
    },
    methods: {
        initialize(){
            axios.get(ip+"/monedas/all").then(response => {
                this.monedas = response.data.map(item => ({
                    ...item,
                    Edit: false,
                    New: false
                }))
                console.log(this.monedas)
                this.loader = false
            })
        },
        edit(item){       
            this.codigo = item.Moneda_Codigo
            this.Desc = item.Moneda_Descripcion
            this.simbolo = item.Moneda_Descripcion_EN
            item.Edit = true
        },
        cancelChanges(item){

            item.Moneda_Codigo = this.codigo
            item.Moneda_Descripcion = this.Desc
            item.Moneda_Descripcion_EN = this.simbolo
            item.Edit = false

        },
        saveChanges(item){
          if(!this.checkifExists(item)){
            item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/monedas/"+item.Moneda_Key, item).then(
                item.Edit = false
            )
          }
          else{
            window.alert("Ya existe una Moneda con ese código o descripción");
          }
            
        },
        saveNew(item){
          if(!this.checkifExists(item)){
            item.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/monedas/",item).then(
              item.New = false
            )
          }
          else{
            window.alert("Ya existe una Moneda con ese código o descripción");
          }
        },
        cancelNew(item){
          item.New = false
          this.monedas.splice(this.monedas.indexOf(item), 1); 
        },
        crear() {
          const nuevoMoneda = {
            Moneda_Codigo: "",
            Moneda_Descripcion: "",
            New: true,
          };
          this.monedas.unshift(nuevoMoneda);
        },
        checkifExists(item){
          const matchesCode = this.monedas.filter((i) => i.Moneda_Codigo === item.Moneda_Codigo);
          const matchesDesc = this.monedas.filter((i) => i.Moneda_Descripcion === item.Moneda_Descripcion);
          const exists = matchesCode.length > 1 || matchesDesc.length > 1;
          return exists
        },


        // PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes('P84')
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes('P85')
        },
        permisoEscrituraMoneda(){
          return localStorage.Permisos.includes('P87')
        },
        permisoCreacionMoneda(){
          return localStorage.Permisos.includes('P88')
        }
        
    }
  };
</script>