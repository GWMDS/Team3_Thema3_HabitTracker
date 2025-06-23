<template>
  <main>
    <section class="overview">
      <div>Gesamte Gewohnheiten: {{ habits.length }}</div>
      <div>Aktuelle längste Serie: {{ longestCurrentStreak }} Tage</div>
      <div>Längste Serie insgesamt: {{ longestStreak }} Tage</div>
      <div>Ø Abschlussrate: {{ averageRate }}%</div>
    </section>
    <section class="progress">
      <h2>Fortschritt der letzten 66 Tage</h2>
      <div v-for="habit in habits" :key="habit.id">
        <h3>{{ habit.name }}</h3>
        <progress :value="habit.completions" max="66"></progress>
        <p>Insgesamt Abgeschlossen: {{ habit.completions }}x ||Max. Serie: {{ habit.maxStreak || 0 }} Tage || Aktuelle Serie: {{ habit.streak || 0 }} Tage</p>
      </div>
    </section>
    <section class="science">
      <h2>Warum 66 Tage?</h2>
      <p>Studien zeigen, dass es etwa 66 Tage dauert, bis sich eine neue Gewohnheit etabliert.</p>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Statistik',
  data() {
    return { habits: [] };
  },
  computed: {
    longestStreak() {
      return Math.max(...this.habits.map(h => h.maxStreak || 0), 0);
    },
    longestCurrentStreak() {
      return Math.max(...this.habits.map(h => h.streak || 0), 0);
    },
    averageRate() {
      if (this.habits.length === 0) return 0;
      const total = this.habits.reduce((sum, h) => sum + (h.completions || 0), 0);
      return Math.round(total / (66 * this.habits.length) * 100);
    },
  },
  methods: {
    fetchHabits() {
      fetch('http://localhost:3000/api/habits')
        .then(res => res.json())
        .then(data => {
          data.forEach(habit => {
            habit.maxStreak = this.calculateMaxStreak(habit.entries);
          });
          this.habits = data;
        });
    },
    calculateMaxStreak(entries) {
      if (!entries) return 0;

      const dates = Object.keys(entries)
        .filter(date => entries[date].done)
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

      if (currentStreak > maxStreak) maxStreak = currentStreak;

      return maxStreak;
    },
  },
  mounted() {
    this.fetchHabits();
  },
};
</script>
