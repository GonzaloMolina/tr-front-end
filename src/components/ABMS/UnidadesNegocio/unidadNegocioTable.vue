<template>
    <v-content>
      <v-container>
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoLecturaTabla()">
        <v-toolbar color="white" elevation="1">
            <v-toolbar-title>Unidades de Negocio</v-toolbar-title>
            <v-btn class="ml-3" dark fab x-small color="#2991c6" @click="crear()" v-if="permisoCreacionUN()">
                  <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="max-width: 30%;"></v-text-field>
        </v-toolbar>
        <v-data-table 
        :headers="headers"
        :items="uns"
        :footer-props="footerProps"
        :search="search"
        :items-per-page="20">
          <template v-slot:[`item.acciones`]="{ item }">
            <div v-if="!item.New && !item.Edit && permisoEscrituraTabla()">
              <b-form-row no-gutters>
              <b-col cols="8">
                <v-icon  @click="disableUN(item)" v-b-tooltip.hover title="Desactivar" v-if="item.Visible == 'X'" dissa medium color="#2991c6">mdi-eye-off</v-icon>
                <v-icon  @click="enableUN(item)" v-b-tooltip.hover title="Activar" v-else medium color="#2991c6">mdi-eye</v-icon>
              </b-col>
              <b-col v-if="permisoEscrituraUN()">
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
          <template v-slot:item.Unidad_Negocio_Codigo="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                    <v-text-field v-model="item.Unidad_Negocio_Codigo" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                </template>
                <template v-else>
                <div>{{ item.Unidad_Negocio_Codigo }}</div>
                </template>
            </td>
            </template>
          <template v-slot:item.Unidad_Negocio_Descripcion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Unidad_Negocio_Descripcion" hide-details :rules="[rules.checkEmpty]"></v-text-field>
                    </b-col>
                </b-form-row>
                </template>
                <template v-else>
                <div>{{ item.Unidad_Negocio_Descripcion }}</div>
                </template>
            </td>
            </template>
            <template v-slot:item.Unidad_Negocio_Observacion="{ item }">
            <td>
                <template v-if="item.Edit || item.New">
                <b-form-row>
                    <b-col cols="10">
                        <v-text-field v-model="item.Unidad_Negocio_Observacion" hide-details></v-text-field>
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
                <div>{{ item.Unidad_Negocio_Observacion }}</div>
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
          { text: "Código", value: "Unidad_Negocio_Codigo" },
          { text: "Descripción", value: "Unidad_Negocio_Descripcion" },
          { text: "Observación", value: "Unidad_Negocio_Observacion" },
          { text: "Activado", value: "Visible", align:"center"},
          { text: "Acciones", value: "acciones", align:"end" }
        ],
        footerProps: {'items-per-page-options': [7, 20,40, 60, 100, 200],
                    'itemsPerPageText': 'UN por página:',},
        
        uns: [],
        loader:true,
        isFormValid: true,
        codigo: null,
        Desc: null,
        Obs: null
      };
    },
    created(){
        this.initialize()
    },
    computed: {
      isValid() {
        return this.uns.every(item => item.Unidad_Negocio_Descripcion && item.Unidad_Negocio_Descripcion.length > 0 
                                            && item.Unidad_Negocio_Codigo && item.Unidad_Negocio_Codigo.length > 0
                                            )
      }
    },
    watch: {
      isValid() {
        this.isFormValid = this.uns.every(item => item.Unidad_Negocio_Descripcion && item.Unidad_Negocio_Descripcion.length > 0 
                                                        && item.Unidad_Negocio_Codigo && item.Unidad_Negocio_Codigo.length > 0
                                                        )
      }
    },
    methods: {
        initialize(){
            axios.get(ip+"/unidades_negocios/").then(response => {
                this.uns = response.data.map(item => ({
                    ...item,
                    Edit: false,
                    New: false
                }))
                this.loader = false
            })
        },
        edit(item){       
            this.codigo = item.Unidad_Negocio_Codigo
            this.Desc = item.Unidad_Negocio_Descripcion
            this.Obs = item.Unidad_Negocio_Observacion
            item.Edit = true
        },
        cancelChanges(item){
            item.Unidad_Negocio_Codigo = this.codigo
            item.Unidad_Negocio_Descripcion = this.Desc
            item.Unidad_Negocio_Observacion = this.Obs
            item.Edit = false
        },
        saveChanges(item){
          if(!this.checkifExists(item)){
            item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/unidades_negocios/"+item.Unidad_Negocio_Key, item).then(
                item.Edit = false
            )
          }
          else{
            window.alert("Ya existe una Unidad de Negocio con ese código o descripción");
          }
            
        },
        saveNew(item){
          if(!this.checkifExists(item)){
            item.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/unidades_negocios/",item).then(
              item.New = false
            )
          }
          else{
            window.alert("Ya existe una Unidad de Negocio con ese código o descripción");
          }
        },
        cancelNew(item){
          item.New = false
          this.uns.splice(this.uns.indexOf(item), 1); 
        },
        crear() {
          const nuevoUN = {
            Unidad_Negocio_Codigo: "",
            Unidad_Negocio_Descripcion: "",
            Visible: 'X',
            New: true,
          };
          this.uns.unshift(nuevoUN);
        },
        checkifExists(item){
          const matchesCode = this.uns.filter((i) => i.Unidad_Negocio_Codigo === item.Unidad_Negocio_Codigo);
          const matchesDesc = this.uns.filter((i) => i.Unidad_Negocio_Descripcion === item.Unidad_Negocio_Descripcion);
          const exists = matchesCode.length > 1 || matchesDesc.length > 1 ;
          return exists
        },
        enableUN(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = 'X'
          axios.patch(ip+"/unidades_negocios/"+item.Unidad_Negocio_Key, item)
        }, 
        disableUN(item){
          item.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          item.Visible = '' 
          axios.patch(ip+"/unidades_negocios/"+item.Unidad_Negocio_Key, item)
        },
        // PERMISOS
        permisoLecturaTabla(){
          return localStorage.Permisos.includes('P64')
        },
        permisoEscrituraTabla(){
          return localStorage.Permisos.includes('P65')
        },
        permisoEscrituraUN(){
          return localStorage.Permisos.includes('P67')
        },
        permisoCreacionUN(){
          return localStorage.Permisos.includes('P68')
        }
        
    }
  };
</script>