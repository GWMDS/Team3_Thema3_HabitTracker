<template>
  <v-app>      
    <!-- Hauptinhalt -->
    <v-main>
      <br>
      <v-container class="text-center" max-width="600px">
        <h2>Habit erstellen</h2>
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
        <v-btn id="save-btn" color="primary" @click="saveHabit">Erstellen</v-btn>
        <v-btn text @click="cancelCreate">Abbrechen</v-btn>
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

    <!-- Fehlerdialog -->
    <v-dialog v-model="errordialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Ungültige Eingabe!</v-card-title>
        <v-container class="text-left">
          <p style="white-space: pre-line;">{{ errorString }}</p>
          
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="errordialog = false">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form-Daten
const enteredName = ref('')
const enteredDescription = ref('')
const selectedDays = ref([])
const selectedCategory = ref('')
const selectedOccurrence = ref('')
const selectedTags = ref([])

const errorString = ref('')

// UI-Zustand
const dialog = ref(false)
const errordialog = ref(false)

// Optionen
const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const tags = [
  'Sport', 'Laufen', 'Lesen', 'Meditation', 'Programmieren',
  'Freunde treffen', 'Wasser trinken', 'Früh aufstehen',
  'Kein Social Media', 'Aufräumen', 'Dankbarkeit',
]

// Methoden
function cancelCreate() {
  router.push("/");
}

function checkInput() {
  errorString.value = ""

  console.log(enteredName.value, selectedOccurrence.value, selectedCategory.value, selectedDays.value.target)
  if (enteredName.value === "" || selectedOccurrence.value === "" || selectedCategory.value === ""){
    errorString.value = errorString.value + "Name, Häufigkeit und Kategorie muss angegeben sein!\n"
  }

  if (selectedOccurrence.value === "Benutzerdefiniert" && selectedDays.value.length == 0){
     errorString.value = errorString.value + "Bei benutzerdefinierter Häufigkeit muss mind. ein Wochentag ausgewählt sein!\n"
  }
}

function saveHabit() {
  checkInput();

  if (errorString.value !== ""){ // es gibt Fehler
    errordialog.value = true
  }
  else{
    fetch('http://192.168.0.97:3000/api/habits')
    .then(res => res.json())
    .then(data => {
      const newId = data.length > 0 ? Math.max(...data.map(h => h.id)) + 1 : 1
      const newHabit = {
        id: newId,
        name: enteredName.value,
        description: enteredDescription.value,
        category: selectedCategory.value,
        done: false,
        completions: 0,
        streak: 0,
        occurence: selectedOccurrence.value,
        occurenceopt: selectedDays.value,
        tags: selectedTags.value

      }
      const updated = [...data, newHabit]
      fetch('http://192.168.0.97:3000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).then(() => router.push('/'))
    })
  }
}
</script>