<template>
  <v-main>
    <v-container>
      <!-- Übersicht -->
      <v-row class="mb-6" dense>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Gesamte Gewohnheiten:</div>
            <strong>{{ habits.length }}</strong>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Aktuelle längste Serie:</div>
            <strong>{{ longestCurrentStreak }} Tage</strong>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Längste Serie insgesamt:</div>
            <strong>{{ longestStreak }} Tage</strong>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3" outlined>
            <div>Ø Abschlussrate:</div>
            <strong>{{ averageRate }}%</strong>
          </v-card>
        </v-col>
      </v-row>

      <!-- Fortschritt -->
      <v-row>
        <v-col cols="12">
          <h2 class="mb-4">Fortschritt der letzten 66 Tage</h2>

          <v-card
            v-for="habit in habits"
            :key="habit.id"
            class="mb-4 pa-4"
            outlined
          >
            <h3 class="mb-2">{{ habit.name }}</h3>
            <v-progress-linear
              :model-value="habit.completions"
              :max="66"
              color="primary"
              height="20"
              rounded
              striped
              class="mb-2"
            >
              <template #default>
                <strong>{{ habit.completions }}/66</strong>
              </template>
            </v-progress-linear>
            <div>
              <v-icon small color="orange">mdi-fire</v-icon>
              Aktuelle Serie: <strong>{{ habit.streak || 0 }}</strong> Tage |
              Max. Serie: <strong>{{ habit.maxStreak || 0 }}</strong> Tage
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Wissenschaftlicher Hintergrund -->
      <v-row>
        <v-col cols="12">
          <v-alert type="info" border="start" elevation="1" class="mt-8">
            <h2 class="mb-2">Warum 66 Tage?</h2>
            Studien zeigen, dass es etwa <strong>66 Tage</strong> dauert, bis sich eine neue Gewohnheit etabliert.
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "Statistik",
  data() {
    return { habits: [] };
  },
  computed: {
    longestStreak() {
      return Math.max(...this.habits.map((h) => h.maxStreak || 0), 0);
    },
    longestCurrentStreak() {
      return Math.max(...this.habits.map((h) => h.streak || 0), 0);
    },
    averageRate() {
      if (this.habits.length === 0) return 0;
      const total = this.habits.reduce((sum, h) => sum + (h.completions || 0), 0);
      return Math.round((total / (66 * this.habits.length)) * 100);
    },
  },
  methods: {
    fetchHabits() {
      fetch("http://192.168.0.97:3000/api/habits")
        .then((res) => res.json())
        .then((data) => {
          data.forEach((habit) => {
            habit.maxStreak = this.calculateMaxStreak(habit.entries);
          });
          this.habits = data;
        });
    },
    calculateMaxStreak(entries) {
      if (!entries) return 0;

      const dates = Object.keys(entries)
        .filter((date) => entries[date].done)
        .sort((a, b) => new Date(a) - new Date(b));

      let maxStreak = 0;
      let currentStreak = 1;

      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          currentStreak++;
        } else {
          if (currentStreak > maxStreak) maxStreak = currentStreak;
          currentStreak = 1;
        }
      }

      return Math.max(maxStreak, currentStreak);
    },
  },
  mounted() {
    this.fetchHabits();
  },
};
</script>
