<template>
  <v-content>
    <v-container fluid >
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
          
          <b-form-row>
            <b-col class="col-9">
              <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
            </b-col>
            <b-col class="col-2 ">
              <b-row>
              <v-btn @click="evalGuardar()" :disabled="!seguridadColaboradoresEditar()"  color="#2991C6" dark >Guardar</v-btn>
              <v-btn @click="back()" :disabled="!seguridadColaboradoresLeer()"   color="#ffa025" dark class="ml-3">Volver</v-btn>
              </b-row>
            </b-col>             
          </b-form-row>

          <v-card class="pa-2 mt-4 mr-10 " max-width="1650" outlined tile>
            <v-form ref="form">
            <b-form-row class="ml-1 mr-1">
              <b-col class="col-1">
                <v-text-field
                  outlined
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  v-model="colaborador.Colaborador_Codigo"
                  label="Código"
                  placeholder="Escribe..."
                  style="margin-top:1rem">
                </v-text-field>
              </b-col>
              <b-col>
                <v-text-field
                  outlined
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  v-model="colaborador.Colaborador_Descripcion"
                  label="Nombre Completo"
                  placeholder="Escribe..."
                  style="margin-top:1rem">
                </v-text-field>
              </b-col>
              <b-col>
                <v-autocomplete
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Colaborador_Usuario"
                  :items="usuarioCodigos"
                  label="Usuario Asociado"
                  style="margin-top:1rem">
                </v-autocomplete>
              </b-col>
              <b-col>
                <v-autocomplete
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Colaborador_Responsable"
                  :items="colaboradoresDescripciones"
                  label="Responsable"
                  style="margin-top:1rem">
                </v-autocomplete>
              </b-col>          
          </b-form-row>

          <b-form-row class="ml-1 mr-1 mt-n6">
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Region"
                :items="regionesDescripciones"
                label="Región"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Calendario"
                :items="calendariosDescripciones"
                label="Calendario"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Area"
                :items="colaboradoresAreasDescripciones"
                label="Área"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Ceco"
                :items="Cecoitems"
                item-text="ceco"
                item-value="cod"
                label="Ceco"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
          </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n6">
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Puesto"
                :items="colaboradoresPuestosDescripciones"
                label="Puesto"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Categoria"
                :items="Catitems"
                item-text="cat"
                item-value="cod"
                label="Categoría"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Tipo"
                :items="tiposDescripciones"
                label="Tipo"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-autocomplete
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Empresa"
                :items="empresasDescripciones"
                label="Empresa">
              </v-autocomplete>
            </b-col>
          </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n6">
            <b-col class="col-3">
              <v-text-field
                :disabled="!seguridadColaboradoresEditar()"
                label="Horas Diarias"
                v-model="colaborador_hora"
                type="number"
                outlined
                min="0"
                dense>
              </v-text-field>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Unidad_Negocio"
                :items="[{un:'No aplica', cod:1}, {un:'SAP', cod:2},{un:'SDM', cod:3}, {un:'Tableau', cod:4}, {un:'Volume Distributor', cod:5}, {un:'Nuvol', cod:6}, {un:'Soluciones Cloud', cod:7}, {un:'Innovación', cod:8}]"
                item-text="un"
                item-value="cod"
                label="Unidad de Negocio"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col class="col-3">
              <v-select
                dense
                :disabled="!seguridadColaboradoresEditar()"
                outlined
                v-model="colaborador.Colaborador_Estado"
                :items="[{est:'Activo', cod:1}, {est:'Inactivo', cod:2}]"
                item-text="est"
                item-value="cod"
                label="Estado"
                placeholder="Selecciona...">
              </v-select>
            </b-col>
            <b-col>
              <v-text-field
                :disabled="!seguridadColaboradoresEditar()"
                label="ID Externo"
                v-model="colaborador.Colaborador_ID_Externo"
                outlined
                placeholder="Escribe..."
                dense>
              </v-text-field>
            </b-col>
          </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n6">
            <b-col class="col-7">
              <v-textarea
                outlined
                v-model="colaborador.Colaborador_Observacion"
                name="input-7-4"
                label="Observaciones"
                placeholder="Escribe..."
                auto-grow
                rows="6"
                row-height="20"
                counter="1000"
                max-length="1000"
              ></v-textarea>
            </b-col>
            <b-col class="col-4 ml-10">    
              <b-row class="mt-1 mb-3">            
                <h6 class="mr-3 mt-2" >Habilitar/Deshabilitar</h6>
                    <v-switch 
                      :disabled="!seguridadColaboradoresEditar()"
                      class="mt-n1 p-2"
                      v-model="switch1"
                      inset
                    ></v-switch>
              </b-row>
              <b-row class="mt-n3">
                <v-select
                    v-model="colaborador.Colaborador_Funciones"
                    :items="this.funciones"
                    item-text="name"
                    item-value="id"
                    chips
                    label="Funciones Asignadas"
                    placeholder="El colaborador no tiene funciones asignadas"
                    multiple
                    outlined
              ></v-select>
              </b-row>
            </b-col>         
          </b-form-row> 
            </v-form>         
          </v-card>


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
  min-width: 100vw;
}
.labelT{
  margin-left :30px;
  
  
}
.labelT2{
  margin-left:1rem;
}
.labelText{
  float: left;
}
.labelText3{
  float: left;
  margin-top: 1rem;
  margin-left:1rem;
}
.labelText4{
  float: left;
  margin-top: 1rem;
  margin-left:7rem;
}
.labelTextv2{
  float: left;
  margin-right: 25px;
}
</style>


<script>
import axios from "axios";
import { runInThisContext } from "vm";
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
export default {
  name: "editColaborador",
  props: {
    colaborador_usuario: ""
  },
  components: {loader
              },
  data: () => ({
    // Enums para Ceco y Categoria
    Cecoitems: [
          { ceco: 'No Aplica', cod: 1 },
          { ceco: 'Administracion', cod: 2 },
          { ceco: 'Preventa', cod: 3 },
          { ceco: 'Comercial', cod: 4 },
          { ceco: 'Controlling', cod: 5 },
          { ceco: 'IT', cod: 6 },
          { ceco: 'RRHH', cod: 7 },
          { ceco: 'Estructura', cod: 8 },
          { ceco: 'Marketing', cod: 9 },
          { ceco: 'Consultoria', cod: 10 },
          { ceco: 'Innovacion', cod: 11 },
        ],
    
 
    Catitems: [
          { cat: 'Gerente', cod: 1 },
          { cat: 'Lider', cod: 2 },
          { cat: 'Consultor', cod: 3 },
          { cat: 'Analista', cod: 4 },
          { cat: 'Preventa', cod: 5 },
          { cat: 'No aplica', cod: 6 },
          { cat:'Trainee', cod: 7}
  ],
    
              
    Unitems: [
      {un:'No aplica', cod:1},
      {un:'SAP', cod:2},
      {un:'SDM', cod:3}, 
      {un:'Tableau', cod:4}, 
      {un:'Volume Distributor', cod:5}, 
      {un:'Nuvol', cod:6}, 
      {un:'Soluciones Cloud', cod:7}, 
      {un:'Innovación', cod:8}
    ],
          
    codigoViejo: '',
    //Reglas de agregado y editado
    //Elemento que se va a guardar con el UPDATE
    selected : [],
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
        Colaborador_Funcion : 'no aplica',
        Colaborador_Hora: 0,
        Usuario_Creacion: 1,
        Colaborador_Ceco: '',
        Colaborador_Categoria: '',
        Colaborador_Estado: '',
        Colaborador_Unidad_Negocio: '',
        Colaborador_ID_Externo: '',
        Colaborador_Observacion: '',
    },
    usuarioCodigos : [],
    originalCodigo: "",
    originalKeyUser: 0,
    colaboradoresCodigos: [],
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
    colaborador_hora: 0,
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
    switch1: false,
    isloading: false
    }),
  
  //Ciclo de vida del componente
  created(){
      this.initialize();
  },
  mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
  },
//Definicion de metodos 
  methods: {
    async initialize(){
      await      this.loadUsuarios()
      await     this.loadEmpresas()
      await     this.loadRegions()
      await     this.loadCalendars()
      await    this.loadColaboradoresTipos()
      await   this.loadColaboradoresAreas()
      await      this.loadColaboradoresPuestos()
      await this.loadColaboradores()
      await this.loadColaboradoresFunciones()
      
      this.asignarDescripciones();
      this.asignarFunciones()
      this.loader = false
    },
    
    async wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
        resolve();
        }, time);
      })
    },
    async loadColaboradores(){
        this.isloading = true
        await axios.get(ip+"/colaboradores").then((response) => {
        this.colaboradores = response.data;
        this.colaboradoresFiltrado = this.colaboradores.filter(colaborador => colaborador.Colaborador_Key != this.$store.state.colaborador.id).filter(colaborador => colaborador.Visible === 'X')
        this.colaboradoresCodigos = _.cloneDeep(this.colaboradoresFiltrado.map(colaborador => colaborador.Colaborador_Codigo))
        
        this.colaboradoresDescripciones = this.colaboradoresFiltrado.map(
          (colaborador) => colaborador.Colaborador_Descripcion
        ).sort()
        })       
        this.isloading = false     
    },
    async loadUsuarios(){
      await axios.get(ip+"/usuarios").then((response) => {
        this.usuarios = response.data;
        this.usuariosFiltrado = this.usuarios.filter(usuario => usuario.Usuario_Habilitado === 'X')
        this.usuarioCodigos = this.usuariosFiltrado.map((usuario) => usuario.Usuario_Mail).sort()
        this.usuariosDescripciones = this.usuariosFiltrado.map(
          (usuario) => usuario.Usuario_Codigo
        ).sort();
      })
    },
    async loadEmpresas(){
      await axios.get(ip+"/empresas").then((response) => {
        this.empresas = response.data;
        this.empresasFiltrado = this.empresas.filter(empresa => empresa.Visible === 'X')
        this.empresasDescripciones = this.empresasFiltrado.map(
          (empresa) => empresa.Empresa_Descripcion
        ).sort();
      })
    },
    async loadRegions() {
      await axios.get(ip+"/regiones/descripciones")
        .then((response) => {
          this.regiones = response.data;
          this.regionesDescripciones = response.data.map(
            (region) => region.Region_Descripcion
          ).sort();
        });
    },
    async loadCalendars() {
      await axios.get(ip+"/calendarios/descripciones")
        .then((response) => {
          this.calendarios = response.data;
          this.calendariosDescripciones = response.data.map((calendario) => calendario.Calendario_Descripcion);
        });
      },
      async loadColaboradoresAreas() {
        await axios.get(ip+"/colaboradores_areas/descripciones")
          .then((response) => {
            this.colaboradoresAreas = response.data;
            this.colaboradoresAreasDescripciones = response.data.map((area) => area.Colaborador_Area_Descripcion);
          });
      },
      async loadColaboradoresPuestos() {
      await axios.get(ip+"/colaboradores_puestos/descripciones")
        .then((response) => {
          this.colaboradoresPuestos = response.data;
          this.colaboradoresPuestosDescripciones = response.data.map((puesto) => puesto.Colaborador_Puesto_Descripcion);
        });
      },
      async loadColaboradoresTipos(){
      await axios.get(ip+"/tipos_colaboradores/descripciones")
        .then((response) => {
          this.tipos = response.data;
          this.tiposDescripciones = this.tipos.map((tipo) => tipo.Tipo_Colaborador_Descripcion);
        });
      },
      async loadColaboradoresFunciones(){
       await axios.get(ip+"/funciones/descripciones")
        .then((response) => {
          this.funciones = response.data;
          this.funcionesDescripciones = response.data.map((funcion) => funcion.name);
        });
      },
      evalGuardar() {
          if(this.colaborador.Colaborador_Codigo != this.originalCodigo){
            if(this.colaboradoresCodigos.includes(this.colaborador.Colaborador_Codigo)){
              alert("El código ya existe")
            } else{
             
              this.guardar()
            }
          } else this.guardar()
     },
      async guardar() {
          await this.guardarHoras()
          var newUserMail = {
            Usuario_Mail : this.colaborador.Colaborador_Usuario
          }
          await axios.patch(ip+"/usuarios/"+this.originalKeyUser, newUserMail).then((response) =>{
          })
          this.asignarKeys()
          await this.guardarFunciones()
          var newEstado = {Usuario_Habilitado : this.colaborador.Visible}         
          await axios.patch(ip+"/usuarios/"+this.originalKeyUser, newEstado).then((response) =>{})
          
          await axios.patch(ip+"/colaboradores/"+this.colaborador.Colaborador_Usuario, this.colaborador)
          .then((response) => {
            this.alert = true
            setTimeout(() => {this.alert = false
             this.$router.push({path: "/colaboradoresHierarchy"})}, 2000)
          })
          .catch(err =>{
            alert('No se ha podido actualizar. El Cliente ya existe')
            this.asignarDescripciones()
            throw new Error('El colaborador ya existe')
          })
      },
      async deleteFunciones(){
        if(this.colaborador.Funcion.length > 0){
        await axios.delete(ip+'/colaboradores_funciones/'+this.colaborador.Colaborador_Key).then((response) => {
           
        })
        }
      },
      async guardarHoras(){
        var usuarioKey = this.usuarios.filter(usuario => usuario.Usuario_Mail == this.colaborador.Colaborador_Usuario)[0].Usuario_Key
        let hora = {Colaborador_Hora_Usuario : usuarioKey,
                    Colaborador_Hora_Dia : parseInt(this.colaborador_hora)}
        await axios.patch(ip+"/colaboradores_horas/"+usuarioKey, hora)
          .then((response) => {
           
        })
      },
      async guardarFunciones(){
        
      var pedido =
         {
          Colaborador_Funcion_Funcion_Key  : '',
          Colaborador_Funcion_Descripcion : '',
          Colaborador_Funcion_Colaborador_Key : '',
          Usuario_Creacion : 1 ,
          Usuario_Modificacion : 1,
          Visible : 'X'
          }
          this.deleteFunciones();
          	
          
          if (this.colaborador.Colaborador_Funciones != null){
            for ( var i  = 0 ; i < (this.colaborador.Colaborador_Funciones).length ; i++){
              if(typeof(this.colaborador.Colaborador_Categoria) === "number"){
                var key = this.colaborador.Colaborador_Funciones[i].id
              }
              else{
                var key = this.colaborador.Colaborador_Funciones[i]
              }
              pedido.Colaborador_Funcion_Funcion_Key = key,
              pedido.Colaborador_Funcion_Descripcion = this.colaborador.Colaborador_Codigo + ' - ' + (this.funciones[key-1]).cod,
              pedido.Colaborador_Funcion_Colaborador_Key = this.colaborador.Colaborador_Key;
              await axios.post(ip+'/colaboradores_funciones/', pedido).then((response) => response  )
                
                 
            }            
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
    seguridadColaboradoresEditar(){
       if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P45') || localStorage.Permisos.includes('P46') 
    },
    seguridadColaboradoresLeer(){
       if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P41') || localStorage.Permisos.includes('P42') 
    },
    asignarKeys(){
      let regionKey = this.regiones.filter(region => region.Region_Descripcion == this.colaborador.Colaborador_Region)[0].Region_Key
      let areaKey = this.colaboradoresAreas.filter(area => area.Colaborador_Area_Descripcion == this.colaborador.Colaborador_Area)[0].Colaborador_Area_Key
      let puestoKey = this.colaboradoresPuestos.filter(puesto => puesto.Colaborador_Puesto_Descripcion == this.colaborador.Colaborador_Puesto)[0].Colaborador_Puesto_Key
      let empresaKey = this.empresas.filter(empresa => empresa.Empresa_Descripcion == this.colaborador.Colaborador_Empresa)[0].Empresa_Key;
      let calendarioKey = this.calendarios.filter(calendario => calendario.Calendario_Descripcion == this.colaborador.Colaborador_Calendario)[0].Calendario_Key;
      let tipoKey = this.tipos.filter(tipo => tipo.Tipo_Colaborador_Descripcion == this.colaborador.Colaborador_Tipo)[0].Tipo_Colaborador_Key;
      let responsableKey = this.colaboradores.filter(colaborador => colaborador.Colaborador_Descripcion == this.colaborador.Colaborador_Responsable)[0].Colaborador_Key;     
      this.colaborador.Colaborador_Region = regionKey;
      this.colaborador.Colaborador_Area = areaKey;
      this.colaborador.Colaborador_Empresa = empresaKey;
      this.colaborador.Colaborador_Puesto = puestoKey;
      this.colaborador.Colaborador_Calendario = calendarioKey
      this.colaborador.Colaborador_Tipo = tipoKey
      this.colaborador.Colaborador_Responsable = responsableKey
      this.colaborador.Colaborador_Usuario = this.originalKeyUser
      
      //Formateo de datos de enums
      //(Si no se modifica el Ceco, el tipo de datos asignado al select es un diccionario)
      if (typeof(this.colaborador.Colaborador_Ceco) === "number"){
        this.colaborador.Ceco_Key = this.colaborador.Colaborador_Ceco
      }
      else{
        this.colaborador.Ceco_Key = this.colaborador.Colaborador_Ceco.cod
      }
      //(Si no se modifica la categoría, el tipo de datos asignado al select es un diccionario)
      if (typeof(this.colaborador.Colaborador_Categoria) === "number"){
        this.colaborador.Colaborador_Categoria_Key = this.colaborador.Colaborador_Categoria
      }
      else{
        this.colaborador.Colaborador_Categoria_Key  = this.colaborador.Colaborador_Categoria.cod
      }
      //Habilitar/Deshabilitar
      if(this.switch1){
        this.colaborador.Visible = 'X'
      }
      else{
        this.colaborador.Visible = null
      }
      
    },

    validatedFields(col){
    var  colaborador = col
      if(colaborador.Colaborador_Responsable===null && colaborador.Colaborador_Key!==41){
        colaborador.Colaborador_Responsable= 436
    }
    if(colaborador.Colaborador_Region === null){
      colaborador.Colaborador_Region = 1
    }
    if(colaborador.Colaborador_Area ===null){
      colaborador.Colaborador_Area = 1 
    }
    if(colaborador.Colaborador_Puesto ===null){
      colaborador.Colaborador_Puesto = 1 
    }
    if(colaborador.Colaborador_Tipo ===null){
      colaborador.Colaborador_Tipo = 1 
    }
    if(colaborador.Colaborador_Empresa ===null){
      colaborador.Colaborador_Empresa = 140
    }
    if(colaborador.Colaborador_Estado ===null){
      colaborador.Colaborador_Estado = 2
    }
    if(colaborador.Colaborador_Codigo ===null){
      colaborador.Colaborador_Codigo = "No tiene"
    }
    if(colaborador.Colaborador_Descripcion ===null){
      colaborador.Colaborador_Descripcion = "No tiene"
    }
    if(colaborador.Colaborador_Unidad_Negocio ===null){
      colaborador.Colaborador_Unidad_Negocio = 1
    }
    if(colaborador.Colaborador_Calendario ===null){
      colaborador.Colaborador_Calendario = 1
    }
    if(colaborador.Colaborador_Ceco_key ===null){
      colaborador.Colaborador_Ceco_key = 1
    }
    if(colaborador.Colaborador_Categoria_Key ===null){
      colaborador.Colaborador_Calendario = 6
    }
    return colaborador
    },
    asignarDescripciones(){
      this.colaborador = _.cloneDeep(this.colaboradores.filter(colaborador => colaborador.Colaborador_Key == this.$store.state.colaborador.id))[0]
      this.colaborador = this.validatedFields(this.colaborador)
      this.originalKeyUser = this.colaborador.Colaborador_Usuario
      let regionDescripcion = this.regiones.filter(region => region.Region_Key == this.colaborador.Colaborador_Region)[0].Region_Descripcion;
      let colaboradorAreaDescripcion = this.colaboradoresAreas.filter(area => area.Colaborador_Area_Key == this.colaborador.Colaborador_Area)[0].Colaborador_Area_Descripcion;
      let colaboradorPuestoDescripcion = this.colaboradoresPuestos.filter(puesto => puesto.Colaborador_Puesto_Key == this.colaborador.Colaborador_Puesto)[0].Colaborador_Puesto_Descripcion;
      let empresaDescripcion = this.empresas.filter(empresa => empresa.Empresa_Key == this.colaborador.Colaborador_Empresa)[0].Empresa_Descripcion;
      let calendarioDescripcion = this.calendarios.filter(calendario => calendario.Calendario_Key == this.colaborador.Colaborador_Calendario)[0].Calendario_Descripcion;
      let tipoDescripcion = this.tipos.filter(tipo => tipo.Tipo_Colaborador_Key == this.colaborador.Colaborador_Tipo)[0].Tipo_Colaborador_Descripcion;
      let responsableDescripcion = this.colaboradores.filter(colaborador => colaborador.Colaborador_Key == this.colaborador.Colaborador_Responsable)[0].Colaborador_Descripcion;
      let usuarioDescripcion = this.usuarios.filter(usuario => usuario.Usuario_Key == this.colaborador.Colaborador_Usuario)[0].Usuario_Mail
      
      this.colaborador.Colaborador_Region = regionDescripcion;
      this.colaborador.Colaborador_Area = colaboradorAreaDescripcion;
      this.colaborador.Colaborador_Empresa = empresaDescripcion;
      this.colaborador.Colaborador_Puesto = colaboradorPuestoDescripcion;
      this.colaborador.Colaborador_Calendario = calendarioDescripcion
      this.colaborador.Colaborador_Tipo = tipoDescripcion
      this.colaborador.Colaborador_Responsable = responsableDescripcion
      this.colaborador.Colaborador_Usuario = usuarioDescripcion
      this.colaborador_hora = this.$store.state.colaborador.horas
      this.colaborador.Usuario_Modificacion = localStorage.usuario_id
      this.originalCodigo = this.colaborador.Colaborador_Codigo
      this.colaborador.Colaborador_Ceco = { ceco: this.Cecoitems[this.colaborador.Ceco_Key - 1].ceco, cod: this.colaborador.Ceco_Key }
      this.colaborador.Colaborador_Categoria = { cat: this.Catitems[this.colaborador.Colaborador_Categoria_Key - 1].cat, cod: this.colaborador.Colaborador_Categoria_Key }
      
      if(this.colaborador.Visible === 'X'){
        this.switch1 = true;
      }     
    },
    asignarFunciones(){
      var funciones = []
      if(this.colaborador.Funcion.length >= 1){
        for(var i = 0 ; i < this.colaborador.Funcion.length ; i++){
          funciones.push(this.funciones.filter(f => f.id == this.colaborador.Funcion[i].Colaborador_Funcion_Funcion_Key)[0])
        }
       this.colaborador.Colaborador_Funciones = funciones
      }
    },
    back(){
      this.$router.push({path:'/colaboradoresHierarchy'})
    }
  
  },
};
</script>