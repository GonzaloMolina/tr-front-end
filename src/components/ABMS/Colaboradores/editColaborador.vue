<template>
  <v-content>
    <v-container fluid>
      <loader :loader="loader" style="position: fixed;"/>
                <v-alert
                :value="alert"
                style="position: absolute;  left: 0; right: 0; top: -12px; text-align: center;"
                top
                dense
                color="blue"
                type="success"
              > Se han guardado los cambios.
              </v-alert>
      <v-form ref="form">
      <v-row>
        <v-col cols="12" style="max-width:82rem; margin-top:-0.5rem">
          <v-title style="font-size:1.5rem; padding-left:1rem;">Datos Generales</v-title>
          <v-btn @click="guardar()" :disabled="!seguridadColaboradores()"  color="#2991C6" dark style="margin-left:53rem">Guardar</v-btn>
          <v-btn @click="back()" :disabled="!seguridadColaboradores()"   color="#ffa025" dark style="margin-left:1rem">Volver</v-btn>
          <v-card class="pa-2" outlined tile style="margin-top:1rem;min-height:30rem">
            <v-text-field
              outlined
              dense
              :disabled="!seguridadColaboradores()"
              v-model="colaborador.Colaborador_Codigo"
              label="Código"
              placeholder="Escribe..."
              style="display:inline-block; min-width:18rem;margin-left:1rem;margin-top:1rem"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              :disabled="!seguridadColaboradores()"
              v-model="colaborador.Colaborador_Descripcion"
              label="Nombre Completo"
              placeholder="Escribe..."
              style="display:inline-block; min-width:18rem; margin-left:1rem;margin-top:1rem"
            ></v-text-field>

            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Usuario"
              :items="usuarioCodigos"
              label="Usuario"
              placeholder="Selecciona..."
              style="max-width:20rem;min-width:20rem; display:inline-block;margin-left:1rem"
            >
            </v-select>
            
            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Responsable"
              :items="colaboradoresDescripciones"
              label="Responsable"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Region"
              :items="regionesDescripciones"
              label="Región"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Calendario"
              :items="calendariosDescripciones"
              label="Calendario"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Area"
              :items="colaboradoresAreasDescripciones"
              label="Área"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:20rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Puesto"
              :items="colaboradoresPuestosDescripciones"
              label="Puesto"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>

             <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Tipo"
              :items="tiposDescripciones"
              label="Tipo"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
            <v-select
              dense
              :disabled="!seguridadColaboradores()"
              outlined
              v-model="colaborador.Colaborador_Empresa"
              :items="empresasDescripciones"
              label="Empresa"
              placeholder="Selecciona..."
              style="max-width:18rem;min-width:18rem; display:inline-block;margin-left:1rem"
            ></v-select>
           
           <v-col cols="4" style = "max-width:82rem; margin-top:-0.5rem" >
              <div class="labelText3" style="">
             <h5 class ='labelT2'>Funciones disponibles</h5>
              <v-checkbox
                v-model="selected"
                label="VENDEDOR"
                value="Vendedor"
                ></v-checkbox>
                <v-checkbox
                v-model="selected"
                 label="RESPONSABLE"
                value="Responsable"
                ></v-checkbox>
              </div>
              <div class="labelText4">
                <h5 class ='labelT2'>Funciones asignadas</h5> 
                <p>{{ selected }}</p>
                 </div>
                 </v-col>
           
            
          </v-card>
        </v-col>
      </v-row>
      </v-form>

    <v-dialog v-model="dialogCancelar" width="500px" height="10rem">
            <v-card>
              <v-toolbar
                dark
                color="#2991C6"
                height="30rem"
              >
              <v-icon color="#ffa025" style="text-shadow: 1px 1px 2px black;position:absolute; left:38%">mdi-alert</v-icon><v-text style="font-weight: bold;position:absolute; left:45%; color:white; text-shadow: 1px 1px 2px black;">ALERTA</v-text>
              </v-toolbar>
              <v-card-title>Los cambios no guardados se borrarán. <br> ¿Deseas continuar?</v-card-title>
              <v-card-actions>
                <router-link to="/colaboradoresHierarchy">
                <v-btn 
                  color="white"
                  text
                  outlined
                  style="margin-left:16rem; background-color:#2991C6"
                  
                >
                  Aceptar
                </v-btn>
                </router-link>
                <v-btn
                  color="white"
                  outlined
                  text
                  style="margin-left:0.5rem; background-color:#ffa025"
                  @click="dialogCancelar = false"
                >
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
    </v-container>
  </v-content>
</template>

<style  scoped>
.container {
  margin-left: 1rem;
  min-width: 100rem;
}
.labelT{
  margin-left :30px;
  
  
}
.labelT2{
  margin-left:1rem;
}
.labelText{
  float: left;
}
.labelText3{
  float: left;
  margin-top: 1rem;
  margin-left:1rem;
}
.labelText4{
  float: left;
  margin-top: 1rem;
  margin-left:7rem;
}

.labelTextv2{
  float: left;
  margin-right: 25px;
}
</style>


<script>
import axios from "axios";
import loader from '../../Estado/loader'
const ip = require('../../../ip/ip')
export default {
  name: "editColaborador",
  props: {
    colaborador_usuario: ""
  },
  components: {loader
              },
  data: () => ({
    codigoViejo: '',
    //Reglas de agregado y editado
    //Elemento que se va a guardar con el UPDATE
    selected : [],
    colaborador: {
        Colaborador_Codigo: '',
        Colaborador_Descripcion: '',
        Colaborador_Usuario: '',
        Colaborador_Tipo: '',
        Colaborador_Responsable: '',
        Colaborador_Region: '',
        Colaborador_Puesto: '',
        Colaborador_Calendario: '',
        Colaborador_Area: '',
        Colaborador_Empresa: '',
        Colaborador_Funcion : 'no aplica',
        Colaborador_Hora: 0,
        Usuario_Creacion: 1,
        Usuario_Modificacion: 1,
    },
    usuarioCodigos : [],
    colaboradores:[],
    colaboradoresDescripciones: [],
    empresas: [],
    empresasDescripciones: [],
    regiones: [],
    regionesDescripciones: [],
    calendarios: [],
    calendariosDescripciones: [],
    colaboradoresAreas: [],
    colaboradoresAreasDescripciones: [],
    colaboradoresPuestos: [],
    colaboradoresPuestosDescripciones: [],
    responsables:[],
    responsablesDescripciones: [],
    usuarios: [],
    usuariosDescripciones: [],
    tipos: [],
    tiposDescripciones: [],
    funciones: [],
    funcionesDescripciones: [],
    dialogGuardar: false,
    alert: false,
    dialogCancelar: false,
    loader: true,
    }),
  
  //Ciclo de vida del componente
  created(){
      this.initialize();
  },
  mounted() {
      if(!localStorage.login){
        this.$router.push("/login");
      }
  },
//Definicion de metodos 
  methods: {
    async initialize(){
      this.loadUsuarios()
      this.loadEmpresas()
      this.loadRegions()
      this.loadCalendars()
      this.loadColaboradoresAreas()
      this.loadColaboradoresPuestos()
      this.loadColaboradoresTipos()
      this.loadColaboradores()
      this.loadColaboradoresFunciones()
      await this.wait(3000)
      this.asignarDescripciones();
      this.asignarFunciones()
      this.loader = false
    },
    
    async wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
        resolve();
        }, time);
      })
    },
    async loadColaboradores(){
        await axios.get(ip+"/colaboradores").then((response) => {
        this.colaboradores = response.data;
        this.colaboradoresDescripciones = response.data.map(
          (colaborador) => colaborador.Colaborador_Descripcion
        ).sort()
        })
     
        
    },
    async loadUsuarios(){
      await axios.get(ip+"/usuarios").then((response) => {
        this.usuarios = response.data;
        this.usuarioCodigos = response.data.map((usuario) => usuario.Usuario_Mail).sort()
        this.usuariosDescripciones = response.data.map(
          (usuario) => usuario.Usuario_Codigo
        ).sort();
      })
    },
    async loadEmpresas(){
      await axios.get(ip+"/empresas").then((response) => {
        this.empresas = response.data;
        this.empresasDescripciones = response.data.map(
          (empresa) => empresa.Empresa_Descripcion
        ).sort();
      })
    },
    async loadRegions() {
      await axios.get(ip+"/regiones/descripciones")
        .then((response) => {
          this.regiones = response.data;
          this.regionesDescripciones = response.data.map(
            (region) => region.Region_Descripcion
          ).sort();
        });
    },
    async loadCalendars() {
      await axios.get(ip+"/calendarios/descripciones")
        .then((response) => {
          this.calendarios = response.data;
          this.calendariosDescripciones = response.data.map((calendario) => calendario.Calendario_Descripcion);
        });
      },
      async loadColaboradoresAreas() {
        await axios.get(ip+"/colaboradores_areas/descripciones")
          .then((response) => {
            this.colaboradoresAreas = response.data;
            this.colaboradoresAreasDescripciones = response.data.map((area) => area.Colaborador_Area_Descripcion);
          });
      },
      async loadColaboradoresPuestos() {
      await axios.get(ip+"/colaboradores_puestos/descripciones")
        .then((response) => {
          this.colaboradoresPuestos = response.data;
          this.colaboradoresPuestosDescripciones = response.data.map((puesto) => puesto.Colaborador_Puesto_Descripcion);
        });
      },
      async loadColaboradoresTipos(){
      await axios.get(ip+"/tipos_colaboradores/descripciones")
        .then((response) => {
          this.tipos = response.data;
          this.tiposDescripciones = response.data.map((tipo) => tipo.Tipo_Colaborador_Descripcion);
        });
      },
      async loadColaboradoresFunciones(){
       await axios.get(ip+"/funciones/descripciones")
        .then((response) => {
          this.funciones = response.data;
          this.funcionesDescripciones = response.data.map((funcion) => funcion.name);
        });
      },

     async guardar() {
          this.asignarKeys()
         await this.guardarFunciones()
          await axios.patch(ip+"/colaboradores/"+this.colaborador.Colaborador_Usuario, this.colaborador)
          .then((response) => {
            this.alert = true
            setTimeout(() => {this.alert = false
             this.$router.push({path: "/colaboradoresHierarchy"})}, 2000)
          })
          .catch(err =>{
            alert('No se ha podido actualizar. El Cliente ya existe')
            this.asignarDescripciones()
            throw new Error('El colaborador ya existe')
          })
      },

      async deleteFunciones(){
        
        await axios.delete(ip+'/colaboradores_funciones/'+this.colaborador.Colaborador_Key).then((response) => {
           
        })
      },

      async guardarFunciones(){


      var pedido =
         {
          Colaborador_Funcion_Funcion_Key  : '',
          Colaborador_Funcion_Descripcion : '',
          Colaborador_Funcion_Colaborador_Key : '',
          Usuario_Creacion : 1 ,
          Usuario_Modificacion : 1,
          Visible : 'X'
          }
          if(this.selected.length > 0){
            this.deleteFunciones();
          }
          
          for ( var i  = 0 ; i < this.selected.length ; i++){
            if(this.selected[i] == 'Vendedor'){
              
              pedido.Colaborador_Funcion_Funcion_Key = 1 ;
              pedido.Colaborador_Funcion_Descripcion = this.colaborador.Colaborador_Codigo+' - VEND'; 
              pedido.Colaborador_Funcion_Colaborador_Key = this.colaborador.Colaborador_Key;
              await axios.post(ip+'/colaboradores_funciones/',pedido)
              .then((response) => console.log(response) )
          }
          else {
            
            pedido.Colaborador_Funcion_Funcion_Key = 2 ;
            pedido.Colaborador_Funcion_Descripcion = this.colaborador.Colaborador_Codigo+' - RESP'; 
            pedido.Colaborador_Funcion_Colaborador_Key = this.colaborador.Colaborador_Key; 
            await axios.post(ip+'/colaboradores_funciones/',pedido)
             .then((response) => console.log(response) )
          }

        }
        
       
      },
    
    cleanStore(){
      this.$store.replaceState({
        cliente: [],
        clienteTipo:0,
        proyecto: [],
        clienteFiscal: [],
        empresa: []})
    },
    seguridadColaboradores(){
       if(!localStorage.login){
          return false
        } else
        return localStorage.Permisos.includes('P41') || localStorage.Permisos.includes('P42') 
    },
    asignarKeys(){
      var regionKey = this.regiones.filter(region => region.Region_Descripcion == this.colaborador.Colaborador_Region)[0].Region_Key
      var areaKey = this.colaboradoresAreas.filter(area => area.Colaborador_Area_Descripcion == this.colaborador.Colaborador_Area)[0].Colaborador_Area_Key
      var puestoKey = this.colaboradoresPuestos.filter(puesto => puesto.Colaborador_Puesto_Descripcion == this.colaborador.Colaborador_Puesto)[0].Colaborador_Puesto_Key
      var empresaKey = this.empresas.filter(empresa => empresa.Empresa_Descripcion == this.colaborador.Colaborador_Empresa)[0].Empresa_Key;
      var calendarioKey = this.calendarios.filter(calendario => calendario.Calendario_Descripcion == this.colaborador.Colaborador_Calendario)[0].Calendario_Key;
      var tipoKey = this.tipos.filter(tipo => tipo.Tipo_Colaborador_Descripcion == this.colaborador.Colaborador_Tipo)[0].Tipo_Colaborador_Key;
      var responsableKey = this.colaboradores.filter(responsable => responsable.Colaborador_Descripcion == this.colaborador.Colaborador_Responsable)[0].Colaborador_Key;
      var usuarioKey = this.usuarios.filter(usuario => usuario.Usuario_Mail == this.colaborador.Colaborador_Usuario)[0].Usuario_Key
      this.colaborador.Colaborador_Region = regionKey;
      this.colaborador.Colaborador_Area = areaKey;
      this.colaborador.Colaborador_Empresa = empresaKey;
      this.colaborador.Colaborador_Puesto = puestoKey;
      this.colaborador.Colaborador_Calendario = calendarioKey
      this.colaborador.Colaborador_Tipo = tipoKey
      this.colaborador.Colaborador_Responsable = responsableKey
      this.colaborador.Colaborador_Usuario = usuarioKey
      
      
    },
    asignarDescripciones(){
      this.colaborador = this.colaboradores.filter(colaborador => colaborador.Colaborador_Key == this.$store.state.colaborador)[0]
      var regionDescripcion = this.regiones.filter(region => region.Region_Key == this.colaborador.Colaborador_Region)[0].Region_Descripcion;
      var colaboradorAreaDescripcion = this.colaboradoresAreas.filter(area => area.Colaborador_Area_Key == this.colaborador.Colaborador_Area)[0].Colaborador_Area_Descripcion;
      var colaboradorPuestoDescripcion = this.colaboradoresPuestos.filter(puesto => puesto.Colaborador_Puesto_Key == this.colaborador.Colaborador_Puesto)[0].Colaborador_Puesto_Descripcion;
      var empresaDescripcion = this.empresas.filter(empresa => empresa.Empresa_Key == this.colaborador.Colaborador_Empresa)[0].Empresa_Descripcion;
      var calendarioDescripcion = this.calendarios.filter(calendario => calendario.Calendario_Key == this.colaborador.Colaborador_Calendario)[0].Calendario_Descripcion;
      var tipoDescripcion = this.tipos.filter(tipo => tipo.Tipo_Colaborador_Key == this.colaborador.Colaborador_Tipo)[0].Tipo_Colaborador_Descripcion;
      var responsableDescripcion = this.colaboradores.filter(responsable => responsable.Colaborador_Key == this.colaborador.Colaborador_Responsable)[0].Colaborador_Descripcion;
      var usuarioDescripcion = this.usuarios.filter(usuario => usuario.Usuario_Key == this.colaborador.Colaborador_Usuario)[0].Usuario_Codigo
      this.colaborador.Colaborador_Region = regionDescripcion;
      this.colaborador.Colaborador_Area = colaboradorAreaDescripcion;
      this.colaborador.Colaborador_Empresa = empresaDescripcion;
      this.colaborador.Colaborador_Puesto = colaboradorPuestoDescripcion;
      this.colaborador.Colaborador_Calendario = calendarioDescripcion
      this.colaborador.Colaborador_Tipo = tipoDescripcion
      this.colaborador.Colaborador_Responsable = responsableDescripcion
      this.colaborador.Colaborador_Usuario = usuarioDescripcion
    },
    asignarFunciones(){
      var funciones = []
      if(this.colaborador.Funcion.length >= 1){
        for(var i = 0 ; i < this.colaborador.Funcion.length ; i++){
          funciones.push(this.funciones.filter(f => f.id == this.colaborador.Funcion[i].Colaborador_Funcion_Funcion_Key)[0])
        }
       funciones = funciones.map( f => f.name)
       this.selected = funciones
      }
    },
    back(){
      this.$router.push({path:'/colaboradoresHierarchy'})
    }
  
  },
};
</script>