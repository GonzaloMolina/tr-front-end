<template>
  <v-content>
    <v-container fluid>
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
      <v-form ref="form">
      <v-row>
        <v-col cols="12" style="max-width:82rem; margin-top:-0.5rem">
          <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
          <img style="margin-top:-1rem; margin-left:1rem" width="180rem" height="40rem" v-bind:src="empresa.Empresa_Logo">
            <v-btn
            color="#2991C6"
            dark
            style="margin-left:40rem"
            @click="guardar()"
          > Guardar
          </v-btn>
          
          <v-btn @click="dialogCancelar = true" color="#ffa025" dark style="margin-left:1rem">Cancelar</v-btn>
          <v-card class="pa-2" outlined tile style="margin-top:1rem;">
            <v-text-field
              outlined
              dense
              v-model="empresa.Empresa_Codigo"
              label="Código"
              :rules="[rules.checkCode,rules.counterCodigo]"
              placeholder="Escribe..."
              style="display:inline-block; max-width:10rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="empresa.Empresa_Descripcion"
              label="Descripción"
              :rules="[rules.checkCode,rules.counterDescripcion]"
              placeholder="Escribe..."
              style="display:inline-block; min-width:35rem; margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              background-color="white"
              dense
              v-model="empresa.Empresa_Identificador_Laboral"
              label="ID Laboral"
              :rules="[rules.checkNumbers]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 19rem;margin-left:1rem"
            ></v-text-field>
            <v-select
              dense
              outlined
              v-model="empresa.Empresa_Tipo"
              :items="tiposEmpresasDescripciones"
              label="Tipo"
              placeholder="Selecciona..."
              style="max-width:12rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-textarea v-model="empresa.Empresa_Observacion" background-color="white" outlined placeholder="Escribe.." :counter="1000" label="Observaciones" rows="2" style="margin-bottom:-2rem">
           </v-textarea>
          </v-card>
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
                <router-link to="/empresasTable">
                <v-btn 
                  color="white"
                  text
                  outlined

                  style="margin-left:16rem; background-color:#2991C6"
                  @click=""
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
  min-width: 100rem;
}
</style>


<script>
import axios from "axios";
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
import {checkCode,checkEmail,counterTelefono,counterCodigo, counterDescripcion,
        counterEmail,checkPhoneNumber,checkNumbers,counterReferentes} 
from '../../../validations/validations'
export default {
  components: {loader},
  data: () => ({
    codigoViejo: '',
    //Reglas de agregado y editado
    rules: {
      checkCode: checkCode,
      checkEmail: checkEmail,
      checkPhoneNumber: checkPhoneNumber,
      checkNumbers: checkNumbers,
      counterCodigo: counterCodigo,
      counterDescripcion: counterDescripcion,
      counterTelefono: counterTelefono,
      counterEmail: counterEmail,
      counterReferentes: counterReferentes,
    },
    //Elemento que se va a guardar con el UPDATE
    empresa: {
        Empresa_Codigo: '',
        Empresa_Descripcion: '',
        Empresa_Tipo: null,
        Empresa_Region: null,
        Empresa_Unidad_Negocio: null,
        Empresa_Identificador_Laboral: '',
        Empresa_Referente: '',
        Empresa_Mail: '',
        Empresa_Telefono: '',
        Empresa_Logo: '',
        Empresa_Observacion: '',
        Usuario_Creacion: 1,
        Usuario_Modificacion: 1,
    },
    unidades_Negocio: [],
    unidades_NegocioDescripciones: [],

    regiones: [],
    regiones_Descripciones: [],

    tiposEmpresas: [],
    tiposEmpresasDescripciones: [],

    dialogGuardar: false,
    alert: false,
    dialogCancelar: false,
    loader: true,
  }),

  created(){
      this.loadTiposEmpresas();
      this.loader = false
  },

  methods: {

    loadTiposEmpresas(){
        axios.get(ip+"/tipos_empresas")
        .then(response => {
            this.tiposEmpresas = response.data
            this.tiposEmpresasDescripciones = response.data.map(tipo_Empresa => tipo_Empresa.Tipo_Empresa_Descripcion)
        })      
    },

    async guardar() {
        if(this.$refs.form.validate()){
        this.asignarKeys();
        this.empresa.Usuario_Creacion = localStorage.usuario_id
        this.empresa.Usuario_Modificacion = localStorage.usuario_id
        await axios.post(ip+"/empresas", this.empresa)
        .then((response) => {
            this.alert = true
            setTimeout(() => {this.alert = false
            this.$router.push({path: "/empresasTable"})}, 2000)
        })
        .catch(err => {
          alert('No se ha podido crear. Empresa ya existe')
          this.empresa = this.$store.state.empresa[0]
          throw new Error('La Empresa ya existe')
      })
      
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

    asignarKeys(){
        var tipoEmpresaKey = this.tiposEmpresas.filter((tipoEmpresa) => tipoEmpresa.Tipo_Empresa_Descripcion == this.empresa.Empresa_Tipo)[0].Tipo_Empresa_Key;
        this.empresa.Empresa_Tipo = tipoEmpresaKey;
    },
    mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
    }
  }
};
</script>
