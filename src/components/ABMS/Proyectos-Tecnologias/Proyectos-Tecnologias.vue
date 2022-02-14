<template>
<v-content>
<v-container style="width:26rem;margin-left: -1rem">
  <loader style="position: fixed;"/>
    <v-text style="font-size:1.5rem;padding-left:1rem">Tecnologías</v-text>
    <v-data-table
        :headers="headersProyectosTecnologias"
        :items="this.$store.state.proyecto[0].Tecnologias"
        sort-by="Proyecto_Tecnologia_Tecnologia"
        :items-per-page="4"
        class="elevation-1"
        hide-default-footer
        style="min-width:10rem"
        >
        <template v-slot:top>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                <v-btn
      
                    v-show="permisoEscrituraProyectoTecnologia()"
                    :loading="!$attrs.proyectoFueGuardado"
                    dark 
                    fab 
                    x-small 
                    color="#2991c6"
                    v-bind="attrs"
                    v-on="on"
                    style="margin-left:10rem;margin-top:-4rem"
                >
                <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                </template>
                <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                    <v-row>
                        <v-autocomplete
                        v-model="proyectoTecnologia.Proyecto_Tecnologia_Tecnologia"
                        label="Tecnología"
                        :items="tecnologiasDescripciones"
                        :search-input.sync="searchTecnologias"
                        dense
                        cache-items
                        placeholder="Selecciona..."
                        color="white"
                        ></v-autocomplete>
                    </v-row>
                        <v-row>
                        <v-text-field style="max-width:5rem" 
                        v-model="proyectoTecnologia.Proyecto_Tecnologia_Porcentaje" label="Porcentaje"></v-text-field>
                        <v-icon>%</v-icon>
                        <v-card-actions>
                            <v-btn style="margin-left:10rem" color="#2991c6" text @click="close">Cancel</v-btn>
                            <v-btn color="#2991c6" text @click="save">Save</v-btn>
                        </v-card-actions>
                        </v-row>
                    </v-container>
                </v-card-text>

                
                </v-card>
            </v-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon
            small
            class="mr-2"
            color="#2991c6"
            @click="editItem(item)"
            >
            mdi-pencil
            </v-icon>
            <v-icon
            small
            color="#2991c6"
            @click="deleteItem(item)"
            >
            mdi-delete
            </v-icon>
        </template>
        </v-data-table>
</v-container>
</v-content>
</template>

<style scoped>
.v-content{
    margin-top:-5rem;
    margin-right: 0rem;
}
</style>

<script>
import axios from 'axios';
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
  export default {
    components: {loader},
    data: () => ({  
      dialog: false,
      /*
      rules: {
        numberPattern: (value) => {
          const pattern = /^([0-9])*$/;
          return pattern.test(value) || "Debe introducir solo números";
      }},
      */
      headersProyectosTecnologias: [
        {
          text: "Tecnologia",
          align: "start",
          sortable: false,
          value: "Tecnologia.Tecnologia_Descripcion",
        },
        {
          text: "Porcentaje %",
          value: "Proyecto_Tecnologia_Porcentaje",
          width:'40%',
          sortable: false,
          align: "center",
        },
        { text: "Acciones", value: "actions", sortable: false,
        align: "end",},
      ],
      searchTecnologias: '',
      tecnologias: [],
      tecnologiasDescripciones: [],
      editedIndex: -1,
      proyectoTecnologia: {
        Proyecto_Tecnologia_Proyecto: '',
        Proyecto_Tecnologia_Tecnologia: "",
        Proyecto_Tecnologia_Porcentaje: 0,
        Usuario_Creacion: 2,
        Usuario_Modificacion: 2,
        Tecnologia: {},
      },
      defaultItem: {
        Proyecto_Tecnologia_Proyecto: '',
        Proyecto_Tecnologia_Tecnologia: "",
        Proyecto_Tecnologia_Porcentaje: 0,
        Usuario_Creacion: 2,
        Usuario_Modificacion: 2,
        Tecnologia: {},
      },
      model: null,
      search: null,
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva' : 'Editar'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.loadTecnologias();
      },

      editItem (item) {
        this.editedIndex = this.$store.state.proyecto[0].Tecnologias.indexOf(item)
        this.proyectoTecnologia = Object.assign({}, item)
        this.dialog = true
        this.asignarDescripcion();
      },

      deleteItem (item) {
        const index = this.$store.state.proyecto[0].Tecnologias.indexOf(item)
        confirm('Está seguro que desea eliminar esta tecnologia?') && this.$store.state.proyecto[0].Tecnologias.splice(index, 1)
        &&
        axios.delete(ip+"/proyectos_tecnologias/"+item.Proyecto_Tecnologia_Proyecto+"/"+item.Proyecto_Tecnologia_Tecnologia)
        .then(response => {
          console.log(response);
        })
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.proyectoTecnologia = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) { //Determina si el elemento del dialog es un editado o un elemento nuevo
          this.proyectoTecnologia.Tecnologia = {Tecnologia_Descripcion: this.proyectoTecnologia.Proyecto_Tecnologia_Tecnologia}
          Object.assign(this.$store.state.proyecto[0].Tecnologias[this.editedIndex], this.proyectoTecnologia)
        } else {
          this.proyectoTecnologia.Tecnologia = {Tecnologia_Descripcion: this.proyectoTecnologia.Proyecto_Tecnologia_Tecnologia}
          this.proyectoTecnologia.Proyecto_Tecnologia_Proyecto = this.$store.state.proyecto[0].Proyecto_Key
          this.$store.state.proyecto[0].Tecnologias.push(this.proyectoTecnologia)
          }
          this.close()
      },

      loadProyecto(){
        this.proyecto = this.$store.state.proyecto[0]
        this.proyectoTecnologia.Proyecto_Tecnologia_Proyecto = this.proyecto.Proyecto_Key
        this.defaultItem.Proyecto_Tecnologia_Proyecto = this.proyecto.Proyecto_Key
      },

      loadTecnologias(){
        axios.get(ip+"/tecnologias/descripciones").then((response) => {
          this.tecnologias = response.data;
          this.tecnologiasDescripciones = response.data.map(
            (tecnologia) => tecnologia.Tecnologia_Descripcion
          );
        });
      },

      asignarDescripcion(){
        var descripcionTecnologia = this.tecnologias.filter(tecno => tecno.Tecnologia_Key == this.proyectoTecnologia.Proyecto_Tecnologia_Tecnologia)[0].Tecnologia_Descripcion;
        this.proyectoTecnologia.Proyecto_Tecnologia_Tecnologia = descripcionTecnologia
      },

      asignarKey(){
        var keyTecnologia = this.tecnologias.filter(tecno => tecno.Tecnologia_Descripcion == this.proyectoTecnologia.Proyecto_Tecnologia_Tecnologia)[0].Tecnologia_Key;
        this.proyectoTecnologia.Proyecto_Tecnologia_Tecnologia = keyTecnologia
      },

      permisoLecturaProyectoTecnologia(){
        return localStorage.Permisos.includes('P21')
      },
      permisoEscrituraProyectoTecnologia(){
        return localStorage.Permisos.includes('P22')
      },

       mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
        }}
}
</script>