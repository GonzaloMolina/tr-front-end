<template>
 <v-content>
    <v-container fluid >
       <loader :loader="loader" style="position: fixed;"/>
        <v-alert
          :value="alert"
          style="position: relative;  left: 0; right: 0; top: -12px; text-align: center;"
          top
          dense
          color="blue"
          type="success"> 
          Se han guardado los cambios.
        </v-alert>
        <b-alert v-model="alert_mail" variant="danger" dismissible>
          El e-mail ingresado no es válido
        </b-alert>
        <b-form-row>
            <b-col class="col-9">
              <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
            </b-col>
            <b-col class="col-2 ">
              <b-row>
                <v-btn :disabled="!btnSegEdit()" @click="saveUser()" color="#2991C6" dark >Guardar</v-btn>
                <v-btn @click="back()" color="#ffa025" dark class="ml-3">Volver</v-btn> 
              </b-row>
            </b-col>             
          </b-form-row>

          <v-card class="pa-2 mt-4 mr-10 " max-width="1650" outlined tile>
            <v-form ref="form">
            <b-form-row class="ml-1 mr-1">
              <b-col class="col-3">
              <v-text-field
               :disabled="!seguridadUsuariosEditar()"
                outlined
                dense         
                v-model="this.usuario.Usuario_Codigo"    
                label="Código"
                placeholder="Escribe..."
                class="mt-3"
                >
              </v-text-field>
            </b-col>
            <b-col class="col-4">
              <v-text-field
                :disabled="!seguridadUsuariosEditar()"
                outlined
                dense
                v-model="usuario.Usuario_Nombre_Completo"
                label="Nombre Completo"
                placeholder="Escribe..."
                class="mt-3">
              </v-text-field>
            </b-col>
            <b-col>
              <v-text-field
                outlined
                dense
                :disabled="!seguridadUsuariosEditar()"
                v-model="usuario.Usuario_Mail"
                @change="validarMail()"
                label="Mail"
                placeholder="Escribe..."
                class="mt-3">
              </v-text-field>
            </b-col>
           </b-form-row> 
           <b-form-row class="ml-1 mr-1 mt-n6">
            <b-col class="col-3">
              <v-autocomplete
                dense
                :disabled="!seguridadUsuariosEditar()"
                outlined
                v-model="usuario.Usuario_Tipo"
                :items="['Administrador', 'Miembro', 'Migración']"
                label="Tipo"
                >
              </v-autocomplete>
            </b-col>
            <b-col class="col-4">
              <v-autocomplete
                dense
                :disabled="!seguridadUsuariosEditar()"
                outlined
                v-model="usuario.Usuario_Rol"
                :items="Rolitems"
                item-text="Rol_Descripcion"
                item-value="Rol_Key"
                label="Rol"
                placeholder="Sin asignar"
                >
              </v-autocomplete> 
            </b-col>
            <b-col>
              <b-row class="ml-12">
              <h6 class="mr-3 mt-3" >Habilitar/Deshabilitar</h6>
                    <v-switch 
                    :disabled="!seguridadUsuariosEditar()"
                      class="mt-2 mb-1 ml-2"
                      v-model="switch1"
                      inset
                    ></v-switch>
                  </b-row>
            </b-col>
          </b-form-row>
            </v-form>
            </v-card>
          
      <!-- <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
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
            </v-dialog> -->
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
import loader from '../../Estado/loader'
import axios from "axios";
const ip = require('../../../ip/ip');
import {checkEmail, counterEmail,} 
from '../../../validations/validations'
export default{
  name:'editUsuario',
  components:{loader},
  mounted() {
    if(!localStorage.login){
      this.$router.push("/login");
    }
  },
  data: () => ({
    loader: true,
    alert: false,
    button: false,
    alert_mail: false,
    usuario: {
      Usuario_Key:'',
      Usuario_Codigo: '',
      Usuario_Rol:'',
      Usuario_Cod_Rol:'',
      Usuario_Nombre_Completo: '',
      Usuario_Mail: '',
      Usuario_Tipo:'',
      Usuario_Nombre: '',
      Usuario_Apellido: '',
      Usuario_TokenID: '',
      Usuario_Habilitado: '',
      Usuario_Mail_Alternativo: '',
    },
    switch1: false,
    roles:[]
   
  }),
  created(){
    this.loadRoles();
    this.loadUsuario();

  },
  rules: {
      checkEmail: checkEmail,
      counterEmail: counterEmail,
    },
  methods:
  {

    loadRoles(){
      axios.get(ip+"/seguridad/").then((response) => {
        this.Rolitems = response.data;
      })
    },
    seguridadUsuariosEditar(){
      if(localStorage.Permisos.includes("P47") && localStorage.Permisos.includes("P48") ){
          return true 
        }
    },

    btnSegEdit(){
      return this.seguridadUsuariosEditar() && !this.button
    },


      async loadUsuario(){       
        this.usuario_id = this.$store.state.usuario_id;   
        axios.get(ip+"/usuarios/user/"+this.usuario_id).then((response) => {
          this.usuario.Usuario_Key = response.data.Usuario_Key;
          this.usuario.Usuario_Nombre_Completo = response.data.Usuario_Nombre_Completo;
          this.usuario.Usuario_Tipo = response.data.Usuario_Tipo;
          this.usuario.Usuario_Codigo = response.data.Usuario_Codigo;
          this.usuario.Usuario_Apellido = response.data.Usuario_Apellido;
          this.usuario.Usuario_Nombre = response.data.Usuario_Nombre;
          this.usuario.Usuario_Mail_Alternativo = response.data.Usuario_Mail_Alternativo;
          this.usuario.Usuario_TokenID = response.data.Usuario_TokenID;
          this.usuario.Usuario_Habilitado = response.data.Usuario_Habilitado;
          this.usuario.Usuario_Rol = response.data.Usuario_Rol;
          //Validación mail
          if (response.data.Usuario_Mail === ""){
            this.usuario.Usuario_Mail = "Sin asignar";
          }
          else{
            this.usuario.Usuario_Mail = response.data.Usuario_Mail;
          }

          if(this.usuario.Usuario_Habilitado === 'X'){
            this.switch1 = true;
          }
        });      
        await this.wait(1800);
        this.loader = false;  
    },

    async saveUser(){

        //Habilitar/deshabilitar
        if(this.switch1){
          this.usuario.Usuario_Habilitado = 'X'
        }
        else{
            this.usuario.Usuario_Habilitado = null
        }

        await axios.patch(ip+"/usuarios/"+ this.usuario_id, this.usuario)
            .then((response) => {
                this.alert = true
            setTimeout(() => {this.alert = false
            this.$router.push({path: "/usuariosTable"})}, 2000)
            })
       this.loader = true;
    },

    validarMail(){
      if(checkEmail(this.usuario.Usuario_Mail) === 'E-mail Invalido'){
        this.button = true;
        this.alert_mail = true;
      }
      else{
        this.alert_mail = false;
        this.button = false;
      }
    },

    wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      })
    },
    back(){
      this.$router.push({path:'/usuariosTable'})
    }
  }
}
</script>
