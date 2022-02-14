<template>
  <v-content>
    <v-container fluid>
      <loader style="position: fixed;"/>
      <v-row>
        <v-header
          style="font-size:1.5rem; margin-left:3rem; margin-top:2rem; min-width:38rem; max-width:60rem"
        >Tareas</v-header>
        <v-btn dark fab x-small color="#2991c6" style="margin-left:-32.5rem; margin-top:2rem;">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>

        <v-btn
          color="#32b4dd"
          dark
          style="margin-left:67rem;margin-top:2rem"
          @click="guardar"
        >Guardar</v-btn>
        <v-btn
          @click="rollback"
          color="#ffa025"
          dark
          style="margin-left:1rem;margin-top:2rem"
        >Cancelar</v-btn>
        <v-col cols="10" style="max-width:64rem; margin-left:1rem;">
          <v-card class="pa-2" outlined tile>
            <v-text-field
              outlined
              dense
              label="Código"
              placeholder="Escribe..."
              style="display:inline-block; max-width: 8rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              label="Grupo 1"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; max-width: 12rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              label="Grupo 2"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; max-width: 12rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              label="Descripción"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; min-width: 25.5rem;"
            ></v-text-field>
            <v-select
              dense
              outlined
              value="Muy Baja"
              :items="tiposProyectos_Descripciones"
              label="Prioridad"
              placeholder="Selecciona..."
              style="max-width:8rem; display:inline-block;"
            ></v-select>

            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="F. Pedido"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  style="max-width:6rem; display:inline-block; margin-left: 1rem;"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
            </v-menu>

            <v-autocomplete
              label="Tipo Fecha"
              :items="usuariosDescripciones"
              :loading="isLoading"
              :search-input.sync="searchResponsables"
              outlined
              dense
              cache-items
              placeholder="Selecciona..."
              color="white"
              style="min-width:8rem; max-width:10rem; display:inline-block; margin-left:1rem;"
            ></v-autocomplete>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Fecha"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  style="max-width:6rem; display:inline-block; margin-left: 1rem;"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
            </v-menu>
            <v-text-field
              outlined
              dense
              label="Pedido por"
              placeholder="Escribe..."
              style="display:inline-block; margin-left:1rem; max-width: 13rem;"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              label="Adjuntar Archivo"
              placeholder="Escribe..."
              style="display:inline-block; margin-top:1rem; max-width: 12.5rem; margin-left:1rem;"
            ></v-text-field>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-textarea
            style="min-width:27rem; "
            auto-grow
            background-color="white"
            filled
            color="black"
            label="Observaciones"
            placeholder="Escribe.."
            rows="4"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import loader from '../Estado/loader'
export default {
      components: {loader},
        mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
}
}
</script>


<style scoped>
.container {
  min-width: 100rem;
  margin-top: -1rem;
}
</style>