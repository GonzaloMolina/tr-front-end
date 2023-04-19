<template >
 
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
      <div v-if="!loader">
            <v-alert
                :value="alert"
                style="position: absolute;  left: 0; right: 0; top: -12px; text-align: center;"
                top
                dense
                color="blue"
                type="success"
              > Se han guardado los cambios.
              </v-alert>

      <b-form-row class="mt-3 mb-n4">
        <b-col class="col-6">
          <b-form-row>
            <b-col class="p-0">
              <h3>Datos Generales</h3>
            </b-col>
            <b-col class="p-0">
              <img width="180rem" height="40rem" v-bind:src="cliente.Cliente_Logo">
            </b-col>
            <b-col class="p-0">
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
                    <v-btn color="#2991c6" text @click="dialog = false">Volver</v-btn>
                    <v-btn color="#2991c6" text @click="saveLogo">Guardar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </b-col>
        </b-form-row>
        </b-col>
        <b-col class="col-4 mr-n7"></b-col>
        <b-col class="col-2 ">
            <b-form-row>
          <b-col class="p-0 mr-4 ">
                  <v-btn :disabled="!isFormValid" @click="guardar()" color="#2991C6" dark >Guardar</v-btn> 
            </b-col>
            <b-col class="p-0">
                <v-btn @click="dialogCancelar = true" color="#ffa025" dark class="ml-3">Volver</v-btn>
            </b-col>
        </b-form-row>
        </b-col>
      </b-form-row>

      <b-form-row>
        <b-col class="col-12">
        <v-card class="mt-5" outlined tile>
          <v-form ref="form">
          <b-form-row class="ml-1 mr-1">
            <b-col class="col-2 mt-3">
              <v-text-field
              outlined
              dense
              v-model="cliente.Cliente_Codigo"
              label="Código"
              :disabled="permisoGuardar()"
              :rules="[rules.checkCode,rules.counterCodigo]"
              placeholder="Escribe..."
            ></v-text-field>
            </b-col>
            <b-col class="col-7 mt-3">
              <v-text-field
                outlined
                dense
                :disabled="permisoGuardar()"
                v-model="cliente.Cliente_Descripcion"
                :rules="[rules.counterDescripcion]"
                label="Descripción"
                placeholder="Escribe..."
              ></v-text-field>
            </b-col>
            <b-col class="col-3 mt-3">
              <v-select
              dense
              outlined
              :disabled="permisoGuardar()"
              v-model="cliente.Industria"
              :items="industrias"
              item-text="Industria_Descripcion"
              label="Industria"
              placeholder="Selecciona..."
              :return-object="true"
            ></v-select>
            </b-col>

          </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n7">
            <b-col class="col-3">
              <v-select
              dense
              outlined
              v-model="cliente.Pais"
              :items="paises"
              label="País"
              placeholder="Selecciona..."
              item-text="Pais_Descripcion"
              :return-object="true"
            ></v-select>
            </b-col>
            <b-col class="col-2">
              <v-select
                dense
                outlined
                :disabled="permisoGuardar()"
                v-model="cliente.Region"
                :items="regiones"
                label="Región"
                placeholder="Selecciona..."
                item-text="Region_Descripcion"
                :return-object="true"
              ></v-select>
            </b-col>
            <b-col class="col-5">
            <v-select
              outlined
              dense
              :disabled="permisoGuardar()"
              v-model="cliente.Empresa"
              :items="empresas"
              label="Partner"
              placeholder="Selecciona..."
              item-text="Empresa_Descripcion"
              :return-object="true"
            ></v-select>
          </b-col>
          <b-col class="col-2">
            <v-select
              outlined
              dense
              :disabled="permisoGuardar()"
              v-model="cliente.Moneda"
              :items="monedas"
              label="Moneda"
              placeholder="Selecciona..."
              item-text="Moneda_Codigo"
              :return-object="true"
            ></v-select>
          </b-col>
          </b-form-row>
          <b-form-row class="ml-1 mr-1 mt-n7">
          <b-col>
            <v-textarea
              outlined
              :disabled="permisoGuardar()"
              placeholder="Escribe.."
              v-model="cliente.Cliente_Observacion"
              label="Observaciones"
              :counter="1000"
              rows="2"
            ></v-textarea>
          </b-col>
          </b-form-row>
        </v-form>
        </v-card>
      </b-col>
      </b-form-row>

      <b-form-row>
        <b-col>
          <template>
          <v-data-table
            :headers="headersProyectos"
            :items="$store.state.cliente[0].Proyectos"
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
                          <router-link to="/createProyecto">
                          <v-btn v-if="permisoCrearProyectos()" @click="sendCliente" dark fab x-small color="#2991c6" style="margin-left:1rem">
                            <v-icon dark>mdi-plus</v-icon>
                          </v-btn>
                          
                          </router-link>
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
                      v-b-tooltip.hover title="Ver más"
                      v-if="permisoEditarProyecto() && item.Visible == 'X'"
                      small
                      class="mr-2"
                      color="#2991c6"
                      @click="sendProyecto(item)"
                    >
                       mdi-sunglasses
                    </v-icon>
                    </router-link>
                    <v-icon
                      v-b-tooltip.hover title="Desactivar"
                      v-if="permisoDesactivarProyecto() && item.Visible == 'X'"
                      small
                      color="#2991c6"
                      @click="desactivarProyecto(item)"
                    >
                      mdi-eye-off
                    </v-icon>
                    <v-icon
                      v-b-tooltip.hover title="Activar"
                      v-if="permisoActivarProyecto() && item.Visible == '' "
                      small
                      color="#2991c6"
                      @click="activarProyecto(item)"
                    >
                      mdi-eye
                    </v-icon>
                  </template>
              
          </v-data-table>
          </template>
        </b-col>
        <b-col>
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
                    <router-link to="/createClienteFiscal">
                    <v-btn v-if="permisoCrearClienteFiscal()" @click="sendCliente" dark fab x-small color="#2991c6" style="margin-left:1rem">
                      <v-icon dark >mdi-plus</v-icon>
                    </v-btn>
                    </router-link>
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
                v-b-tooltip.hover title="Ver más"
                v-if="permisoEditarClienteFiscal() && item.Visible == 'X'"
                :disabled="!permisoEditarClienteFiscal()"
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
                v-if="permisoDesactivarClienteFiscal() && item.Visible == 'X'"
                small
                color="#2991c6"
                @click="desactivarClienteFiscal(item)"
              >
                mdi-eye-off
              </v-icon>
              <v-icon
                v-b-tooltip.hover title="Activar"
                v-if="permisoActivarClienteFiscal() && item.Visible == '' "
                small
                color="#2991c6"
                @click="activarClienteFiscal(item)"
              >
                mdi-eye
              </v-icon>
            </template>
          </v-data-table>
          </template>
        </b-col>
      </b-form-row>
      <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
            <v-card>
              <v-toolbar
                dark
                color="#2991C6"
                height="30rem"
              >
              <v-icon color="#ffa025" style="text-shadow: 1px 1px 2px black;position:absolute; left:38%">mdi-alert</v-icon><h5 class="mt-2" style="font-weight: bold;position:absolute; left:45%; color:white; text-shadow: 1px 1px 2px black;">ALERTA</h5>
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
        </div>
    </v-container>
  </v-content>

</template>

<style scoped>
.container {
  margin-left: 3rem;
  min-width: 75%;
}
.dataFooter {
    position: relative;
    font-size: 0.75rem;
    margin-left: 15%;
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
    dialog: false,
    dialogDeleteProyecto:false,
    dialogDeleteClienteFiscal: false,
    dialogCancelar: false,
    isFormValid: true,

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


    item: 1,
    defaultCode: "",
    elementoEditado:{},
    indice: 0,
    dialogGuardar: false,
    //Keys para guardar
    regiones: [],
    industrias: [],
    monedas: [],
    empresas: [],
    paises: [],
    

    //AUTOCOMPLETE
    entries: [],
    isReady: false,
    model: null,
    search: null,
    logo: '',
    alert: false,
    loader: true,

  }),

  watch: {
      'cliente.Cliente_Codigo': function() {
        this.validateForm()
      },
      'cliente.Cliente_Descripcion': function(){
        this.validateForm()
      }
    },

  created() {
    this.initialize();
  },

  methods: {
      async initialize() {
        this.loader = true;

        await Promise.all([
        this.loadCliente(),
        this.loadRegiones(),
        this.loadIndustrias(),
        this.loadMonedas(),
        this.loadEmpresas(),
        this.loadPaises(),
        this.loadClientesFiscalesBackup(),
        
      ]);

      setTimeout(() => {
        this.loader = false
        }, 2000); //DISPARAR EVENTO DE LOADING
      
    },

    

    wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    })
    
    },

    getClientesFiscales(){
      let clientesfiscales = []
      for (var index in this.$store.state.cliente[0].ClientesFiscales){
        let key = this.$store.state.cliente[0].ClientesFiscales[index].Cliente_Fiscal_Key
        axios.get(ip+"/clientes_fiscales/key/"+key).then(response => {
          clientesfiscales.push(response.data)          
        })
      }
      return clientesfiscales
    },

    getProyectos(){
      let proyectos = []
      for (var index in this.$store.state.cliente[0].Proyectos){
        let key = this.$store.state.cliente[0].Proyectos[index].Proyecto_Key
        axios.get(ip+"/proyectos/key/"+key).then(response => {
          proyectos.push(response.data)
        })
      }
      
      return proyectos
      
    },

    //Se hace una copia de los clientes fiscales originales para guardarlos si no fueron modificados
    loadClientesFiscalesBackup(){

      this.clientesFiscalesOriginal = this.getClientesFiscales()
    },

     permisoGuardar(){
        return !localStorage.Permisos.includes("P6")
      },

      permisoleerClienteFiscal(){
        return localStorage.Permisos.includes("P11")
      },

      permisoCrearClienteFiscal(){
        return localStorage.Permisos.includes("P12")
      },

      permisoDesactivarClienteFiscal(){
        return localStorage.Permisos.includes("P10")
      },

      permisoActivarClienteFiscal(){
        return localStorage.Permisos.includes("P10")
      },

      permisoEditarClienteFiscal(){
        return localStorage.Permisos.includes("P10")
      },

      permisoCrearProyectos(){
        return localStorage.Permisos.includes("P18")
      },

      permisoEditarProyecto(){
        return localStorage.Permisos.includes("P20")
      },
      permisoDesactivarProyecto(){
          return localStorage.Permisos.includes("P19")
      },
      permisoActivarProyecto(){
          return localStorage.Permisos.includes("P19")
      },


    //Borrado logico de proyecto
    desactivarProyecto(item){ 
      const index = this.cliente.Proyectos.indexOf(item)
      // const item = this.elementoEditado
      // this.elementoEditado = Object.assign({}, item)
      var visible = {Visible: ''}
      item.Visible = ''
      this.cliente.Proyectos.splice(index, 1, item)
      axios.patch(ip+"/proyectos/"+item.Proyecto_Codigo, visible)
      .then(response => {
        
      })
      this.closeDialogProyecto()
    },

    //Activado logico de proyecto
    activarProyecto(item){
      const index = this.cliente.Proyectos.indexOf(item)
      var visible = {Visible: 'X'}
      item.Visible = 'X'
      this.cliente.Proyectos.splice(index, 1, item)
      axios.patch(ip+"/proyectos/"+item.Proyecto_Codigo, visible)
      .then((response) => {
        
      });
    },

    //borrado logico de cliente fiscal
    desactivarClienteFiscal(item){ 
      const index = this.cliente.ClientesFiscales.indexOf(item)
      var visible = {Visible: ''}
      item.Visible = '' 
      this.cliente.ClientesFiscales.splice(index, 1,item)
      axios.patch(ip+"/clientes_fiscales/"+item.Cliente_Fiscal_Codigo, visible)
      .then(response => {
        
      })
      this.closeDialogClienteFiscal()
    },

    //Activado logico
    activarClienteFiscal(item){
      const index = this.cliente.ClientesFiscales.indexOf(item)
      var visible = {Visible: 'X'}
      item.Visible = 'X'
      this.cliente.ClientesFiscales.splice(index, 1,item)
      axios.patch(ip+"/clientes_fiscales/"+item.Cliente_Fiscal_Codigo, visible)
      .then((response) => {
        
      });
    },

    //Guardado del cliente y de los clientes fiscales.
    async guardar() {
        if(this.$refs.form.validate()){
        this.cliente.Usuario_Modificacion = localStorage.usuario_id
        await axios.patch(ip+"/clientes/"+this.defaultCode, this.cliente)

          .then((response) => {
            this.guardarClientesFiscales();
            this.alert = true
            setTimeout(() => {this.alert = false
             this.$router.push({path: "/clientesTable"})}, 2000)
          })
          .catch(err =>{
            alert('No se ha podido actualizar. El Cliente ya existe')
            throw new Error('El cliente ya existe')
          })
        } 
    },

    cleanStore(){
      this.$store.replaceState({
        cliente: [],
        clienteTipo:0,
        proyecto: [],
        clienteFiscal: [],
        empresa:[]})
        this.$router.push({path:'/clientesTable'})
    },

    //Se carga el cliente de vuex
    loadCliente(){     
      this.cliente = this.$store.state.cliente[0];
      this.cliente.ClientesFiscales = this.getClientesFiscales()
      this.cliente.Proyectos = this.getProyectos()

      this.logo = this.$store.state.cliente[0].Cliente_Logo
      this.defaultCode = this.$store.state.cliente[0].Cliente_Codigo;

    },

    //Se envia el cliente a vuex
    sendCliente(){
      this.$store.state.cliente[0] = this.cliente;
      this.$store.state.proyecto[0] = this.proyectoVacio();
      this.$store.state.clienteTipo = 1;
    },

    //Se envia el cliente fiscal y cliente a vuex
    sendClienteFiscal(item){
      this.sendCliente();
      this.$store.state.clienteFiscal[0] = item;
    },


    //Se envia proyecto a vuex
    sendProyecto(item){
      this.sendCliente();
      this.$store.state.proyecto[0] = item;
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

    //Pedidos a la API para combos
    loadRegiones() {
      axios
        .get(ip+"/regiones/descripciones")
        .then((response) => {
          this.regiones = response.data;
        });
    },

    loadIndustrias() {
      axios
        .get(ip+"/industrias/descripciones")
        .then((response) => {
          this.industrias = response.data;
        });
    },

    loadMonedas() {
      axios.get(ip+"/monedas").then((response) => {
        this.monedas = response.data;
      });
    },

    loadEmpresas(){
      axios.get(ip+"/empresas").then((response) => {
        this.empresas = response.data;
      });
    },

    loadPaises(){
      axios.get(ip+"/paises").then((response) => {
        this.paises= response.data;
      });
    },


    //Guarda clientes fiscales borrando los que ya estaban y guardando todos como si fueran nuevos
    guardarClientesFiscales(){
      if(this.clientesFiscalesOriginal.length != 0){
        var clientesFiscales = this.clientesFiscalesOriginal
        for(clienteFiscal of clientesFiscales){
        axios.delete(ip+"/clientes_fiscales/"+ clienteFiscal.Cliente_Fiscal_Codigo)
        }
        var clientesFiscalesAGuardar = this.$store.state.cliente[0].ClientesFiscales
        for (let clienteFiscal of clientesFiscalesAGuardar) {
            clienteFiscal.Usuario_Creacion = localStorage.usuario_id
            clienteFiscal.Usuario_Modificacion = localStorage.usuario_id
            axios.post(ip+"/clientes_fiscales", clienteFiscal)
            .then((response) => {
             
            })
            .catch(err => {
              alert('Cliente Fiscal'+clienteFiscal.Cliente_Fiscal_Descripcion+ 'ya existe')
            })
        }
        alert('Clientes Fiscales correctamente añadidos')
        }
    },

    validateForm() {
      this.isFormValid = this.$refs.form.validate()
    },

    //Guardar logo
    saveLogo(){
      this.cliente.Cliente_Logo = this.logo
      this.dialog = false
    },

        //ACCIONES DE DIALOGOS DE BORRADO
    desactivarElementoDialogProyecto(item){
        this.indice = this.cliente.Proyectos.indexOf(item)
        this.elementoEditado = Object.assign({}, item)
        this.dialogDeleteProyecto = true
    },

    desactivarElementoDialogClienteFiscal(item){
        this.indice = this.cliente.ClientesFiscales.indexOf(item)
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
      if(!localStorage.login){
        this.$router.push("/login");
      }
      }
}

}
</script>
