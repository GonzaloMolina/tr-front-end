<template>
<v-content>
    <v-container fluid style="overflow-y:hidden;height:38rem">
                <v-card class="card">
                <v-title class="titulo" style="position:relative;top:1.5rem"> BIENVENIDO </v-title>
            
               

                    <v-expansion-panels
                        v-model="panel"
                        multiple
                        style="top:4rem; min-width: 100%;"
                    >
                    <v-expansion-panel>
                    <v-expansion-panel-header style="font-size:20px;text-align: center;">INICIAR SESION</v-expansion-panel-header>
                        <v-expansion-panel-content>
                           <v-text class="labels"> Usuario:
                            </v-text>
                            <v-text-field
                                class="input"
                                outlined
                                dense
                                v-model="user.Usuario_Codigo"
                                required
                            ></v-text-field>
                            <v-text class="labels"> Password:
                            </v-text>
                            <v-text-field
                                class="input"
                                outlined
                                dense
                                v-model="user.Password"
                                type="password"
                                required
                            ></v-text-field> 
                             <v-btn @click="getUser(user)" style="position:relative; left:25%"> INICIAR SESION </v-btn>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
 
  
             </v-card>  
    </v-container>     
</v-content>
</template>


<script>
import axios from "axios";
import store from "@/store";
import { PublicClientApplication } from '@azure/msal-browser';
const ip = require('../../ip/ip')
export default {
    data: () => ({
            loginNormal: false,
            user:
            { 
                Usuario_Codigo: '',
                Password : ''
            },
            userRecover:{
            },
            colaboradorRecover:{},
            account: undefined,
            signin: 'https://microsoft.com',
            containers: [],
            
        }),
        methods:{
            getUser(user){
                axios.post(ip+"/autenticacion/autenticar/", user).then((response) => {
                    this.userRecover = response.data.user;
                    if(this.userRecover.Usuario_Habilitado == 'X'){
                        this.getPermisos(user)
                        localStorage.setItem('usuario_id', response.data.user.Usuario_Key)
                        localStorage.setItem('token', response.data.token)
                        localStorage.setItem('login',true)
                        localStorage.setItem('usuario', JSON.stringify(this.userRecover));
                        this.getColaborador();
                        this.$notify({
                            title: 'Bienvenido '+this.userRecover.Usuario_Nombre_Completo,
                            position: 'center',
                            width: '100%',
                        })
                        this.$store.state.loggin = true
                        this.$router.push({path:"/Grid"},{params: this.userRecover})
                    } else alert('No está habilitado para acceder')  
                    
                    })
                    .catch(e => {
                        alert('Usuario no encontrado')
                    });
            },
            
            async getColaborador(){
                await axios.get(ip + "/colaboradores/"+this.userRecover.Usuario_Key).then((response) => {
                    this.colaboradorRecover = response.data;
                    localStorage.setItem('nombre_colaborador', this.colaboradorRecover.Colaborador_Descripcion);
                    localStorage.setItem('colaborador', this.colaboradorRecover)
                    window.dispatchEvent(new CustomEvent('login', {
                        detail: {
                            storage: localStorage.nombre_colaborador
                        }
                    }))
                })
            },
            obtenerPerfiles(data){
                const perfil = [];
                for(var i = 0; i < data.Rol.PerfilRol.length; i++){
                    // console.log(data.Rol.PerfilRol[i])
                    perfil.push(data.Rol.PerfilRol[i])
                };
                return this.obtenerPermisos(perfil)
            },
            obtenerPermisos(lista){
                const permisos = [];
                for(var i = 0; i < lista.length; i++){
                        // var a = a + lista[i].Perfil.PerfilPermiso.length
                        // console.log(a);
                    permisos.push(lista[i].Perfil.PerfilPermiso)
                };
                // console.log(permisos);
                return this.obtenerCodigoPermiso(permisos)
            },
            obtenerCodigoPermiso(permisos){
                const permisosCodigo = [];
                permisos.map(permiso => {
                    for(var i = 0; i < permiso.length; i++){
                        permisosCodigo.push(permiso[i].Permisos.Permiso_Codigo);
                    }
                })
                localStorage.setItem('Permisos', JSON.stringify(permisosCodigo))
                return permisosCodigo
            },
            // Rol -> PerfilRol[] -> Perfil -> PerfilPermiso[] -> Permisos ->  Permiso_Codigo
            async getPermisos(user){
                await axios.get(ip+ "/seguridad/" + user.Usuario_Codigo).then((response)=>{
                    this.obtenerPerfiles(response.data)
                })
            }, 
            async SignIn() {
                await this.$msalInstance.loginPopup({}).then(() => {
                    const myAccounts = this.$msalInstance.getAllAccounts();
                    this.account = myAccounts[0];
                    var user =  { 
                                    Usuario_Codigo: this.account.username,
                                    Password : ''
                                }
                    this.getUser(user)
                    })
                    .catch(error => {
                        console.error(`error during authentication: ${error}`);
                    });
                },
            },
        created(){
            this.$msalInstance = new PublicClientApplication(this.$store.state.msalConfig);
        },
        beforeCreate() {
            localStorage.Permisos = ['P1']
        },
        mounted() {
            const accounts = this.$msalInstance.getAllAccounts();
            if (accounts.length == 0) {
                return;
            }
            this.account = accounts[0];
            this.$emitter.emit('login', this.account);
        },
}
</script>


<style scoped> 
.card {
    max-width: 30%;
    height:12rem;
    left: 35%;
    position:relative;
    top:3rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow:0px 0px 20px #236192;
    text-align: left;
    border-style: none;
    border-radius: 6px;
}
.buttonOffice{
    font-family:'SEGOE UI';
    text-transform: none;
    font-weight: 600;
    background-color: #FFA025 !important;
    color:black;
    position:relative; 
    top:3rem; 
    max-width:12rem;
    left:22%
}
.labels{
    font-size: 20px;
}
.titulo{
    margin-top: 1%;
    font-size: 28px;
    font-family: 'Roboto';
    text-align: center;
    color: #236192;
}
img {
    margin-top:0%;
    margin-bottom: 2%;
    margin-left: 28%;
}
.input{
   width: 23rem;
}
.inicioSesion{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    width: 30%;
    height: 12rem;
    padding: 2rem;
    position:relative;
    left: 50%;
    border-style: none;
    border-radius: 6px;
    box-shadow:0px 0px 20px #236192;
  }
.vue-notification {
margin-top: 200px;
}
</style>
