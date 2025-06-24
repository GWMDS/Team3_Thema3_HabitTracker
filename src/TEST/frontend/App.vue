<template>
  <v-app>
     <!-- Navigation Drawer -->
     <v-navigation-drawer v-model="drawer" v-if="mobile" app temporary>
      <v-list>
        <v-list-item>
          <v-btn block to="/" exact>Heute</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block to="/statistik" exact>Statistik</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block to="/profil" exact>Profil</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app density="compact">
      <v-app-bar-nav-icon v-if="mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Habit Tracker</v-app-bar-title>
      <v-btn v-if="!mobile" to="/" exact>Heute</v-btn>
      <v-btn v-if="!mobile" to="/statistik" exact>Statistik</v-btn>
      <v-btn v-if="!mobile" to="/profil" exact>Profil</v-btn>
      <v-btn id="theme-btn" color="primary" @click="changeTheme">
        <v-icon size="24">mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useDisplay } from 'vuetify'

const theme = useTheme()

const { mobile } = useDisplay() // mobile Ansicht?

const drawer = ref(false)

function changeTheme(){
  if (theme.global.name.value === "dark"){
      theme.global.name.value = "light"
  }
  else {
      theme.global.name.value = "dark"
  }
}
</script>

<script>
export default { name: 'App' };
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 1rem;
}
nav button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.v-btn--active {
  background-color: primary; 
}
</style>