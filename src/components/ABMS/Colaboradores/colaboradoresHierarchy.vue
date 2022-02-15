<template>
 <v-content>
  <v-container style="background-color:white; min-height:28rem">
    <v-toolbar dense flat>
            <v-toolbar-title>Colaboradores</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer style="max-width:1rem"></v-spacer>
            <v-text-field
              v-model="search"
              label="Búsqueda"
              placeholder="Escribe..."
              outlined
              background-color="white"
              dense
              clearable
              clear-icon="mdi-close-circle-outline"
              style="display:inline-block; max-width:20rem;margin-top:1.8rem"
              ></v-text-field>
            <v-btn
            @click="()=>{this.selection = []}"
            style="margin-left:1rem"
            >
              LIMPIAR SELECCIÓN
            </v-btn>

          </v-toolbar>
    <v-row>
      

      <v-col>
        
        <v-treeview
          v-model="selection"
          :items="items"
          :search="search"
          :filter="filter"
          :selection-type="selectionType"
          selectable
          return-object
          open-all
          style="background-color:white"
        ></v-treeview>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col
        class="pa-8"
        cols="8"
      >
        <template v-if="!selection.length" >
          No se seleccionó ningun colaborador.
        </template>
        <template v-if="selection.length == 1" >
          <div
            v-for="node in selection"
            :key="node.id"
          >
            <v-text-field
              outlined
              dense
              disabled
              v-model="node.codigo_colaborador"
              label="Cód. Colaborador"
              style="display:inline-block; max-width:8rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              disabled
              v-model="node.region_usuario"
              label="Region"
              style="display:inline-block; max-width:13rem;margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              disabled
              v-model="node.calendario_usuario"
              label="Calendario"
              style="display:inline-block; max-width:13rem;margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              disabled
              v-model="node.horas"
              label="Horas diarias"
              style="display:inline-block; max-width:6.5rem;margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              disabled
              v-model="node.name"
              label="Nombre Colaborador"
              style="display:inline-block; min-width:17rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              disabled
              v-model="node.codigo_usuario"
              label="Usuario"
              style="display:inline-block; min-width:18rem;margin-left:1rem"
            ></v-text-field>
            <v-icon
            v-b-tooltip.hover title="Desactivar"
            v-if="permisoDesactivar() && node.visible == 'X'"
            large
            color= "#2991c6"
            @click="desactivarColaborador(node)"
            style=";margin-left:2rem"
            >
            mdi-eye-off
            </v-icon>
            <v-icon
            v-b-tooltip.hover title="Activar"
            v-if="node.visible == ''"
            large
            color="#2991c6"
            @click="activarColaborador(node)"
            style="margin-left:2rem"
            >
            mdi-eye
            </v-icon>
            <router-link :to="{ name: 'editColaborador', params: {colaborador_usuario: node.id } }">
            <v-icon
              v-b-tooltip.hover title="Editar"
              v-if=" node.visible == 'X' "
              large
              color="#2991c6"
              class="mr-2"
              style="margin-left:0.5rem"
              @click=""
            >
              mdi-pencil
            </v-icon>
           </router-link>

            
          </div>
        </template>
        <template v-if="selection.length>1">
          Ha seleccionado mas de un colaborador.
        </template>
      </v-col>
    </v-row>
  </v-container>
 </v-content>
</template>

<script>
import axios from 'axios';
const ip = require('../../../ip/ip')
  export default {
    data: () => ({
      selectionType: 'independent',
      selection: [],
      items: [],
      search: null,
      caseSensitive: false,
    }),
    beforeMount(){
      this.initialize()
      this.$forceUpdate();
    },
    computed: {
      filter () {
        return this.caseSensitive
          ? (item, search, textKey) => item[textKey].indexOf(search) > -1
          : undefined
      },
    },
    methods: {
      initialize () { //Pido todos los usuarios al backend
        axios.get(ip+"/colaboradores/listadoJerarquia/"+80)
        .then(response => {
          this.items.push(response.data)
        })
      },
      permisoDesactivar(){
        if(localStorage.Permisos.includes("P34")){
          return true
        }
      },
      desactivarColaborador(item) { //Boton de borrado logico. Quita la marca visible del cliente
          var habilitado = {Visible: '', Colaborador_Estado: 2}
          var inhabilitado = ''
          item.visible = ''
          this.selection[0].visible = ''
          axios.patch(ip+"/colaboradores/"+item.id, habilitado)
          axios.patch(ip+"/usuarios/habilitado/"+item.id,inhabilitado)
          .then(response => {
            console.log(response)
          })
              },
      activarColaborador(item){
        var habilitado = {Visible: 'X',Colaborador_Estado: 1}
        this.selection[0].visible = 'X'
        
        axios.patch(ip+"/colaboradores/"+item.id, habilitado)
        .then(response => {
          console.log(response)
        })
        
      }
    }
  }
</script>
