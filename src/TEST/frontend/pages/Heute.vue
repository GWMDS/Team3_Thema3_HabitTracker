<template>
  <main>
    <section class="overview">
      <div>Gewählte Ansicht: {{ selectedDate }}</div>
      <div>Gewohnheiten Heute: {{ habits.length }}</div>
      <div>Abgeschlossen: {{ completedToday }}</div>
      <div>Ø Abschlussrate: {{ averageRate }}%</div>
    </section>

    <section class="calendar-buttons">
      <button
        v-for="(day, index) in lastFiveDays"
        :key="day.date"
        @click="selectDate(day.date)"
        :class="{ active: day.date === selectedDate }"
      >
        <div>{{ day.weekday }}</div>
        <div>{{ day.formattedDate }}</div>
      </button>
    </section>

    <section class="habits">
      <h2>Gewohnheiten für {{ selectedDate }}</h2>
      <button @click="$router.push('/erstellen')" class="menu-btn">Neuen Habit erstellen</button>
      <ul>
        <li v-for="habit in habits" :key="habit.id">
          <label :class="{ disabled: !isEditable }">
            <input
              type="checkbox"
              :checked="getStatus(habit)"
              :disabled="!isEditable"
              @change="toggleHabit(habit, $event.target.checked)"
            />
            {{ habit.name }} <span v-if="habit.streak">🔥 {{ habit.streak }}</span> <br>
            Beschreibung: {{ habit.description }} <br>
            Kategorie: {{ habit.category }}
          </label>
          <button @click="deleteHabit(habit.id)" :disabled="!isEditable" class="del-btn">🗑️</button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
export default {
  name: "Heute",
  data() {
    return {
      habits: [],
      selectedDate: new Date().toISOString().split("T")[0],
      todayDate: new Date().toISOString().split("T")[0],
    };
  },
  computed: {
    completedToday() {
      return this.habits.filter((h) => h.entries?.[this.selectedDate]?.done).length;
    },
    averageRate() {
      if (this.habits.length === 0) return 0;
      const total = this.habits.reduce((sum, h) => sum + (h.completions || 0), 0);
      return Math.round((total / (66 * this.habits.length)) * 100);
    },
    isEditable() {
      return this.selectedDate === this.todayDate;
    },
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
  },
  methods: {
    selectDate(date) {
      this.selectedDate = date;
    },
    getStatus(habit) {
      return habit.entries?.[this.selectedDate]?.done || false;
    },
    toggleHabit(habit, isChecked) {
      if (!this.isEditable) return;

      if (!habit.entries) habit.entries = {};
      habit.entries[this.selectedDate] = { done: isChecked };

      // completions neu berechnen
      habit.completions = Object.values(habit.entries).filter(e => e.done).length;

      this.recalculateStreak(habit);
      this.saveHabits();
    },
    recalculateStreak(habit) {
      let streak = 0;
      let currentDate = new Date(this.selectedDate);

      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (habit.entries?.[dateStr]?.done) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      habit.streak = streak;
    },
    fetchHabits() {
      fetch("http://localhost:3000/api/habits")
        .then((res) => res.json())
        .then((data) => {
          this.habits = data.map((h) => {
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
    saveHabits() {
      fetch("http://localhost:3000/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.habits),
      });
    },
    deleteHabit(id) {
      this.habits = this.habits.filter((h) => h.id !== id);
      this.saveHabits();
    },
  },
  mounted() {
    this.fetchHabits();
  },
};
</script>

<style>
.calendar-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin: 1rem 0;
}
.calendar-buttons button {
  cursor: pointer;
  border: 1px solid #888;
  background: #eee;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-family: Arial, sans-serif;
  color: #222;
  min-width: 60px;
  user-select: none;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
}
.calendar-buttons button div:first-child {
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.calendar-buttons button.active {
  background-color: #3f51b5;
  color: white;
  border-color: #2c387e;
}
.calendar-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
