<template>
    <v-content>
      <v-container fluid >
        <loader :loader="loader" style="position: fixed;"/>
        <div v-if="!loader && permisoCreacionColaborador()">       
            <b-form-row>
              <b-col class="col-9">
                <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
              </b-col>
              <b-col class="col-2 ">
                <b-row>
                <v-btn @click="guardar()" :disabled="!isFormValid && permisoCreacionColaborador()"  color="#2991C6" dark >Guardar</v-btn>
                <v-btn @click="back()"  color="#ffa025" dark class="ml-3">Volver</v-btn>
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
                    style="margin-top:1rem"
                    :rules="[rules.checkEmpty]">
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
                    style="margin-top:1rem"
                    :rules="[rules.checkEmpty]">
                  </v-text-field>
                </b-col>
                <b-col>
                  <v-autocomplete
                    dense
                    :disabled="!seguridadColaboradoresEditar()"
                    outlined
                    v-model="colaborador.Usuario"
                    :items="usuarios"
                    label="Usuario Asociado"
                    style="margin-top:1rem"
                    item-text="Usuario_Codigo"
                    :return-object="true"
                    :rules="[rules.checkSelection]">
                  </v-autocomplete>
                </b-col>
                <b-col>
                  <v-autocomplete
                    dense
                    :disabled="!seguridadColaboradoresEditar()"
                    outlined
                    v-model="colaborador.Responsable"
                    :items="colaboradores"
                    label="Responsable"
                    style="margin-top:1rem"
                    item-text="Colaborador_Descripcion"
                    :return-object="true"
                    :rules="[rules.checkSelection]">
                  </v-autocomplete>
                </b-col>          
            </b-form-row>
  
            <b-form-row class="ml-1 mr-1 mt-n6">
              <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Region"
                  :items="regiones"
                  label="Región"
                  placeholder="Selecciona..."
                  item-text="Region_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
                   <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Calendario"
                  :items="calendarios"
                  label="Calendario"
                  placeholder="Selecciona..."
                  item-text="Calendario_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
               <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Area"
                  :items="colaboradoresAreas"
                  label="Área"
                  placeholder="Selecciona..."
                  item-text="Colaborador_Area_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
                <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Ceco"
                  :items="cecos"
                  label="Ceco"
                  placeholder="Selecciona..."
                  item-text="Ceco_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
            </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n6">
              <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Puesto"
                  :items="colaboradoresPuestos"
                  label="Puesto"
                  placeholder="Selecciona..."
                  item-text="Colaborador_Puesto_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
              <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Categoria"
                  :items="categorias"
                  label="Categoría"
                  placeholder="Selecciona..."
                  item-text="Colaborador_Categoria_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
         <b-col class="col-3">
                <v-select
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Tipo"
                  :items="tipos"
                  label="Tipo"
                  placeholder="Selecciona..."
                  item-text="Tipo_Colaborador_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
                <b-col class="col-3">
                <v-autocomplete
                  dense
                  :disabled="!seguridadColaboradoresEditar()"
                  outlined
                  v-model="colaborador.Empresa"
                  :items="empresas"
                  label="Empresa"
                  item-text="Empresa_Descripcion"
                  :return-object="true"
                  placeholder="Selecciona..."
                  :rules="[rules.checkSelection]">
                </v-autocomplete>
              </b-col>
            </b-form-row>
            <b-form-row class="ml-1 mr-1 mt-n6">
              <b-col class="col-3">
                <v-text-field
                  :disabled="!seguridadColaboradoresEditar()"
                  label="Horas Diarias"
                  v-model="colaborador.Horas"
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
                  v-model="colaborador.Unidad_Negocio"
                  :items="unidadesNegocio"
                  label="Unidad de Negocio"
                  placeholder="Selecciona..."
                  item-text="Unidad_Negocio_Descripcion"
                  :return-object="true"
                  :rules="[rules.checkSelection]">
                </v-select>
              </b-col>
            <b-col class="col-3">
                <v-select
                  dense
                  :disabled="true"
                  outlined
                  v-model="colaborador.Colaborador_Estado"
                  :items="[{est:'Activo', cod:1}, {est:'Inactivo', cod:2}]"
                  item-text="est"
                  item-value="cod"
                  label="Estado"
                  placeholder="Selecciona..."
                  >
                </v-select>
              </b-col>
                 <b-col>
                <v-text-field
                  :disabled="!seguridadColaboradoresEditar()"
                  label="ID Externo"
                  v-model="colaborador.Colaborador_ID_Externo"
                  outlined
                  placeholder="Sin asignar"
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
                        :disabled="true"
                        class="mt-n1 p-2"
                        v-model="switch1"
                        inset
                      ></v-switch>
                </b-row>
               <b-row class="mt-n3">
                  <v-select
                      v-model="colaborador.Funciones"
                      :items="this.funciones"
                      chips
                      label="Funciones Asignadas"
                      placeholder="El colaborador no tiene funciones asignadas"
                      multiple
                      outlined
                      item-text="Funcion_Descripcion"
                    :return-object="true"
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
        </div>
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
  import loader from '../../Estado/loader'
  import {isFieldEmpty, isNotSelected} from '../../../validations/validations'
  const ip = require('../../../ip/ip')
  
  export default {
    name: "editColaborador",
    props: {
      colaborador_usuario: ""
    },
    components: {loader},
    data: () => ({
  
      colaborador: {},
      usuarios: [],
      colaboradores: [],
      regiones: [],
      calendarios:[],
      colaboradoresAreas:[],
      cecos: [],
      colaboradoresPuestos:[],
      categorias:[],
      tipos:[],
      empresas:[],
      unidadesNegocio:[],
      funciones:[],
      funcionesOriginales:[],
      responsables: [],
      actualCode: null,
      actualUser:null, 
      dialogGuardar: false,
      alert: false,
      dialogCancelar: false,
      loader: true,
      switch1: true,
      isloading: false,
      isFormValid: false,
      rules: {
              checkEmpty: isFieldEmpty,
              checkSelection: isNotSelected,

          }
      }),
  
      watch: {
          colaborador: {
          handler: 'validateForm',
          deep: true,
          immediate: false,
          include: [
              'Colaborador_Codigo',
              'Colaborador_Descripcion',
              'Usuario',
          ]
       }
      },
    
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
        this.loadColaboradores()
        this.colaborador.Colaborador_Estado = 1;
        this.loadUsuarios()
        this.loadRegions()
        this.loadCalendars()

        this.loadColaboradoresAreas()
        this.loadCecos()   
        this.loadColaboradoresPuestos()    
        this.loadCategorias()
        this.loadColaboradoresTipos()
        this.loadEmpresas()
        this.loadUnidadesDeNegocio()
        this.loadColaboradoresFunciones()
        this.loader = false
      },
      
      async wait(time) {
        return new Promise(resolve => {
          setTimeout(() => {
          resolve();
          }, time);
        })
      },
      
      validateForm() {
            this.isFormValid = this.$refs.form.validate()
          },    
  
  
      loadUsuarios(){
          axios.get(ip+"/usuarios/enabled/"+2).then((response) => {
          this.usuarios = response.data;
        })
      },
  
  
      async loadColaboradores(){
          this.isloading = true
          await axios.get(ip+"/colaboradores").then((response) => {
            this.colaboradores = response.data
          })       
      },

  
      async loadRegions() {
        await axios.get(ip+"/regiones/").then((response) => {
            this.regiones = response.data;
          });
      },
  
      async loadCalendars() {
        await axios.get(ip+"/calendarios/descripciones").then((response) => {
            this.calendarios = response.data;
          });
        },
  
        async loadColaboradoresAreas() {
          await axios.get(ip+"/colaboradores_areas/").then((response) => {
              this.colaboradoresAreas = response.data;
            });
        },
  
        async loadCecos(){
          await axios.get(ip+"/ceco").then((response) => {
              this.cecos = response.data;
              
            });
        },
  
        async loadColaboradoresPuestos() {
          await axios.get(ip+"/colaboradores_puestos").then((response) => {
              this.colaboradoresPuestos = response.data;
            });
        },
  
        async loadCategorias() {
          await axios.get(ip+"/colaboradores_categorias").then((response) => {
              this.categorias = response.data;
            });
        },
  
        async loadColaboradoresTipos(){
          await axios.get(ip+"/tipos_colaboradores").then((response) => {
              this.tipos = response.data;
            });
        },
  
        async loadEmpresas(){
        await axios.get(ip+"/empresas").then((response) => {
          this.empresas = response.data;
        })
      },
       
      async loadUnidadesDeNegocio(){
        await axios.get(ip+"/unidades_negocios/").then((response) => {
          this.unidadesNegocio = response.data;
        })
      },
  
      async loadColaboradoresFunciones(){
         await axios.get(ip+"/funciones/").then((response) => {
            this.funciones = response.data;           
          });
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
  
      async guardar() {
            if (!(this.colaboradores.some((item) => item.Colaborador_Codigo === this.colaborador.Colaborador_Codigo))){
              if (!(this.colaboradores.some((item) => item.Colaborador_Usuario === this.colaborador.Usuario.Usuario_Key))) {
                this.colaborador.Usuario_Creacion = parseInt(localStorage.usuario_id)
                console.log(this.colaborador)
                await axios.post(ip + "/colaboradores/", this.colaborador);
                await axios.post(ip + "/colaboradores_horas/", this.colaborador);
                
                const response = await axios.get(ip + "/colaboradores/getlastid/" + this.colaborador.Usuario.Usuario_Key);
                
                console.log(response.data);
                this.colaborador.Colaborador_Key = response.data.Colaborador_Key;
                this.guardarfunciones(this.colaborador.Colaborador_Key);
                console.log(this.colaborador);
                this.showSuccessDialog();
                      
                }
              else{
                alert('El usuario se encuentra asociado a otro colaborador')
              }
            }
            else{
              alert('El codigo de colaborador ya existe.')
            }

        },
  
        guardarfunciones(id){
           var newFunciones = this.colaborador.Funciones
           if (newFunciones) {
              for (let i=0; i < newFunciones.length; i++) {
                var newColaboradorFuncion = {
                  Colaborador_Funcion_Funcion_Key: newFunciones[i].Funcion_Key,
                  Colaborador_Funcion_Descripcion: this.colaborador.Colaborador_Codigo + ' - ' + newFunciones[i].Funcion_Codigo,
                  Colaborador_Funcion_Colaborador_Key: this.colaborador.Colaborador_Key,
                  Usuario_Creacion: parseInt(localStorage.usuario_id)
                }
                axios.post(ip+"/colaboradores_funciones/", newColaboradorFuncion);
            }}
        },
  
        showSuccessDialog(){
              alert('Se ha registrado un nuevo colaborador')
              setTimeout(() => {
                  this.loader = true
                  window.location.href = '/colaboradoresHierarchy';
              }, 3000);
          }, 
  
     
      back(){
        this.$router.push({path:'/colaboradoresHierarchy'})
      },
      
      permisoCreacionColaborador(){
          return localStorage.Permisos.includes("P125")
        },

    
    },
  };
  </script>