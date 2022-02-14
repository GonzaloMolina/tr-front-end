<template>
  <v-content>
    <v-container>
      <loader style="position: fixed;"/>
      <v-data-table
        style="position: relative; left: 25%; max-width: 50%"
        :headers="headers"
        :items="desserts"
        items-per-page="100"
        hide-default-footer
        hide-default-header
        width="10rem"
      >
        <template v-slot:top>
          <v-toolbar dense flat color="white">
            <v-toolbar-title>Períodos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-select
              dense
              outlined
              label="Desde"
              placeholder="Selecciona..."
              :menu-props="{ bottom: true, offsetY: true }"
              :items="fechas"
              v-model="fechaDesde"
              style="
                position: absolute;
                left: 25%;
                max-width: 10rem;
                max-height: 2rem;
              "
            ></v-select>
            <v-select
              dense
              outlined
              label="Hasta"
              placeholder="Selecciona..."
              :menu-props="{ bottom: true, offsetY: true }"
              :items="fechas"
              v-model="fechaHasta"
              style="
                position: absolute;
                left: 58%;
                max-width: 10rem;
                max-height: 2rem;
              "
            ></v-select>
            <v-btn
              @click="searchPeriods(fechaDesde, fechaHasta)"
              style="position: absolute; left: 92%; bottom: 5%"
              dark
              fab
              x-small
              color="#2991c6"
            >
              <v-icon> mdi-magnify </v-icon></v-btn
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-divider class="mx-4" horizontal></v-divider>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-b-tooltip.hover
            title="Cerrar período"
            v-if="permisoModificarPeriodosAbiertos(item)"
            medium
            color="#2991c6"
            @click="cerrarMes(item)"
          >
            mdi-lock-open
          </v-icon>
          <v-icon
            v-b-tooltip.hover
            title="Abrir período"
            v-if="permisoModificarPeriodosCerrados(item)"
            medium
            color="#2991c6"
            @click="abrirMes(item)"
          >
            mdi-lock
          </v-icon>
        </template>
      </v-data-table>
    </v-container>
  </v-content>
</template>

<style scoped>
.shrink {
  width: 200px;
}
.container {
  margin-left: 5rem;
}

.v-application--is-ltr .v-data-footer__select {
  display: none;
}
</style>

<script>
import axios from "axios";
import loader from '../../Estado/loader'
import moment from "moment";
const ip = require("../../../ip/ip");
export default {
  components: {loader},
  data: () => ({
    search: "",
    //Diseño del datatable
    headers: [
      {
        text: "Período",
        align: "start",
        sortable: false,
        value: "Tiempo_Periodo",
      },
      {
        text: "Activar o Desactivar",
        value: "actions",
        sortable: false,
        align: "end",
      },
    ],
    //Elementos del datatable
    desserts: [],
    allPeriods: [],

    //Elementos de los combos
    fechas: [],
    //Elementos para la busqueda de la fecha
    fechaDesde: "",
    fechaHasta: "",
    //AUTOCOMPLETE
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  created() {
    this.initialize();
  },

  methods: {
    permisoModificarPeriodosAbiertos(item){
      if (item.Tiempo_Abierto_Cerrado === 'A' && localStorage.Permisos.includes("P26")){
        return true
      }
    },
    permisoModificarPeriodosCerrados(item){
      if (item.Tiempo_Abierto_Cerrado === 'C' && localStorage.Permisos.includes("P26")){
        return true
      }
    },
    async initialize() {
      //Pido todos los clientes al backend
      var date = moment(new Date()).add(1, "months").format("YYYYMM");
      var datefivemonthslater = moment(new Date())
        .add(-4, "months")
        .format("YYYYMM");
      this.getPeriodsNow(datefivemonthslater, date);
      this.getAllPeriods();
    },

    wait(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },

    getPeriodsNow(datefivemonthslater, date) {
      axios
        .get(ip + "/tiempos_periodos/" + datefivemonthslater + "/" + date)
        .then((response) => {
          this.desserts = response.data;
          var lastIndex = this.desserts.length - 1;
          this.fechaDesde = this.desserts[lastIndex].Tiempo_Periodo;
          this.fechaHasta = this.desserts[0].Tiempo_Periodo;
        });
    },

    getAllPeriods() {
      axios.get(ip + "/tiempos_periodos/").then((response) => {
        this.allPeriods = response.data;
        this.fechas = response.data.map((element) => element.Tiempo_Periodo);
      });
    },

    async searchPeriods(fechaDesde, fechaHasta) {
      if (parseInt(fechaDesde) > parseInt(fechaHasta)) {
        alert("La Fecha Desde ingresada es mayor a la Fecha Hasta");
      } else {
        this.getPeriodsNow(fechaDesde, fechaHasta);
      }
    },

    cerrarMes(item) {
      const index = this.desserts.indexOf(item);
      var abierto_cerrado = { Tiempo_Abierto_Cerrado: "C" };
      item.Tiempo_Abierto_Cerrado = "C";
      this.desserts.splice(index, 1, item);
      this.updatePeriodsList(item);
      axios
        .patch(ip + "/tiempos_periodos/" + item.Tiempo_Periodo, abierto_cerrado)
        .then((response) => {
          console.log(response);
        });
      this.evalPeriods();
    },

    abrirMes(item) {
      const index = this.desserts.indexOf(item);
      var abierto_cerrado = { Tiempo_Abierto_Cerrado: "A" };
      item.Tiempo_Abierto_Cerrado = "A";
      this.desserts.splice(index, 1, item);
      this.updatePeriodsList(item);
      axios
        .patch(ip + "/tiempos_periodos/" + item.Tiempo_Periodo, abierto_cerrado)
        .then((response) => {
          console.log(response);
        });
      this.evalPeriods();
    },

    evalPeriods() {
      var periodosAbiertos = this.allPeriods.filter(
        (periodo) => periodo.Tiempo_Abierto_Cerrado == "A"
      );
      console.log(periodosAbiertos);
      var periodosAbiertosAMostrar = periodosAbiertos.map(
        (periodo) => periodo.Tiempo_Periodo
      );
      console.log(periodosAbiertos);
      if (periodosAbiertos.length == 0) {
        alert("Todos los períodos estan cerrados");
      } else if (periodosAbiertos.length > 1) {
        alert(
          "Los siguientes periodos estan abiertos:" + periodosAbiertosAMostrar
        );
      }
    },

    updatePeriodsList(item) {
      var index = this.allPeriods.findIndex(
        (period) => period.Tiempo_Periodo === item.Tiempo_Periodo
      );
      this.allPeriods.splice(index, 1, item);
    },
     mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
    }
  },
};
</script>