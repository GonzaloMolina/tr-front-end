<template>
  <v-content>
    <v-container fluid >
      <loader :loader="loader" style="position: fixed;"/>
      <div v-if="!loader">
        <div class="alert alert-primary mt-3" role="alert" style="display: none;">
                Se guardaron los cambios.
            </div>
          
          <b-form-row>
            <b-col class="col-9">
              <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
            </b-col>
            <b-col class="col-2 ">
              <b-row>
              <v-btn @click="guardar()" :disabled="!seguridadColaboradoresEditar()"  color="#2991C6" dark >Guardar</v-btn>
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
                  style="margin-top:1rem"
                  :rules="[rules.checkEmpty, rules.checkIfCodeExists]">
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
                  :rules="[rules.checkSelection, rules.checkIfUserExists]">
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
                  :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
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
                :return-object="true">
              </v-autocomplete>
            </b-col>
          </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n6">
            <b-col class="col-3">
              <v-text-field
                :disabled="!seguridadColaboradoresEditar()"
                label="Horas Diarias"
                v-model="colaborador.Horas.Colaborador_Hora_Dia"
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
                :return-object="true">>
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
                      :disabled="!seguridadColaboradoresEditar()"
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
  components: {loader
              },
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
    switch1: false,
    isloading: false,
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
      this.rules = {
            checkEmpty: isFieldEmpty,
            checkSelection: isNotSelected,
            checkIfCodeExists: (value) => {
                const exists = this.colaboradores.some((item) => item.Colaborador_Codigo === value && item.Colaborador_Codigo != this.actualCode);
                return exists ? "El código ya existe" : true;
            },
            checkIfUserExists: (value) => {
                const exists = this.colaboradores.some((item) => item.Colaborador_Usuario === value.Usuario_Key && item.Colaborador_Usuario != this.actualUser);
                return exists ? "Ya existe un colaborador asociado a ese usuario" : true;
            }
        }
      if(!localStorage.login){
        this.$router.push("/login");
      }
  },
//Definicion de metodos 
  methods: {
    async initialize(){
      this.loadColaborador()
      this.loadColaboradores()
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

    loadColaborador(){
      axios.get(ip+"/colaboradores/colaborador/"+ this.$store.state.colaborador.id).then((response) => {
                this.colaborador = response.data
                this.getHorasColaborador()
                this.getVisibleColaborador()   
                this.actualCode = this.colaborador.Colaborador_Codigo,
                this.actualUser = this.colaborador.Colaborador_Usuario,           
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
      });

    },

    loadUsuarios(){
        axios.get(ip+"/usuarios/enabled/"+this.colaborador.Usuario.Usuario_Key).then((response) => {
        this.usuarios = response.data;
      })
    },


    async loadColaboradores(){
        this.isloading = true
        await axios.get(ip+"/colaboradores").then((response) => {
          this.colaboradores = response.data
          this.colaborador.Responsable = this.colaboradores.find((c) => this.colaborador.Colaborador_Responsable === c.Colaborador_Key);

          const index = this.colaboradores.findIndex(c => c.Colaborador_Key === this.colaborador.Colaborador_Key);
          this.colaboradores.splice(index, 1);
        })       
    },

    getHorasColaborador(){
      axios.get(ip+"/colaboradores_horas/"+this.colaborador.Usuario.Usuario_Key).then((response) => {
        this.colaborador.Horas =  response.data
      })
    },
    
    getVisibleColaborador(){
        if(this.colaborador.Visible == 'X'){
          this.switch1 = true
        }
        else{
          this.switch1 = false
        }
    },

    async loadRegions() {
      await axios.get(ip+"/regiones/enabled/"+this.colaborador.Region.Region_Key).then((response) => {
          this.regiones = response.data;
        });
    },

    async loadCalendars() {
      await axios.get(ip+"/calendarios/descripciones").then((response) => {
          this.calendarios = response.data;
        });
      },

      async loadColaboradoresAreas() {
        await axios.get(ip+"/colaboradores_areas/enabled/"+this.colaborador.Area.Colaborador_Area_Key).then((response) => {
            this.colaboradoresAreas = response.data;
          });
      },

      async loadCecos(){
        await axios.get(ip+"/ceco/enabled/"+this.colaborador.Ceco.Ceco_Key).then((response) => {
            this.cecos = response.data;
            
          });
      },

      async loadColaboradoresPuestos() {
        await axios.get(ip+"/colaboradores_puestos/enabled/"+this.colaborador.Puesto.Colaborador_Puesto_Key).then((response) => {
            this.colaboradoresPuestos = response.data;
          });
      },

      async loadCategorias() {
        await axios.get(ip+"/colaboradores_categorias/enabled/"+this.colaborador.Categoria.Colaborador_Categoria_Key).then((response) => {
            this.categorias = response.data;
          });
      },

      async loadColaboradoresTipos(){
        await axios.get(ip+"/tipos_colaboradores/enabled/"+this.colaborador.Tipo.Tipo_Colaborador_Key).then((response) => {
            this.tipos = response.data;
          });
      },

      async loadEmpresas(){
      await axios.get(ip+"/empresas/enabled/"+this.colaborador.Empresa.Empresa_Key).then((response) => {
        this.empresas = response.data;
      })
    },
     
    async loadUnidadesDeNegocio(){
      await axios.get(ip+"/unidades_negocios/enabled/"+this.colaborador.Unidad_Negocio.Unidad_Negocio_Key).then((response) => {
        this.unidadesNegocio = response.data;
      })
    },

    async loadColaboradoresFunciones(){
      var funcionKeys = this.colaborador.Funcion.map(funcion => funcion.Colaborador_Funcion_Funcion_Key);
      var funcionKeysStr = funcionKeys.join(',')
       await axios.get(ip+"/funciones/enabled/"+funcionKeysStr).then((response) => {
          this.funciones = response.data;
          this.colaborador.Funciones = this.funciones.filter(funcion => funcionKeys.includes(funcion.Funcion_Key));
          this.funcionesOriginales = this.colaborador.Funciones
          this.loader = false
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

    guardar() {
          console.log(this.colaborador)
          this.colaborador.Usuario_Modificacion = parseInt(localStorage.usuario_id)
          
          if (this.switch1){
            this.colaborador.Visible = 'X'
          }
          else{
            this.colaborador.Visible = null
          }

          axios.patch(ip+"/colaboradores/"+this.colaborador.Colaborador_Key, this.colaborador).then(
              this.guardarfunciones(),
              axios.patch(ip+"/colaboradores_horas/colab/"+this.colaborador.Horas.Colaborador_Hora_Key, this.colaborador).then(
                this.showSuccessDialog()
            )
          )

      },

      guardarfunciones(){
        const colaboradorFunciones = this.colaborador.Funciones;
          const newFunciones = colaboradorFunciones.filter(colaboradorFuncion =>
            !this.funcionesOriginales.some(
              funcionOriginal => funcionOriginal.Funcion_Key === colaboradorFuncion.Funcion_Key
            )
          );

          const deletedFunciones = this.funcionesOriginales.filter(funcionOriginal =>
            !colaboradorFunciones.some(
              colaboradorFuncion => colaboradorFuncion.Funcion_Key === funcionOriginal.Funcion_Key
            )
          );

          if (newFunciones.length > 0) {
            for (let i=0; i < newFunciones.length; i++) {
              var newColaboradorFuncion = {
                Colaborador_Funcion_Funcion_Key: newFunciones[i].Funcion_Key,
                Colaborador_Funcion_Descripcion: this.colaborador.Colaborador_Codigo + ' - ' + newFunciones[i].Funcion_Codigo,
                Colaborador_Funcion_Colaborador_Key: this.colaborador.Colaborador_Key,
                Usuario_Creacion: parseInt(localStorage.usuario_id)
              }
              axios.post(ip+"/colaboradores_funciones/", newColaboradorFuncion);
            }
          }


          if (deletedFunciones.length > 0) {
            for (let i=0; i < deletedFunciones.length; i++) {
              const funcion = this.colaborador.Funcion.find(obj => obj.Colaborador_Funcion_Funcion_Key === deletedFunciones[i].Funcion_Key);
              console.log(funcion)
              axios.delete(ip+"/colaboradores_funciones/"+ funcion.Colaborador_Funcion_Key);
            }
          }
      },

      showSuccessDialog(){
            const alertElement = document.querySelector('.alert');
            alertElement.style.display = 'block';
            setTimeout(() => {
                this.loader = true
                window.location.href = '/colaboradoresHierarchy';
            }, 3000);
        }, 

   
    back(){
      this.$router.push({path:'/colaboradoresHierarchy'})
    }
  
  },
};
</script>