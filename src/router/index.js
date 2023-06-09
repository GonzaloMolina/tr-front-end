import Vue from 'vue'
import VueRouter from 'vue-router'
import help from '../components/Help/Help.vue'
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
import paisesTable from '../components/ABMS/Paises/paisesTable.vue'
import cecosTable from '../components/ABMS/Ceco/cecosTable.vue'
import tecnologiasTable from '../components/ABMS/Tecnologias/tecnologiasTable.vue'
import editTecnologia from '../components/ABMS/Tecnologias/editTecnologia.vue'
import createTecnologia from '../components/ABMS/Tecnologias/createTecnologia.vue'
import proyectostiposTable from '../components/ABMS/Proyectos-Tipos/ProyectosTiposTable.vue'
import editProyectosTipo from '../components/ABMS/Proyectos-Tipos/editProyectosTipo.vue'
import createProyectosTipo from '../components/ABMS/Proyectos-Tipos/createProyectosTipo.vue'
import unidadNegocioTable from '../components/ABMS/UnidadesNegocio/unidadNegocioTable.vue'
import areasTable from '../components/ABMS/Colaboradores-Areas/areasTable.vue'
import alcancesTable from '../components/ABMS/Proyectos-Alcances/alcancesTable.vue'
import monedasTable from '../components/ABMS/Monedas/monedasTable.vue'
import regionesTable from '../components/ABMS/Regiones/regionesTable.vue'
import editRegion from '../components/ABMS/Regiones/editRegion.vue'
import createRegion from '../components/ABMS/Regiones/createRegion.vue'
import industriasTable from '../components/ABMS/Industrias/industriasTable.vue'
import puestosTable from '../components/ABMS/Colaboradores-Puestos/puestosTable.vue'
import editPuesto from '../components/ABMS/Colaboradores-Puestos/editPuesto.vue'
import createPuesto from '../components/ABMS/Colaboradores-Puestos/createPuesto.vue'
import categoriasTable from '../components/ABMS/Colaboradores-Categorias/categoriasTable.vue'
import tiposcolaboradoresTable from '../components/ABMS/Colaboradores-Tipos/tiposColaboradoresTable.vue'
import funcionesTable from '../components/ABMS/Funciones/funcionesTable.vue'
import tiposEmpresasTable from '../components/ABMS/Empresas-Tipos/empresasTiposTable.vue'
import createUsuario from '../components/ABMS/Usuarios/createUsuario.vue'
import createColaborador from '../components/ABMS/Colaboradores/createColaborador.vue'

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
    path: '/paises',
    name: 'paisesTable',
    component: paisesTable,
    props: true
  },
 {
    path: '/cecos',
    name: 'cecosTable',
    component: cecosTable,
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
  },
  {

    path: '/proyectostipos',
    name: 'proyectostipos',
    component: proyectostiposTable,
    props: true
  },
  {
    path: '/editProyectosTipo',
    name: 'editProyectosTipo',
    component: editProyectosTipo,
    props: true
  },
  {
    path: '/createProyectosTipo',
    name: 'createProyectosTipo',
    component: createProyectosTipo,
    props: true
  },
  {
    path: '/unidadesnegocio',
    name: 'unidadesNegocio',
    component: unidadNegocioTable,
    props: true
  },
  {
    path: '/areas',
    name: 'areas',
    component: areasTable,
    props: true
  },
  {
    path: '/alcances',
    name: 'alcances',
    component: alcancesTable,
    props: true
  },
  {
    path: '/monedas',
    name: 'monedas',
    component: monedasTable,
    props: true
  }, 
  {
    path: '/regiones',
    name: 'regiones',
    component: regionesTable,
    props: true
  }, 
  {
    path: '/editRegion',
    name: 'editRegion',
    component: editRegion,
    props: true
  }, 
  {
    path: '/createRegion',
    name: 'createRegion',
    component: createRegion,
    props: true
  }, 
  {
    path: '/industrias',
    name: 'industrias',
    component: industriasTable,
    props: true
  }, 
  {
    path: '/puestos',
    name: 'puestos',
    component: puestosTable,
    props: true
  }, 
  {
    path: '/editPuesto',
    name: 'editPuesto',
    component: editPuesto,
    props: true
  }, 
  {
    path: '/createPuesto',
    name: 'createPuesto',
    component: createPuesto,
    props: true
  }, 
  {
    path: '/categorias',
    name: 'categorias',
    component: categoriasTable,
    props: true
  }, 
  {
    path: '/tiposcolaboradores',
    name: 'tiposcolaboradores',
    component: tiposcolaboradoresTable,
    props: true
  }, 
  {
    path: '/funciones',
    name: 'funciones',
    component: funcionesTable,
    props: true
  }, 
  {
    path: '/help',
    name: 'help',
    component: help,
    props: true
  }, 
  {
    path: '/empresasTipos',
    name: 'empresasTipos',
    component: tiposEmpresasTable,
    props: true
  }, 
  {
    path: '/createUsuario',
    name: 'createUsuarios',
    component: createUsuario,
    props: true
  }, 
  {
    path: '/createColaborador',
    name: 'createColaborador',
    component: createColaborador,
    props: true
  }, 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router