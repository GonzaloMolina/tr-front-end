<template>
    <v-content>
        <v-container>
            <loader :loader="loader" style="position: fixed;"/>
            <div v-if="!loader && permisoLecturaABM()">
            <div class="alert alert-primary mt-3" role="alert" style="display: none;">
                Se han guardado los cambios.
            </div>
            <b-form-row>
                <b-col cols="9">
                    <h5>Editar Región:</h5>
                    <h2>{{region.Region_Descripcion}}</h2>
                </b-col>
                <b-col cols="3" class="d-flex justify-content-end">
                    <div class="button-group">
                        <v-btn  v-if="permisoEscrituraABM()" :disabled="!isFormValid" @click="save()" color="#2991C6" dark class="mr-0">Guardar</v-btn> 
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
                                v-model="region.Region_Codigo"
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
                                v-model="region.Region_Descripcion"
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
                                v-model="region.Region_Agrupada"
                                :items="grupos"
                                label="Grupo"
                                :disabled="isFormDisabled"
                                item-text="Region_Agrupada_Descripcion"    
                                :return-object="true"                           
                                >
                                </v-autocomplete>
                            </b-col>
                            <b-col cols="6">
                                <v-combobox
                                dense
                                outlined
                                v-model="region.Moneda"                            
                                :items="monedas"
                                label="Moneda"
                                :disabled="isFormDisabled"
                                item-text="Moneda_Descripcion"  
                                :return-object="true"
                                >
                                </v-combobox>
                            </b-col>
                            <b-col>
                                <v-textarea
                                outlined
                                auto-grow
                                background-color="white"
                                filled
                                color="black"
                                label="Observaciones"
                                v-model="region.Region_Observacion"
                                :counter="3000"
                                placeholder="Escribe.."
                                rows="1"
                                :disabled="isFormDisabled"
                                ></v-textarea> 
                            </b-col>

                        </b-form-row>
                    </v-form>
                </v-card>
                <v-dialog v-model="dialogCancelar" width="500px" height="10rem" v-if="permisoEscrituraABM()">
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
        region: {Usuario_Modificacion: null},
        tipos: [],
        grupos: [],
        monedas: [],
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
        region: {
        handler: 'validateForm',
        deep: true,
        immediate: false,
        include: [
            'Region_Codigo',
            'Region_Descripcion',
            'Region_Moneda',
            'Region_Agrupada',
            'Region_Observacion'
        ]
     }
    },
    created(){
        this.initialize()
    },
    methods: {
        initialize(){
            axios.get(ip+"/regiones/key/"+this.$route.params.id).then((response) => {
                this.region=response.data
                this.loader = false
            });
            this.getRegionesAgrupadas();
            this.getMonedas();
        },

        cancelEdit(){
            this.$router.push({path:'/regiones'})
        },

        save(){
            this.region.Usuario_Modificacion = parseInt(localStorage.usuario_id)
            axios.patch(ip+"/regiones/"+this.region.Region_Key, this.region).then(
                    this.showSuccessDialog(),
                )
        },

        showSuccessDialog(){
            
            const alertElement = document.querySelector('.alert');
            this.isFormDisabled = true;
            alertElement.style.display = 'block';
            setTimeout(() => {
                this.loader = true
                window.location.href = '/regiones';
            }, 1500);
        }, 

        validateForm() {
          this.isFormValid = this.$refs.form.validate()
        },

        getRegionesAgrupadas(){
            axios.get(ip+"/Regiones_Agrupadas").then((response) => {
                 this.grupos = response.data
            });
        },

        getMonedas(){
            axios.get(ip+"/Monedas/all").then((response) => {
                 this.monedas = response.data
            });
        },

        permisoLecturaABM(){
          return localStorage.Permisos.includes("P91")
        },
        permisoEscrituraABM(){
          return localStorage.Permisos.includes("P92")
        },
    }
  }
</script>