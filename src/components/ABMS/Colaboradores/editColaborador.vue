<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
                <v-alert
                :value="alert"
                style="position: absolute;  left: 0; right: 0; top: -12px; text-align: center;"
                top
                dense
                color="blue"
                type="success"
                
              > Se han guardado los cambios.
              </v-alert>
      <v-form ref="form">
      <v-row>
        <v-col cols="12" style="max-width:82rem; margin-top:-0.5rem">
          <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
           <v-btn @click="guardar" disabled color="#32b4dd" style="margin-left:53rem">Guardar</v-btn>
          <v-btn @click="dialogCancelar = true" color="#ffa025" dark style="margin-left:1rem">Volver</v-btn>
          <v-card class="pa-2" outlined tile style="margin-top:1rem;">
            <v-text-field
              outlined
              dense
              :disabled="permisoGuardar()"
              v-model="colaborador.Colaborador_Codigo"
              label="Código"
              placeholder="Escribe..."
              style="display:inline-block; min-width:18rem;margin-left:1rem;margin-top:2rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              :disabled="permisoGuardar()"
              v-model="colaborador.Colaborador_Descripcion"
              label="Nombre Completo"
              placeholder="Escribe..."
              style="display:inline-block; min-width:18rem; margin-left:1.8rem;margin-top:2rem"
            ></v-text-field>
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Usuario"
              :items="usuariosDescripciones"
              label="Usuario"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Responsable"
              :items="colaboradoresDescripciones"
              label="Responsable"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Region"
              :items="regionesDescripciones"
              label="Región"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Calendario"
              :items="calendariosDescripciones"
              label="Calendario"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1.8rem"
            ></v-select>
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Area"
              :items="colaboradoresAreasDescripciones"
              label="Área"
              placeholder="Selecciona..."
              style="max-width:20rem;min-width:20rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Puesto"
              :items="colaboradoresPuestosDescripciones"
              label="Puesto"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>

             <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Tipo"
              :items="tiposDescripciones"
              label="Tipo"
              placeholder="Selecciona..."
              style="max-width:20rem;min-width:20rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="permisoGuardar()"
              outlined
              v-model="colaborador.Colaborador_Empresa"
              :items="empresasDescripciones"
              label="Empresa"
              placeholder="Selecciona..."
              style="max-width:20rem;min-width:20rem; display:inline-block;margin-left:1rem"
            ></v-select>
             <v-text-field
              outlined
              dense
              :disabled="permisoGuardar()"
              v-model="colaborador.Colaborador_Funcion_Descripcion"
              label="Funcion"
              placeholder="Escribe..."
              style="display:inline-block; min-width:18rem;margin-left:1rem;margin-top:2rem"
            ></v-text-field>
            
            <double-select
              :items="arrayOfItems"
              :selectedItems="arrayOfSelectedItems"
              :searchable="false"
              :orderBy="'name'"
              text-field="name"
              value-field="id"
              style="width:740px;height:350px;margin-left:0rem"
            ></double-select>



            <v-col>

            </v-col>
          </v-card>
        </v-col>
      </v-row>
      </v-form>

    <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
            <v-card>
              <v-toolbar
                dark
                color="#2991C6"
                height="30rem"
              >
              <v-icon color="#ffa025" style="text-shadow: 1px 1px 2px black;position:absolute; left:38%">mdi-alert</v-icon><v-text style="font-weight: bold;position:absolute; left:45%; color:white; text-shadow: 1px 1px 2px black;">ALERTA</v-text>
              </v-toolbar>
              <v-card-title>Los cambios no guardados se borrarán. <br> ¿Deseas continuar?</v-card-title>
              <v-card-actions>
                <router-link to="/colaboradoresHierarchy">
                <v-btn 
                  color="white"
                  text
                  outlined

                  style="margin-left:16rem; background-color:#2991C6"
                  @click=""
                >
                  Aceptar
                </v-btn>
                </router-link>
        
                <v-btn
                  color="white"
                  outlined
                  text
                  style="margin-left:0.5rem; background-color:#ffa025"
                  @click="dialogCancelar = false"
                >
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>



    </v-container>
  </v-content>
</template>




<style  scoped>
.container {
  margin-left: 1rem;
  min-width: 100rem;
}




</style>


<script>
import axios from "axios";
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
import {checkCode,checkEmail,counterTelefono,counterCodigo, counterDescripcion,
        counterEmail,checkPhoneNumber,checkNumbers,counterReferentes} 
from '../../../validations/validations'
import DoubleSelect from 'vue-double-select'
export default {
  name: "editColaborador",
  props: {
    colaborador_usuario: ""
  },
  components: {loader,DoubleSelect
              },
  data: () => ({
    codigoViejo: '',
    //Reglas de agregado y editado
    //Elemento que se va a guardar con el UPDATE
    colaborador: {
        Colaborador_Codigo: '',
        Colaborador_Descripcion: '',
        Colaborador_Usuario: '',
        Colaborador_Tipo: '',
        Colaborador_Responsable: '',
        Colaborador_Region: '',
        Colaborador_Puesto: '',
        Colaborador_Calendario: '',
        Colaborador_Area: '',
        Colaborador_Empresa: '',
        Colaborador_Hora: 0,
        Usuario_Creacion: 1,
        Usuario_Modificacion: 1,
    },
    colaboradores:[],
    colaboradoresDescripciones: [],
    empresas: [],
    empresasDescripciones: [],
    regiones: [],
    regionesDescripciones: [],
    calendarios: [],
    calendariosDescripciones: [],
    colaboradoresAreas: [],
    colaboradoresAreasDescripciones: [],
    colaboradoresPuestos: [],
    colaboradoresPuestosDescripciones: [],
    responsables:[],
    responsablesDescripciones: [],
    usuarios: [],
    usuariosDescripciones: [],
    tipos: [],
    tiposDescripciones: [],
    funciones: [],
    funcionesDescripciones: [],
    dialogGuardar: false,
    alert: false,
    dialogCancelar: false,
    loader: true,
    arrayOfItems: [     
      {
        id:1,
        name: 'VENDEDOR'
      },
      {
        id:2,
        name: 'RESPONSABLE'
      }],
    model: [1],
    arrayOfSelectedItems: [

    ]

  }),
  created(){
      this.initialize();
  },

  methods: {
    async initialize(){
      this.loadUsuarios();
      this.loadEmpresas();
      this.loadRegions();
      this.loadCalendars();
      this.loadColaboradoresAreas();
      this.loadColaboradoresPuestos();
      this.loadColaboradoresTipos();
      await this.wait(1000)
      this.loadColaboradores();
      await this.wait(1300)
      this.asignarDescripciones();
      this.loader = false
    },
    onChangeList: function({ source, destination }) {
      this.funciones = source;
      this.arrayOfSelectedtems = destination;
    },

      async wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
  })
    },

    async loadColaboradores(){
        await axios.get(ip+"/colaboradores").then((response) => {
        this.colaboradores = response.data;
        this.colaborador = this.colaboradores.filter(colaborador => colaborador.Colaborador_Usuario == this.colaborador_usuario)[0]
        var usuarioMail = this.usuarios.filter(usuario => usuario.Usuario_Key == this.colaborador.Colaborador_Usuario)[0].Usuario_Codigo;
        this.colaborador.Colaborador_Usuario = usuarioMail
        this.colaboradoresDescripciones = response.data.map(
          (colaborador) => colaborador.Colaborador_Descripcion
        ).sort()
      })
        
      ;
    },

    loadUsuarios(){
      axios.get(ip+"/usuarios").then((response) => {
        this.usuarios = response.data;
        this.usuariosDescripciones = response.data.map(
          (usuario) => usuario.Usuario_Codigo
        ).sort();
    })
    },

    loadEmpresas(){
      axios.get(ip+"/empresas").then((response) => {
        this.empresas = response.data;
        this.empresasDescripciones = response.data.map(
          (empresa) => empresa.Empresa_Descripcion
        ).sort();
      })
    },

    loadRegions() {
      axios.get(ip+"/regiones/descripciones")
        .then((response) => {
          this.regiones = response.data;
          this.regionesDescripciones = response.data.map(
            (region) => region.Region_Descripcion
          ).sort();
        });
    },
    loadCalendars() {
      axios.get(ip+"/calendarios/descripciones")
        .then((response) => {
          this.calendarios = response.data;
          this.calendariosDescripciones = response.data.map((calendario) => calendario.Calendario_Descripcion);
        });
      },

      loadColaboradoresAreas() {
      axios.get(ip+"/colaboradores_areas/descripciones")
        .then((response) => {
          this.colaboradoresAreas = response.data;
          this.colaboradoresAreasDescripciones = response.data.map((area) => area.Colaborador_Area_Descripcion);
        });
      },

      loadColaboradoresPuestos() {
      axios.get(ip+"/colaboradores_puestos/descripciones")
        .then((response) => {
          this.colaboradoresPuestos = response.data;
          this.colaboradoresPuestosDescripciones = response.data.map((puesto) => puesto.Colaborador_Puesto_Descripcion);
        });
      },
      loadColaboradoresTipos(){
        axios.get(ip+"/tipos_colaboradores/descripciones")
        .then((response) => {
          this.tipos = response.data;
          this.tiposDescripciones = response.data.map((tipo) => tipo.Tipo_Colaborador_Descripcion);
        });
      },
     
    async guardar() {
          axios.delete(ip+"/colaboradores_funciones/"+this.colaborador.Colaborador_Key).then((response) => {
              console.log(response);
          })
          for(var i = 0; i < this.arrayOfSelectedItems.length; i++){
          var funcion = {
            Colaborador_Funcion_Funcion_Key: this.arrayOfSelectedItems[i].id,
            Colaborador_Funcion_Descripcion: this.colaborador.Colaborador_Codigo+" - "+this.arrayOfSelectedItems[i].name.substr(0,4),
            Colaborador_Funcion_Colaborador_Key: this.colaborador.Colaborador_Key,
            Usuario_Creacion: localStorage.usuario_id,
            Usuario_Modificacion: localStorage.usuario_id
          }
          await axios.post(ip+"/colaboradores_funciones_edit/", funcion)
          .then((response) => {
              this.alert = true
              setTimeout(() => {this.alert = false
          
          }) 
          .catch(err =>{
            alert('No se ha podido guardar')
            throw new Error('La empresa ya existe')
          })
          })
          }
    },

    cleanStore(){
      this.$store.replaceState({
        cliente: [],
        clienteTipo:0,
        proyecto: [],
        clienteFiscal: [],
        empresa: []})
    },

    permisoGuardar(){
      return !localStorage.Permisos.includes("P14")
    },

    asignarKeys(){
        var tipoEmpresaKey = this.tiposEmpresas.filter((tipoEmpresa) => tipoEmpresa.Tipo_Empresa_Descripcion == this.empresa.Empresa_Tipo)[0].Tipo_Empresa_Key;
        this.empresa.Empresa_Tipo = tipoEmpresaKey;
    },

    asignarDescripciones(){
      var regionDescripcion = this.regiones.filter(region => region.Region_Key == this.colaborador.Colaborador_Region)[0].Region_Descripcion;
      var colaboradorAreaDescripcion = this.colaboradoresAreas.filter(area => area.Colaborador_Area_Key == this.colaborador.Colaborador_Area)[0].Colaborador_Area_Descripcion;
      var colaboradorPuestoDescripcion = this.colaboradoresPuestos.filter(puesto => puesto.Colaborador_Puesto_Key == this.colaborador.Colaborador_Puesto)[0].Colaborador_Puesto_Descripcion;
      var empresaDescripcion = this.empresas.filter(empresa => empresa.Empresa_Key == this.colaborador.Colaborador_Empresa)[0].Empresa_Descripcion;
      var calendarioDescripcion = this.calendarios.filter(calendario => calendario.Calendario_Key == this.colaborador.Colaborador_Calendario)[0].Calendario_Descripcion;
      var tipoDescripcion = this.tipos.filter(tipo => tipo.Tipo_Colaborador_Key == this.colaborador.Colaborador_Tipo)[0].Tipo_Colaborador_Descripcion;
      var responsableDescripcion = this.colaboradores.filter(responsable => responsable.Colaborador_Key == this.colaborador.Colaborador_Responsable)[0].Colaborador_Descripcion;
      this.colaborador.Colaborador_Region = regionDescripcion;
      this.colaborador.Colaborador_Area = colaboradorAreaDescripcion;
      this.colaborador.Colaborador_Empresa = empresaDescripcion;
      this.colaborador.Colaborador_Puesto = colaboradorPuestoDescripcion;
      this.colaborador.Colaborador_Calendario = calendarioDescripcion
      this.colaborador.Colaborador_Tipo = tipoDescripcion
      this.colaborador.Colaborador_Responsable = responsableDescripcion
    },
  mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
        }
  },
};
</script>
