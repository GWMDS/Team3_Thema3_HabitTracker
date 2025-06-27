<template>
  <v-app>
    <v-main>
      <v-container class="text-center" max-width="600px">
        <br>
        <h2>Habit bearbeiten</h2>
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
        >
          <v-checkbox
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

        <v-btn color="primary" @click="saveChanges">Änderungen speichern</v-btn>
        <v-btn text @click="cancelEdit">Abbrechen</v-btn>
      </v-container>
    </v-main>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Änderungen gespeichert</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog">Schließen</v-btn>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const habitId = route.params.id

const enteredName = ref('')
const enteredDescription = ref('')
const selectedDays = ref([])
const selectedCategory = ref('')
const selectedOccurrence = ref('')
const selectedTags = ref([])

const errorString = ref('')

const dialog = ref(false)
const errordialog = ref(false)

const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const tags = [
  'Sport', 'Laufen', 'Lesen', 'Meditation', 'Programmieren',
  'Freunde treffen', 'Wasser trinken', 'Früh aufstehen',
  'Kein Social Media', 'Aufräumen', 'Dankbarkeit',
]

// Lade Habit-Daten bei Initialisierung
onMounted(() => {
  fetch(`http://localhost:3000/api/habits/${habitId}`)
    .then(res => {
      if (!res.ok) throw new Error('Habit nicht gefunden')
      return res.json()
    })
    .then(habit => {
      enteredName.value = habit.name
      enteredDescription.value = habit.description
      selectedCategory.value = habit.category
      selectedOccurrence.value = habit.occurence
      selectedDays.value = habit.occurenceopt || []
      selectedTags.value = habit.tags || []
    })
    .catch(err => {
      console.error(err)
      alert('Fehler beim Laden des Habits')
      router.push('/') // zurück zur Startseite
    })
})

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

function saveChanges() {
  checkInput()

  if (errorString.value !== ""){ // es gibt Fehler
    errordialog.value = true
  }
  else{
    // Hole aktuelle Liste aller Habits, update den einen Eintrag und speichere alles neu (dein Backend-Setup)
    fetch('http://localhost:3000/api/habits')
      .then(res => res.json())
      .then(data => {
        const updatedHabits = data.map(h => {
          if (h.id === Number(habitId)) {
            return {
              ...h,
              name: enteredName.value,
              description: enteredDescription.value,
              category: selectedCategory.value,
              occurence: selectedOccurrence.value,
              occurenceopt: selectedDays.value,
              tags: selectedTags.value,
            }
          }
          return h
        })

        return fetch('http://localhost:3000/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedHabits),
        })
      })
      .then(() => {
        dialog.value = true
      })
      .catch(err => {
        console.error(err)
        alert('Fehler beim Speichern')
      })
  }
}

function closeDialog() {
  dialog.value = false
  router.push('/') // nach dem Speichern zurück zur Startseite (oder andere Route)
}

function cancelEdit() {
  router.push('/') // Abbrechen und zurück zur Startseite
}
</script>
