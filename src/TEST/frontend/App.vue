<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="onMenuClick"></v-app-bar-nav-icon>
      <v-app-bar-title>Habit Tracker</v-app-bar-title>
      <v-btn @click="$router.push('/')">Heute</v-btn>
      <v-btn @click="$router.push('/statistik')">Statistik</v-btn>
      <v-btn @click="$router.push('/Profil')">Profil</v-btn>
      <v-btn id="theme-btn" color="primary" @click="changeTheme">
        <v-icon size="24">mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  
    <!--
    <header>
      <h1>Habit Tracker</h1>
      <nav>
        <button @click="$router.push('/')">Heute</button>
        <button @click="$router.push('/statistik')">Statistik</button>
        <button @click="$router.push('/Profil')">Profil</button>
      </nav>
    </header>
    -->
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

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
</style>
