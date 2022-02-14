<template>
    <v-content class="p-0 m-0">
        <v-container class="contenedorPrinc px-0">
            <Nav></Nav>
        </v-container>
            <v-container class="contenedor px-0">
            <Grid></Grid>
            </v-container>
    </v-content>
</template>

<script>
import Nav from '../Nav/Nav'
import Grid from '../Grilla/Grid'
export default {
    components: {Nav,Grid},
    data: () => ({ 
            
    })
}
</script>

<style scoped>
.contenedorPrinc{
  min-width: 100%;
  max-width: 100%;
}

.contenedor {
  min-width: 100%;
}
</style>