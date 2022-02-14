<template>
<v-content>
  <v-container class="screen">
    <loader style="position: fixed;"/>
  <v-row class="fill-height" >
    <v-col>
      <v-sheet height="64" width="1290">
        <v-toolbar
          flat
        >
          <v-select
              v-model="calendariosSeleccionados"
              :items="calendarDescriptions"
              label="Calendario"
              placeholder="Selecciona..."
              style="margin-bottom:4px; margin-top:2rem; max-width:14rem; height:4rem"
              outlined
              :small-chips="true"
              multiple
              dense
              @change="ajustarCalendario"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0">
                  <span>{{ item }}</span>
                </v-chip>
                <span
                  v-if="index === 1"
                  class="grey--text caption"
                >
                  (+{{ calendariosSeleccionados.length - 1 }} others)
                </span>
              </template>
            </v-select>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            style="margin-left:1rem"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title style="margin-left: 16rem">
            {{title}}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <router-link style="position:relative;right:14.5%" to="/periodos">
          <v-btn v-b-tooltip.hover  title="Activar o desactivar períodos"  dark rounded color="#2991c6"> 
            <v-icon dark >mdi-lock-open</v-icon> 
            <v-icon dark >mdi-lock</v-icon> 
          </v-btn>
          </router-link>


          <v-menu
            bottom
            right
            
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
                style="position:absolute; right:4rem"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dia</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>


          <v-btn
            dark 
            v-if="permisoActualizarCalendario()"
            fab 
            small 
            color="#2991c6"
            @click="nuevoEvento"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="450" width="1290">
        <v-calendar
          ref="calendar"
          v-model="focus"
          locale="es"
          color="primary"
          event-more-text="Más eventos"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:more="viewDay"
          @click:date="viewDay"
          @mouseenter:event="showEvent"
          @mouseout:event="clean"
          @change="updateRange"
        ></v-calendar>

          <!-- DIALOGO PARA AGREGAR EVENTO -->

          <v-dialog persistent v-model="dialog" width="350">
            <v-card>
              <v-container>
                <v-form @submit.prevent="addEvent">
                  <v-select :items="typeEvents" placeholder="Selecciona..." v-model="selectedEvent.type" label="Tipo">
                  </v-select>
                  <v-text-field width="200" type="text" label="Descripción" placeholder="Escribe.." v-model="selectedEvent.name">
                  </v-text-field>
                  <v-select 
                  v-model="selectedEvent.calendario"
                  :items="calendarDescriptions"
                  label="Calendario"
                  placeholder="Selecciona..."
                  >
                  </v-select>
                  <v-text-field style="width:9rem" type="date" label="Feriado" v-model="selectedEvent.feriado">
                  </v-text-field>
                  <v-btn style="margin-left:3rem; display:inline-block" type="submit" color="#2991C6" dark
                  @click.stop="dialog = false"> CONFIRMAR
                  </v-btn>
                  <v-btn
                    color="#ffa025"
                    dark
                    style="margin-left:1rem;display:inline-block"
                    @click="clean()"
                  >
                    Cancelar
                  </v-btn>
                </v-form>
              </v-container>
            </v-card>
          </v-dialog>

          <!-- DIALOGO PARA AGREGAR EVENTO -->

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          min-width="200px"
          max-height="35px"
          offset-x
        >
            <v-toolbar
              :color="selectedEvent.color"
              dark
              max-height="35px"
            >
              <v-toolbar-title style="position:absolute;bottom:32px" v-html="selectedEvent.calendario"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn @click="dialog = true
                             isEditEvent = true" icon small
                             style="position:absolute;right:30px;bottom:32px">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="deleteEvent(selectedEvent)" icon small
              style="position:absolute;right:10px;bottom:32px">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>

            <v-snackbar
            :value="alert"
            color="blue"
            elevation="9"
            type="success"
            top
            centered
          > Actualizado correctamente.
          </v-snackbar>


  </v-container>
  </v-content>
</template>

<style scoped>
.screen {
  margin-left: 1rem;
  min-width: 100rem;
}
</style>

<script>
import axios from "axios";
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
  export default {
    components: {loader},
    data: () => ({
      title: '',
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      isEditEvent: false,
      indexItem: 0,
      dateToSave:0,
      events: [],
      events2: [],
      eventsFromApi: [],
      calendarDescriptions: [],
      calendars: [],
      typeEvents : ['Feriado'],
      name: '',
      dialog: false,
      monthName:'',
      calendarioSeleccionado: '',
      calendariosSeleccionados:[],
      alert: false,
    }),
    created(){
      this.getEvents()
      this.loadCalendars();
      //this.getNotifications()
    },

    mounted () {
      this.$refs.calendar.checkChange()
       
      if(!localStorage.login){
        this.$router.push("/login");
      }
        
    },
      
    methods: {

      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },

      //Metodos que brinda la interfaz provista por vuetify
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          this.indexItem = this.events.indexOf(event)
          this.dateToSave = this.convertDateToInt(event.start)
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange({ start, end }) {
        this.start = start;
        this.end = end;

        let yr = this.start.year;
        let mn = this.start.month;

        const mNames = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];

        this.title = mNames[mn-1] + " - " + yr;
      },


      //Pedido a la api de feriados
      async getEvents(){
        await axios.get(ip+"/feriados").then(response =>{
          this.eventsFromApi = response.data
        })
        for(var i=0 ; i<this.eventsFromApi.length ; i++){
          this.events.push({name: this.eventsFromApi[i].Feriado_Descripcion , type: 'Feriado' , calendario: this.eventsFromApi[i].Calendario.Calendario_Descripcion, start:this.eventsFromApi[i].Feriado_Fecha, feriado:this.eventsFromApi[i].Feriado_Fecha, end: this.eventsFromApi[i].Feriado_Fecha, color:"blue", key: this.eventsFromApi[i].Feriado_Key})
        }
        this.events2 = this.events
      },

      //Pedido a la api de notificaciones
      async getNotifications(){
        await axios.get(ip+"/tiempos")
      },

      //Pedido de calendarios
      loadCalendars() {
      axios.get(ip+"/calendarios/descripciones")
        .then((response) => {
          this.calendars = response.data;
          this.calendarDescriptions = response.data.map((calendario) => calendario.Calendario_Descripcion);
        });
      },

      //Agrupa feriados de la region seleccionada
      async eventsFromCalendar() { 
        var calendarKey = this.assignKey();
        this.events = []
        await axios.get(ip+"/feriados/"+calendarKey).then(response => {
          this.eventsFromApi = response.data
        })
        for(var i=0 ; i<this.eventsFromApi.length ; i++){
          this.events.push({name: this.eventsFromApi[i].Feriado_Descripcion , type: 'Feriado' , calendario: this.eventsFromApi[i].Calendario.Calendario_Descripcion, start:this.eventsFromApi[i].Feriado_Fecha, end: this.eventsFromApi[i].Feriado_Fecha, color:"blue"})
        }
      },


      //Agregado de evento o feriado
      async addEvent(){
        if(this.selectedEvent.type == 'Feriado'){
          var date = new Date(this.selectedEvent.feriado)
          console.log(date)
          var saveFeriado = this.saveFeriado(date)
          if(this.isEditEvent){
            this.events.splice(this.indexItem,1,saveFeriado)
            await axios.patch(ip+'/feriados/'+this.selectedEvent.key,saveFeriado).then(response => {
              this.alert = true
              setTimeout(() => {this.alert = false
                                this.events = []
                                this.getEvents()}, 2000)
            })
          } else {
            await axios.post(ip+'/feriados',saveFeriado).then(response =>{
              this.alert = true
              this.selectedEvent = {}
              setTimeout(() => {this.alert = false
                                this.events = []
                                this.getEvents()}, 2000)
            })
          }

        } else {

        }
      },

      deleteEvent(event){
        axios.delete(ip+'/feriados/'+event.key).then(response => {
        this.alert = true
        setTimeout(() => {this.alert = false}, 2000)
        })
        this.events.splice(this.indexItem,1)
        this.selectedOpen = false
      },

      //Convierte una fecha date a INT
      convertDateToInt(date){
        var year = date.substring(0,4)
        var month = date.substring(5,7)
        var day = date.substring(8,10)
        var dateToSave = year+month+day
        return Number.parseInt(dateToSave)
      },

      ajustarCalendario(){
        if(this.calendariosSeleccionados.length == 0){
          this.events = this.events2
        }else{
          this.events = this.events2
          this.events = this.events.filter(event => this.calendariosSeleccionados.includes(event.calendario))
        }
      },


      //Cambia la descripcion del feriado a int para el guardado en la base
      assignKey(){
        var keyCalendar =  this.calendars.filter((calendar) => calendar.Calendario_Descripcion == this.calendarioSeleccionado)[0].Calendario_Key;
        return keyCalendar
      },

      permisoActualizarCalendario(){
       return localStorage.Permisos.includes("P30")
         
      },

      permisoActualizarPeriodos(){
        return localStorage.Permisos.includes("P26")
      },


      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },    
      
      updateCalendar(){
        this.dialog = false
        this.selectedOpen = false
        this.isEditEvent = false
      },

      clean(){
        this.selectedOpen = false
        this.isEditEvent = false
        this.dialog = false
        this.indexItem = 0
      },

      nuevoEvento(){
        this.selectedEvent = {}
        this.dialog = true
      },


      saveFeriado(date){
        return {
            Feriado_Calendario: this.calendars.filter((calendario) => calendario.Calendario_Descripcion == this.selectedEvent.calendario)[0].Calendario_Key,
            Feriado_Tiempo: this.convertDateToInt(this.selectedEvent.feriado),
            Feriado_Fecha: date,
            Feriado_Descripcion: this.selectedEvent.name,
            Feriado_Laborable: '',
            Usuario_Creacion: localStorage.usuario_id,
            Usuario_Modificacion: localStorage.usuario_id
          }
      },

    },
  }
</script>