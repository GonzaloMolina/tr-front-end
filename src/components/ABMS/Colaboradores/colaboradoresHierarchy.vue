<template>

       <div style="height: 100%">
         
            <div class="example-wrapper">
                <div style="margin-bottom: 5px;">
                    <input style="border: 1px solid" type="text" id="filter-text-box" placeholder="Filter..." v-on:input="onFilterTextBoxChanged()">
                    <v-btn id= 'btn-colaborador' color="#2991C6" dark  :disabled="btnEditarPermisos()" style="40rem" @click="editColab" > EDITAR </v-btn>
                    <v-btn id= 'btn-colaborador' color="#2991C6" dark :disabled="btnEditarPermisos()" style="40rem" @click="enableorunable"> ACTIVAR/DESACTIVAR </v-btn>
                </div>
                <ag-grid-vue
                
                style="width: 100%; height: 100%;"
                class="ag-theme-alpine"
                
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
    this.autoGroupColumnDef = {
      headerName: 'Codigo_usuario',
      minWidth: 300,
      checkboxSelection:true,
      cellRendererParams: {
        suppressCount: true,
      },
    };
    this.columnDefs = [ { field: 'region_usuario' },{ field: 'calendario_usuario' },{field: 'horas'},{field: 'name'},{field: 'visible'}],
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
      var colaborator = this.gridApi.getSelectedRows()[0]
      this.$store.state.colaborador = colaborator.id
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
            this.lo
            alert('Colaborador Actualizado')
        })
        
      } else {
        var visible = {
            Usuario_Habilitado:'X',
            Visible: 'X',
            Colaborador_Estado: 1}
        await axios.patch(ip+"/colaboradores/enableorunablecolaboratoranduser/"+colaborator.usuario, visible)
          .then((response) => {
            alert('Colaborador Actualizado')
        })
      }
      this.disableEditar = true
      this.loadColaboradores()
      this.disableEditar = false
      
    }
    
  },
 
 
};
</script>
<style lang="scss">
   @import "~ag-grid-community/dist/styles/ag-grid.css";
   @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
   .example-wrapper {
  display: flex;
  flex-direction: column;
  margin-left:200px;
  margin-top:200px;
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