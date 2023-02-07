<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
      <!--
        <v-alert
            :value="alert"
            style="position: absolute;  left: 0; right: 0; top: -12px; text-align: center;"
            top
            dense
            color="blue"
          > Se han guardado los cambios.
          </v-alert>
          -->
      <v-form ref="form">
      <v-row>
        <v-header
          style="font-size:1.5rem; margin-left:3rem; margin-top:2rem; width:36rem"
        >{{proyecto.Proyecto_Descripcion}}</v-header>
        <v-checkbox
          style="display:inline-block;margin-top:2rem "
          v-model="proyecto.Proyecto_Facturable"
          :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto() "
          label="Facturable"
        ></v-checkbox>
        <v-checkbox
          v-model="proyecto.Proyecto_Newsletter"
          :disabled="permisoActualizarProyecto()"
          :color="proyecto.Proyecto_Newsletter ? 'yellow' : 'black'"
          style="display:inline-block;margin-top:2rem; margin-left:2rem"
          label="Newsletter"
        ></v-checkbox>

          <v-btn
            :disabled="permisoActualizarProyecto()" 
            color="#2991C6"
            dark
            style="margin-left:11rem;margin-top:2rem"
            @click="guardar"
          > Guardar
          </v-btn>
        
          <v-btn @click="dialogCancelar = true" color="#ffa025" dark style="margin-left:1rem;margin-top:2rem">Cancelar</v-btn>
        <v-col cols="12" style="max-width:56rem;margin-left:1rem;margin-top:-1rem">
          <v-card class="pa-2" outlined tile>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Codigo"
              label="Código"
              :disabled="permisoActualizarProyecto()"
              :rules="[rules.checkCode,rules.counterCodigo]"
              placeholder="Escribe..."
              style="display:inline-block; max-width: 8rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Codigo_Externo"
              label="Código Externo"
              :disabled="permisoActualizarProyecto()"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; max-width: 8rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="proyecto.Proyecto_Descripcion"
              
              :rules="[rules.counterDescripcion]"
              label="Descripción"
              :disabled="permisoActualizarProyecto()"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; min-width: 24rem;"
            ></v-text-field>
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
              style="max-width:10rem; display:inline-block; margin-left:1rem; margin-bottom:-1.5rem"
            ></v-select>
            <v-select
              dense
              outlined

              v-model="proyecto.Proyecto_Alcance"
              :items="alcances_descripciones"
              label="Alcance"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto()"
              placeholder="Selecciona..."
              style="max-width:11.5rem; display:inline-block; margin-bottom:-1.5rem"
            ></v-select>
            <v-autocomplete
              v-model="proyecto.Proyecto_Unidad_Negocio"
              label="U. Negocio"
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto()"
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
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto()"
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
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto()"
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
              :readonly="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo'"
              :disabled="proyecto.Tipo.Proyecto_Tipo_Beneficio != 'Trabajo Externo' || permisoActualizarProyecto()"
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
            :disabled="permisoActualizarProyecto()"
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
import {checkCode,counterCodigo,counterDescripcion,counterReferentes,checkEmail} from '../../../validations/validations'

  export default {
    components: {
      proyectosTecnologias,
      loader
    },
    data: () => ({
      proyectoFueGuardado: true,
      newsletter: null,
      rules: {
        checkCode: checkCode,
        counterCodigo: counterCodigo,
        counterDescripcion: counterDescripcion,
        counterReferentes: counterReferentes,
        checkEmail: checkEmail,
      },
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
      },
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
      dialog (val) {
        val || this.close()
      },
    },
    
    created () {
        this.initialize()
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
          if(this.$store.state.proyecto[0].Tecnologias === 0){
            var tecnologias = this.$store.state.proyecto[0].Tecnologias
            
            let contador = 0
            let flag = false
         
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
          } else return true
          
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

        loadUnidades_Negocios(){
            axios.get(ip+"/unidades_negocios/descripciones")
            .then(response => {
                this.unidades_Negocio = response.data
                this.unidades_NegocioDescripciones = response.data.map(unidad_negocio => unidad_negocio.Unidad_Negocio_Descripcion)
            })      
        },

        loadTecnologias(){
          axios.get(ip+"/tecnologias/descripciones").then((response) => {
            this.tecnologias = response.data;
          });
        },

        //--
        //Asigna descripciones al cargar el proyecto

        asignarDescripciones(){
            var desUnidad_Negocio = this.unidades_Negocio.filter(unidad_negocio => unidad_negocio.Unidad_Negocio_Key == this.proyecto.Proyecto_Unidad_Negocio)[0].Unidad_Negocio_Descripcion
            var desAlcance = this.alcances.filter(alcance => alcance.Proyecto_Alcance_Key == this.proyecto.Proyecto_Alcance)[0].Proyecto_Alcance_Descripcion
            var desTipoProyecto = this.proyectos_tipos.filter(tipo => tipo.Proyecto_Tipo_Key == this.proyecto.Proyecto_Tipo)[0].Proyecto_Tipo_Descripcion
            var desMoneda = this.monedas.filter(moneda => moneda.Moneda_Key == this.proyecto.Proyecto_Moneda)[0].Moneda_Codigo
            var desResponsable = //this.responsables.filter(responsable => responsable.Colaborador_Usuario == this.proyecto.Proyecto_Responsable)[0].Usuario.Usuario_Nombre_Completo
            this.proyecto.Responsable.Usuario_Nombre_Completo
            var desVendedor = this.vendedores.filter(vendedor => vendedor.Colaborador_Usuario == this.proyecto.Proyecto_Vendedor)[0].Usuario.Usuario_Nombre_Completo
            //this.proyecto.Vendedor.Usuario_Nombre_Completo
            this.proyecto.Proyecto_Newsletter = this.evalNewsletter()
            this.proyecto.Proyecto_Facturable = this.evalFacturable()
            this.proyecto.Proyecto_Unidad_Negocio = desUnidad_Negocio
            this.proyecto.Proyecto_Alcance = desAlcance
            this.proyecto.Proyecto_Tipo = desTipoProyecto
            this.proyecto.Proyecto_Moneda = desMoneda
            this.proyecto.Proyecto_Responsable = desResponsable
            this.proyecto.Proyecto_Vendedor = desVendedor
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
          this.$store.state.cliente[0].Proyectos.push(this.proyecto)
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
            this.$store.state.cliente[0].Proyectos = this.$store.state.cliente[0].Proyectos.filter(proyecto => proyecto.Proyecto_Codigo != this.defaultCode)
            this.$store.state.cliente[0].Proyectos.push(this.proyecto)
          })
          
        },

        guardarTecnologias(){
          if(this.tecnologiasOriginal.length > 0){
              axios.delete(ip+"/proyectos_tecnologias/"+this.proyecto.Proyecto_Key).then((response) => {
              
          })
          }
          var tecnologiasAGuardar = this.$store.state.proyecto[0].Tecnologias
         
          for(let i = 0; i< tecnologiasAGuardar.length; i++){
            this.asignarKey(tecnologiasAGuardar[i])
            tecnologiasAGuardar[i].Usuario_Creacion = localStorage.usuario_id
            tecnologiasAGuardar[i].Usuario_Modificacion = localStorage.usuario_id
            axios.post(ip+"/Proyectos_Tecnologias", tecnologiasAGuardar[i])
            .then((response) => {
              
            })
          }
          /*
          axios.get(ip+"/proyectos_tecnologias/"+this.proyecto.Proyecto_Key).then( response => {
            this.$store.state.proyecto[0].Tecnologias = response.data
          })
          */
        },

        asignarKey(tecnologia){
          if(typeof tecnologia.Proyecto_Tecnologia_Tecnologia === 'string'){
            console.log(tecnologia)
            var keyTecnologia = this.tecnologias.filter(tecno => tecno.Tecnologia_Descripcion == tecnologia.Proyecto_Tecnologia_Tecnologia)[0].Tecnologia_Key;
            tecnologia.Proyecto_Tecnologia_Tecnologia = keyTecnologia
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
          this.proyecto.Proyecto_Facturable = false
          } else{
            this.proyecto.Proyecto_Alcance = this.proyectoConDescripciones.Proyecto_Alcance
            this.proyecto.Proyecto_Unidad_Negocio = this.proyectoConDescripciones.Proyecto_Unidad_Negocio
            this.proyecto.Proyecto_Responsable = this.proyectoConDescripciones.Proyecto_Responsable
            this.proyecto.Proyecto_Vendedor = this.proyectoConDescripciones.Proyecto_Vendedor
            this.proyecto.Proyecto_Moneda = this.proyectoConDescripciones.Proyecto_Moneda
            this.proyecto.Proyecto_Facturable = this.proyectoConDescripciones.Proyecto_Facturable
            this.proyecto.Proyecto_Newsletter = this.proyectoConDescripciones.Proyecto_Newsletter
            }
        },
      },

     mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
     }

}
</script>
