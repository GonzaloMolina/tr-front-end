<template>
  <v-content>
    <v-container fluid>
      <loader style="position: fixed;"/>
      <v-alert
                :value="alert"
                style="position: absolute;  left: 0; right: 0; top: -12px; text-align: center;"
                top
                dense
                text
                color="blue"
              > Se han guardado los cambios.
              </v-alert>      

      <v-form ref="form">
      <v-row>
        <v-col cols="12" style="max-width:82rem; margin-top:-0.5rem">
          <v-title style="font-size:1.5rem; padding-left:1rem;">{{this.$store.state.cliente[0].Cliente_Descripcion}}</v-title>
         <v-btn
            :disabled="permisoGuardar()" 
            color="#2991C6"
            dark
            style="position:relative; left:68%"
            @click="guardar"
          > Guardar
          </v-btn>

         
          <v-btn @click="dialogCancelar = true" color="#ffa025" dark style="position:relative; left:69%">Cancelar</v-btn>
          <v-card class="pa-2" outlined tile style="margin-top:1rem;">
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Codigo"
              label="Código"
              :rules="[rules.counterCodigoClienteFiscal,rules.checkCode]"
              placeholder="Escribe..."
              style="display:inline-block; max-width:10rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Descripcion"
              label="Descripción"
              :rules="[rules.counterDescripcionClienteFiscal,rules.checkCode]"
              placeholder="Escribe..."
              style="display:inline-block; min-width:24rem; margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              background-color="white"
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Direccion"
              label="Dirección"
              :rules="[rules.counterDireccion,rules.checkDirection]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 26rem; margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              background-color="white"
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Telefono"
              label="Teléfono"
              :rules="[rules.checkPhoneNumber,rules.counterTelefono]"
              placeholder="Escribe..."
              style="display:inline-block; min-width: 16rem; margin-left:1rem"
            ></v-text-field>
            <v-textarea background-color="white" outlined placeholder="Escribe.." label="Observaciones" :counter="1000" rows="2" style="margin-bottom:-2rem">
           </v-textarea>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" style="max-width:82rem; margin-top:-0.5rem">
          <v-text style="font-size:1.5rem; padding-left:1rem; margin-top:2rem">Facturación</v-text>
          <v-card class="pa-2" outlined tile>
            <v-select
              dense
              outlined
              v-model="clienteFiscal.Cliente_Fiscal_Tipo_ID_Fiscal"
              :items="tiposIDFiscal"
              label="Tipo"
              placeholder="Selecciona..."
              style="max-width:6rem; display:inline-block"
            ></v-select>
            <v-text-field
              style="margin-left:1rem ;max-width:15rem; display:inline-block;"
              outlined
              background-color="white"
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Identificador_Fiscal"
              label="ID Fiscal"
              :rules="[rules.counterIdFiscal,rules.checkNumbers]"
              placeholder="Escribe..."
            ></v-text-field>
            <v-text-field
              style="max-width:15rem; display:inline-block; margin-left:1rem"
              outlined
              background-color="white"
              dense
              v-model="clienteFiscal.Cliente_Fiscal_IIBB"
              label="Ingresos Brutos"
              :rules="[rules.counterIIBB,rules.checkNumbers]"
              placeholder="Escribe..."
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Giro_Negocio"
              label="Giro Negocio"
              placeholder="Escribe..."
              style="max-width:8rem; display:inline-block; margin-left:1rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Direccion_Factura"
              label="Dirección Facturación"
              :rules="[rules.counterDireccion,rules.checkDirection]"
              placeholder="Escribe..."
              style="min-width:33.5rem; display:inline-block;margin-left:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Mail_Para"
              label="Mail Para"
              :rules="[rules.checkEmail,rules.counterEmail]"
              placeholder="Escribe..."
              style="min-width:39rem; display:inline-block;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Mail_Copia"
              label="Mail Copia"
              placeholder="Escribe..."
              style="min-width:39rem; display:inline-block; margin-left:1rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Mail_Pagos"
              label="Mail Pagos"
              placeholder="Escribe..."
              style="min-width:39rem; display:inline-block; margin-bottom:-1.5rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="clienteFiscal.Cliente_Fiscal_Telefono_Pagos"
              label="Teléfono Pagos"
              :rules="[rules.checkPhoneNumber,rules.counterTelefono]"
              placeholder="Escribe..."
              style="min-width:39rem; display:inline-block; margin-left:1rem; margin-bottom:-1.5rem"
            ></v-text-field>
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

<style  scoped>
.container {
  margin-left: 1rem;
  min-width: 100rem;
}
</style>


<script>
import axios from "axios";
import loader from '../../Estado/loader'
import {checkCode,counterCodigoClienteFiscal,counterDescripcionClienteFiscal,checkEmail,counterDireccion,counterTelefono,
        counterIdFiscal,counterEmail,counterIIBB,checkPhoneNumber,checkDirection,checkNumbers} 
from '../../../validations/validations'

export default {
  components: {loader},
  data: () => ({
    codigoViejo: '',
    //Reglas de agregado y editado
    rules:{
      counterCodigoClienteFiscal: counterCodigoClienteFiscal,
      counterDescripcionClienteFiscal: counterDescripcionClienteFiscal,
      counterDireccion: counterDireccion,
      counterTelefono: counterTelefono,
      counterIdFiscal: counterIdFiscal,
      counterEmail: counterEmail,
      counterIIBB: counterIIBB,
      checkCode: checkCode,
      checkPhoneNumber: checkPhoneNumber,
      checkDirection: checkDirection,
      checkNumbers: checkNumbers,
      checkEmail: checkEmail
    },
    //Elemento que se va a guardar con el UPDATE
    clienteFiscal: {
      Cliente_Fiscal_Codigo: "",
      Cliente_Fiscal_Descripcion: "",
      Cliente_Fiscal_Cliente: 0, //guardar el cliente que viene
      Cliente_Fiscal_Tipo_ID_Fiscal: "",
      Cliente_Fiscal_Identificador_Fiscal: "",
      Cliente_Fiscal_IIBB: "",
      Cliente_Fiscal_Direccion: "",
      Cliente_Fiscal_Telefono: "",
      Cliente_Fiscal_Giro_Negocio: "",
      Cliente_Fiscal_Mail_Para: "",
      Cliente_Fiscal_Mail_Copia: "",
      Cliente_Fiscal_Direccion_Factura: "",
      Cliente_Fiscal_Mail_Pagos: "",
      Cliente_Fiscal_Telefono_Pagos: "",
      Cliente_Fiscal_Predeterminado: "",
      Usuario_Creacion: 2,
      Usuario_Modificacion: 2,
      Visible: 'X'
    },
    tiposIDFiscal: ['CUIT','REN','DNI'],
    codigoViejo: "",
    alert: false,
    dialogCancelar: false,
  }),

  created(){
    this.clienteFiscal = this.$store.state.clienteFiscal[0]
    this.codigoViejo = this.clienteFiscal.Cliente_Fiscal_Codigo
  },

  methods: {
    rollback(){
      if(this.$store.state.clienteTipo == 0){
        this.$router.push({ path: '/createCliente'})
      } else {
      this.$router.push({ path: '/editCliente' })
      }
    },

    guardar() {
      if(this.$refs.form.validate()){
      this.$store.state.cliente[0].ClientesFiscales.filter(
        cliente => cliente.Cliente_Fiscal_Codigo != this.codigoViejo).push(this.clienteFiscal)
        this.alert = true
        setTimeout(() => {this.alert = false}, 2000)
      this.rollback();
      }
    },
    mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
    }
    }
};
</script>