import Vue from 'vue'
import VueRouter from 'vue-router'
import clientesTable from '../components/ABMS/Clientes/clientesTable.vue'
import createProyecto from '../components/ABMS/Proyectos/createProyecto.vue'
import editProyecto from '../components/ABMS/Proyectos/editProyecto.vue'
import createCliente from '../components/ABMS/Clientes/createCliente.vue'
import editCliente from '../components/ABMS/Clientes/editClient.vue'
import tiemposCalendar from '../components/ABMS/Tiempos/tiemposCalendar.vue'
import periodos from '../components/ABMS/Tiempos/periodos.vue'
import createClienteFiscal from '../components/ABMS/ClientesFiscales/createClienteFiscal.vue'
import editClienteFiscal from '../components/ABMS/ClientesFiscales/editClienteFiscal.vue'
import empresasTable from '../components/ABMS/Empresas/empresasTable.vue'
import createEmpresa from '../components/ABMS/Empresas/createEmpresa.vue'
import editEmpresa from '../components/ABMS/Empresas/editEmpresa.vue'
import VistaUsuario from '../components/Usuario/VistaUsuario.vue'
import usuariosTable from '../components/ABMS/Usuarios/usuariosTable.vue'
import colaboradoresHierarchy from '../components/ABMS/Colaboradores/colaboradoresHierarchy.vue'
import editColaborador from '../components/ABMS/Colaboradores/editColaborador.vue'
import editUsuario from '../components/ABMS/Usuarios/editUsuario.vue'
import tecnologiasTable from '../components/ABMS/Tecnologias/tecnologiasTable.vue'
import editTecnologia from '../components/ABMS/Tecnologias/editTecnologia.vue'
import createTecnologia from '../components/ABMS/Tecnologias/createTecnologia.vue'

Vue.use(VueRouter)

  const routes = [
    
    //Ruta por defecto de la App.

 
  {
    path: '/',
    redirect: {
      name: 'Login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login/login.vue'),
  },
  {
    path: '/Grid',
    name: 'Grid',
    component: () => import('../components/Grilla/Grid.vue'),
    props: true,
  },
  {
    path: '/clientesTable',
    name: 'Clientes',
    component: clientesTable,
  },
  {
    path: '/createProyecto',
    name: 'Crear Proyecto',
    component: createProyecto,
    props: true
  },
  {
    path: '/createCliente',
    name: 'Crear Cliente',
    component: createCliente,
    props: true
  },
  {
    path: '/editCliente',
    name: 'Editar Cliente',
    component: editCliente,
    props: true
  },
  {
    path: '/editProyecto',
    name: 'Editar Proyecto',
    component: editProyecto,
    props: true
  },
  {
    path: '/createClienteFiscal',
    name: 'Crear Cliente Fiscal',
    component: createClienteFiscal,
    props: true
  },
  {
    path: '/editClienteFiscal',
    name: 'Editar Cliente Fiscal',
    component: editClienteFiscal,
    props:true,
  },
  {
    path: '/tiemposCalendar',
    name: 'Tiempos Calendar',
    component: tiemposCalendar
  },
  {
    path: '/Tareas',
    name: 'Tareas',
    component: () => import('../components/Grilla/Tareas.vue')  
  },
  {
    path: '/createEmpresa',
    name: 'Crear Empresa',
    component: createEmpresa
  },
  {
    path: '/editEmpresa',
    name: 'Editar Empresa',
    component: editEmpresa
  },
  {
    path: '/empresasTable',
    name: 'Empresas',
    component: empresasTable
  },
  {
    path: '/Usuario',
    name: 'Usuario',
    component: VistaUsuario
  },
  {
    path: '/periodos',
    name: 'Periodos',
    component: periodos
  },
  {
    path: '/usuariosTable',
    name: 'Usuarios',
    component: usuariosTable,
  },
  {
    path: '/colaboradoresHierarchy',
    name: 'Colaboradores',
    component: colaboradoresHierarchy,
  },
  {
    path: '/editColaborador',
    name: 'editColaborador',
    component: editColaborador,
    props: true
  },
  {
    path: '/editUsuario',
    name: 'editUsuario',
    component: editUsuario,
    props: true
  },
  {
    path: '/tecnologias',
    name: 'tecnologiasTable',
    component: tecnologiasTable,
    props: true
  },
  {
    path: '/editTecnologia',
    name: 'editTecnologia',
    component: editTecnologia,
    props: true
  },
  {
    path: '/createTecnologia',
    name: 'createTecnologia',
    component: createTecnologia,
    props: true
  }



]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router