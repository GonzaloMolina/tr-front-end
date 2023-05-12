<template>
    <v-content>
        <v-container>
            <loader :loader="loader" style="position: fixed;"/>
            <div v-if="!loader && permisoLecturaTipoProyecto()">
            <div class="alert alert-primary mt-3" role="alert" style="display: none;">
                Se ha creado el tipo de proyecto.
            </div>
            <b-form-row>
                <b-col cols="9">
                    <h5>Editar Tipo de Proyeco:</h5>
                    <h2>{{proyectotipo.Proyecto_Tipo_Descripcion}}</h2>
                </b-col>
                <b-col cols="3" class="d-flex justify-content-end">
                    <div class="button-group">
                        <v-btn  v-if="permisoEscrituraTipoProyecto()" :disabled="!isFormValid" @click="save()" color="#2991C6" dark class="mr-0">Guardar</v-btn> 
                        <v-btn  @click="dialogCancelar = true"  color="#ffa025" dark class="ml-2">Volver</v-btn>
                    </div>
                </b-col>
            </b-form-row>
                <v-card outlined tile>
                    <v-form ref="form">
                        <b-form-row class="ml-1 mr-1 mt-2">
                            <b-col cols="4">
                                <v-text-field
                                outlined
                                dense
                                v-model="proyectotipo.Proyecto_Tipo_Codigo"
                                label="Código"
                                placeholder="Escribe..."
                                :disabled="isFormDisabled"
                                :rules="[rules.checkEmpty,rules.checkCode, rules.counterCodigo, rules.checkIfCodeExists]"
                            ></v-text-field>
                            </b-col>
                            <b-col cols="8">
                                <v-text-field
                                outlined
                                dense
                                v-model="proyectotipo.Proyecto_Tipo_Descripcion"
                                label="Descripción"
                                placeholder="Escribe..."
                                :disabled="isFormDisabled"
                                :rules="[rules.counterDescripcion, rules.checkEmpty, rules.checkIfDescExists]"
                            ></v-text-field>
                            </b-col>
                        </b-form-row>
                        <b-form-row class="ml-1 mr-1 mt-n5">
                            <b-col cols="6">
                                <v-combobox
                                dense
                                outlined
                                v-model="proyectotipo.Proyecto_Tipo_Grupo"
                                :items="grupos"
                                label="Grupo"
                                :disabled="isFormDisabled"
                                >
                                </v-combobox>
                            </b-col>
                            <b-col cols="6">
                                <v-combobox
                                dense
                                outlined
                                v-model="proyectotipo.Proyecto_Tipo_Beneficio"                            
                                :items="beneficios"
                                label="Beneficio"
                                :disabled="isFormDisabled"
                                >
                                </v-combobox>
                            </b-col>

                        </b-form-row>
                    </v-form>
                </v-card>
                <v-dialog v-model="dialogCancelar" width="500px" height="10rem" v-if="permisoEscrituraTipoProyecto()">
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
        proyectotipo: {Usuario_Creacion: parseInt(localStorage.usuario_id)},
        tipos: [],
        grupos: [],
        beneficios: [],
        proyectotipos: [],
        loader: true,
        dialogCancelar: false,
        isFormDisabled: false, 
        isFormValid: true,
        newGrupo: " ",
        rules: {
            checkCode: checkCode,
            counterCodigo: counterCodigo,
            counterDescripcion: counterDescripcion,
            checkEmpty: isFieldEmpty,
            checkSelection: isNotSelected,
            checkIfCodeExists: (value) => {
                const exists = this.proyectotipos.some((item) => item.Proyecto_Tipo_Codigo === value);
                    return exists ? "El código ya existe" : true;
            },
            checkIfDescExists: (value) => {
                const exists = this.proyectotipos.some((item) => item.Proyecto_Tipo_Descripcion === value);
                    return exists ? "Ya existe un tipo de proyecto con esta descripción" : true;
            }
        },
     };
    },
    watch: {
        proyectotipo: {
        handler: 'validateForm',
        deep: true,
        immediate: false,
        include: [
            'Proyecto_Tipo_Codigo',
            'Proyecto_Tipo_Descripcion',
            'Proyecto_Tipo_Grupo',
            'Proyecto_Tipo_Beneficio'
        ]
     }
    },
    created(){
        this.initialize()
    },
    methods: {
        initialize(){
            this.getGrupos();
            this.getBeneficios();
            this.getProyectosTipos();
            this.loader = false
        },

        getProyectosTipos(){
            axios.get(ip+"/proyectos_tipos").then(response => {
                this.proyectotipos = response.data
            })
        },

        cancelCreate(){
            this.$router.push({path:'/proyectostipos'})
        },

        save(){
            this.proyectotipo.Usuario_Creacion = parseInt(localStorage.usuario_id)
            axios.post(ip+"/proyectos_tipos/", this.proyectotipo).then(
                    this.showSuccessDialog(),
                )
        },

        showSuccessDialog(){
            
            const alertElement = document.querySelector('.alert');
            this.isFormDisabled = true;
            alertElement.style.display = 'block';
            setTimeout(() => {
                this.loader = true
                window.location.href = '/proyectostipos';
            }, 1500);
        }, 

        validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },

        getGrupos(){
            axios.get(ip+"/proyectos_tipos/grupos").then((response) => {
                 this.grupos = [...new Set(response.data.map((item) => item.DISTINCT))];

            });
        },

        getBeneficios(){
            axios.get(ip+"/proyectos_tipos/beneficios").then((response) => {
                 this.beneficios = [...new Set(response.data.map((item) => item.DISTINCT))];
            });
        },

        permisoLecturaTipoProyecto(){
          return localStorage.Permisos.includes("P71")
        },
        permisoEscrituraTipoProyecto(){
          return localStorage.Permisos.includes("P72")
        },
    }
  }
</script>