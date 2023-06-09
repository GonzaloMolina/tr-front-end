<template>
    <v-content>
        <v-container>
            <loader :loader="loader" style="position: fixed;"/>
            <div v-if="!loader && permisoCreacionUsuario()">
            <div class="alert alert-primary mt-3" role="alert" style="display: none;">
                Se ha registrado un nuevo Usuario.
            </div>
            <b-form-row>
                <b-col cols="9">
                    <h5>Nuevo Usuario:</h5>
                    <h2>{{usuario.Usuario_Descripcion}}</h2>
                </b-col>
                <b-col cols="3" class="d-flex justify-content-end">
                    <div class="button-group">
                        <v-btn :disabled="!isFormValid" @click="save()" color="#2991C6" dark class="mr-0">Guardar</v-btn> 
                        <v-btn  @click="dialogCancelar = true"  color="#ffa025" dark class="ml-2">Volver</v-btn>
                    </div>
                </b-col>
            </b-form-row>
                <v-card outlined tile>
                    <v-form ref="form">
                        <b-form-row class="ml-1 mr-1 mt-2">
                            <b-col cols="5">
                                <v-text-field
                                outlined
                                dense
                                v-model="usuario.Usuario_Codigo"
                                label="Email"
                                placeholder="Sin asignar"
                                :disabled="isFormDisabled"
                                :rules="[rules.checkIfCodeExists, rules.checkEmpty, rules.checkEmail]"
                            ></v-text-field>
                            </b-col>
                            <b-col cols="3">
                                <v-text-field
                                outlined
                                dense
                                v-model="usuario.Usuario_Nombre"
                                label="Nombre(s)"
                                placeholder="Sin asignar"
                                :disabled="isFormDisabled"
                                :rules="[rules.checkEmpty]"
                            ></v-text-field>
                            </b-col>
                            <b-col cols="4">
                                <v-text-field
                                    outlined
                                    dense
                                    v-model="usuario.Usuario_Apellido"
                                    label="Apellido(s)"
                                    placeholder="Sin asignar"
                                    :disabled="isFormDisabled"
                                    :rules="[rules.checkEmpty]"
                                ></v-text-field>
                            </b-col>
                        </b-form-row>
                        <b-form-row class="ml-1 mr-1 mt-n5">
                            <b-col cols="3">
                                <v-autocomplete
                                dense
                                outlined
                                v-model="usuario.Usuario_Tipo"
                                :items="['Administrador', 'Miembro', 'Migración']"
                                :return-object="true"
                                label="Tipo"
                                placeholder="Sin asignar"
                                :rules="[rules.checkSelection]"
                                >
                                </v-autocomplete>
                            </b-col>
                            <b-col cols="4">
                                <v-autocomplete
                                dense                              
                                outlined
                                v-model="usuario.Usuario_Rol"
                                :items="Rolitems"
                                item-text="Rol_Descripcion"
                                item-value="Rol_Key"
                                label="Rol"
                                placeholder="Sin asignar"
                                :rules="[rules.checkSelection]"
                                >
                            </v-autocomplete> 
                            </b-col>
                            <b-col cols="5">
                            <v-text-field
                                outlined
                                dense
                                v-model="usuario.Usuario_Mail_Alternativo"
                                label="Email Alternativo"
                                placeholder="Sin asignar"
                                :disabled="isFormDisabled"
                            ></v-text-field>
                        </b-col>
                                            
                        </b-form-row>

                    </v-form>
                </v-card>
                <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
                    <v-card>
                        <v-toolbar dark color="#2991C6" height="30rem">
                        <v-icon color="#ffa025" style="text-shadow: 1px 1px 2px black; position:absolute; left:38%">mdi-alert</v-icon>
                        <h5 class="mt-2" style="font-weight: bold; position:absolute; left:45%; color:white; text-shadow: 1px 1px 2px black;">ALERTA</h5>
                        </v-toolbar>
                        <v-card-title>Los cambios no guardados se borrarán.<br>¿Deseas continuar?</v-card-title>
                        <v-card-actions>
                        <v-btn color="white" text outlined style="margin-left:16rem; background-color:#2991C6" @click="cancelCreate()">
                            Aceptar
                        </v-btn>
                        <v-btn color="white" outlined text style="margin-left:0.5rem; background-color:#ffa025" @click="dialogCancelar = false">
                            Cancelar
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </v-container>
    </v-content>
</template>

<script>
  import axios from 'axios';
  const ip = require('../../../ip/ip')
  import loader from '../../Estado/loader'
  import {checkCode,counterCodigo,counterDescripcion, isFieldEmpty, isNotSelected, checkEmail} from '../../../validations/validations'
  export default {
    components: {loader},
    data() {
      return{
        usuario: {
            Usuario_Creacion: parseInt(localStorage.usuario_id),
        },
        rules: {
            checkCode: checkCode,
            counterCodigo: counterCodigo,
            counterDescripcion: counterDescripcion,
            checkEmpty: isFieldEmpty,
            checkSelection: isNotSelected,
            checkEmail: checkEmail,
            checkIfCodeExists: (value) => {
                const exists = this.usuarios.some((item) => item.Usuario_Codigo === value);
                    return exists ? "Ya existe un usuario registrado con ese mail" : true;
            },
            checkIfDescExists: (value) => {
                const exists = this.usuarios.some((item) => item.Usuario_Descripcion === value);
                    return exists ? "Ya existe una tecnología con esta descripción" : true;
            }
        },
        usuarios: [],
        tipos: [],
        Rolitems:[],
        loader: true,
        dialogCancelar: false,
        isFormDisabled: false,
        isFormValid: null,
     };
    },
    created(){
        this.loadRoles()
        this.getUsuarios()
        this.loader = false
    },
    watch: {
        usuario: {
        handler: 'validateForm',
        deep: true,
        immediate: false,
        include: [
            'Usuario_Codigo',
            'Usuario_Descripcion',
            'Usuario_Proveedor',
            'Tipo',
        ]
     }
    },
    methods: {
        loadRoles(){
      axios.get(ip+"/seguridad/").then((response) => {
        this.Rolitems = response.data;
      })
    },

        getUsuarios(){
            axios.get(ip+"/usuarios").then(response => {
                this.usuarios = response.data
                console.log(this.usuarios)
            })
        },

        cancelCreate(){
            this.$router.push({path:'/usuariosTable'})
        },

        save(){
            axios.post(ip+"/usuarios/", this.usuario).then(
                    this.showSuccessDialog()
                )
        },

        showSuccessDialog(){
            const alertElement = document.querySelector('.alert');
            this.isFormDisabled = true;
            alertElement.style.display = 'block';
            setTimeout(() => {
                window.location.href = '/usuariosTable';
            }, 1500);
        }, 

        validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },

        permisoCreacionUsuario(){
          return localStorage.Permisos.includes("P124")
        },

    }
  }
</script>