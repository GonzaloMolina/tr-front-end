<template>

  <div  style="height: 100%; width: auto;">
    <loader :loader="loader" style="position: fixed;"/>
       <div class="example-wrapper" style="">
           <div style="margin-bottom: 5px; ">
               <input style="border: 1px solid" type="text" id="filter-text-box" placeholder="Filtro..." v-on:input="onFilterTextBoxChanged()">
               <v-btn id= 'btn-colaborador' color="#2991C6" dark  :disabled="btnEditarPermisosLectura()" style="40rem" @click="editColab" > EDITAR </v-btn>
               <v-btn id= 'btn-colaborador' color="#2991C6" dark :disabled="btnEditarPermisosEditar()" style="40rem" @click="enableorunable"> ACTIVAR/DESACTIVAR </v-btn>
               <router-link to="/createColaborador">
                <v-btn class="ml-3" dark fab x-small color="#2991c6" >
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </router-link>
              </div>
           <ag-grid-vue
           
           style="width: 80vw; height: 100%"
           class="ag-theme-alpine a"
           
           :columnDefs="columnDefs"
           @grid-ready="onGridReady"
           :defaultColDef="defaultColDef"
           :autoGroupColumnDef="autoGroupColumnDef"
           :overlayNoRowsTemplate="overlayNoRowsTemplate"
           :rowData="rowData"
           :treeData="true"
           :rowSelection="rowSelection"
           :suppressRowClickSelection="true"
           :animateRows="true"
           :groupDefaultExpanded="groupDefaultExpanded"
           :getDataPath="getDataPath"></ag-grid-vue>
       </div>
   </div>
   
</template>


<script>
import loader from '../../Estado/loader'
import axios from "axios";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from "ag-grid-vue";
import TotalValueRenderer from './totalValueRendererVue.js';
const ip = require('../../../ip/ip')
export default {
components: {
'ag-grid-vue': AgGridVue,
totalValueRenderer: TotalValueRenderer,
},
data: function () {
return {
 overlayLoadingTemplate: null,
 overlayNoRowsTemplate :null,
 colaborator : null,
 rowSelection:null,
 columnDefs: null,
 gridApi: null,
 columnApi: null,
 disableEditar : false,
 horas_user: "",
 loader: true,
 defaultColDef: {
   flex: 1,
 },
 autoGroupColumnDef: null,
 rowData: [],
 groupDefaultExpanded: null,
 getDataPath: null,

};

},

beforeMount(){
this.loadColaboradores();


},
created() {
this.overlayNoRowsTemplate ="<span style=\"padding: 15px; border: 5px solid #444; background: lightgoldenrodyellow;\">Cargando</span>";  
this.overlayLoadingTemplate =
 '<span class="ag-overlay-loading-center">Cargando.......</span>';
this.autoGroupColumnDef = {
 headerName: 'Codigo Usuario',
 minWidth: 300,
 resizable: true,
 checkboxSelection:true,
 cellRendererParams: {
   suppressCount: true,
 },
};
this.columnDefs = [ {filter:true,field: 'name',headerName:'Nombre',minWidth:290, resizable: true},
                   { filter:true,field:'region_usuario',minWidth:80,headerName:'Region',resizable: true},
                   { filter:true,field: 'calendario_usuario',headerName:'Calendario',resizable: true },
                   {filter:true,field: 'horas',headerName:'Horas',resizable: true},
                   {filter:true, field: 'visible',resizable: true,headerName:'Activo'},
                   { filter:true, field: 'usuario_mail',resizable: true, headerName:'Usuario'},
                   { filter:true, field: 'area',resizable: true, headerName:'Area'},
                   { filter:true, field: 'puesto',resizable: true, headerName:'Puesto'},
                   { filter:true, field: 'tipo',resizable: true, headerName:'Tipo'},
                   { filter:true, field: 'ceco',resizable: true, headerName:'CECO'},
                   
                 ],
                 
this.groupDefaultExpanded = 1;
this.getDataPath = (data) => {
 return data.orgHierarchy;
};
},
methods: {

async loadColaboradores(){
   await axios.get(ip+"/colaboradores/listadojerarquia/76").then((response) => {
   this.rowData = response.data;
 })
}, 

onFilterTextBoxChanged() {
 this.gridApi.setQuickFilter(
   document.getElementById('filter-text-box').value
 );
},
onGridReady(params) {
 this.gridApi = params.api;
 this.gridColumnApi = params.columnApi;
 //Oculta columnas agregadas
 this.gridColumnApi.setColumnVisible('ceco', false)
 this.gridColumnApi.setColumnVisible('categoria', false)
 this.gridColumnApi.setColumnVisible('usuario_mail', false)
 this.gridColumnApi.setColumnVisible('area', false)
 this.gridColumnApi.setColumnVisible('puesto', false)
 this.gridColumnApi.setColumnVisible('tipo', false)
 this.gridColumnApi.setColumnVisible('CECO', false)
},
async editColab(){
  this.loader = true; 
let colaborator = this.gridApi.getSelectedRows()[0]
await this.getHoras(colaborator.usuario)
if( this.horas_user === null ) {  this.horas_user = 0}
this.$store.state.colaborador = {id: colaborator.id, horas: this.horas_user}
this.$router.push('editColaborador/')  
},

 async getHoras(user){
  var horas = 10
  await  axios.get(ip+"/colaboradores_horas").then((response) => {
    horas = response.data.filter( h => h.Colaborador_Hora_Usuario == user)[0].Colaborador_Hora_Dia;
  })
  this.horas_user = horas
},
seguridadColaboradoresGuardar(){
  if(!localStorage.login){
     return false
   } else
   return localStorage.Permisos.includes('P46') || localStorage.Permisos.includes('P45') 
},
seguridadColaboradoresLectura(){
  if(!localStorage.login){
     return false
   } else
   return localStorage.Permisos.includes('P41') || localStorage.Permisos.includes('P42') 
},
async wait(time) {
 return new Promise(resolve => {
   setTimeout(() => {
   resolve();
   }, time);
 })
},
btnEditarPermisosEditar(){
 return !this.seguridadColaboradoresGuardar()
},
btnEditarPermisosLectura(){
 return !this.seguridadColaboradoresLectura() && this.btnEditarPermisoAccion()
},
btnEditarPermisoAccion(){
 return this.disableEditar
},

async enableorunable(){
 var colaborator = this.gridApi.getSelectedRows()[0]

 if(colaborator.visible == 'X'){
    colaborator.Visible = '';
    colaborator.Usuario_Habilitado = '';
    colaborator.Colaborador_Estado = 2;
 } else {
    colaborator.Visible = 'X';
    colaborator.Usuario_Habilitado = 'X';
    colaborator.Colaborador_Estado = 1;
 }

 await axios.patch(ip+"/colaboradores/enableorunablecolaboratoranduser/"+colaborator.usuario, colaborator)
     .then((response) => {
       this.disableEditar = true
       this.loadColaboradores()
       this.gridApi.showLoadingOverlay() 
       this.disableEditar = false
   }) 

 alert('Colaborador Actualizado')
}

},


};
</script>
<style lang="scss">
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
.example-wrapper {
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
margin-top:100px;
height: 100vh;
width: 100vw;
}
#myGrid {
flex: 1 1 0px;
width: 100%;
}
.ag-theme-alpin{
margin-top:100px;
width: 500px;
height: 500px;
}
#filter-text-box{
margin-left: 10px;
margin-right: 10px;
}
#btn-colaborador{
margin-left: 5px;
margin-right: 5px;
}
</style>
