<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
            <v-alert
                :value="alert"
                style="position: absolute;  left: 0; right: 0; top: -12px; text-align: center;"
                top
                dense
                type="success"
                
                color="blue"
              > Se han guardado los cambios.
              </v-alert>
      <v-form ref="form">
      <v-row>
        <v-col cols="12" style="max-width:82rem">
          <v-title style="font-size:1.5rem; padding-left:1rem;">Datos generales</v-title>
          <img style="margin-top:-1rem; margin-left:1rem" width="180rem" height="40rem" v-bind:src="cliente.Cliente_Logo">

          <v-dialog v-model="dialog" persistent max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" x-small fab><v-icon>mdi-camera</v-icon></v-btn>
            </template>
            <v-card>
              <v-col>
              <v-card-title class="headline">Inserte link de Imagen</v-card-title>
              <v-text-field label="Imagen:" v-model="logo"></v-text-field>
              </v-col>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#2991c6" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="#2991c6"  text @click="saveLogo" >Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn
            :disabled="permisoGuardar()" 
            color="#2991C6"
            dark
            style="margin-left:38rem"
            @click="evaluarGuardado"
          > Guardar
          </v-btn>


          <v-btn @click="dialogCancelar = true" color="#ffa025" dark style="margin-left:1rem">Cancelar</v-btn>
          <v-card class="pa-2" style="margin-top:1rem;" outlined tile>
            <v-text-field
              outlined
              dense
              v-model="cliente.Cliente_Codigo"
              label="Código"
              :rules="[rules.checkCode,rules.counterCodigo]"
              placeholder="Escribe..."
              style="display:inline-block; max-width:7rem; margin-bottom:-1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="cliente.Cliente_Descripcion"
              :rules="[rules.checkCode,rules.counterDescripcion]"
              label="Descripción"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 23rem; margin-left:1rem; margin-bottom:-1rem"
            ></v-text-field>
            <v-select
              dense
              outlined
              v-model="cliente.Cliente_Industria"
              :items="industriasDescripciones"
              label="Industria"
              placeholder="Selecciona..."
              style="max-width:10rem;display:inline-block; margin-left:1rem; margin-bottom:-1rem"
            ></v-select>
            <v-select
              dense
              outlined
              v-model="cliente.Cliente_Pais"
              :items="paisesDescripciones"
              label="País"
              placeholder="Selecciona..."
              style="max-width:9rem; display:inline-block;margin-left:1rem; margin-bottom:-1rem"
            ></v-select>
            <v-select
              dense
              outlined
              v-model="cliente.Cliente_Region"
              :items="descripcionesRegiones"
              label="Región"
              placeholder="Selecciona..."
              style="max-width:9rem; display:inline-block;margin-left:1rem; margin-bottom:-1rem"
            ></v-select>
            <v-select
              outlined
              dense
              v-model="cliente.Cliente_Empresa"
              :items="empresasDescripciones"
              label="Partner"
              placeholder="Selecciona..."
              style="max-width:9rem; display:inline-block; margin-left:1rem; margin-bottom:-2rem"
            ></v-select>
            <v-select
              outlined
              dense
              v-model="cliente.Cliente_Moneda_Principal"
              :items="monedasCodigos"
              label="Moneda"
              placeholder="Selecciona..."
              style="max-width:6rem; display:inline-block; margin-left:1rem; margin-bottom:-2rem"
            ></v-select>
            <v-textarea
              outlined
              placeholder="Escribe.."
              v-model="cliente.Cliente_Observacion"
              label="Observaciones"
              :counter="1000"
              rows="2"
              style="margin-bottom:-2rem"
            ></v-textarea>
          </v-card>
        </v-col>
        <v-col cols="3" style="margin-left:10rem">

        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" style="max-width:40rem; margin-top:-2rem">
          <template>
          <v-data-table
            :headers="headersProyectos"
            :items="cliente.Proyectos"
            sort-by="[Visible]"
            :sort-desc="true"
            class="elevation-2"
            :items-per-page="4"
            hide-default-footer
          >
            <template v-slot:top="{ pagination, options, updateOptions }">
                    <v-toolbar flat color="white">
                      <v-toolbar-title style="font-size:1.5rem;">Proyectos</v-toolbar-title>
                        <template>
                          <v-btn :loading="!clienteFueGuardado" @click="sendCliente" dark fab x-small color="#2991c6" style="margin-left:1rem">
                            <v-icon dark>mdi-plus</v-icon>
                          </v-btn>
                        </template>
                        <v-data-footer 
                        :pagination="pagination"
                        class="dataFooter"
                        :itemsPerPageOptions=[]
                        :options="options"
                        @update:options="updateOptions"
                        items-per-page-text=""
                        pageText= '{0}-{1} de {2}'/>

                    </v-toolbar>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <router-link to="/editProyecto">
                    <v-icon
                      v-b-tooltip.hover title="Editar"
                      small
                      v-if=" item.Visible == 'X' "
                      class="mr-2"
                      color="#2991c6"
                      @click="sendProyecto(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    </router-link>
                    <v-icon
                      v-b-tooltip.hover title="Desactivar"
                      v-if=" item.Visible == 'X' "
                      small
                      color="#2991c6"
                      @click="desactivarElementoDialog(item)"
                    >
                      mdi-eye-off
                    </v-icon>
                    <v-icon
                      v-b-tooltip.hover title="Activar"
                      v-show=" item.Visible == '' "
                      small
                      color="#2991c6"
                      @click="activarProyecto(item)"
                    >
                      mdi-eye
                    </v-icon>
                  </template>
              
          </v-data-table>
          </template>
        </v-col> 
        <v-col cols="5" style="margin-top:-2rem">
          <template>
          <v-data-table
            :headers="headersRazonesSociales"
            :items="cliente.ClientesFiscales"
            sort-by="Cliente_Fiscal_Descripcion"
            :items-per-page="4"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:top="{ pagination, options, updateOptions }">
              <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:1.5rem;">Clientes Fiscales</v-toolbar-title>
                  <template>
                    <v-btn :loading="!clienteFueGuardado" @click="sendCliente" dark fab x-small color="#2991c6" style="margin-left:1rem">
                      <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                    <v-data-footer 
                      :pagination="pagination"
                      :itemsPerPageOptions=[]
                      class="dataFooter"
                      :options="options"
                      @update:options="updateOptions"
                      items-per-page-text=""
                      pageText= '{0}-{1} de {2}'/>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <router-link to="/editClienteFiscal">
              <v-icon
                v-b-tooltip.hover title="Editar"
                v-if=" item.Visible == 'X' "
                small
                class="mr-2"
                color="#2991c6"
                @click="sendClienteFiscal(item)"
              >
                mdi-sunglasses
              </v-icon>
              </router-link>
              <v-icon
                v-b-tooltip.hover title="Desactivar"
                v-if=" item.Visible == 'X' "
                small
                color="#2991c6"
                @click="desactivarClienteFiscal(item)"
              >
                mdi-eye-off
              </v-icon>
              <v-icon
                v-b-tooltip.hover title="Activar"
                v-if=" item.Visible == '' "
                small
                color="#2991c6"
                @click="activarClienteFiscal(item)"
              >
                mdi-eye
              </v-icon>
            </template>
          </v-data-table>
          </template>
        </v-col>
      </v-row>
      </v-form>

      <v-dialog v-model="dialogDeleteProyecto" max-width="500px">
          <v-card>
            <v-card-title class="headline">Estas seguro que deseas desactivar este elemento?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="desactivarProyecto">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDeleteClienteFiscal" max-width="500px">
          <v-card>
            <v-card-title>Este elemento se desactivará. ¿Deseas continuar?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="desactivarClienteFiscal">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
                  @click="cleanStore"
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
  margin-left: 1rem;
  min-width: 100rem;
}
.dataFooter {
    position: relative;
    align-items: center;
    font-size: 0.75rem;
    left: 11rem;
}
</style>


<script>
import axios from "axios";
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
import {checkCode,counterCodigo,counterDescripcion,checkEmail} from '../../../validations/validations'
export default {
  components: {loader},
  data: () => ({
    //dialogo de logo
    clienteFueGuardado: false,
    dialog: false,
    dialogCancelar: false,
    dialogDeleteProyecto:false,
    dialogDeleteClienteFiscal: false,
    //Reglas de agregado y editado
    rules: {
      counterCodigo: counterCodigo,
      counterDescripcion: counterDescripcion,
      checkCode: checkCode,
      checkEmail: checkEmail,
    },
    //Razones Sociales y Proyectos para los datatable de un cliente
    headersRazonesSociales: [
      {
          text: 'Tipo',
          align: 'start',
          sortable: false,
          value: 'Cliente_Fiscal_Tipo_ID_Fiscal',
          width: '10%',
        },
        { text: 'ID Fiscal', value: 'Cliente_Fiscal_Identificador_Fiscal', width:'40%', sortable: false},
        { text: 'Descripción', value: 'Cliente_Fiscal_Descripcion',width:'50%',sortable: false},
        { text: 'Activado' , value: 'Visible', sortable: false, align:'center'},
        { text: 'Principal' , value: 'Cliente_Fiscal_Predeterminado', sortable: false, align:'center'},
        { text: 'Acciones', value: 'actions', sortable: false,align: 'end'  },
    ],
    headersProyectos: [
      {
        text: "Código",
        align: "start",
        sortable: false,
        value: "Proyecto_Codigo",
      },
      { text: "Descripción", value: "Proyecto_Descripcion",sortable: false },
      { text: "Tipo", value: "Tipo.Proyecto_Tipo_Descripcion",sortable: false },
      { text: "Responsable", value: "Responsable.Usuario_Nombre_Completo", sortable: false},
      { text: "Acciones", value: "actions", sortable: false },
    ],
    //Elemento que se va a guardar con el UPDATE
    cliente: {},
    defaultCode: "",
    elementoEditado:{},
    //Keys para guardar
    regiones: [],
    industrias: [],
    monedas: [],
    empresas: [],
    paises: [],
    //SEARCHBOX
    descripcionesRegiones: [],
    industriasDescripciones: [],
    empresasDescripciones: [],
    monedasCodigos: [],
    paisesDescripciones: [],
    //AUTOCOMPLETE
    entries: [],
    isLoading: false,
    model: null,
    search: null,
    logo: '',
    dialogGuardar: false,
    alert: false,
    loader: true,
  }),
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      //Carga de cliente vacio almacenado en vuex
      this.loadCliente();
      //Pedidos al back para la carga de los combos
      this.loadRegions();
      this.loadIndustrias();
      this.loadMonedas();
      this.loadEmpresas();
      this.loadPaises();
      //Este if se realiza para diferenciar el comportamiento de un nuevo cliente con uno que ya fue guardado y 
      // esta listo para asignarle proyectos y clientes fiscales
      setTimeout(() => {
        if(this.clienteFueGuardado){
        this.asignarDescripciones()
        } else {
          this.loader = false
        }
      }, 2000) //DISPARAR EVENTO DE LOADING
      
    },
     permisoGuardar(){
        return !localStorage.Permisos.includes("P6")
      },
    wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
           resolve();
        }, time);
      })
    },
    //Borrado logico de proyecto
    desactivarProyecto(){ 
      const index = this.indice
      const item = this.elementoEditado
      var visible = {Visible: ''}
      item.Visible = ''
      this.cliente.Proyectos.splice(index, 1, item)
      axios.patch(ip+"/proyectos/"+item.Proyecto_Codigo, visible)
      .then(response => {
        console.log(response)
      })
      this.closeDialogProyecto()
    },
    //Activacion logica de proyecto
    activarProyecto(item){ 
      const index = this.cliente.Proyectos.indexOf(item)
      var visible = {Visible: 'X'}
      item.Visible = 'X'
      this.cliente.Proyectos.splice(index, 1, item)
      axios.patch(ip+"/proyectos/"+item.Proyecto_Codigo, visible)
      .then((response) => {
        console.log(response);
      });
    },
    //Borrado logico de cliente fiscal
    desactivarClienteFiscal(){ 
      const index = this.indice
      const item = this.elementoEditado
      var visible = {Visible: ''}
      item.Visible = '' 
      this.cliente.ClientesFiscales.splice(index, 1,item)
      axios.patch(ip+"/clientes_fiscales/"+item.Cliente_Fiscal_Codigo, visible)
      .then(response => {
        console.log(response)
      })
      this.closeDialogClienteFiscal()
    },
    //Activacion logica de cliente fiscal
    activarClienteFiscal(item){ 
      const index = this.cliente.ClientesFiscales.indexOf(item)
      var visible = {Visible: 'X'}
      item.Visible = 'X'
      this.cliente.ClientesFiscales.splice(index, 1,item)
      axios.patch(ip+"/clientes_fiscales/"+item.Cliente_Fiscal_Codigo, visible)
      .then((response) => {
        console.log(response);
      });
    },
    cleanStore(){
      this.$store.replaceState({
        cliente: [],
        clienteTipo:0,
        proyecto: [],
        clienteFiscal: [],
        empresa: []})
      this.$router.push({path: "/clientesTable"})
    },
    //Se envia el cliente guardado a vuex
    sendCliente(){
      this.$store.state.cliente[0] = this.cliente;
      this.$store.state.proyecto[0] = this.proyectoVacio();
      this.$store.state.clienteTipo = 1; //el tipo de cliente se utiliza para diferenciar los componentes create y edit
    },
    //Se envia proyecto a vuex para su edicion
    sendProyecto(item){
      this.sendCliente();
      this.$store.state.proyecto[0] = item;
    },
    //se carga el cliente que fue guardado
    loadCliente(){
      this.cliente = _.cloneDeep(this.$store.state.cliente[0])
      this.clienteFueGuardado = this.$store.state.clienteFueGuardado
    },
    //Se cambia el path a crear un nuevo cliente fiscal
    sendToClienteFiscal(){
      this.$store.state.clienteTipo = 0;
      this.$router.push({path: "/createClienteFiscal"})
    },
    //Se cambia el path a crear un nuevo proyecto y se almacena en vuex un proyecto vacio
    sendToProyecto(){
      this.$store.state.clienteTipo = 0;
      this.$store.state.proyecto[0] = this.proyectoVacio()
      this.$router.push({path: "/createProyecto"})
    },
    proyectoVacio(){
      return {
        Proyecto_Key: null,
        Proyecto_Unidad_Negocio: "",
        Proyecto_Facturable: 2,
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
        Proyecto_Newsletter: "No",
        Proyecto_Observacion: "",
        Usuario_Creacion: null,
        Usuario_Modificacion: null,
        Tecnologias: [],
        Tipo: {Proyecto_Tipo_Beneficio: ''}
      }
    },
    // Logica de guardado, que funciona en ida y vuelta. Es decir, la primer condicion evalua ante la creacion de un cliente
    // desde 0. El segundo if, es el guardado final, es el camino de vuelta, guarda clientes fiscales y regresa a la pantalla principal
    async evaluarGuardado(){
      if(this.$refs.form.validate()){
        if(!this.clienteFueGuardado){
          await this.guardarCliente(); //DISPARAR EVENTO DE LOADING
        } else{
          this.guardarClientesFiscales();
          this.alert = true;
          setTimeout(() => {this.alert = false
          this.$router.push({path: "/clientesTable"})}, 2000)
          
          }
      }
    },
    //Guardado de un cliente nuevo
    async guardarCliente() {
      await this.assignKeys();
      this.cliente.Usuario_Creacion = localStorage.usuario_id
      this.cliente.Usuario_Modificacion = localStorage.usuario_id
      var clienteGuardado = this.cliente.Cliente_Codigo
      await axios.post(ip+"/clientes", this.cliente)
      .then((res) => {
        this.asignarDescripciones()
        this.alert = true
        setTimeout(() => {this.alert = false}, 2000)
      })
      .catch(err => {
        alert('No se ha podido crear. Cliente ya existe')
        this.asignarDescripciones()
        throw new Error('El cliente ya existe')
      })
      await axios.get(ip+"/clientes/"+ clienteGuardado)
      .then((response) => {
        this.$store.state.cliente[0] = response.data
      })
      this.clienteFueGuardado = true;
      this.$store.state.clienteFueGuardado = true;
    },
    //Pedidos a la api de los combos
    //Pedidos a la API para combos
    loadRegions() {
      axios
        .get(ip+"/regiones/descripciones")
        .then((response) => {
          this.regiones = response.data;
          this.descripcionesRegiones = response.data.map(
            (region) => region.Region_Descripcion
          ).sort();
        });
    },

    loadIndustrias() {
      axios
        .get(ip+"/industrias/descripciones")
        .then((response) => {
          this.industrias = response.data;
          this.industriasDescripciones = response.data.map(
            (industria) => industria.Industria_Descripcion
          ).sort();
        });
    },

    loadMonedas() {
      axios.get(ip+"/monedas").then((response) => {
        this.monedas = response.data;
        this.monedasCodigos = response.data.map(
          (moneda) => moneda.Moneda_Codigo
        ).sort();
      });
    },

    loadEmpresas(){
      axios.get(ip+"/empresas").then((response) => {
        this.empresas = response.data;
        this.empresasDescripciones = response.data.map(
          (empresa) => empresa.Empresa_Descripcion
        ).sort();
      });
    },
    loadPaises(){
      axios.get(ip+"/paises").then((response) => {
        this.paises= response.data;
        this.paisesDescripciones = response.data.map(
          (pais) => pais.Pais_Descripcion
        ).sort();
      });
    },
    
    //Este metodo es muy importante para cargar los combos. Estos campos vienen en formato "key" y hay que transformarlos
    //En descripcion
    asignarDescripciones(){
      var regionDescripcion = this.regiones.filter(region => region.Region_Key == this.cliente.Cliente_Region)[0].Region_Descripcion;
      var industriaDescripcion = this.industrias.filter(industria => industria.Industria_Key == this.cliente.Cliente_Industria)[0].Industria_Descripcion;
      var monedaPrincCodigo = this.monedas.filter(moneda => moneda.Moneda_Key == this.cliente.Cliente_Moneda_Principal)[0].Moneda_Codigo;
      var empresaDescripcion = this.empresas.filter(empresa => empresa.Empresa_Key == this.cliente.Cliente_Empresa)[0].Empresa_Descripcion;
      var paisDescripcion = this.paises.filter(pais => pais.Pais_Key == this.cliente.Cliente_Pais)[0].Pais_Descripcion;
      this.cliente.Cliente_Region = regionDescripcion;
      this.cliente.Cliente_Industria = industriaDescripcion;
      this.cliente.Cliente_Empresa = empresaDescripcion;
      this.cliente.Cliente_Moneda_Principal = monedaPrincCodigo;
      this.cliente.Cliente_Pais = paisDescripcion
    },
    //Este metodo asigna las keys en base a las descripciones seleccionadas en el combo. Se utiliza en el guardado.
    assignKeys() {
      var keyRegion = this.regiones.filter(
        (region) => region.Region_Descripcion == this.cliente.Cliente_Region)[0].Region_Key;
      var keyIndustria = this.industrias.filter(
        (industria) => industria.Industria_Descripcion == this.cliente.Cliente_Industria)[0].Industria_Key;
      var keyMoneda = this.monedas.filter(
        (moneda) => moneda.Moneda_Codigo == this.cliente.Cliente_Moneda_Principal)[0].Moneda_Key;
      var empresaKey = this.empresas.filter(empresa => empresa.Empresa_Descripcion == this.cliente.Cliente_Empresa)[0].Empresa_Key;
      var paisKey = this.paises.filter(pais => pais.Pais_Descripcion == this.cliente.Cliente_Pais)[0].Pais_Key;
      this.cliente.Cliente_Region = keyRegion;
      this.cliente.Cliente_Industria = keyIndustria;
      this.cliente.Cliente_Empresa = empresaKey;
      this.cliente.Cliente_Moneda_Principal = keyMoneda;
      this.cliente.Cliente_Pais = paisKey;
    },
    // Guardado de logo
    saveLogo(){
      this.cliente.Cliente_Logo = this.logo
      this.dialog = false
    },
    //Guarda los clientes fiscales recorriendo la lista almacenada en vuex
    guardarClientesFiscales(){
      var clientesFiscales = this.$store.state.cliente[0].ClientesFiscales
      if(clientesFiscales.length != 0){
        for (let clienteFiscal of clientesFiscales) {
        clienteFiscal.Usuario_Creacion = localStorage.usuario_id
        clienteFiscal.Usuario_Modificacion = localStorage.usuario_id
        axios.post(ip+"/clientes_fiscales/", clienteFiscal)
        .then((response) => {
          console.log(response.data)
        })
      }
      alert('Clientes Fiscales correctamente guardados')
      }
      
    },
    //ACCIONES DE DIALOGOS DE BORRADO
    desactivarElementoDialogProyecto(item){
        this.indice = this.desserts.indexOf(item)
        this.elementoEditado = Object.assign({}, item)
        this.dialogDeleteProyecto = true
    },
    desactivarElementoDialogClienteFiscal(item){
        this.indice = this.desserts.indexOf(item)
        this.elementoEditado = Object.assign({}, item)
        this.dialogDeleteClienteFiscal = true
    },
    closeDialogProyecto(){
      this.dialogDeleteProyecto = false
      this.elementoEditado= {}
      this.indice = 0
    },
    closeDialogClienteFiscal(){
      this.dialogDeleteClienteFiscal = false
      this.elementoEditado= {}
      this.indice = 0
    },
    mounted() {
       if(!this.$store.state.loggin){
      this.$router.push("/login");
      }
      }
  },
};
</script>
