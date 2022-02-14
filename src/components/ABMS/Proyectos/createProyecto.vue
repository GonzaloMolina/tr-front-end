<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
      <v-form ref="form">
      <v-row>
        <v-header
          style="font-size:1.5rem; margin-left:3rem; margin-top:2rem; width:36rem"
        >{{proyecto.Proyecto_Descripcion}}</v-header>
        <v-checkbox
          style="display:inline-block;margin-top:2rem "
          v-model="proyecto.Proyecto_Facturable"
          :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
          label="Facturable"
        ></v-checkbox>
        <v-checkbox
          v-model="proyecto.Proyecto_Newsletter"
          :color="proyecto.Proyecto_Newsletter ? 'yellow' : 'black'"
          style="display:inline-block;margin-top:2rem; margin-left:2rem"
          label="Newsletter"
        ></v-checkbox>

          <v-btn
            color="#2991C6"
            dark
            style="margin-left:11rem;margin-top:2rem"
            @click="evaluarGuardado"
          > Guardar
          </v-btn>

          <v-snackbar
            :value="alert"
            color="blue"
            elevation="9"
            type="success"
            top
            centered
          > Se han guardado los cambios.
          </v-snackbar>

          <v-btn @click="dialogCancelar = true" color="#ffa025" dark style="margin-left:1rem;margin-top:2rem">Cancelar</v-btn>
        <v-col cols="12" style="max-width:56rem;margin-left:1rem;margin-top:-1rem">
          <v-card class="pa-2" outlined tile>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Codigo"
              label="Código"
              :rules="[rules.checkCode,rules.counterCodigo]"
              placeholder="Escribe..."
              style="display:inline-block; max-width: 8rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Codigo_Externo"
              label="Código Externo"
              :rules="[rules.counterCodigo]"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; max-width: 8rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Descripcion"
              :rules="[rules.counterDescripcion]"
              label="Descripción"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; min-width: 24rem;"
            ></v-text-field>
            <v-select
              dense
              outlined
              v-model="proyecto.Proyecto_Tipo"
              @input="asignarSegunTipo"
              :items="proyectos_tipos_descripciones"
              v-b-tooltip.hover="{variant: 'light'}" :title="evalTooltipTiposProyectos"
              label="Tipo"
              placeholder="Selecciona..."
              style="max-width:10rem; display:inline-block; margin-left:1rem; margin-bottom:-1.5rem"
            ></v-select>
            <v-select
              dense
              outlined
              v-model="proyecto.Proyecto_Alcance"
              :items="alcances_descripciones"
              label="Alcance"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              placeholder="Selecciona..."
              style="max-width:11.5rem; display:inline-block; margin-bottom:-1.5rem"
            ></v-select>
            <v-autocomplete
              v-model="proyecto.Proyecto_Unidad_Negocio"
              label="U. Negocio"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :items="unidades_NegocioDescripciones"
              :loading="isLoading"
              :search-input.sync="searchUnidadesNegocio"
              outlined
              dense
              cache-items
              placeholder="Selecciona..."
              color="white"
              style="min-width:8rem; max-width:10rem; display:inline-block; margin-left:1rem; margin-bottom:-1.5rem"
            ></v-autocomplete>
            <v-autocomplete
              v-model="proyecto.Proyecto_Responsable"
              label="Responsable"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :items="responsablesDescripciones"
              :loading="isLoading"
              :search-input.sync="searchResponsables"
              outlined
              dense
              cache-items
              placeholder="Selecciona..."
              color="white"
              style="min-width:8rem; max-width:10rem; display:inline-block; margin-left:0.5rem; margin-bottom:-1.5rem"
            ></v-autocomplete>
            <v-autocomplete
              v-model="proyecto.Proyecto_Vendedor"
              label="Vendedor"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :items="vendedoresDescripciones"
              :loading="isLoading"
              :search-input.sync="searchVendedores"
              outlined
              dense
              cache-items
              placeholder="Selecciona..."
              color="white"
              style="min-width:8rem; max-width:10rem; display:inline-block; margin-left:0.5rem; margin-bottom:-1.5rem"
            ></v-autocomplete>
            <v-select
              dense
              outlined
              v-model="proyecto.Proyecto_Moneda"
              :items="monedasCodigos"
              label="Moneda"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != '' && proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              placeholder="Selecciona..."
              style="max-width:8rem; display:inline-block; margin-left:0.5rem; margin-bottom:-1.5rem"
            ></v-select>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-textarea
            style="min-width:24rem; margin-top:-1rem"
            auto-grow
            background-color="white"
            filled
            color="black"
            label="Descripcion detallada"
            v-model="proyecto.Proyecto_Observacion"
            :counter="3000"
            placeholder="Escribe.."
            rows="4"
          ></v-textarea>
        </v-col>
        <v-col cols="12" style="margin-left:1rem; max-width:56rem; margin-top:-1rem">
        <!--
          <v-text style="font-size:1.5rem; padding-left:1rem;">Referentes</v-text>
          <v-card class="pa-2" outlined tile>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Referente_Comercial"
              label="Referente Comercial"
              :disabled="permisoActualizarProyecto()"
              :rules="[rules.counterReferentes]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 18rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Referente_Comercial_Mail"
              label="Mail Comercial"
              :disabled="permisoActualizarProyecto()"
              :rules="[rules.counterReferentes]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 34rem; margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Referente_Tecnico"
              label="Referente Técnico"
              :disabled="permisoActualizarProyecto()"
              :rules="[rules.counterReferentes]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 18rem; margin-bottom:-1.5rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Referente_Tecnico_Mail"
              label="Mail Técnico"
              :disabled="permisoActualizarProyecto()"
              :rules="[rules.counterReferentes]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 34rem; margin-left:1rem;margin-bottom:-1.5rem"
            ></v-text-field>
          </v-card>
          -->
        </v-col>

        <v-col cols="3" style="margin-top:-1rem; min-width:26rem">
          <proyectosTecnologias  :proyectoFueGuardado="proyectoFueGuardado"></proyectosTecnologias>
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




    </v-container>
  </v-content>
</template>

<style scoped>
.container {
  min-width: 84rem;
  margin-top: -1rem;
}
</style>


<script>
import axios from 'axios';
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
import proyectosTecnologias from '../Proyectos-Tecnologias/Proyectos-Tecnologias';
import {checkCode,counterCodigo,counterDescripcion,counterReferentes,checkEmail} from '../../../validations/validations'
  export default {
    components: {
      proyectosTecnologias, loader
    },
    data: () => ({
      proyectoFueGuardado: false,
      rules: {
        checkCode: checkCode,
        counterCodigo: counterCodigo,
        counterDescripcion: counterDescripcion,
        counterReferentes: counterReferentes,
        checkEmail: checkEmail,
      },
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
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
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
      if(this.proyectoFueGuardado){
        this.asignarDescripciones()
      }else{
        this.loader = false
      }
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
    async evaluarGuardado() {
      if(this.proyectoFueGuardado){
        this.guardarTecnologias(); // guarda las tecnologias en la base
        this.$store.state.proyecto[0] = []
        setTimeout(() => {this.loader = false
                          this.rollback()}, 2000) // vuelve al cliente
      } else if(this.$refs.form.validate()){
        await this.guardarProyecto();
        this.asignarDescripciones();
        this.loader = true
        setTimeout(() => {this.loader = false}, 1000)
      }
    },
    //Guardado del proyecto. Realiza una validacion si existe el proyecto en la lista de proyectos de vuex
    //Luego guarda el proyecto y lo pide nuevamente para poder obtener la Key del proyecto
    async guardarProyecto() {
      var proyectoGuardado = this.proyecto.Proyecto_Codigo
      var proyectoDescripcion= this.proyecto.Proyecto_Descripcion
      if(this.$store.state.cliente[0].Proyectos.some(proyecto => proyecto.Proyecto_Codigo == proyectoGuardado ||
      proyecto.Proyecto_Descripcion == proyectoDescripcion)){
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
        await axios.post(ip+"/proyectos", this.proyecto)
        .then((response) => {
          //console.log(this.proyecto);
        });
        await axios.get(ip+"/proyectos/"+ proyectoGuardado)
        .then((response) => {
          var proyectoParaGuardarEnState = response.data
          proyectoParaGuardarEnState.Tipo = {Proyecto_Tipo_Descripcion: tipoDescripcion,
                                             Proyecto_Tipo_Beneficio: tipoBeneficio}
          proyectoParaGuardarEnState.Responsable = {Usuario_Nombre_Completo: responsable}
          this.$store.state.cliente[0].Proyectos.push(proyectoParaGuardarEnState) // Inserta el proyecto guardado al cliente
          this.$store.state.proyecto = [proyectoParaGuardarEnState] // Inserta el proyecto guardado al cliente
          this.proyectoFueGuardado = true
        })
        }
    },
    //Guarda tecnologias
    guardarTecnologias(){
          var tecnologiasAGuardar = this.$store.state.proyecto[0].Tecnologias
          console.log(tecnologiasAGuardar)
          console.log(this.$store.state.proyecto[0].Tecnologias)
          for(let i = 0; i< tecnologiasAGuardar.length; i++){
            this.asignarKey(tecnologiasAGuardar[i])
            tecnologiasAGuardar[i].Usuario_Creacion = localStorage.usuario_id
            tecnologiasAGuardar[i].Usuario_Modificacion = localStorage.usuario_id
            axios.post(ip+"/Proyectos_Tecnologias", tecnologiasAGuardar[i])
            .then((response) => {
              console.log(response);
            })
          }
        },
    //Este metodo recorre la lista de tecnologias evaluando sus porcentajes, si se pasa del 100 emite alerta
    //si no llega al 100 tambien.
    validarPorcentaje(){
      var tecnologias = this.$store.state.proyecto[0].Tecnologias
      console.log(tecnologias)
      if(tecnologias.length == 0){
        return true
      } else{
        let contador = 0
        let flag = false
        var seleccionado = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Descripcion == this.proyecto.Proyecto_Tipo)[0]
        if(seleccionado.Proyecto_Tipo_Beneficio != "Trabajo Externo"){
          return true
        } else{
        for (let tecnologia of tecnologias){
          contador = contador + tecnologia.Proyecto_Tecnologia_Porcentaje
        }
        if (contador > 100){
          alert('El porcentaje de tecnologías supera el 100%')
          return flag
        } else if(contador < 100) {
          alert('El porcentaje de tecnologías no llega al 100%')
          return flag
        } else return flag = true
        }
       }
      
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
    loadResponsables(){
      axios.get(ip+"/colaboradores/descripciones").then((response) => {
        this.responsables = response.data.filter(responsable => responsable.Funcion.Colaborador_Funcion_Funcion_Key === 2)
        this.responsablesDescripciones = this.responsables.map(responsable => responsable.Usuario.Usuario_Nombre_Completo).sort();
      });
    },
    loadVendedores(){
      axios.get(ip+"/colaboradores/descripciones").then((response) => {
        this.vendedores = response.data.filter(responsable => responsable.Funcion.Colaborador_Funcion_Funcion_Key === 1)
        this.vendedoresDescripciones = this.vendedores.map(vendedor => vendedor.Usuario.Usuario_Nombre_Completo).sort();
      });
    },
    //Asigna descripciones para mostrar en los combos
    asignarDescripciones(){
      var desUnidad_Negocio = this.unidades_Negocio.filter(unidad_negocio => unidad_negocio.Unidad_Negocio_Key == this.proyecto.Proyecto_Unidad_Negocio)[0].Unidad_Negocio_Descripcion
      var desAlcance = this.alcances.filter(alcance => alcance.Proyecto_Alcance_Key == this.proyecto.Proyecto_Alcance)[0].Proyecto_Alcance_Descripcion
      var desTipoProyecto = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Key == this.proyecto.Proyecto_Tipo)[0].Proyecto_Tipo_Descripcion
      var desMoneda = this.monedas.filter(moneda => moneda.Moneda_Key == this.proyecto.Proyecto_Moneda)[0].Moneda_Codigo
      var desResponsable = this.responsables.filter(responsable => responsable.Colaborador_Usuario == this.proyecto.Proyecto_Responsable)[0].Usuario.Usuario_Nombre_Completo
      var desVendedor = this.vendedores.filter(responsable => responsable.Colaborador_Usuario == this.proyecto.Proyecto_Vendedor)[0].Usuario.Usuario_Nombre_Completo
      this.proyecto.Proyecto_Newsletter = this.evalNewsletter()
      this.proyecto.Proyecto_Facturable = this.evalFacturable()
      this.proyecto.Proyecto_Unidad_Negocio = desUnidad_Negocio
      this.proyecto.Proyecto_Alcance = desAlcance
      this.proyecto.Proyecto_Tipo = desTipoProyecto
      this.proyecto.Proyecto_Moneda = desMoneda
      this.proyecto.Proyecto_Responsable = desResponsable
      this.proyecto.Proyecto_Vendedor = desVendedor
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
      var keyMoneda = this.monedas.filter((moneda) => 
          moneda.Moneda_Codigo == this.proyecto.Proyecto_Moneda)[0].Moneda_Key;
      var keyResponsable = this.responsables.filter(responsable => responsable.Usuario.Usuario_Nombre_Completo == this.proyecto.Proyecto_Responsable)[0].Colaborador_Usuario
      var keyVendedor = this.vendedores.filter(vendedor => vendedor.Usuario.Usuario_Nombre_Completo == this.proyecto.Proyecto_Vendedor)[0].Colaborador_Usuario
      this.proyecto.Proyecto_Unidad_Negocio = keyUnidad_Negocio;
      this.proyecto.Proyecto_Facturable = this.asignarFacturable();
      this.proyecto.Proyecto_Newsletter = this.asignarNewsletter();
      this.proyecto.Proyecto_Alcance = keyAlcance;
      this.proyecto.Proyecto_Tipo = keyTipoProyecto;
      this.proyecto.Proyecto_Moneda = keyMoneda;
      this.proyecto.Proyecto_Responsable = keyResponsable
      this.proyecto.Proyecto_Vendedor = keyVendedor
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
          console.log(seleccionado.Proyecto_Tipo_Beneficio)
          this.proyecto.Tipo.Proyecto_Tipo_Beneficio = seleccionado.Proyecto_Tipo_Beneficio
          if(seleccionado.Proyecto_Tipo_Beneficio != "Trabajo Externo"){
          this.proyecto.Proyecto_Alcance = "No Aplica"
          this.proyecto.Proyecto_Unidad_Negocio = "No Aplica"
          this.proyecto.Proyecto_Responsable = "Sin Asignar"
          this.proyecto.Proyecto_Vendedor = "Sin Asignar"
          this.proyecto.Proyecto_Moneda = "N/A"
          this.proyecto.Proyecto_Facturable = false
          } else{
            this.proyecto.Proyecto_Alcance = this.proyectoOriginal.Proyecto_Alcance
            this.proyecto.Proyecto_Unidad_Negocio = this.proyectoOriginal.Proyecto_Unidad_Negocio
            this.proyecto.Proyecto_Responsable = this.proyectoOriginal.Proyecto_Responsable
            this.proyecto.Proyecto_Vendedor = this.proyectoOriginal.Proyecto_Vendedor
            this.proyecto.Proyecto_Moneda = this.proyectoOriginal.Proyecto_Moneda
            this.proyecto.Proyecto_Facturable = this.proyectoOriginal.Proyecto_Facturable
            this.proyecto.Proyecto_Newsletter = this.proyectoOriginal.Proyecto_Newsletter
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
