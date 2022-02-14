<template>
  <v-content>
    <v-container class="contenedor">
      <loader :loader="loader" style="position: fixed;"/>
      <v-alert
        :value="alert"
        style="position: absolute;  left: 0; right: 0; top: -12px; text-align: -webkit-center;"
        top
        dense
        color="blue"
        type="success"
      > Se han guardado los cambios.
      </v-alert>
      <v-row class="rowSelectores">
        <!-- SELECTOR DE MES INICIO -->
        <v-col cols="2" class="colMes">
          <v-menu v-model="menu1" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="Mes"
                readonly
                outlined
                dense
                v-model="date"
                v-bind="attrs"
                v-on="on"
                class="textFieldSelectorMes"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date2"
              type="month"
              locale="es"
              class="datePicker"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="refreshHours()">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <!-- SELECTOR DE MES FIN -->

        <!-- SELECTOR DE USUARIO INICIO -->
        <v-col cols="2" class="colUsu">
          <v-autocomplete
            v-model="colaboradorSeleccionadoDescripcion"
            :items="colaboradoresDescripciones"
            :disabled="colaboradores.length == 1"
            :menu-props="{ bottom: true, offsetY: true }"
            label="Colaborador"
            placeholder="Seleccionar"
            class="seleccionarColaborador"
            @change="nuevoColaboradorAsignado"
            dense
            outlined
          ></v-autocomplete>
        </v-col>
        <!-- SELECTOR DE USUARIO FIN -->

        <!-- SELECTOR DE MODALIDADES INICIO -->
        <v-col cols="1" class="colMod px-1">
          <v-select
            dense
            multiple
            outlined
            v-model="modalidadesSeleccionadas"
            :menu-props="{ bottom: true, offsetY: true }"
            :items="modalidadesDescripciones"
            
            label="Modalidad"
            placeholder="Seleccionar"
            class="seleccionarModalidad"
          ></v-select>
        </v-col>
        <!-- SELECTOR DE MODALIDADES FIN -->

        <!-- SELECTOR DE ASIGNACIONES INICIO -->
        <v-col @click="disabled = false" cols="1" class="colAsig m-0 p-0">
          <v-dialog v-model="dialogAsignaciones" scrollable width="460px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="#3A8CBB"
                class="btnSeleccionarProyecto"
                v-b-tooltip.hover title="Asignaciones"
                :disabled="disabled"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-filter</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>Selecciona tus asignaciones</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 350px">
                <treeselect
                  class="seleccionarProyecto"
                  :multiple="true"
                  :options="options"
                  alwaysOpen
                  placeholder="Seleccionar proyectos"
                  search-nested
                  disableFuzzyMatching="true"                                    
                  :disable-branch-nodes="true"
                  defaultExpandLevel
                  
                  v-model="proyectosSeleccionados"
                />
                <treeselect-value :value="proyectosSeleccionados" /> 
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions style="margin-left:15rem">
                <v-btn color="#2991C6" @click="nuevoProyectoSeleccionado()" class="btnGuardar"
                >Guardar
                </v-btn>
                <v-btn
                color="#ffa025"
                dark
                class="btnCancelar"
                @click="dialogAsignaciones = false"
                >Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <!-- SELECTOR DE ASIGNACIONES FIN -->

        <!-- BOTON EXPORTAR PDF INICIO -->
        <v-col cols="1" class="colExpPDF px-0 mr-2" >
          <v-btn
            color="#F40F02"
            :disabled="!seguridadExportarExcel()"
            dark
            class="btnExportarPDF"
            v-b-tooltip.hover
            title="Exportar a PDF - En desarrollo"
            
          >
            <v-icon>mdi-file-pdf-outline</v-icon>
          </v-btn>
        </v-col>
        <!-- BOTON EXPORTAR PDF FIN -->

        <!-- BOTON EXPORTAR INICIO -->
        <v-col cols="1" class="colExp px-0 mr-2">
          <v-btn
            color="#1d6f42"
            :disabled="!seguridadExportarExcel()"
            dark
            class="btnExportar"
            v-b-tooltip.hover
            title="Exportar - En desarrollo"
          >
            <v-icon>mdi-table-arrow-up</v-icon>
          </v-btn>
        </v-col>
        <!-- BOTON EXPORTAR FIN -->

        <!-- BOTON IMPORTAR INICIO -->
        <v-col cols="1" class="colImp px-0 mr-2" >
          <v-btn
            color="#1d6f42"
            :disabled="!seguridadExportarExcel()"
            dark
            class="btnImportar"
            v-b-tooltip.hover
            title="Importar - - En desarrollo"
          >
            <v-icon>mdi-table-arrow-down</v-icon>
          </v-btn>
        </v-col>
        <!-- BOTON IMPORTAR FIN -->

        <!-- BOTON CARGA MASIVA INICIO -->
        <v-col cols="1" class="colRep px-0 mr-2">
           <v-dialog v-model="dialogCargaMasiva" persistent scrollable width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="#1a5e86"
                class="btnSeleccionarProyecto"
                v-b-tooltip.hover title="Carga Mavisa de Horas"
                :disabled="mesAbierto === 'C' && puedeCargaMasiva()"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </template>
            <v-card class="cardBulkLoad">
              <v-card-title class="justify-center">Selecciona un período para cargar horas</v-card-title>
              <v-card-text class="cardBulkLoad2">
                 
                 <v-date-picker class="dataPickerBulkLoad"
                  v-model="dates"
                  type="date"
                  locale="es"
                  range
                  show-current
                  no-title
                  :min="this.date2+'-'+'01'"
                  :max="this.date2+'-'+this.mes.length.toString()"

                  ></v-date-picker>
                <template class="textBulkLoad">
                  <v-text-field
                  
                  outlined
                  dense
                  type="number"
                  v-model="cargaMasivaCantHoras"
                  label="Cantidad de Horas"
                  placeholder="Horas"
                  class="v-text-field-bulkLoad"
                  ></v-text-field>
                  <v-select
                  dense
                  outlined
                  label="Selecciona una Asignacion"
                  class="v-text-field-bulkLoad"
                  placeholder=""
                  v-model="cargaMasivaAsignacionSelecionada"
                  :items="proyectosSeleccionados"
                  
                  ></v-select>
                   <v-select
                  dense
                  outlined
                  :items="modalidadesSeleccionadas"
                  class="v-text-field-bulkLoad"
                  v-model="cargaMasivaModalidad"
                  label="Selecciona una Modalidad"
                  placeholder=""
                  
                  ></v-select>
                  <div class="validationsBulkLoad">
                  <p v-show="cargaMasivaCantHoras < 0" style="color:orange">La cantidad de horas tiene que ser mayor o igual a "0" </p>
                  <p v-show="dates[1] < dates[0]" style="color:orange">La fecha DESDE tiene que ser menor a la fecha HASTA </p>
                  </div>    
                   <v-btn
                    :disabled="!validateBulkLoad()" 
                    color="#2991C6"
                    dark
                    class="btnGuardarBulk"
                    @click="bulkLoad() "
                > Actualizar
                </v-btn>
                   <v-btn
                    color="#ffa025"
                    dark
                    @click="cancelBulkLoad()"
                    class="btnGuardarBulk"
                    
                > Cancelar
                </v-btn>
                </template>
                  

              </v-card-text>


            </v-card>
          </v-dialog>
        </v-col>
        <!-- BOTON CARGA MASIVA FIN -->

        <!-- BOTON REPORTES INICIO -->
        <v-col cols="1" class="colRep px-0 mr-2">
           <v-dialog v-model="dialogReporte" scrollable width="460px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="#1a5e86"
                class="btnSeleccionarProyecto"
                v-b-tooltip.hover title="Reportes"
                :disabled="!puedeGenerarReporte()"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-table</v-icon>
              </v-btn>
            </template>
            <v-card class="cardReport">
              <v-card-title>Selecciona un Reporte</v-card-title>

              <v-card-text style="height: 350px">

                  <v-btn @click="timeReportCargaUsuario()" color="#1a5e86" class="reporte"> Time Report por Usuario </v-btn>
                  <v-btn  @click="timeReportCargaResumen()" color="#1a5e86" class="reporte"> Time Report Resumen </v-btn>

              </v-card-text>


            </v-card>
          </v-dialog>
        </v-col>
        <!-- BOTON REPORTAR FIN -->

        <!-- BOTON DE GUARDAR INICIO -->

        <v-col cols="1" class="colGuar px-0 mr-2">
            <template>
                <v-btn
                :disabled="(mesAbierto === 'C' && puedeGuardar()) || waiting" 
                color="#2991C6"
                dark
                class="btnGuardar"
                @click="save() "
                > Guardar
                </v-btn>
            </template>
          </v-col>

          
        <!-- BOTON DE GUARDAR FIN -->

        <!-- BOTON DE CANCELAR INICIO -->
        
        <v-col cols="1" class="colCanc px-0 mr-2">
          <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="#ffa025"
                dark
                v-bind="attrs"
                v-on="on"
                
                > Cancelar
                </v-btn>
            </template>
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
                  @click="refreshHours()"
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
        </v-col>
        <!-- BOTON DE CANCELAR FIN -->
      </v-row>

      <!-- DATA TABLE INICIO -->
      <div>
        <b-table-simple
          hover
          small
          v-if="showGrid"
          :borderless="borderless"
          caption-top
          responsive
          class="table table-hover"
        >
          <colgroup>
            <col />
            <col />
          </colgroup>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <colgroup>
            <col />
            <col />
          </colgroup>

          <b-thead class="tHead">
            <b-tr>
              <b-th colspan="4"></b-th>
              <!-- Iterador de numero de dias en mes -->
              <b-th v-for="day in days.number" class="numeroDia">
                <b-td class="numeroDiaEspecial" v-if="days.specialDay[day-1]==true">{{day}}</b-td>
                <b-td class="numeroDiaNoEspecial" v-if="days.specialDay[day-1]==false">{{day}}</b-td>
                </b-th>
              <!-- Ultima columna de Total Horas (sumas) -->
              <b-th colspan="2" class="totalHorasY">Total</b-th>
            </b-tr>
            <b-tr>
              <!-- Iterador de nombre de numero de dias en mes -->
              <b-th colspan="4"></b-th>
              <b-th v-for="day in days.name" class="nombreDia">
                <b-td class="nombreDiaFinSemana" v-if="day === 'S' || day === 'D'"> {{day}}</b-td>
                <b-td class="nombreDiaDeSemana" v-if="day != 'S' && day != 'D'"> {{day}}</b-td>
                </b-th>   
              <b-th></b-th>
            </b-tr>
          </b-thead>

          <!-- TABLA ASIGNACIONES INICIO -->
          <b-tbody v-for="asignacion in asignacionesHoras">
            <b-tr>
              <b-th rowspan="3" colspan="1" class="color1"></b-th>

                <b-th rowspan="3" colspan="2" class="color1">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                    >
                    {{asignacion.name}}
                    </span>
                      </template>
                         <span>
                          Proyecto: {{ asignacion.tooltip.Proyecto_Descripcion }} <br>
                          Region: {{asignacion.tooltip.Cliente.Region.Region_Descripcion }} <br>
                          Responsable: {{ asignacion.tooltip.Responsable.Usuario_Nombre_Completo }} <br>
                          Alcance: {{ asignacion.tooltip.Alcance.Proyecto_Alcance_Descripcion }} <br>
                          Tipo: {{ asignacion.tooltip.Tipo.Proyecto_Tipo_Descripcion }} <br>
                          Vendedor: {{ asignacion.tooltip.Vendedor.Usuario_Nombre_Completo }}
                        </span>
                </v-tooltip>
              </b-th>

              <b-th v-if="evaluarModalidad('LO')" class="colorLocal1">{{asignacion.modalidades.local.name}}</b-th>

              <!-- LOCAL INICIO    -->

              <b-td
                v-if="evaluarModalidad('LO')"
                class="colorLocal1"
                v-for="(hora, index) in asignacion.modalidades.local.horas"
              >
                <input
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  type = "number"
                  maxlength = "4"
                  size="1"
                  min="0"
                  max="20"
                  :disabled="mesAbierto === 'C'"
                  class="classLocal"
                  @input="(e, f) =>handleInput(e,asignacion.modalidades.local.horas[index],f)"
                  :value="asignacion.modalidades.local.horas[index].valor"
                />
              </b-td>
              <b-th v-if="evaluarModalidad('LO')" id="totalHoras" class="sumasY">
                {{ sumasEnXLocal(asignacion) }}
              </b-th>
            </b-tr>

            <!-- LOCAL FIN -->

            <!-- HOME OFFICE INICIO -->
            <b-tr>
              <b-th v-if="evaluarModalidad('HO')" class="colorHO1">
                {{ asignacion.modalidades.homeoffice.name }}
              </b-th>

              <b-td
                v-if="evaluarModalidad('HO')"
                class="colorHO1"
                v-for="(hora, index) in asignacion.modalidades.homeoffice.horas"
                ><input
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  type = "number"
                  maxlength = "3"
                  size="1"
                  min="0"
                  max="20"
                  :disabled="mesAbierto === 'C'"
                  class="classHomeOffice"
                  @input="(e, f) =>handleInput(e,asignacion.modalidades.homeoffice.horas[index],f)"
                  :value="asignacion.modalidades.homeoffice.horas[index].valor"
                />
              </b-td>
              <b-th v-if="evaluarModalidad('HO')" id="totalHoras" class="sumasY">
                {{ sumasEnXHomeOffice(asignacion) }}
              </b-th>
            </b-tr>
            <!-- HOME OFFICE FIN -->

            <!-- EXTRANJERO INICIO -->
            <b-tr>
              <b-th v-if="evaluarModalidad('EX')" class="colorExtranjero1">{{asignacion.modalidades.extranjero.name}}</b-th>

              <b-td
                v-if="evaluarModalidad('EX')"
                class="colorExtranjero1"
                v-for="(hora, index) in asignacion.modalidades.extranjero.horas"
              >
                <input
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  type = "number"
                  maxlength = "3"
                  size="1"
                  min="0"
                  max="20"
                  :disabled="mesAbierto === 'C'"
                  class="classExtranjero"
                  @input="(e, f) =>handleInput(e,asignacion.modalidades.extranjero.horas[index],f)"
                  :value="asignacion.modalidades.extranjero.horas[index].valor"
              /></b-td>
              <b-th v-if="evaluarModalidad('EX')" id="totalHoras" class="sumasY">{{ sumasEnXExtranjero(asignacion) }}</b-th>
            </b-tr>
            <!-- EXTRANJERO FIN -->
          </b-tbody>

          <!-- FOOTER TABLA INICIO -->
          <b-tfoot>
            <b-tr>
              <b-th colspan="4" class="totalHorasX"><b>Total:</b></b-th>
              <b-th v-for="day in numberOfDays" class="sumas"> 
                <b-td class="sumasmayor8" v-if="((horasColumnas[day-1] > 0) && (days.specialDay[day-1] === true && days.name[day-1] !== 'D' && days.name[day-1] !== 'S'))">{{horasColumnas[day-1]}}</b-td>
                
                <b-td class="sumasmenor8" v-if="((horasColumnas[day-1] == 0) && (days.specialDay[day-1] === true && days.name[day-1] !== 'D' && days.name[day-1] !== 'S'))">{{horasColumnas[day-1]}}</b-td>
                
                <b-td class="sumasmayor8" v-if="(horasColumnas[day-1] == 0 || horasColumnas[day-1] > colaboradorHorasPorDia) && (days.specialDay[day-1] === false && days.name[day-1] !== 'D' && days.name[day-1] !== 'S')">{{horasColumnas[day-1]}}</b-td>

                <b-td class="sumasmayor8" v-if="(horasColumnas[day-1] > 0 && horasColumnas[day-1] < colaboradorHorasPorDia && (days.specialDay[day-1] === false && days.name[day-1] !== 'D' && days.name[day-1] !== 'S'))">{{horasColumnas[day-1]}}</b-td>
                                
                
                <b-td class="sumasmenor8" v-if="((horasColumnas[day-1] === colaboradorHorasPorDia) && (days.specialDay[day-1] === false && days.name[day-1] !== 'D' && days.name[day-1] !== 'S'))">{{horasColumnas[day-1]}}</b-td>
                
                
                
                
                <b-td class="sumasmenor8" v-if="days.name[day-1] === 'S' && horasColumnas[day-1] == 0 ">{{horasColumnas[day-1]}}</b-td>
                <b-td class="sumasmenor8" v-if="days.name[day-1] === 'D' && horasColumnas[day-1] == 0 ">{{horasColumnas[day-1]}}</b-td>
                <b-td class="sumasmayor8" v-if="days.name[day-1] === 'D' && horasColumnas[day-1] > 0">{{horasColumnas[day-1]}}</b-td>
                <b-td class="sumasmayor8" v-if="days.name[day-1] === 'S' && horasColumnas[day-1] > 0">{{horasColumnas[day-1]}}</b-td>
              </b-th>
              <b-th class="sumaTotalMes">{{sumaTotalEnX()}}</b-th>
            </b-tr>
          </b-tfoot>
          <!-- FOOTER TABLA FIN -->

          <!-- TABLA ASIGNACIONES FIN -->
        </b-table-simple>
        <!-- DATA TABLE FIN -->
        
      </div>
    </v-container>
  </v-content>
</template>

<script>
import moment, { months } from "moment";
import axios from "axios";
import loader from '../Estado/loader'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { substr } from '../../ip/ip';
const ip = require("../../ip/ip");

export default { 
  components: { Treeselect, loader},
  data() {
    return {
      loader: true,

      disabled: false,

      showGrid: false,

      mesAbierto: '',

      horasColumnas:[],

      horasColumnasSuma: 0,

      // bordes de grilla
      borderless: true,

      // Harcodeo de de carga de horas en 0
      inputrow: 0,

      // Array de numero de dias
      numberOfDays: [],

      //Objeto que tiene los dias del mes con 3 propiedades 1. Nro del dia - 2. Fecha - 3. Primera letra del dia
      days: {},

      proyectos: [],

      clientes: [],

      // Nombre de proyectos
      proyectosDescripciones: [],

      // Key de proyectos
      proyectosCodigos: [],

      ProyectoSeleccionadoDescripcion: "",

      proyecto_descripciones: "",

      proyectosSeleccionados: [],

      colaboradores: [],

      modalidades: [],

      modalidadesDescripciones: [],

      modalidadesSeleccionadas: ["HO"], //se completa con la info del usuario

      clienteKey: [],

      clienteDescripcion: [],

      // Descripciones de Usuarios
      colaboradoresDescripciones: [],

      // Key de colaborador seleccionado
      colaborador: {},
      colaboradorHorasPorDia: 0,
      colaborador_codigo :'',
      colaborador_region:'',
      colaborador_calendario_key : null,
      calendarios : [],

      // Colaborador seleccionado , por defecto el mismo que el logeado
      colaboradorUsuario: "",

      colaborarCantidad : true,

      colaboradorSeleccionadoDescripcion: "",

      cargaMasivaAsignacionSelecionada : "",
      cargaMasivaModalidad: '',
      cargaMasivaDesde:0,
      cargaMasivaHasta:0,
      cargaMasivaCantHoras : 0,
      flagBulk : false,
      // Asignaciones
      asignacionesHoras: [],
      asignacion: {},
      dialogCargaMasiva:false,

      // Selector de mes
      date: '',
      date2: '',
      menu1: false,
      mesActualDinamico: 0,
      feriados: [],
      feriadosFechas: [],

      mes:[],

      dataGet: [],

      day: 0,

      tooltips:[],
      tooltipAsignacion:[],

      dates : [],


      // Valores overlay
      overlay: false,
      zIndex: 0,
      dialogAsignaciones: false,
      dialogCancelar: false,
      dialogReporte:false,

      // Treeview selector de asignaciones
      // Value van a quedar guardadas las asignaciones seleccionadas
      value: [],
      // Lista de asignaciones
      options: [],
      alert: false,
      timeout: 7000,
      waiting: false,
    };
  },

  watch: {
    asignacionesHoras: {
      handler(val) {
        console.log(JSON.stringify(val, null, 2));
      },
      deep: true,
    },
  },

  computed: {
    // Script de selector de mes
    mesSeleccionado() {
      return this.date ? moment(this.date).format("YYYYMM") : "";
    },
    calculoColumnas(){
      return this.asignacionesHoras === 0;
    },
    
  },
  methods: {
    // Glosario de metodos (Selecciona el nombre del metodo y apretar ctrl + F para ir a la seccion)
    // 01 - Prints
    // 02 - Calculos de tabla
    // 03 - Persistencia
    // 04 - Estructura
    // 05 - Fechas & Formateos
    // 06 - Filtros
    // 07 - Botones
    // 08 - Pedidos a la base
    // 09 - Funcion Input

    // =============================== 01 - Prints Inicio ===============================
    // En esta seccion van las pruebas para printear en consola del navegador
    puedeGuardar(){
      return localStorage.Permisos.includes("P2") && localStorage.Permisos.includes("P3")
    },

    puedeExportarPDF(){
      return localStorage.Permisos.includes('PX')
    },

    puedeExportar(){
      return localStorage.Permisos.includes('PX')
    },

    puedeImportar(){
      return localStorage.Permisos.includes('PX')
    },

    puedeCargaMasiva(){
      return localStorage.Permisos.includes('P39')
    },
    
    puedeGenerarReporte(){
      return localStorage.Permisos.includes('P38')
    },    
    
    printA() {
      console.log(this.asignacionesHoras[0].name)
      this.parametersBulkLoad();
      ///console.log(this.asignacionesHoras);
      //var a = 
      //console.log(this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada));
      //console.log(a.filter(m => m.name == this.cargaMasivaModalidad))
    },

    printAsignacionesHoras() {
      console.log(this.asignacionesHoras);
    },

    printInicializarColumnas(){
      console.log(this.horasColumnas);
    },
    debug(){
      this.infoTooltip()
      console.log(this.asignacionesHoras)
      console.log(this.asignacionesHoras[0].tooltip)
    },

    // =============================== Prints Fin ===============================



    // =============================== 02 - Calculos de tabla Inicio ===============================
    // En esta seccion van los calculos que se utilizan en la tabla de horas (Sumas de columnas y de filas)
    
    inicializarTotalColumnas(){
      this.horasColumnas = [];
      for( var i = 0; i <= this.numberOfDays ; i++){
        this.horasColumnas.push(0);
      }
    },

    sumarcolumnas() {
      var sum = 0;
      for(var x = 0; x < this.numberOfDays; x ++){
      sum=0
      for(var i = 0; i < this.asignacionesHoras.length; i++) {
        if(this.modalidadesSeleccionadas.includes('LO'))
        {sum += parseFloat(this.asignacionesHoras[i].modalidades.local.horas[x].valor)
        } 
        if(this.modalidadesSeleccionadas.includes('HO'))
        {sum += parseFloat(this.asignacionesHoras[i].modalidades.homeoffice.horas[x].valor)
        } 
        if(this.modalidadesSeleccionadas.includes('EX'))
        {sum += parseFloat(this.asignacionesHoras[i].modalidades.extranjero.horas[x].valor)
        }  
      }
      if(isNaN(sum)){
        this.horasColumnas[x] = 0;
      } else{
        this.horasColumnas[x] = Math.round(sum * 100) / 100;
      }
      
      }
      },

    // Funcion para total de sumas de horas de modalidad local en la columna final
    sumasEnXLocal(asig) {
      var sum = 0;
      for (var i = 0; i < asig.modalidades.local.horas.length; i++) {
        sum += parseFloat(asig.modalidades.local.horas[i].valor)
      }
      if(isNaN(sum)){
        return 0
      } else {
        return Math.round(sum * 100) / 100
      }
    },

    // Funcion para total de sumas de horas de modalidad homeoffice en la columna final
    sumasEnXHomeOffice(asig) {
      var sum = 0;
      for (var i = 0; i < asig.modalidades.homeoffice.horas.length; i++) {
        sum += parseFloat(asig.modalidades.homeoffice.horas[i].valor);
      }
      if(isNaN(sum)){
        return 0
      } else {
        return Math.round(sum * 100) / 100
      }
    },

    // Funcion para total de sumas de horas de modalidad homeoffice en la columna final
    sumasEnXExtranjero(asig) {
      var sum = 0;
      for (var i = 0; i < asig.modalidades.extranjero.horas.length; i++) {
        sum += parseFloat(asig.modalidades.extranjero.horas[i].valor);
      }
      if(isNaN(sum)){
        return 0
      } else {
        return Math.round(sum * 100) / 100
      }
    },


     // Funcion para total de sumas de horas totales de todas las modalidades
    sumaTotalEnX(){
      var suma = 0
      for(let i = 0; i< this.horasColumnas.length; i++){
        suma += parseFloat(this.horasColumnas[i])
      }
      if(isNaN(suma)){
        return 0
      } else {
        return Math.round(suma * 100) / 100
      }
    },

    sumaTotalHomeOffice(){
      var sum = 0;
      var totalHomeDias = []
      for(var x = 0; x < this.numberOfDays; x ++){
      sum=0
      for(var i = 0; i < this.asignacionesHoras.length; i++) {
        sum += parseFloat(this.asignacionesHoras[i].modalidades.homeoffice.horas[x].valor);
      }
      totalHomeDias[x] = sum;
      }
      let sumaTotal = 0
      for (let i=0 ; i< totalHomeDias.length;i++){
        sumaTotal += totalHomeDias[i]
      }

      if(isNaN(sumaTotal)){
        return 0
      } else {
        return Math.round(sumaTotal * 100) / 100
      }
    },

/*
    alertaHomeOfficeMensual(){
      var valorDelUsuario = this.colaborador.HomeOffice.Colaborador_Home_Cantidad
      console.log(valorDelUsuario)
      var restoDeDias = this.numberOfDays % 8
      console.log(restoDeDias)
      var cantidadHO = valorDelUsuario * 4 + ((restoDeDias * 7) / valorDelUsuario )
      console.log(cantidadHO)
      console.log(sumaTotalHomeOffice()/8)
      if(cantidadHO > (this.sumaTotalHomeOffice()/8)){
          alert('Se exceden las horas HO cargadas')
        } else if(cantidadHO > (this.sumaTotalHomeOffice()/8)){
          alert('No se alcanzan las horas HO mínimas')
        }
    },
*/

    // =============================== Calculos de tabla Fin ===============================

    // =============================== 04 - Estructura Inicio ===============================

    generarSetDatos(proyecto) {
      if (this.seSeleccionoProyecto(proyecto.Proyecto_Descripcion)) {
        console.log("El proyecto ya se encuentra seleccionado");
      } else {
        var asignacion = this.generateJSONAsignacion();
        asignacion.modalidades.local.local_key = 1;
        asignacion.modalidades.homeoffice.homeoffice_key = 2;
        asignacion.modalidades.extranjero.extranjero_key = 3;
        asignacion.key_name = proyecto.Proyecto_Key;
        asignacion.name = proyecto.Proyecto_Descripcion;
        asignacion.proyecto_codigo = proyecto.Proyecto_Codigo;
        asignacion.tooltip = {}
        asignacion.periodo = proyecto.Tiempo_Abierto_Cerrado
        this.asignacionesHoras.push(asignacion);
        this.reload();
      }
    },

    generateJSONAsignacion() {
      var asignacion = {
      name: "",
      periodo: "",
      tooltip:"",
      key_name: "",
      proyecto_codigo:"",
      modalidades: {
        local: {
          name: 'LO',
          local_key: "1",
          horas: [],
        },
        homeoffice: {
          name: 'HO',
          homeoffice_key: "2",
          horas: [],
        },
        extranjero: {
          name: 'EX',
          extranjero_key: "3",
          horas: [],
        },
      },
    };
    for (var i = 0; i < this.numberOfDays; i++) {
      asignacion.modalidades.local.horas.push({ hora: i+1, valor: 0});
      asignacion.modalidades.homeoffice.horas.push({ hora: i+1, valor: 0});
      asignacion.modalidades.extranjero.horas.push({ hora: i+1, valor: 0});
    }
   

    return asignacion;
    },

    // =============================== Estructura Fin ===============================

    // =============================== 05 - Fechas & Formateos Inicio ===============================

    // Formatea el mes seleccionado actual
    MesActualFormato() {
      this.mesActualDinamico = moment(this.date).format("YYYYMM");
    },

    // Force Updates
    reload() {
      this.$forceUpdate();
    },

    // Script de extension de fechas de MomentJS
    moment: function (mesSeleccionado) {
      return moment(this.mesSeleccionado).locale('es');
    },

    mesCalculo() {
      var mes = this.date;
      mes = this.date ? moment(this.date).locale('es').format("YYYYMM") : "";
      mes = String(mes) + "01";
      mes = Number(mes);
      return mes;
    },

    // =============================== Fechas & Formateos Fin ===============================

    // =============================== 06 - Filtros Inicio ===============================

    nuevoProyectoSeleccionado() {
      // Validar si el proyecto ya se esta mostrando
      var asignacionesFiltradas = this.asignacionesHoras.filter(asignacion => this.proyectosSeleccionados.includes(asignacion.name))
      this.asignacionesHoras = asignacionesFiltradas
      for (var i = 0; i < this.proyectosSeleccionados.length; i++) {
        var proyecto = this.proyectos.find(p => p.Proyecto_Descripcion == this.proyectosSeleccionados[i]);
        console.log(proyecto)
        console.log("proyecto"); 
       this.generarSetDatos(proyecto);
      }
      this.dialogAsignaciones = false;
      this.infoTooltip()
    },

    seSeleccionoProyecto(name) {
      var existe = false;
      existe = this.asignacionesHoras.some((a) => a.name == name);
      console.log(existe);
      return existe;
    },

    async nuevoColaboradorAsignado() {
      var key = this.colaboradores.filter((c) => c.Colaborador_Descripcion == this.colaboradorSeleccionadoDescripcion)[0].Colaborador_Usuario;
      var horasPorUsuario = this.colaboradores.filter((c) => c.Colaborador_Descripcion == this.colaboradorSeleccionadoDescripcion)[0].CantHora.Colaborador_Hora_Dia;
      var colaborador = this.colaboradores.filter((c) => c.Colaborador_Descripcion == this.colaboradorSeleccionadoDescripcion)[0]
      this.colaborador_calendario_key = this.colaboradores.filter((c) => c.Colaborador_Descripcion == this.colaboradorSeleccionadoDescripcion)[0].Colaborador_Calendario
      await this.getFeriados();
      this.updateGrid();
      this.colaboradorUsuario = key;
      this.colaborador = colaborador;
      this.colaboradorHorasPorDia = horasPorUsuario
      this.giveMeHours();
    },

    cantidadDeProyectos() {
      var cantidad = [];
      cantidad = this.dataGet.map((json) => json.Hora_Proyecto);
      cantidad = new Set(cantidad);
      cantidad = Array.from(cantidad);
      return cantidad;
    },

    modalidadesFiltradas() {
      var modalidadesFiltadas = this.modalidades;
      console.log(modalidadesFiltadas);
      for (var i = 0; i < this.modalidadesSeleccionadas.length; i++) {
        modalidadesFiltadas = modalidadesFiltadas.filter((m) => m.Tipo_Hora_Descripcion == this.modalidadesSeleccionadas[i]);
      }
      console.log(modalidadesFiltadas);
    },

    //Evaluacion de modalidades seleccionadas para mostrar u ocultar las modalidades
    evaluarModalidad(modalidad) {
      return this.modalidadesSeleccionadas.includes(modalidad);
    },

    // =============================== Filtros Fin ===============================

    // =============================== 07 - Botones Inicio ===============================

    async refreshHours() {
      this.date = this.date2  
      this.horasColumnas = []
      await this.getFeriados();
      this.updateGrid();
      this.asignacionesHoras = [];
      this.giveMeHours();
      this.menu1 = false;
      this.dialogCancelar = false;
    },

    async eliminarMes() {
      await axios
        .delete(
          ip + "/horas/" + this.colaboradorUsuario + "/" + this.mesActualDinamico)
        .then((response) => {
           console.log(response.data);
        });
     
    },

    // =============================== Botones Fin ===============================

    // =============================== 08 - Pedidos a la base Inicio ===============================

    // Me traigo las modalidades de la base
    async giveMeModalidades() {
      await axios.get(ip + "/horas_tipos/").then((response) => {
        this.modalidades = response.data;
        this.modalidadesDescripciones = response.data.map(
          (modalidad) => modalidad.Hora_Tipo_Codigo
        );
      });
    },

    seguridadImportarExcel(){
      return localStorage.Permisos.includes('P35')
    },

    seguridadExportarExcel(){
      return localStorage.Permisos.includes('P36')
    },

    seguridadImportarPDF(){
      return localStorage.Permisos.includes('P37')
    },

    async giveMeProyects() {
      await axios.get(ip + "/proyectos/").then((response) => {
        this.proyectos = response.data;
      });
    },

    async giveMeClients() {
      await axios.get(ip + "/clientes/clientes_proyectos").then((response) => {
        this.clientes = response.data;
        console.log(response.data)
      });
      this.jerarquiaProyectos();
    },

    jerarquiaProyectos(){
      for(var i = 0; i <= this.clientes.length; i++){
        var op = {
              id: this.clientes[i].Cliente_Codigo,
              label: this.clientes[i].Cliente_Descripcion,
              children: [],
            };
            for(var n = 0; n < this.clientes[i].Proyectos.length; n++ ){
                var ch = {
                  id: this.clientes[i].Proyectos[n].Proyecto_Descripcion,
                  label: this.clientes[i].Proyectos[n].Proyecto_Descripcion
                }
                op.children.push(ch)
              } 
        this.options.push(op);
      }
    },
  timeReportCargaResumen(){	
    window.open("http://cs.crysol.net:8081/BOE/OpenDocument/opendoc/custom.jsp?sIDType=CUID&iDocID=Ac5rgt.f99xMpJxF86oHeq4&sIDType=CUID&lsSResponsable="+this.colaborador_codigo)
    
  },
  timeReportCargaUsuario(){
    window.open("http://cs.crysol.net:8081/BOE/OpenDocument/opendoc/custom.jsp?sIDType=CUID&iDocID=AV9nD8PXIfVJmKh4kFnYx7A")
  },
    //Me traigo los colaboradores del back .
    async giveColaboradores() {
        await axios.get(ip+"/colaboradores/jerarquia/"+localStorage.usuario_id).then((response) => {
        this.colaboradores = response.data;
        this.colaboradoresDescripciones = this.colaboradores.map(colaborador => colaborador.Colaborador_Descripcion)
        this.colaborador = response.data[0]
        this.colaboradorHorasPorDia = this.colaborador.CantHora.Colaborador_Hora_Dia
        this.colaborador_codigo = response.data[0].Colaborador_Codigo
        this.colaborador_calendario_key = response.data[0].Colaborador_Region
        })
    },
    async giveRegion(){
        await axios.get(ip+'/calendarios/').then((response) => {
          this.calendarios = response.data
        })
      },
    async assignColaborador(){
      await this.giveColaboradores();
      this.colaboradorSeleccionadoDescripcion = this.colaborador.Colaborador_Descripcion
      this.colaboradorUsuario = this.colaborador.Colaborador_Usuario
      
    },

    async giveMePeriods(){
      await axios.get(ip+"/tiempos_periodos/")
        .then(response => {
          this.allPeriods = response.data
          if(this.allPeriods.filter(period => period.Tiempo_Abierto_Cerrado == 'A').length == 0){
            this.date = new Date().toISOString().substr(0, 7)
          } else{
            this.date = this.allPeriods.filter(period => period.Tiempo_Abierto_Cerrado == 'A')[0].Tiempo_Periodo_Fecha
          }
        })
    },

  //tooltip
   async giveMeTooltip(proyectoCodigo,asignaciones,i){
     var tooltips = ''
      var dataTooltip =  this.generateJSONTooltip();
      await axios.get(ip+"/proyectos/proyecto/"+proyectoCodigo).then((response) => {       
        asignaciones[i].tooltip = response.data
      })
        
    },
     infoTooltip(){
      for(var i = 0; i <= this.asignacionesHoras.length; i++){
        var proyectoCodigo = this.asignacionesHoras[i].proyecto_codigo;
        
        this.giveMeTooltip(proyectoCodigo,this.asignacionesHoras,i);
        }
    },
    generateJSONTooltip(){
        var infoTooltip = {
          proyecto: "",
          region: "",
          responsable: "",
          alcance: "",
          tipo: "",
          vendedor: "",
        };
      return infoTooltip;
    },
    //Me traigo las horas por defecto , Mes actual y colaboradorUsuario conectado.
    async giveMeHours() {
      this.MesActualFormato()
      this.numberOfDays = moment(this.date).daysInMonth()
      this.asignacionesHoras = [];
      await axios.get(ip + "/horas"+"/"+this.colaboradorUsuario+"/"+this.mesActualDinamico+this.numberOfDays)
      .then((response) => {
        this.asignacionesHoras = response.data;
        this.disabled = false
        this.mesAbierto = this.asignacionesHoras[0].periodo
        this.proyectosSeleccionados = this.asignacionesHoras.map(a => a.name)
        this.infoTooltip()
      }).catch(e => {
        axios.get(ip+"/tiempos_periodos/"+  this.mesSeleccionado.substr(0,6)).then((response) => {
          this.mesAbierto = response.data.Tiempo_Abierto_Cerrado
        })
        
      })
      this.reload();
    },

    async getFeriados(){
      await axios.get(ip+"/feriados/"+this.colaborador_calendario_key)
      .then((response) => {
        this.feriados = response.data
        this.feriados = this.feriados.filter((feriado) => feriado.Feriado_Fecha.includes(this.date))
        this.feriadosFechas = this.feriados.map((feriado) => feriado.Feriado_Fecha)
      })
    },

    async save(){
      this.waiting = true
      var pedido = {
        asignaciones : this.asignacionesHoras,
        usuario : this.colaboradorUsuario,
        fecha : this.mesActualDinamico,
        usuarioLogueado : localStorage.usuario_id
      }
      await axios.post(ip+'/horas',pedido).then((response) => {
        this.alert = true
        setTimeout(() => {
          this.alert = false
          this.waiting = false
          }, 2000)
      });

    },

    
    validateBulkLoad(){
      return this.dates.length == 2  // cantidad de dias selecionados si o si 2.
             && this.dates[1].substring(8,10) > this.dates[0].substring(8,10)
             &&  this.cargaMasivaCantHoras >= 0
             && this.cargaMasivaModalidad != ''
             && this.cargaMasivaAsignacionSelecionada != ''
            
      },

    bulkLoad(){
      var desde = this.dates[0].substring(8,10);
      var hasta = this.dates[1].substring(8,10);
      this.cargaMasivaDesde = desde
      this.cargaMasivaHasta = hasta
      if(desde <= 9){
        desde.substring(1);
      }
      if(hasta <= 9){
        hasta.substring(1);
      }

     if(this.cargaMasivaModalidad == 'HO'){
        console.log("entre ")
        hasta++;
        while(desde != hasta){
          console.log(this.days.name[desde-1])
          this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada)[0].modalidades.homeoffice.horas[desde - 1].valor = this.cargaMasivaCantHoras;
          if(this.days.name[desde-1] == 'S' || this.days.name[desde-1] == 'D' || this.days.specialDay[desde - 1]) {
            this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada)[0].modalidades.homeoffice.horas[desde - 1].valor = 0;
          }
          desde++;
          
        }
      }
      if(this.cargaMasivaModalidad == 'LO' || this.days.name[desde-1] == 'D' || this.days.specialDay[desde - 1]){
          hasta++;
        while(desde != hasta){
          console.log(this.days.name[desde-1])
          this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada)[0].modalidades.local.horas[desde - 1].valor = this.cargaMasivaCantHoras;
          if(this.days.name[desde-1] == 'S' || this.days.name[desde-1] == 'D' || this.days.specialDay[desde - 1]) {
            this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada)[0].modalidades.local.horas[desde - 1].valor = 0;
          }
          desde++;
          
        }
        
      }
      if(this.cargaMasivaModalidad == 'EX' ||this.days.name[desde-1] == 'D' || this.days.specialDay[desde - 1]){
          hasta++;
        while(desde != hasta){
          console.log(this.days.name[desde-1])
          this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada)[0].modalidades.extranjero.horas[desde - 1].valor = this.cargaMasivaCantHoras;
          if(this.days.name[desde-1] == 'S' || this.days.name[desde-1] == 'D' || this.days.specialDay[desde - 1]) {
            this.asignacionesHoras.filter( a => a.name == this.cargaMasivaAsignacionSelecionada)[0].modalidades.extranjero.horas[desde - 1].valor = 0;
          }
          desde++;
          
        }
      }
      this.cargaMasivaCantHoras = this.colaborador.CantHora.Colaborador_Hora_Dia;
      this.cargaMasivaModalidad = this.modalidadesSeleccionadas[0]
      this.cargaMasivaAsignacionSelecionada = this.asignacionesHoras[0].name
      this.dialogCargaMasiva = false
      
      
    },

    cancelBulkLoad(){
       this.cargaMasivaCantHoras = this.colaborador.CantHora.Colaborador_Hora_Dia;
      this.cargaMasivaModalidad = this.modalidadesSeleccionadas[0]
      this.cargaMasivaAsignacionSelecionada = this.asignacionesHoras[0].name
      this.dialogCargaMasiva = false
    },
   
    parametersBulkLoad(){
      this.cargaMasivaCantHoras = this.colaborador.CantHora.Colaborador_Hora_Dia;
      this.cargaMasivaModalidad = this.modalidadesSeleccionadas[0]
      this.cargaMasivaAsignacionSelecionada = this.asignacionesHoras[0].name
    },

    updateGrid(){
      // Dias en numeros del Mes seleccionado
      this.numberOfDays = moment(this.date).daysInMonth();
      const Mes = Array.from(
        {
          length: moment(this.date).daysInMonth(),
        },
        (x, i) => moment(this.date).startOf('month').add(i, "days")
      );
      this.mes = Mes
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      // Dias en letra del Mes seleccionado
      this.days.name = Mes.map((d) => String(d._d.toLocaleDateString('es-ES',options)).substr(0, 1).toUpperCase());
      this.days.date = Mes.map((d) => String(d._d.toISOString('es-ES').substr(0, 10)));
      this.days.number = Mes.map((d) => d._d.getDate())
      this.days.specialDay = Mes.map((d) => this.feriadosFechas.includes(String(d._d.toISOString('es-ES').substr(0, 10))))
    },

    // =============================== Pedidos a la base Fin ===============================

    // =============================== 09 - Funcion Input Inicio ===============================
    handleInput(e, o) {
        this.$set(o, "valor", e.target.value);
      }
    },

    waitTime(time) {
      return new Promise(resolve => {
        setTimeout(() => {
           resolve();
        }, time);
      })
    },

      
    // =============================== Funcion Input Fin ===============================

  created() {

  },

  beforeCreated() {
    //this.getFeriados()
    //this.updateGrid();
    
  },

  async beforeMount() {
    await this.giveMePeriods()
    this.giveMeModalidades();
    await this.assignColaborador();
    this.getFeriados();
    this.updateGrid();
    await this.giveMeHours(); 
    this.showGrid = true
    this.loader = false
    this.giveMeProyects();
    this.giveRegion()
    this.giveMeClients();
    this.inicializarTotalColumnas();
    this.date2 = this.date
    this.dateInit = 
    this.parametersBulkLoad()
  },

  mounted() {
    if(!localStorage.login){
      this.$router.push("/login");
    }
  },

  beforeUpdate() {
    //this.getFeriados()
    this.updateGrid()
    this.sumarcolumnas();
    this.sumaTotalEnX();

  },
};
</script>

<style scoped lang="scss">
td, th {
   position: relative;
}

.table-hover tbody tr:hover td {
  background-color: rgba(148, 210, 252, 0.5);
}

th:hover::after, td:hover::after { 
   background-color: rgba(148, 210, 252, 0.5);
   content: '\00a0';  
   left: 0;
   height: 200vh;    
   pointer-events: none;
   position: absolute;
   top: -100vh;
   width: 100%;   
}

.table-hover tbody tr:hover td {
  background-color: #94c7e2d8;
}

.classLocal {
  text-align: -webkit-center;
  min-width: 60%;
  max-width: 100%;
  font-size: 16px;
}
.reporte  {
  margin-left: 20px;
  margin-top:40px;
  margin-bottom :10px;
  width: 350px;
  color:#ffff;
  font-weight : bold;
}

.btnbulk{
  
  color:#ffff;
  font-weight : bold;
}



.v-icon notranslate mdi mdi-chevron-right theme--light ::before {
  display: none;
}
.v-icon notranslate mdi mdi-chevron-right theme--light ::after {
  display: none;
}

.btnCancelarReport{
 margin-left :20px
}
.cardReport{
  height: 300px;
}

.classHomeOffice {
  text-align: -webkit-center;
  min-width: 60%;
  max-width: 100%;
  font-size: 16px;
}

.classExtranjero {
  text-align: -webkit-center;
  min-width: 60%;
  max-width: 100%;
  font-size: 16px;
}

.contenedor {
  min-width: 100%;
}

.rowSelectores {
  position:relative;
  bottom: 0%;
}

.table {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tHead {
  background-color: #1a5e86;
  color: white;
  text-align: -webkit-center;
}

.color1 {
  background-color: white;
  text-align: -webkit-center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 14rem;
}


.sumas {
  background-color: #1a5e86;
  color: white;
  max-width: 1rem;
  text-align: -webkit-center;
}

.sumasY {
  background-color: #1a5e86;
  color: white;
  max-width: 1rem;
  text-align:-webkit-center;
}

.sumasmayor8{
  background-color: #1a5e86;
  color: #ffa025;
  text-align:-webkit-center;
  font-size: 16px;
}

.sumasmenor8{
  background-color: #1a5e86;
  color: white;
  text-align:-webkit-center;
  font-size: 16px;
}

.nombreDia {
  text-align: -webkit-center;
  max-width: 1rem;
}

.nombreDiaFinSemana {
  color: black;
}

.nombreDiaDeSemana {
  color: white;
}

.totalHorasX {
  background-color: #1a5e86;
  color: white;
  text-align: -webkit-center;
  font-weight: 500;
}

.totalHorasY {
  padding-left: 0rem;
  padding-right: 0rem;
  max-width: 3rem;
  vertical-align: middle;
}

.sumaTotalMes {
  background-color: #1a5e86;
  color: white;
  max-width: 3rem;
  vertical-align: middle;
  text-align: -webkit-center;
}

.numeroDia {
  text-align:-webkit-center;
  max-width: 1rem;
}

.numeroDiaEspecial{
  color:  #ffa025;
}

.numeroDiaNoEspecial{
  color:  white;
}

.colMes {
  position: relative;
  left: 0.5%;
  //max-width: fit-content;
  min-width: 9%;
  max-width: 9%;
  margin-top:2%;
}


.textFieldSelectorMes {
  text-transform: capitalize;
  //min-width: -webkit-fit-content;
  max-width: 100%;
  font-weight: 500;
  font-size: 1.1rem;
  max-height: 10%;
}

.datePicker {
  text-transform: capitalize;
  
}

.colUsu {
  position: relative;
  min-width: -webkit-fit-content;
  margin-top:2%;
  //min-width: fit-content;
  min-width: 25%;
  max-width: 40%;
}

.seleccionarColaborador {
  min-width: 100%;
  max-width: 100%;
}

.colMod {
  position: relative;
  //min-width: -webkit-fit-content;
  min-width: 11%;
  max-width: 11%;
  margin-top:2%;
}

.seleccionarModalidad {
  min-width: 100%;
  max-width: 100%;
}

.colAsig {
  position: relative;
  min-width: fit-content;
  max-height: 2.3rem;
  left:1rem;
  // max-width: -moz-fit-content;
  max-width: 4%;
  top:2.5rem;

}

.btnSeleccionarProyecto {
  min-width: fit-content;
  left:5%;
  max-width: 100%;
}

.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined){
  background-color: #A9A9A9 !important;
}

.seleccionarProyecto {
  align-content: -webkit-center;
}

.colExpPDF {
  position: relative;
  margin-left:3%;
  max-width: -webkit-fit-content;
  // max-width: -moz-fit-content;
  min-width: fit-content;
  margin-top:2%;
}

.colExp {
  position: relative;
  max-width: -webkit-fit-content;
  //max-width: -moz-fit-content;
  min-width: fit-content;
  margin-top:2%;
}

.colImp {
  position: relative;
  max-width: -webkit-fit-content;
  // max-width: -moz-fit-content;
  max-width: fit-content;
  margin-top:2%;
}

.colMas {
  position: relative;
  max-width: -webkit-fit-content;
  // max-width: -moz-fit-content;
  max-width: fit-content;
  margin-top:2%;
}


.colRep {
  position: relative;
  max-width: -webkit-fit-content;
  // max-width: -moz-fit-content;
  max-width: fit-content;
  margin-top:2%;
}


.colGuar {
  max-width: -webkit-fit-content;
  position: relative;
  max-width: fit-content;
  left: 1%;
  margin-top:2%;
}

.btnGuardar {
  color: white;
}
.btnGuardarBulk {
  color: white;
  margin-right: 10px;
  //margin-top:115px
}

.colCanc {
  max-width: -webkit-fit-content;
  position: relative;
  max-width: fit-content;
  left: 1%;
  margin-top:2%;
}

.colorLocal1 {
  background-color: rgb(180, 180, 180);
  text-align: -webkit-center;
  max-width: 2rem;
}

.colorHO1 {
  background-color: rgb(210, 210, 210);
  text-align: -webkit-center;
  max-width: 2rem;
}

.colorExtranjero1 {
  background-color: rgb(240, 240, 240);
  text-align: -webkit-center;
  max-width: 2rem;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
.dataPickerBulkLoad{
  float: right;
  margin-left: 10px;
  margin-top: 10px;
}
.v-text-field-bulkLoad{
  width: 240px;
  margin-top:10px;
  
}

.validationsBulkLoad{
  height: 120px;
}



</style>
