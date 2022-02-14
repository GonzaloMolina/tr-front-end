<template>
  <v-content>
        <v-container class="contenedor">
          <v-row>
            <v-col cols="2">
              <v-sheet rounded="lg" color="#1A5E86" width="100%">
                <v-list style="height:32rem" color="transparent">
                  <v-list-item >
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-avatar style="margin-left:3rem" size="80" >
                          <img
                            src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                            alt="Imagen Usuario"
                          />
                        </v-avatar>
                        <h5
                          dense
                          flat
                          style="margin-top: 20px; text-align: center; color: #fff; white-space: initial"
                        >
                          {{colaboradorLogueado.Colaborador_Descripcion}}
                        </h5>
                        <h6
                          dense
                          flat
                          style="margin-top: 20px; text-align: center; color: #fff; white-space: initial"
                          >
                          {{colaboradorLogueado.Puesto.Colaborador_Puesto_Descripcion}}
                        </h6>
                        <h6
                          dense
                          flat
                          style="margin-top: 20px; text-align: center; color: #fff; white-space: initial"
                        >

                          {{colaboradorLogueado.Region.Region_Descripcion}}
                        </h6>
                        <v-spacer></v-spacer>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-col>

            <v-col cols="8">
              <v-expansion-panels
                v-model="panel"
                multiple
                style="top: 0rem; min-width: 120%;"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header style="font-size:20px">Preferencias</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-col cols="6">
                        <v-icon >mdi-calendar-clock</v-icon>
                        <v-title style="display:inline-block;vertical-align: middle">Horas Diarias </v-title>
                        <v-text-field v-model="horasDiarias" hide-details placeholder dense style="position:relative;left:2.7rem;width:3rem;display:inline-block" type=number></v-text-field>
                        </v-col>
                        
                        <v-col cols="6">
                        <v-icon >mdi-calendar-range</v-icon>
                        <v-title style="display:inline-block;vertical-align: middle">HO Semanales </v-title>
                        <v-text-field v-model="hoSemanales" hide-details dense style="position:relative;left:2rem;width:3rem;display:inline-block" type=number></v-text-field>
                        </v-col>

                        <v-col cols="6">
                        <v-icon >mdi-calendar-text</v-icon>
                        <v-title style="display:inline-block;vertical-align: middle">Calendario </v-title>
                        <v-select :items="calendario" v-model="setCalendario" hide-details outlined dense style="left:4rem;width:18rem;display:inline-block"></v-select>
                        </v-col>

                        <v-col cols="6">
                        <v-icon >mdi-calendar-week-begin</v-icon>
                        <v-title style="display:inline-block;vertical-align: middle">Inicio Default </v-title>
                        <v-select :items="inicioDefault" v-model="setDefault" hide-details outlined dense style="left:3rem;width:18rem;display:inline-block"></v-select>
                        </v-col>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel style="position:relative; top:0.5rem">
                    <v-expansion-panel-header style="font-size:20px">Privacidad</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-col>
                        <v-icon >mdi-bell-ring</v-icon>
                        <v-title style="display:inline-block;vertical-align: middle">Notificaciones </v-title>
                      </v-col>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-btn color="#32b4dd" dark @click="" style="top:2rem; right: 41%;">Guardar</v-btn>
                  <v-btn @click="" color="#ffa025" dark style="top:2rem; right: 40%;" >Cancelar</v-btn>
              </v-expansion-panels>

            </v-col >
            <v-col cols="3">
              
            </v-col>
            </v-row
          ></v-container
        >
    </v-content
  >
</template>

<style scoped>

.contenedor{
  min-width: 100%;
  padding:1%;
}
</style>


<script>
import axios from "axios";
const ip = require("../../ip/ip");
export default {
  data: () => ({
    panel: [0,1], //Expande el panel by default
    horasDiarias: 8,
    hoSemanales: 0,
    calendario: [],
    setCalendario: '',
    inicioDefault: ['Carga de Horas'],
    setDefault: 'Carga de Horas',
    usuarioLogueado:{},
    colaboradorLogueado: {}

  }),
  created() {
    this.usuarioLogueado = localStorage.usuario
    this.getColaborador();
    this.getRegiones();
  },
  methods: {
    async getColaborador(){
      await axios.get(ip + "/colaboradores/"+localStorage.usuario_id).then((response) => {
        this.colaboradorLogueado = response.data;
    })
    this.setCalendario = this.colaboradorLogueado.Region.Region_Descripcion
    this.hoSemanales = this.colaboradorLogueado.HomeOffice.Colaborador_Home_Cantidad
  },
    async getRegiones(){
      axios
        .get(ip+"/regiones/descripciones")
        .then((response) => {
          this.calendario = response.data.map(
            (region) => region.Region_Descripcion
          );
        });
    } 
  }
};

</script>