<template>

       <div  style="height: 100%; width: auto;">
         
            <div class="example-wrapper">
                <div style="margin-bottom: 5px;">
                    <input style="border: 1px solid" type="text" id="filter-text-box" placeholder="Filtro..." v-on:input="onFilterTextBoxChanged()">
                    <v-btn id= 'btn-colaborador' color="#2991C6" dark  :disabled="btnEditarPermisos()" style="40rem" @click="editColab" > EDITAR </v-btn>
                    <v-btn id= 'btn-colaborador' color="#2991C6" dark :disabled="btnEditarPermisos()" style="40rem" @click="enableorunable"> ACTIVAR/DESACTIVAR </v-btn>
                </div>
                <ag-grid-vue
                
                style="width: 80vw; height: 100%"
                class="ag-theme-alpine a"
                
                :columnDefs="columnDefs"
                @grid-ready="onGridReady"
                :defaultColDef="defaultColDef"
                :autoGroupColumnDef="autoGroupColumnDef"
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
      colaborator : null,
      rowSelection:null,
      columnDefs: null,
      gridApi: null,
      columnApi: null,
      disableEditar : false,
      defaultColDef: {
        flex: 1,
      },
      autoGroupColumnDef: null,
      rowData: [],
      groupDefaultExpanded: null,
      getDataPath: null,
      async loadColaboradores(){
        await axios.get(ip+"/colaboradores/listadojerarquia/76").then((response) => {
        this.rowData = response.data;
      })
    }, 
    };
    
  },
 
beforeMount(){
  this.loadColaboradores();
  
  
},
created() {
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
    this.columnDefs = [ {filter:true,field: 'name',headerName:'Nombre',minWidth:290, resizable: true},{ filter:true,field:'region_usuario',minWidth:80,headerName:'Region',resizable: true},{ filter:true,field: 'calendario_usuario',headerName:'Calendario',resizable: true },{filter:true,field: 'horas',headerName:'Horas',resizable: true},{filter:true, field: 'visible',resizable: true,headerName:'Activo'}],
    this.groupDefaultExpanded = -1;
    this.getDataPath = (data) => {
      return data.orgHierarchy;
    };
  },
  methods: {
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(
        document.getElementById('filter-text-box').value
      );
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    editColab(){
      let colaborator = this.gridApi.getSelectedRows()[0]
      this.$store.state.colaborador = {id: colaborator.id, horas: colaborator.horas}
      console.log(colaborator)
      this.$router.push('editColaborador/')  
    },

    seguridadColaboradores(){
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

    btnEditarPermisos(){
      return !this.seguridadColaboradores() && this.btnEditarPermisoAccion()
    },

    btnEditarPermisoAccion(){
      return this.disableEditar
    },

  
    async enableorunable(){
      var colaborator = this.gridApi.getSelectedRows()[0]
      console.log(colaborator)
      if(colaborator.visible == 'X'){
        var noVisible = {
          Usuario_Habilitado:'',
          Visible: '',
          Colaborador_Estado: 2}
        await axios.patch(ip+"/colaboradores/enableorunablecolaboratoranduser/"+colaborator.usuario, noVisible)
          .then((response) => {
            this.disableEditar = true
            this.loadColaboradores()
            this.gridApi.showLoadingOverlay()
            
            this.disableEditar = false
      
        })
        
      } else {
        var visible = {
            Usuario_Habilitado:'X',
            Visible: 'X',
            Colaborador_Estado: 1}
        await axios.patch(ip+"/colaboradores/enableorunablecolaboratoranduser/"+colaborator.usuario, visible)
          .then((response) => {
            this.disableEditar = true
            this.loadColaboradores()
            this.gridApi.showLoadingOverlay()
            
            this.disableEditar = false
            
        })
      }
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
  margin-left:450px;
  margin-top:100px;
  height: 1000px;
  width: 1000px;
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