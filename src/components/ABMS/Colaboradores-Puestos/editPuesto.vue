<template>
    <v-content>
        <v-container>
            <loader :loader="loader" style="position: fixed;"/>
            <div v-if="!loader && permisoLecturaPuesto()">
            <div class="alert alert-primary mt-3" role="alert" style="display: none;">
                Se han guardado los cambios.
            </div>
            <b-form-row>
                <b-col cols="9">
                    <h5>Editar Puesto:</h5>
                    <h2>{{puesto.Colaborador_Puesto_Descripcion}}</h2>
                </b-col>
                <b-col cols="3" class="d-flex justify-content-end">
                    <div class="button-group">
                        <v-btn  v-if="permisoEscrituraPuesto()" :disabled="!isFormValid" @click="save()" color="#2991C6" dark class="mr-0">Guardar</v-btn> 
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
                                v-model="puesto.Colaborador_Puesto_Codigo"
                                label="Código"
                                placeholder="Escribe..."
                                :disabled="isFormDisabled"
                                :rules="[rules.checkEmpty,rules.checkCode, rules.counterCodigo]"
                            ></v-text-field>
                            </b-col>
                            <b-col cols="8">
                                <v-text-field
                                outlined
                                dense
                                v-model="puesto.Colaborador_Puesto_Descripcion"
                                label="Descripción"
                                placeholder="Escribe..."
                                :disabled="isFormDisabled"
                                :rules="[rules.counterDescripcion, rules.checkEmpty]"
                            ></v-text-field>
                            </b-col>
                        </b-form-row>
                        <b-form-row class="ml-1 mr-1 mt-n5">
                            <b-col cols="6">
                                <v-autocomplete
                                dense
                                outlined
                                v-model="puesto.Padre"
                                :items="puestos"
                                label="Padre"
                                :disabled="isFormDisabled"
                                :return-object="true" 
                                item-text="Colaborador_Puesto_Descripcion"
                                >
                                </v-autocomplete>
                            </b-col>
                            <b-col cols="6">
                                <v-combobox
                                dense
                                outlined
                                v-model="puesto.Colaborador_Puesto_Skill"                            
                                :items="skills"
                                label="Skill"
                                :disabled="isFormDisabled"
                                >
                                </v-combobox>
                            </b-col>
                        </b-form-row>
                        <b-form-row class="ml-1 mr-1 mt-n5">
                            <b-col>
                                <v-textarea
                                outlined
                                auto-grow
                                background-color="white"
                                filled
                                color="black"
                                label="Observaciones"
                                v-model="puesto.Colaborador_Puesto_Observacion"
                                :counter="3000"
                                placeholder="Escribe.."
                                rows="1"
                                :disabled="isFormDisabled"
                                ></v-textarea> 
                            </b-col>

                        </b-form-row>
                    </v-form>
                </v-card>
                <v-dialog v-model="dialogCancelar" width="500px" height="10rem" v-if="permisoEscrituraPuesto()">
                    <v-card>
                        <v-toolbar dark color="#2991C6" height="30rem">
                        <v-icon color="#ffa025" style="text-shadow: 1px 1px 2px black; position:absolute; left:38%">mdi-alert</v-icon>
                        <h5 class="mt-2" style="font-weight: bold; position:absolute; left:45%; color:white; text-shadow: 1px 1px 2px black;">ALERTA</h5>
                        </v-toolbar>
                        <v-card-title>Los cambios no guardados se borrarán.<br>¿Deseas continuar?</v-card-title>
                        <v-card-actions>
                        <v-btn color="white" text outlined style="margin-left:16rem; background-color:#2991C6" @click="cancelEdit()">
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
        puesto: {Padre:{Colaborador_Puesto_Codigo:null},Usuario_Modificacion: null},
        tipos: [],
        puestos: [],
        skills: [],
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
            checkSelection: isNotSelected
        },
     };
    },
    watch: {
        puesto: {
        handler: 'validateForm',
        deep: true,
        immediate: false,
        include: [
            'Colaborador_Puesto_Codigo',
            'Colaborador_Puesto_Descripcion',
        ]
     }
    },
    created(){
        this.initialize()
    },
    methods: {
        initialize(){
            axios.get(ip+"/colaboradores_puestos/"+ this.$route.params.id).then((response) => {
                this.puesto=response.data
                this.loader = false
            });
            this.getPuestos();
            this.getSkills();
        },

        getPuestos(){
            axios.get(ip+"/colaboradores_puestos/").then(response => {
                this.puestos = response.data
                this.getPuestoPadre()
            })
        },

        getPuestoPadre() {
            const parentPuesto = this.puestos.find(p => p.Colaborador_Puesto_Codigo == this.puesto.Colaborador_Puesto_Padre);
            if(parentPuesto){
                this.puesto.Padre = parentPuesto
            }
        },

        getSkills(){
            axios.get(ip+"/colaboradores_puestos/skills").then((response) => {
                 this.skills = [...new Set(response.data.map((item) => item.DISTINCT))];
            });
        },

        cancelEdit(){
            this.$router.push({path:'/puestos'})
        },

        save(){
            this.puesto.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/colaboradores_puestos/"+this.puesto.Colaborador_Puesto_Key, this.puesto).then(
                    this.showSuccessDialog(),
                )
        },

        showSuccessDialog(){      
            const alertElement = document.querySelector('.alert');
            this.isFormDisabled = true;
            alertElement.style.display = 'block';
            setTimeout(() => {
                this.loader = true
                window.location.href = '/puestos';
            }, 1500);
        }, 

        validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },


        permisoLecturaPuesto(){
          return localStorage.Permisos.includes("P101")
        },
        permisoEscrituraPuesto(){
          return localStorage.Permisos.includes("P102")
        },
    }
  }
</script>