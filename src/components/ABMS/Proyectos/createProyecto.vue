<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
        <h3 class="mt-3">Cliente: {{ this.$store.state.cliente[0].Cliente_Descripcion}}</h3>
        <b-form-row class="mt-3 mb-n4">
          <b-col cols="5">
            <h1 style="font-size:1.5rem;">{{proyecto.Proyecto_Descripcion}}</h1>
          </b-col>
          <b-col cols="1">
            <v-checkbox
              v-model="proyecto.Proyecto_Facturable"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              label="Facturable"
            ></v-checkbox>
          </b-col>
          <b-col cols="2" class="ml-4">
            <v-checkbox
              v-model="proyecto.Proyecto_Newsletter"
              :disabled="permisoActualizarProyecto()"
              :color="proyecto.Proyecto_Newsletter ? 'yellow' : 'black'"
              label="Newsletter"
            ></v-checkbox>
          </b-col>
          <b-col cols="1" class="ml-12">
                <v-btn :disabled="!isFormValid || permisoActualizarProyecto()" @click="guardar"  color="#2991C6" dark >Guardar</v-btn> 
          </b-col>
          <b-col cols="1">
              <v-btn @click="dialogCancelar = true" color="#ffa025" dark class="ml-3">Volver</v-btn>
          </b-col>
        </b-form-row>
        <v-form ref="form">
        <b-form-row>

            <b-col class="col-6">
              <v-card class="mt-n3" outlined tile>

                <b-form-row class="ml-1 mr-1">
                  <b-col class="col-3 mt-3">
                    <v-text-field
                    outlined
                    dense
                    v-model="proyecto.Proyecto_Codigo"
                    label="Código"
                    :rules="[rules.checkCode,rules.counterCodigo]"
                    placeholder="Escribe..."
                  ></v-text-field>
                  </b-col>
                  <b-col class="col-3 mt-3">
                    <v-text-field
                    outlined
                    dense
                    v-model="proyecto.Proyecto_Codigo_Externo"
                    label="Código Externo"
                    :rules="[rules.counterCodigo]"
                    placeholder="Sin asignar"
                    ></v-text-field>
                  </b-col>
                  <b-col class="col-6 mt-3">
                      <v-select
                      dense
                      outlined
                      :rules="[rules.checkSelection]"
                      v-model="proyecto.Proyecto_Tipo"
                      @input="asignarSegunTipo"
                      :items="proyectos_tipos_descripciones"
                      v-b-tooltip.hover="{variant: 'light'}"
                      :title="evalTooltipTiposProyectos"
                      label="Tipo"
                      placeholder="Selecciona..."
                      @blur="validateForm"
                      ></v-select>
                  </b-col>
                </b-form-row>
                <b-form-row class="ml-1 mr-1 mt-n6">
                  <b-col class="col-6 ">
                    <v-select
                    dense
                    outlined
                    :rules="[rules.checkSelection]"
                    v-model="proyecto.Proyecto_Alcance"
                    :items="alcances_descripciones"
                    label="Alcance"
                    :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica'"
                    placeholder="Selecciona..."
                    ></v-select>
                  </b-col>
                  <b-col class="col-6">
                    <v-autocomplete
                    v-model="proyecto.Proyecto_Unidad_Negocio"
                    :rules="[rules.checkSelection]"
                    label="U. Negocio"
                    :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica'"
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
                      :rules="[rules.checkSelection]"
                      :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica'"
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
                    :rules="[rules.checkSelection]"
                    :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica'"
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
                    :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica'"
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
                    @blur="validateForm"
                    :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio == 'No Aplica'"
                    placeholder="Selecciona..."
                    ></v-select>
                  </b-col>
                </b-form-row>

            </v-card>
            <b-form-row>
              <b-col class="col-12  mt-n12" tabindex="-1">
              <proyectosTecnologias></proyectosTecnologias>
            </b-col>
            </b-form-row>
            </b-col>


            <b-col class="col-5">
              <v-card class="mt-n3" outlined tile>
                <h4 class="p-3">Descripción</h4>
                <img class="ml-5 mt-n4" width="40" height="25" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg/1920px-Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg.png" alt="Spain Flag" /> 
                <b-col class="col-12">
                      <v-text-field
                      outlined
                      dense
                      v-model="proyecto.Proyecto_Descripcion"
                      :rules="[rules.checkEmpty]"
                      label="Descripción"
                      placeholder="Sin asignar"
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
                    placeholder="Sin Asignar"
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
                      label="Description"
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
        </v-form>
          <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
            <v-card>
              <v-toolbar
                dark
                color="#2991C6"
                height="30rem"
              >
              <v-icon color="#ffa025" style="text-shadow: 1px 1px 2px black;position:absolute; left:38%">mdi-alert</v-icon><h5 style="font-weight: bold;position:absolute; left:45%; color:white; text-shadow: 1px 1px 2px black;" class="mt-3">ALERTA</h5>
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
          <v-snackbar
            :value="alert"
            color="blue"
            elevation="9"
            type="success"
            top
            centered
          > Se han guardado los cambios.
          </v-snackbar>

    </v-container>
  </v-content>
</template>

<style scoped>
.container {
  min-width: 90%;
  margin-top: -1rem;
}
</style>


<script>
import axios from 'axios';
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
import proyectosTecnologias from '../Proyectos-Tecnologias/Proyectos-Tecnologias';
import {checkCode,counterCodigo,counterDescripcion,counterReferentes,checkEmail, isFieldEmpty, isNotSelected} from '../../../validations/validations'
  export default {
    components: {
      proyectosTecnologias, loader
    },
    data: () => ({
      
      isFormValid: false,
      rules: {
        checkCode: checkCode,
        counterCodigo: counterCodigo,
        counterDescripcion: counterDescripcion,
        counterReferentes: counterReferentes,
        checkEmail: checkEmail,
        checkEmpty: isFieldEmpty,
        checkSelection: isNotSelected
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
      newsletter: '',
      searchUnidadesNegocio: '',
      searchResponsables: '',
      searchVendedores: '',
      proyecto: {},
      proyectoOriginal: {},
      proyectoParaGuardarEnState: {},
      //Elemento que se va a guardar con el UPDATE
      defaultCode: '',
      //Keys para guardar
      responsables: [],
      vendedores: [],
      unidades_Negocio: [],
      alcances: [],
      proyectos_tipos: [],
      monedas: [],
      tecnologias: [],
      proyectos:[],
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
      visible: {Visible: ''},
      alert: false,
      dialogCancelar: false,
      loader: true,
    }),
  computed: {
  },
  watch: {
  proyecto: {
    handler: 'validateForm',
    deep: true,
    immediate: false,
    // List of properties to watch for changes
    include: [
      'Proyecto_Codigo',
      'Proyecto_Descripcion',
      'Proyecto_Tipo',
      'Proyecto_Alcance',
      'Proyecto_Unidad_Negocio',
      'Proyecto_Responsable',
      'Proyecto_Vendedor',
      'Proyecto_Moneda',
      'Ceco_Key'
    ]
  }
},

  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.$store.state.ProyectoKey = null,
      this.$store.state.Tecnologias = []
      this.loadProyecto();
      this.loadUnidades_Negocios();
      this.loadProyectosAlcances();
      this.loadProyectosTipos();
      this.loadMonedas();
      this.loadVendedores();
      this.loadResponsables();
      this.loadTecnologias();
      this.proyectoOriginal = _.cloneDeep(this.proyecto)
      await this.wait(1000); //DISPARAR EVENTO DE LOADING

      this.loader = false
    },
    wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
           resolve();
        }, time);
      })
    },

    validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },


    permisoActualizarProyecto(){
          return !localStorage.Permisos.includes("P19")
      },
    loadProyecto(){
      this.proyecto = _.cloneDeep(this.$store.state.proyecto[0])
      this.proyecto.Proyecto_Cliente = this.$store.state.cliente[0].Cliente_Key
      this.proyecto.Proyecto_Facturable = this.evalFacturable();
      this.proyecto.Proyecto_Newsletter = this.evalNewsletter();
    },
    //Convierte lo leido del campo Newsletter a BOOL para el funcionamiento del checkbox
    evalNewsletter(){
      if(this.proyecto.Proyecto_Newsletter.toString() == "Si"){
        return true
      } else return false
    },
    //Convierte lo leido del campo Facturable a BOOL para el funcionamiento del checkbox
    evalFacturable(){
      if(this.proyecto.Proyecto_Facturable == 1){
        return true
      } else return false
    },
    //Guardado de proyecto. En primera instancia si el proyecto no fue guardado, se lo guarda para luego poder
    //guardar las tecnologias. En una segunda instancia de guardado, realiza validacion de porcentajes de tecnologias,
    //guarda las tecnologias, asigna datos para el guardado y guarda el proyecto en vuex
    async guardar() {
          if(this.$refs.form.validate()){
            if(this.validarPorcentaje()){
                await this.guardarProyecto()  // Inserta el proyecto guardado al cliente
              }
          }
        },

    //Guardado del proyecto. Realiza una validacion si existe el proyecto en la lista de proyectos de vuex
    //Luego guarda el proyecto y lo pide nuevamente para poder obtener la Key del proyecto
    async guardarProyecto() {
      this.loader = true
      axios.get(ip+"/proyectos/client/"+this.proyecto.Proyecto_Cliente).then(response => {
            this.proyectos = response.data
          }).then((response) => {
            var proyectoGuardado = this.proyecto.Proyecto_Codigo
            if(this.proyectos.some(item => item.Proyecto_Codigo === this.proyecto.Proyecto_Codigo || item.Proyecto_Descripcion ===  this.proyecto.Proyecto_Descripcion)){
              alert('El proyecto ya existe para el cliente seleccionado')
              throw new Error('Proyecto existe')
            } else {
              var responsable = this.proyecto.Proyecto_Responsable
              var tipoDescripcion = this.proyecto.Proyecto_Tipo
              var tipoBeneficio = this.proyecto.Tipo.Proyecto_Tipo_Beneficio
              this.assignKeys();
              this.proyecto.Usuario_Creacion = localStorage.usuario_id
              this.proyecto.Usuario_Modificacion = localStorage.usuario_id
              this.proyecto.Visible = 'X'
               axios.post(ip+"/proyectos", this.proyecto)
              .then((response) => {
                alert('El proyecto se ha guardado')
                axios.get(ip+"/proyectos/"+ proyectoGuardado)
                .then((response) => {
                  var proyectoParaGuardarEnState = response.data
                  this.$store.state.ProyectoKey = response.data.Proyecto_Key
                  proyectoParaGuardarEnState.Tipo = {Proyecto_Tipo_Descripcion: tipoDescripcion,
                                                    Proyecto_Tipo_Beneficio: tipoBeneficio}
                  proyectoParaGuardarEnState.Responsable = {Usuario_Nombre_Completo: responsable}
                  this.$store.state.proyecto = [proyectoParaGuardarEnState] // Inserta el proyecto guardado al cliente      
                  this.guardarTecnologias() // guarda las tecnologias en la base

                  setTimeout(() => {
                                this.loader = false
                                this.rollback()}, 500)
                })
              });
              }
            })
      	  },



    //Guarda tecnologias
    guardarTecnologias(){
          // Obtener tecnologías creadas
          const tecnologiasAGuardar = this.$store.state.Tecnologias
          if (tecnologiasAGuardar.length > 0){
            for(let i = 0; i< tecnologiasAGuardar.length; i++){        
              tecnologiasAGuardar[i].Usuario_Creacion = localStorage.usuario_id
              tecnologiasAGuardar[i].Proyecto_Tecnologia_Proyecto = this.$store.state.ProyectoKey
              axios.post(ip+"/Proyectos_Tecnologias", tecnologiasAGuardar[i])
            }
          }
        },


    //Este metodo recorre la lista de tecnologias evaluando sus porcentajes, si se pasa del 100 emite alerta
    //si no llega al 100 tambien.
    validarPorcentaje(){
          if(this.$store.state.Tecnologias.length > 0){
            var tecnologias = this.$store.state.Tecnologias

            let contador = 0
            let flag = false

            for (let tecnologia of tecnologias){
              contador = contador + parseInt(tecnologia.Proyecto_Tecnologia_Porcentaje)
            }
            if (contador > 100){
              alert('El porcentaje de tecnologías supera el 100%')
              return flag
            } else if(contador < 100) {
              alert('El porcentaje de tecnologías no llega al 100%')
              return flag
            } else return flag = true
          } else return true

        },

    rollback(){
      this.$store.state.proyecto[0] = {}
      if(this.$store.state.clienteTipo == 0){
        this.$router.push({ path: '/createCliente'})
        this.$store.state.proyecto[0] = []
      } else {
      this.$router.push({ path: '/editCliente' })
      this.$store.state.proyecto[0] = []
      }
    },
    //PEDIDOS A LA API
    loadMonedas() {
      axios.get(ip+"/monedas").then((response) => {
        this.monedas = response.data;
        this.monedasCodigos = response.data.map(
          (moneda) => moneda.Moneda_Codigo
        );
      });
    },
    loadProyectosAlcances() {
      axios
        .get(ip+"/proyectos_alcances/descripciones")
        .then((response) => {
          this.alcances = response.data;
          this.alcances_descripciones = response.data.map(
            (proyecto) => proyecto.Proyecto_Alcance_Descripcion
          );
        });
    },
    loadProyectosTipos() {
      axios
        .get(ip+"/proyectos_tipos/descripciones")
        .then((response) => {
          this.proyectos_tipos = response.data;
          this.proyectos_tipos_descripciones = response.data.map(
            (tipo) => tipo.Proyecto_Tipo_Descripcion
          );
        });
    },
    
    loadUnidades_Negocios() {
      axios
        .get(ip+"/unidades_negocios/descripciones")
        .then((response) => {
          this.unidades_Negocio = response.data;
          this.unidades_NegocioDescripciones = response.data.map(
            (unidad_negocio) => unidad_negocio.Unidad_Negocio_Descripcion
          );
        });
    },
    loadTecnologias(){
      axios.get(ip+"/tecnologias/descripciones").then((response) => {
        this.tecnologias = response.data;
      });
    },
 
    // RESPONSABLES con usuario Sin Asignar
    loadResponsables(){
      axios.get(ip+"/colaboradores/responsables/"+2).then((response) => {
        this.responsables = response.data;
        });
      },

      // VENDEDORES con usuario Sin Asignar
      loadVendedores(){
        axios.get(ip+"/colaboradores/vendedores/"+2).then((response) => {
          this.vendedores = response.data;
          });
      },

    //Asigna descripciones para mostrar en los combos
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
      const responsable = this.vendedores.find(obj => obj.Colaborador_Usuario === this.proyecto.Proyecto_Responsable);
      this.proyecto.Proyecto_Responsable = responsable.Usuario.Usuario_Nombre_Completo
      const vendedor = this.vendedores.find(obj => obj.Colaborador_Usuario === this.proyecto.Proyecto_Vendedor);
      this.proyecto.Proyecto_Vendedor = vendedor.Usuario.Usuario_Nombre_Completo
      if((this.proyecto.Proyecto_Moneda) == null){
        this.proyecto.Proyecto_Moneda = 'N/A'
      }

    },
    //Asigna la key a la tecnologia brindada
    asignarKey(tecnologia){
      var keyTecnologia = this.tecnologias.filter(tecno => tecno.Tecnologia_Descripcion == tecnologia.Proyecto_Tecnologia_Tecnologia)[0].Tecnologia_Key;
      tecnologia.Proyecto_Tecnologia_Tecnologia = keyTecnologia
    },
    //Asigna las keys para el guardado del proyecto
    assignKeys() {
      var keyUnidad_Negocio = this.unidades_Negocio.filter((unidad_negocio) =>
          unidad_negocio.Unidad_Negocio_Descripcion == this.proyecto.Proyecto_Unidad_Negocio)[0].Unidad_Negocio_Key;
      var keyAlcance = this.alcances.filter((alcance) =>
          alcance.Proyecto_Alcance_Descripcion == this.proyecto.Proyecto_Alcance)[0].Proyecto_Alcance_Key;
        

      var keyTipoProyecto = this.proyectos_tipos.filter((tipo) =>
          tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0].Proyecto_Tipo_Key;

      if((this.proyecto.Proyecto_Moneda) == null){
        var keyMoneda = 6
      }
      else{
        var keyMoneda = this.monedas.filter((moneda) => 
          moneda.Moneda_Codigo == this.proyecto.Proyecto_Moneda)[0].Moneda_Key;
      }

      if(this.proyecto.Ceco_Key == null){
        this.proyecto.Ceco_Key = 1
      }
      
      this.proyecto.Proyecto_Unidad_Negocio = keyUnidad_Negocio;
      this.proyecto.Proyecto_Facturable = this.asignarFacturable();
      this.proyecto.Proyecto_Newsletter = this.asignarNewsletter();
      this.proyecto.Proyecto_Alcance = keyAlcance;
      this.proyecto.Proyecto_Tipo = keyTipoProyecto;
      this.proyecto.Proyecto_Moneda = keyMoneda;
      this.proyecto.Proyecto_Responsable = this.proyecto.Proyecto_Responsable.Colaborador_Usuario
      this.proyecto.Proyecto_Vendedor = this.proyecto.Proyecto_Vendedor.Colaborador_Usuario
    },
    //Asigna la key de facturable en base a la condicion del checkbox
    asignarFacturable(){
      if(this.proyecto.Proyecto_Facturable == true){
        return 1
      } else return 2
    },
    //Asigna el campo de Newsletter en base a la condicion del checkbox
    asignarNewsletter(){
      if(this.proyecto.Proyecto_Newsletter == true){
        return 'Si'
      } else return 'No'
    },
    //Funcion que retorna la informacion que debe ser mostrada en el tooltip
    evalTooltipTiposProyectos(){
      var tooltip = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0]
      if(tooltip == undefined){
        return 'No se selecciono un Tipo'
      } else return ('Grupo: ' +tooltip.Proyecto_Tipo_Grupo+ '\n' +'Beneficio: ' +tooltip.Proyecto_Tipo_Beneficio)
    },
    //Funcion que funciona en base al tipo de proyecto, segun sea Trabajo Externo o distinto de Trabajo Externo
    asignarSegunTipo(){
          var seleccionado = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0]
  
          this.proyecto.Tipo.Proyecto_Tipo_Beneficio = seleccionado.Proyecto_Tipo_Beneficio
          if(seleccionado.Proyecto_Tipo_Beneficio != "Trabajo Externo"){
          this.proyecto.Proyecto_Alcance = "No Aplica"
          this.proyecto.Proyecto_Unidad_Negocio = "No Aplica"
          this.proyecto.Proyecto_Responsable = this.responsables.find(obj => obj.Colaborador_Usuario === 2);
          this.proyecto.Proyecto_Vendedor = this.vendedores.find(obj => obj.Colaborador_Usuario === 2);
          this.proyecto.Proyecto_Moneda = "N/A"
          this.proyecto.Proyecto_Facturable = false
          this.proyecto.Ceco_Key = 1
          }
    },
     mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
        } 
  }
}
</script>
