<template>
  <v-main>
    <v-container>
      <!-- Übersicht: Zeigt aktuelle Auswahl, Anzahl Habits, abgeschlossene heute und Durchschnittsrate -->
      <v-row class="mb-6" dense>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Gewählte Ansicht:</div>
            <strong>{{ selectedDate }}</strong>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Gewohnheiten heute:</div>
            <strong>{{ habits.length }}</strong>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Abgeschlossen:</div>
            <strong>{{ completedToday }}</strong>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Ø Abschlussrate:</div>
            <strong>{{ averageRate }}%</strong>
          </v-card>
        </v-col>
      </v-row>

      <!-- Buttons für die letzten 7 Tage (inkl. heute) -->
      <v-row class="mb-4" justify="center">
        <v-btn
          v-for="(day, index) in lastFiveDays"
          :key="day.date"
          @click="selectDate(day.date)"
          :color="day.date === selectedDate ? 'primary' : 'grey lighten-2'"
          class="ma-1"
        >
          <div class="text-center">
            <div class="font-weight-bold">{{ day.weekday }}</div>
            <div>{{ day.formattedDate }}</div>
          </div>
        </v-btn>
      </v-row>

      <!-- Filter: Suche + Kategorie -->
      <v-row class="mb-4" align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchTerm"
            label="Suche nach Name oder Tags"
            clearable
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedCategory"
            :items="allCategories"
            label="Kategorie filtern"
            clearable
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="2">
          <!-- Button zum Erstellen einer neuen Gewohnheit -->
          <v-btn
            outlined
            dense
            text
            block
            color="primary"
            rounded
            @click="$router.push('/erstellen')"
          >
            Habit erstellen
          </v-btn>
        </v-col>
      </v-row>

      <!-- Liste aller gefilterten Habits -->
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-hover v-slot="{ hover }" v-for="habit in filteredHabits" :key="habit.id" class="mb-3">
            <v-card
              outlined
              rounded
              :elevation="hover ? 6 : 2"
              class="pa-4"
            >
              <!-- Kopfbereich mit Checkbox, Name und Kategorie -->
              <div
                class="habit-header d-flex justify-space-between align-center cursor-pointer"
                @click="togglePanel(habit.id)"
              >
                <div class="d-flex align-center">
                  <v-checkbox
                    class="mr-2"
                    :model-value="getStatus(habit)"
                    :disabled="!isEditable"
                    @change.stop="toggleHabit(habit, $event)"
                    @click.stop
                    hide-details
                  />
                  <strong class="text-subtitle-1">{{ habit.name }}</strong>
                  <v-chip
                    class="ml-3"
                    small
                    color="primary"
                    text-color="white"
                    label
                  >
                    {{ habit.category }}
                  </v-chip>
                </div>

                <!-- Streak-Zähler -->
                <div class="text-subtitle-2">
                  🔥 Streak: <strong>{{ habit.streak || 0 }}</strong> Tage
                  <v-icon small class="ml-2">
                    {{ openedPanels.includes(habit.id) ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </div>
              </div>

              <!-- Ausklappbereich: Beschreibung, Tags, Aktionen -->
              <v-expand-transition>
                <div
                  v-show="openedPanels.includes(habit.id)"
                  class="pl-10 text-body-2 text--secondary mt-3"
                >
                  <p><strong>Beschreibung: </strong> {{ habit.description || "Keine Beschreibung" }}</p>
                  <p>
                    <strong>Tags: </strong>
                    <span v-if="habit.tags && habit.tags.length">
                      <v-chip
                        v-for="(tag, index) in parsedTags(habit.tags)"
                        :key="index"
                        class="ma-1"
                        small
                        color="secondary"
                        text-color="white"
                        label
                      >
                        {{ tag }}
                      </v-chip>
                    </span>
                    <span v-else>Keine Tags</span>
                  </p>

                  <!-- Buttons: Löschen und Bearbeiten -->
                  <v-row justify="space-between" align="center">
                    <v-col cols="auto" class="text-right">
                      <v-btn
                        icon
                        color="error"
                        small
                        @click.stop="deleteHabit(habit.id)"
                        :disabled="!isEditable"
                        title="Habit löschen"
                      >
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        outlined
                        dense
                        text
                        color="primary"
                        rounded
                        @click="$router.push({ name: 'EditHabit', params: { id: habit.id } })"
                      >
                        Bearbeiten
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
          </v-hover>

          <!-- Falls keine Habits gefunden -->
          <div v-if="filteredHabits.length === 0" class="text-center grey--text">
            Keine Habits gefunden.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>

export default {
  name: "Heute",
  data() {
    return {
      habits: [], // Alle geladenen Habits
      selectedDate: new Date().toISOString().split("T")[0], // Ausgewähltes Datum (Standard = heute)
      todayDate: new Date().toISOString().split("T")[0], // Heutiges Datum
      searchTerm: "", // Suchbegriff für Name/Tags
      selectedCategory: null, // Kategorie-Filter
      openedPanels: [], // IDs der geöffneten Details-Panels
    };
  },
  computed: {
    // Anzahl heute erledigter Habits
    completedToday() {
      return this.habits.filter((h) => h.entries?.[this.selectedDate]?.done).length;
    },
    // Durchschnittliche Abschlussrate über max. 66 Tage
    averageRate() {
      if (this.habits.length === 0) return 0;
      const total = this.habits.reduce((sum, h) => sum + (h.completions || 0), 0);
      return Math.round((total / (66 * this.habits.length)) * 100);
    },
    // Nur heute kann bearbeitet werden
    isEditable() {
      return this.selectedDate === this.todayDate;
    },
    // Letzte 7 Tage (inkl. heute) mit Wochentag & Datum
    lastFiveDays() {
      const days = [];
      const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        days.push({
          date: `${yyyy}-${mm}-${dd}`,
          formattedDate: `${dd}.${mm}`,
          weekday: dayNames[d.getDay()],
        });
      }
      return days;
    },
    // Alle vorhandenen Kategorien (einmalig)
    allCategories() {
      const cats = this.habits
        .map((h) => h.category)
        .filter((c) => c && c.trim() !== "")
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      return cats;
    },
    // Gefilterte Liste nach Suche und Kategorie
    filteredHabits() {
      const searchLower = this.searchTerm.toLowerCase().trim();

      return this.habits.filter((habit) => {
        const matchesCategory = this.selectedCategory
          ? habit.category === this.selectedCategory
          : true;

        const tagsArray = habit.tags
          ? habit.tags.toString().toLowerCase().split(",").map((t) => t.trim())
          : [];

        const matchesSearch =
          !searchLower ||
          habit.name.toLowerCase().includes(searchLower) ||
          tagsArray.some((tag) => tag.includes(searchLower));

        return matchesCategory && matchesSearch;
      });
    },
  },
  methods: {
    // Datum wechseln (z. B. durch Klick auf Kalenderbutton)
    selectDate(date) {
      this.selectedDate = date;
    },
    // Panel umschalten (auf/zu)
    togglePanel(habitId) {
      const idx = this.openedPanels.indexOf(habitId);
      if (idx > -1) {
        this.openedPanels.splice(idx, 1);
      } else {
        this.openedPanels.push(habitId);
      }
    },
    // Status (Checkbox) auslesen
    getStatus(habit) {
      console.log("Habit selected date:  " +  this.selectedDate)
      console.log("State: " + habit.entries?.[this.selectedDate]?.done ?? false)
      return habit.entries?.[this.selectedDate]?.done ?? false
    },
    // Checkbox-Änderung speichern
    toggleHabit(habit, isChecked) {
      if (!this.isEditable) return;

      if (!habit.entries) habit.entries = {};

      if (isChecked) {
        habit.entries[this.selectedDate] = { done: true };
      } else {
        delete habit.entries[this.selectedDate];
      }

      // Neue Abschlussanzahl & Streak berechnen
      habit.completions = Object.values(habit.entries).filter((e) => e.done).length;
      this.recalculateStreak(habit);
      this.saveHabits();
    },
    // Streak berechnen (zusammenhängende erledigte Tage rückwärts)
    recalculateStreak(habit) {
      let streak = 0;
      let currentDate = new Date(this.selectedDate);
      while (true) {
        const dateStr = currentDate.toISOString().split("T")[0];
        if (habit.entries?.[dateStr]?.done) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      habit.streak = streak;
    },
    // Tags-String zu Array umwandeln
    parsedTags(tags) {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      return tags.toString().split(",").map((t) => t.trim());
    },
    // Alle Habits vom Server laden
    fetchHabits() {
      fetch("http://localhost:3000/api/habits")
        .then((res) => res.json())
        .then((data) => {
          this.habits = data.map((h) => {
            // Backward-Kompatibilität: evtl. alte Struktur umwandeln
            if (!h.entries) {
              h.entries = {};
              if (h.done) {
                const today = new Date().toISOString().split("T")[0];
                h.entries[today] = { done: true };
                delete h.done;
              }
            }
            return h;
          });
        });
    },
    // Änderungen speichern (POST an Server)
    saveHabits() {
      fetch("http://localhost:3000/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.habits),
      });
    },
    // Habit löschen
    deleteHabit(id) {
      this.habits = this.habits.filter((h) => h.id !== id);
      this.saveHabits();
    },
  },
  mounted() {
    this.fetchHabits(); // Beim Laden automatisch Habits holen
  },
};
</script>
