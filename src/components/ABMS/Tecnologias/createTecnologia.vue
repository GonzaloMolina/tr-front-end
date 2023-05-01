<template>
    <v-content>
        <v-container>
            <loader :loader="loader" style="position: fixed;"/>
            <div v-if="!loader && permisoCreacionTecnologia()">
            <div class="alert alert-primary mt-3" role="alert" style="display: none;">
                Se ha registrado una nueva tecnología.
            </div>
            <b-form-row>
                <b-col cols="9">
                    <h5>Nueva tecnología:</h5>
                    <h2>{{tecnologia.Tecnologia_Descripcion}}</h2>
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
                            <b-col cols="2">
                                <v-text-field
                                outlined
                                dense
                                v-model="tecnologia.Tecnologia_Codigo"
                                label="Código"
                                placeholder="Sin asignar"
                                :disabled="isFormDisabled"
                                :rules="[rules.checkIfCodeExists, rules.checkEmpty,rules.checkCode, rules.counterCodigo]"
                            ></v-text-field>
                            </b-col>
                            <b-col cols="6">
                                <v-text-field
                                outlined
                                dense
                                v-model="tecnologia.Tecnologia_Descripcion"
                                label="Descripción"
                                placeholder="Sin asignar"
                                :disabled="isFormDisabled"
                                :rules="[rules.checkIfDescExists, rules.counterDescripcion, rules.checkEmpty]"
                            ></v-text-field>
                            </b-col>
                            <b-col cols="4">
                                <v-text-field
                                    outlined
                                    dense
                                    v-model="tecnologia.Tecnologia_Proveedor"
                                    label="Proveedor"
                                    placeholder="Sin asignar"
                                    :disabled="isFormDisabled"
                                    :rules="[rules.checkEmpty]"
                                ></v-text-field>
                            </b-col>
                        </b-form-row>
                        <b-form-row class="ml-1 mr-1 mt-n5">
                            <b-col cols="4">
                                <v-autocomplete
                                dense
                                outlined
                                v-model="tecnologia.Tipo"
                                :items="tipos"
                                :return-object="true"
                                label="Tipo"
                                item-text="Tipo_Tecnologia_Descripcion"
                                :disabled="isFormDisabled"
                                placeholder="Sin asignar"
                                :rules="[rules.checkSelection]"
                                >
                                </v-autocomplete>
                            </b-col>
                            <b-col>
                                <v-textarea
                                outlined
                                auto-grow
                                background-color="white"
                                filled
                                color="black"
                                label="Observaciones"
                                v-model="tecnologia.Tecnologia_Observacion"
                                :counter="3000"
                                placeholder="Sin observaciones"
                                rows="1"
                                :disabled="isFormDisabled"
                                ></v-textarea> 
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
  import {checkCode,counterCodigo,counterDescripcion, isFieldEmpty, isNotSelected} from '../../../validations/validations'
  export default {
    components: {loader},
    data() {
      return{
        tecnologia: {
            Usuario_Creacion: parseInt(localStorage.usuario_id),
        },
        rules: {
            checkCode: checkCode,
            counterCodigo: counterCodigo,
            counterDescripcion: counterDescripcion,
            checkEmpty: isFieldEmpty,
            checkSelection: isNotSelected,
            checkIfCodeExists: (value) => {
                const exists = this.tecnologias.some((item) => item.Tecnologia_Codigo === value);
                    return exists ? "El código ya existe" : true;
            },
            checkIfDescExists: (value) => {
                const exists = this.tecnologias.some((item) => item.Tecnologia_Descripcion === value);
                    return exists ? "Ya existe una tecnología con esta descripción" : true;
            }
        },
        tecnologias: [],
        tipos: [],
        loader: true,
        dialogCancelar: false,
        isFormDisabled: false,
        isFormValid: null,
     };
    },
    created(){
        this.getTecnologiastipos()
        this.getTecnologias()
        this.loader = false
    },
    watch: {
        tecnologia: {
        handler: 'validateForm',
        deep: true,
        immediate: false,
        include: [
            'Tecnologia_Codigo',
            'Tecnologia_Descripcion',
            'Tecnologia_Proveedor',
            'Tipo',
            'Tecnologia_Observacion',
        ]
     }
    },
    methods: {

        getTecnologias(){
            axios.get(ip+"/tecnologias").then(response => {
                this.tecnologias = response.data
                console.log(this.tecnologias)
            })
        },

        getTecnologiastipos(){
            axios.get(ip+"/tipos_tecnologias/activos").then(response => {
                this.tipos = response.data
            })
        }, 

        cancelCreate(){
            this.$router.push({path:'/tecnologias'})
        },

        save(){
            axios.post(ip+"/tecnologias/", this.tecnologia).then(
                    this.showSuccessDialog()
                )
        },

        showSuccessDialog(){
            const alertElement = document.querySelector('.alert');
            this.isFormDisabled = true;
            alertElement.style.display = 'block';
            setTimeout(() => {
                window.location.href = '/tecnologias';
            }, 1500);
        }, 

        validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },

        permisoCreacionTecnologia(){
          return localStorage.Permisos.includes("P53")
        },

    }
  }
</script>