<template>
    <v-app>
      <!-- Topbar -->
      <v-app-bar app>
        <v-app-bar-nav-icon @click="onMenuClick"></v-app-bar-nav-icon>
        <v-app-bar-title>Habit erstellen</v-app-bar-title>
        <v-btn id="theme-btn" color="primary" @click="handleClick('theme')"><v-icon size="24">mdi-theme-light-dark</v-icon></v-btn>
      </v-app-bar>
        
      <br>
      <hr><br>

      <!-- Hauptinhalt -->
      <v-main>
        <v-container class="text-center">
          <v-text-field 
            label="Name"
            v-model="enteredName"
          ></v-text-field>
          <v-textarea 
            label="Beschreibung (optional)"
            v-model="enteredDescription"
          ></v-textarea>

          <v-select
            v-model="selectedOccurrence"
            label="Häufigkeit"
            :items="['Täglich', 'Wöchentlich', 'Monatlichlich', 'Benutzerdefiniert']"
          ></v-select>

          <v-row
            v-if="selectedOccurrence === 'Benutzerdefiniert'"
            justify="center"
          ><v-checkbox
            v-for="day in days"
            :key="day"
            v-model="selectedDays"
            :label="day"
            :value="day"
            density="compact"
          ></v-checkbox>
          </v-row>

          <v-select
          v-model="selectedCategory"
            label="Kategorie"
            :items="['Gesundheit', 'Produktivität', 'Lernen', 'Achtsamkeit', 'Sonstiges']"
          ></v-select>
          
          <v-combobox
            v-model="selectedTags"
            :items="tags"
            label="Tags"
            chips
            multiple
            clearable
          ></v-combobox>
          <v-btn id="save-btn" color="primary" @click="handleClick('save')">Speichern</v-btn>
        </v-container>
      </v-main>

      <!-- Dialog -->
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">Eingegeben:</v-card-title>
          <v-container class="text-left">
            <p><b>Name: </b>{{ enteredName }}</p>
            <p><b>Beschreibung: </b>{{ enteredDescription }}</p>
            <p><b>Häufigkeit: </b>{{ selectedOccurrence }}</p>
            <p><b>Wochentage: </b>{{ selectedDays }}</p>
            <p><b>Kategorie: </b>{{ selectedCategory }}</p>
            <p><b>Tags: </b>{{ selectedTags }}</p>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Schließen</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>

</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Habit erstellen'
})

const theme = useTheme()

const enteredName = ref([])
const enteredDescription = ref([])
const selectedDays = ref([])
const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const selectedCategory = ref([])
const selectedOccurrence = ref([])
const selectedTags = ref([])

const dialog = ref(false)


const tags = [
  'Sport',
  'Laufen',
  'Lesen',
  'Meditation',
  'Programmieren',
  'Freunde treffen',
  'Wasser trinken',
  'Früh aufstehen',
  'Kein Social Media',
  'Aufräumen',
  'Dankbarkeit',
];

function handleClick(ButtonType) {
  if (ButtonType === "theme"){
    console.log("Themebutton wurde geklickt!");
    if (theme.global.name.value === "dark"){
      theme.global.name.value = "light"
    }
    else {
      theme.global.name.value = "dark"
    }
  }
  else if (ButtonType === "save"){
    console.log("Speicherbutton wurde geklickt!");
    dialog.value = "true"

  }
  
}
</script>

<style>
body {
  font-family: Roboto, sans-serif;
}
</style>