<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
      <div v-if="!loader">
        <b-form-row class="mt-3 mb-n4">
          <b-col cols="5">
            <v-title style="font-size:1.5rem;">{{proyecto.Proyecto_Descripcion}}</v-title>
          </b-col>
          <b-col cols="1">
            <v-checkbox
              v-model="proyecto.Proyecto_Facturable"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto()"
              label="Facturable"
            ></v-checkbox>
          </b-col>
          <b-col cols="2" class="ml-6">
            <v-checkbox
              v-model="proyecto.Proyecto_Newsletter"
              :disabled="permisoActualizarProyecto()"
              :color="proyecto.Proyecto_Newsletter ? 'yellow' : 'black'"
              label="Newsletter"
            ></v-checkbox>
          </b-col>
          <b-col cols="1" class="ml-12">
                <v-btn :disabled="!isFormValid || permisoActualizarProyecto()" @click="guardar()" color="#2991C6" dark >Guardar</v-btn> 
          </b-col>
          <b-col cols="1" class="ml-3"> 
              <v-btn @click="dialogCancelar = true" color="#ffa025" dark class="ml-3">Volver</v-btn>
          </b-col>
        </b-form-row>

        <b-form-row>
            <b-col class="col-6">
              <v-card class="mt-n3" outlined tile>
              <v-form ref="form">
                <b-form-row class="ml-1 mr-1">
                  <b-col class="col-3 mt-3">
                    <v-text-field
                    outlined
                    dense
                    v-model="proyecto.Proyecto_Codigo"
                    label="Código"
                    :disabled="permisoActualizarProyecto()"
                    :rules="[rules.checkCode]"
                    placeholder="Escribe..."
                  ></v-text-field>
                  </b-col>
                  <b-col class="col-3 mt-3">
                    <v-text-field
                    outlined
                    dense
                    v-model="proyecto.Proyecto_Codigo_Externo"
                    label="Código Externo"
                    :disabled="permisoActualizarProyecto()"
                    placeholder="Sin asignar"
                    ></v-text-field>
                  </b-col>

                  <b-col class="col-6 mt-3">
                      <v-select
                      dense
                      outlined
                      :disabled="permisoActualizarProyecto()"
                      v-model="proyecto.Proyecto_Tipo"
                      @input="asignarSegunTipo"
                      :items="proyectos_tipos_descripciones"
                      v-b-tooltip.hover="{variant: 'light'}"
                      :title="evalTooltipTiposProyectos"
                      label="Tipo"
                      placeholder="Selecciona..."
                      ></v-select>
                  </b-col>
                </b-form-row>
                <b-form-row class="ml-1 mr-1 mt-n6">
                  <b-col class="col-6 ">
                    <v-select
                    dense
                    outlined
                    v-model="proyecto.Proyecto_Alcance"
                    :items="alcances_descripciones"
                    label="Alcance"
                    :disabled= permisoActualizarProyecto()
                    placeholder="Selecciona..."
                    ></v-select>
                  </b-col>
                  <b-col class="col-6">
                    <v-autocomplete
                    v-model="proyecto.Proyecto_Unidad_Negocio"
                    label="U. Negocio"
                    :disabled="permisoActualizarProyecto()"
                    :items="unidades_NegocioDescripciones"
                    :loading="isLoading"
                    :search-input.sync="searchUnidadesNegocio"
                    outlined
                    dense
                    cache-items
                    placeholder="Selecciona..."
                    color="white"
                    ></v-autocomplete>
                  </b-col>
                 
                </b-form-row>

                <b-form-row class="ml-1 mr-1 mt-n6">
                  <b-col>
                    <v-autocomplete
                      v-model="proyecto.Proyecto_Responsable"
                      label="Responsable"
                      :disabled="permisoActualizarProyecto()"
                      :items="responsables"
                      :loading="isLoading"
                      :search-input.sync="searchResponsables"
                      :return-object="true"
                      outlined
                      dense
                      cache-items
                      placeholder="Selecciona..."
                      color="white"
                      item-text="Usuario.Usuario_Nombre_Completo"
                      ></v-autocomplete>
                  </b-col>
                  <b-col>
                    <v-autocomplete
                    v-model="proyecto.Proyecto_Vendedor"
                    label="Vendedor"
                    :disabled=" permisoActualizarProyecto()"
                    :items="vendedores"
                    :loading="isLoading"
                    :search-input.sync="searchVendedores"
                    :return-object="true"
                    outlined
                    dense
                    cache-items
                    placeholder="Selecciona..."
                    color="white"
                    item-text="Usuario.Usuario_Nombre_Completo"
                    ></v-autocomplete>
                  </b-col>
                </b-form-row>
                <b-form-row class="ml-1 mr-1 mt-n6">
                  <b-col class="col-3">
                    <v-select
                    dense
                    outlined
                    v-model="proyecto.Proyecto_Moneda"
                    :items="monedasCodigos"
                    label="Moneda"
                    :disabled=" permisoActualizarProyecto()"
                    placeholder="Selecciona..."
                    ></v-select>
                  </b-col>
                  <b-col class="col-5">
                    <v-select
                    dense
                    outlined
                    v-model="proyecto.Ceco_Key"
                    :items="Cecoitems"
                    item-text="ceco"
                    item-value="cod"
                    label="CECO"
                    :disabled=" permisoActualizarProyecto()"
                    placeholder="Selecciona..."
                    ></v-select>
                  </b-col>
                </b-form-row>
              </v-form>
            </v-card>
            <b-form-row>
              <b-col class="col-12 mt-n12">
              <proyectosTecnologias :proyectoFueGuardado="proyectoFueGuardado"></proyectosTecnologias>
            </b-col>
            </b-form-row>
            </b-col>

            <b-col class="col-5" >
              <v-card class="mt-n3" outlined tile>
                <h4 class="p-3">Descripción</h4>
                <img class="ml-5 mt-n4" width="40" height="25" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg/1920px-Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg.png" alt="Spain Flag" /> 
                <b-col class="col-12">
                    <v-text-field
                    outlined
                    dense
                    v-model="proyecto.Proyecto_Descripcion"
                    :rules="[rules.counterDescripcion]"
                    label="Descripción"
                    :disabled="permisoActualizarProyecto()"
                    placeholder="Escribe..."
                    ></v-text-field>
                  </b-col>
                <b-col class="mt-n9">
                  <v-textarea
                    outlined
                    auto-grow
                    background-color="white"
                    filled
                    color="black"
                    label="Descripcion detallada"
                    v-model="proyecto.Proyecto_Observacion"
                    :counter="3000"
                    :disabled="permisoActualizarProyecto()"
                    placeholder="Escribe.."
                    rows="4"
                  ></v-textarea> 
              </b-col>       
              <img class="ml-5 mb-n4" width="40" height="25" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1920px-Flag_of_the_United_States.svg.png" alt="US Flag" /> 
              <b-col class="mt-5">
                <v-text-field
                      outlined
                      dense
                      background-color="white"
                      v-model="proyecto.Proyecto_Descripcion_EN"
                      :rules="[rules.counterDescripcion]"
                      label="Description"
                      :disabled="permisoActualizarProyecto()"
                      placeholder="Not assigned"
                      ></v-text-field>
              </b-col>
              <b-col class="mt-n9">
                <v-textarea
                    outlined
                    auto-grow
                    background-color="white"
                    filled
                    color="black"
                    label="Detailed description"
                    v-model="proyecto.Proyecto_Observacion_EN"
                    :counter="3000"
                    :disabled="permisoActualizarProyecto()"
                    placeholder="Not assigned"
                    rows="4"
                  ></v-textarea>
              </b-col>

              </v-card>
            </b-col>

          </b-form-row>


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
                <v-btn
                  color="white"
                  text
                  outlined

                  style="margin-left:16rem; background-color:#2991C6"
                  @click="rollback"
                >
                  Aceptar
                </v-btn>
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

<style scoped>
.container {
  min-width: 90%;
}
.v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
    align-items: center;
    display: inline-flex;
    flex: 1 1 auto;
    height: auto;
    margin-bottom: 0;
}
</style>


<script>
import axios from 'axios';
const ip = require('../../../ip/ip')
import loader from '../../Estado/loader'
import proyectosTecnologias from '../Proyectos-Tecnologias/Proyectos-Tecnologias';
import {checkCode,counterCodigo,counterDescripcion,counterReferentes} from '../../../validations/validations'

  export default {
    components: {
      proyectosTecnologias,
      loader
    },
    data: () => ({
      isFormValid: true,
      proyectoFueGuardado: false,
      newsletter: null,
      rules: {
        checkCode: checkCode,
        counterDescripcion: counterDescripcion,
        counterReferentes: counterReferentes,
      },
      renderComponent : false,
      dialog: false,
      searchUnidadesNegocio: '',
      searchResponsables: '',
      searchVendedores: '',
      proyecto: {
        Proyecto_Unidad_Negocio: null,
        Proyecto_Facturable: null,
        Proyecto_Alcance: null,
        Proyecto_Codigo: "",
        Proyecto_Descripcion: "",
        Proyecto_Tipo: null,
        Proyecto_Cliente: null,
        Proyecto_Moneda: null,
        Proyecto_Responsable: null,
        Proyecto_Vendedor: null,
        Proyecto_Referente_Comercial: "",
        Proyecto_Referente_Comercial_Mail: "",
        Proyecto_Referente_Tecnico: "",
        Proyecto_Referente_Tecnico_Mail: "",
        Proyecto_Codigo_Externo: "",
        Proyecto_Observacion: "",
        Proyecto_Newsletter: null,
        Usuario_Creacion: null,
        Usuario_Modificacion: null,
        Ceco_Key : null,
        Proyecto_Descripcion_EN: null,
        Proyecto_Observacion_EN: null,
      },
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
      proyectoTecnologias: [],
      proyectoConDescripciones: {},
      //Elemento que se va a guardar con el UPDATE
      defaultCode: '',
      //Keys para guardar
      tecnologiasOriginal: [],
      unidades_Negocio: [],
      alcances: [],
      proyectos_tipos: [],
      monedas: [],
      usuarios: [],
      tecnologias: [],
      responsables:[],
      vendedores:[],
      //SEARCHBOX
      responsablesDescripciones: [],
      vendedoresDescripciones: [],
      alcances_descripciones: [],
      proyectos_tipos_descripciones: [],
      monedasCodigos: [],
      //AUTOCOMPLETE
      unidades_NegocioDescripciones: [],
      isLoading: false,
      model: null,
      search: null,
      alert: false,
      dialogCancelar: false,
      loader:true,
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
      },
    },
    watch: {
        proyecto: {
        handler: 'validateForm',
        deep: true,
        immediate: false,
        include: [
            'Proyecto_Codigo',
            'Proyecto_Descripcion',
            'Proyecto_Codigo_Externo', 
            'Proyecto_Tipo',
            'Proyecto_Alcance',
            'Proyecto_Unidad_Negocio',
            'Proyecto_Cliente',
            'Proyecto_Responsable',
            'Proyecto_Vendedor',
            'Proyecto_Descripcion_EN',
            'Proyecto_Observacion_EN',
            'Ceco_Key'
        ]
     }
    },

    created () {
        this.initialize()
        this.proyectoFueGuardado  = true
        this.$store.state.ProyectoKey = this.proyecto.Proyecto_Key
    },

    methods: {
        async initialize () {
        this.loadProyecto();
        this.loadUnidades_Negocios();
        this.loadProyectosAlcances();
        this.loadProyectosTipos();
        this.loadMonedas();
        this.loadResponsables();
        this.loadVendedores();
        this.loadTecnologias();
        this.loadTecnologiasBackup();
	      setTimeout(() => { this.asignarDescripciones()
                          }, 3000)
        setTimeout(() => { this.loader = false
        }, 3200)

        this.loadProyectoDescripciones();
        },

        wait(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        })
        },
         permisoActualizarProyecto(){
          return !localStorage.Permisos.includes("P19")
      },

        rollback(){
          if(this.$store.state.clienteTipo == 0){
            this.$router.push({ path: '/createCliente'})
            this.$store.state.proyecto[0] = []
          } else {
          this.$router.push({ path: '/editCliente' })
          this.$store.state.proyecto[0] = []
          }
        },

      validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },

        async guardar() {
          if(this.$refs.form.validate()){
            if(this.validarPorcentaje()){
                this.guardarTecnologias() // guarda las tecnologias en la base
                await this.guardarProyecto()  // Inserta el proyecto guardado al cliente
                this.asignarDescripciones()
                setTimeout(() => {
                                this.rollback()}, 500)
               }
          }
        },

        validarPorcentaje(){
          if(this.$store.state.Tecnologias){
           if(this.$store.state.Tecnologias.length > 0){
            var tecnologias = this.$store.state.Tecnologias

            let contador = 0
            let flag = false

            for (let tecnologia of tecnologias){
              contador = contador + parseInt(tecnologia.Proyecto_Tecnologia_Porcentaje);
            }
            if (contador > 100){
              alert('El porcentaje de tecnologías supera el 100%')
              return flag
            } else if(contador < 100) {
              alert('El porcentaje de tecnologías no llega al 100%')
              return flag
            } else return flag = true
          } else return true}

        },

        loadProyecto(){
          this.proyecto = _.cloneDeep(this.$store.state.proyecto[0])
          this.defaultCode = this.proyecto.Proyecto_Codigo
        },

        evalNewsletter(){
          if(this.proyecto.Proyecto_Newsletter.toString() == "Si"){
            return true
          } else return false
        },

        evalFacturable(){
          if(this.proyecto.Proyecto_Facturable == 1){
            return true
          } else return false
        },

        //CARGAN LOS CHECKBOXES Y AUTOCOMPLETE

        loadTecnologiasBackup(){
          this.tecnologiasOriginal = _.cloneDeep(this.$store.state.proyecto[0].Tecnologias)
        },

        loadProyectoDescripciones(){

          this.proyectoConDescripciones = _.cloneDeep(this.proyecto)

        },

        loadMonedas(){
            axios.get(ip+"/monedas")
            .then(response => {
                this.monedas = response.data
                this.monedasCodigos = response.data.map(moneda => moneda.Moneda_Codigo)
            })
        },
        loadProyectosAlcances(){
            axios.get(ip+"/proyectos_alcances/descripciones")
            .then(response => {
                this.alcances = response.data
                this.alcances_descripciones = response.data.map(proyecto => proyecto.Proyecto_Alcance_Descripcion)
            })
        },
        loadProyectosTipos(){
            axios.get(ip+"/proyectos_tipos/descripciones")
            .then(response => {
                this.proyectos_tipos = response.data
                this.proyectos_tipos_descripciones = response.data.map(tipo => tipo.Proyecto_Tipo_Descripcion)
            })
        },

        loadTecnologias(){
          axios.get(ip+"/proyectos_tecnologias/tecnologias/"+this.proyecto.Proyecto_Key).then((response) => {
            this.proyectoTecnologias = response.data
          });
        },

        // RESPONSABLES
        loadResponsables(){
          axios.get(ip+"/colaboradores/responsables/"+this.proyecto.Proyecto_Responsable).then((response) => {
            this.responsables = response.data;
            });
          },

      // VENDEDORES
      loadVendedores(){
        axios.get(ip+"/colaboradores/vendedores/"+this.proyecto.Proyecto_Vendedor).then((response) => {
          this.vendedores = response.data;
          });
      },

        loadUnidades_Negocios(){
            axios.get(ip+"/unidades_negocios/descripciones")
            .then(response => {
                this.unidades_Negocio = response.data
                this.unidades_NegocioDescripciones = response.data.map(unidad_negocio => unidad_negocio.Unidad_Negocio_Descripcion)
            })
        },


        //--
        //Asigna descripciones al cargar el proyecto

        asignarDescripciones(){
            var desUnidad_Negocio = this.unidades_Negocio.filter(unidad_negocio => unidad_negocio.Unidad_Negocio_Key == this.proyecto.Proyecto_Unidad_Negocio)[0].Unidad_Negocio_Descripcion
            var desAlcance = this.alcances.filter(alcance => alcance.Proyecto_Alcance_Key == this.proyecto.Proyecto_Alcance)[0].Proyecto_Alcance_Descripcion
            var desTipoProyecto = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Key == this.proyecto.Proyecto_Tipo)[0].Proyecto_Tipo_Descripcion
            var desMoneda = this.monedas.filter(moneda => moneda.Moneda_Key == this.proyecto.Proyecto_Moneda)[0].Moneda_Codigo
            this.proyecto.Proyecto_Newsletter = this.evalNewsletter()
            this.proyecto.Proyecto_Facturable = this.evalFacturable()
            this.proyecto.Proyecto_Unidad_Negocio = desUnidad_Negocio
            this.proyecto.Proyecto_Alcance = desAlcance
            this.proyecto.Proyecto_Tipo = desTipoProyecto
            this.proyecto.Proyecto_Moneda = desMoneda
            this.proyecto.Proyecto_Responsable = this.proyecto.Responsable.Usuario_Nombre_Completo
            this.proyecto.Proyecto_Vendedor = this.proyecto.Vendedor.Usuario_Nombre_Completo
        },

        //--
        //Asigna keys al guardar el proyecto

        assignKeys(){
          var keyUnidad_Negocio = this.unidades_Negocio.filter((unidad_negocio) =>
          unidad_negocio.Unidad_Negocio_Descripcion == this.proyecto.Proyecto_Unidad_Negocio)[0].Unidad_Negocio_Key;
          var keyAlcance = this.alcances.filter((alcance) =>
              alcance.Proyecto_Alcance_Descripcion == this.proyecto.Proyecto_Alcance)[0].Proyecto_Alcance_Key;
          var keyTipoProyecto = this.proyectos_tipos.filter((tipo) =>
              tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0].Proyecto_Tipo_Key;
          var keyMoneda = this.monedas.filter((moneda) =>
              moneda.Moneda_Codigo == this.proyecto.Proyecto_Moneda)[0].Moneda_Key;

          this.proyecto.Proyecto_Unidad_Negocio = keyUnidad_Negocio;
          this.proyecto.Proyecto_Facturable = this.asignarFacturable();
          this.proyecto.Proyecto_Newsletter = this.asignarNewsletter();
          this.proyecto.Proyecto_Alcance = keyAlcance;
          this.proyecto.Proyecto_Tipo = keyTipoProyecto;
          this.proyecto.Proyecto_Moneda = keyMoneda;
          this.proyecto.Proyecto_Responsable = this.proyecto.Proyecto_Responsable.Colaborador_Usuario
          this.proyecto.Proyecto_Vendedor = this.proyecto.Proyecto_Vendedor.Colaborador_Usuario
        },


        asignarFacturable(){
          if(this.proyecto.Proyecto_Facturable == true){
            return 1
          } else return 2
        },

        asignarNewsletter(){
          if(this.proyecto.Proyecto_Newsletter == true){
            return 'Si'
          } else return 'No'
        },

        //--
        async guardarProyecto(){
          var responsable = this.proyecto.Proyecto_Responsable
          var tipo = this.proyecto.Proyecto_Tipo
          this.assignKeys();
          this.proyecto.Usuario_Creacion = localStorage.usuario_id
          this.proyecto.Usuario_Modificacion = localStorage.usuario_id
          this.proyecto.Tecnologias = this.$store.state.proyecto[0].Tecnologias
          await axios.patch(ip+"/Proyectos/"+this.defaultCode, this.proyecto)
          .then((response) => {
            this.proyecto.Tipo = {Proyecto_Tipo_Descripcion: tipo,
                                 Proyecto_Tipo_Beneficio: this.proyecto.Tipo.Proyecto_Tipo_Beneficio
                                 }
            this.proyecto.Responsable = {Usuario_Nombre_Completo: responsable}
          })

        },

        guardarTecnologias(){
          // Obtener tecnologías editadas/creadas
          const tecnologiasAGuardar = this.$store.state.Tecnologias
          const tecnologiasAEliminar = this.proyectoTecnologias.filter(objeto => !tecnologiasAGuardar.some(tecnologia => tecnologia.Proyecto_Tecnologia_Key === objeto.Proyecto_Tecnologia_Key));

          if (tecnologiasAGuardar){
            for(let i = 0; i< tecnologiasAGuardar.length; i++){
              //Por cada tecnología del array, verificar si existían previamente o fueron creadas
              const index = this.proyectoTecnologias.findIndex(item => item.Proyecto_Tecnologia_Key === tecnologiasAGuardar[i].Proyecto_Tecnologia_Key);

              // Si el index es -1, no existe en la base y hay que crear un proyecto_tecnologia nuevo
              if (index == -1) {
                tecnologiasAGuardar[i].Usuario_Creacion = localStorage.usuario_id
                axios.post(ip+"/Proyectos_Tecnologias", tecnologiasAGuardar[i])
              }
              else{ // caso contrario se actualiza el registro existente
                tecnologiasAGuardar[i].Usuario_Modificacion = localStorage.usuario_id
                axios.patch(ip+"/Proyectos_Tecnologias/"+tecnologiasAGuardar[i].Proyecto_Tecnologia_Key, tecnologiasAGuardar[i])
              }
            }
          }

          if(tecnologiasAEliminar.length > 0){
           
            for(let i = 0; i< tecnologiasAEliminar.length; i++){
              axios.delete(ip+"/proyectos_tecnologias/"+tecnologiasAEliminar[i].Proyecto_Tecnologia_Key)
            }
          }
        },


        evalTooltipTiposProyectos(){
          var tooltip = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0]
          if(tooltip == undefined){
            return 'No se selecciono un Tipo'
          } else return ('Grupo: ' +tooltip.Proyecto_Tipo_Grupo+ '\n' +'Beneficio: ' +tooltip.Proyecto_Tipo_Beneficio)
        },

        asignarSegunTipo(){
          var seleccionado = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0]
          this.proyecto.Tipo.Proyecto_Tipo_Beneficio = seleccionado.Proyecto_Tipo_Beneficio
          if(seleccionado.Proyecto_Tipo_Beneficio != "Trabajo Externo"){
          this.proyecto.Proyecto_Alcance = "No Aplica"
          this.proyecto.Proyecto_Unidad_Negocio = "No Aplica"
          this.proyecto.Proyecto_Responsable = "Sin Asignar"
          this.proyecto.Proyecto_Vendedor = "Sin Asignar"
          this.proyecto.Proyecto_Moneda = "N/A"
          this.proyecto.Proyecto_Facturable = false}
        },
      },

     mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }

     }

}


</script>
