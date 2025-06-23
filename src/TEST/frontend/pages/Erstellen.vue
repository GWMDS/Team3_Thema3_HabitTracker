<template>
  <main class="form-page">
    <h2>Neue Gewohnheit erstellen</h2>
    <input v-model="enteredName" placeholder="Name" />
    <textarea v-model="enteredDescription" placeholder="Beschreibung (optional)"></textarea>
    <select v-model="selectedCategory">
      <option disabled value="">Kategorie wählen</option>
      <option>Gesundheit</option>
      <option>Produktivität</option>
      <option>Lernen</option>
      <option>Achtsamkeit</option>
      <option>Sonstiges</option>
    </select>
    <button @click="saveHabit">Speichern</button>
  </main>
</template>

<script>
export default {
  name: 'Erstellen',
  data() {
    return {
      enteredName: '',
      enteredDescription: '',
      selectedCategory: '',
    };
  },
  methods: {
    saveHabit() {
      fetch('http://localhost:3000/api/habits')
        .then(res => res.json())
        .then(data => {
          const newId = data.length > 0 ? Math.max(...data.map(h => h.id)) + 1 : 1;
          const newHabit = {
            id: newId,
            name: this.enteredName,
            description: this.enteredDescription,
            category: this.selectedCategory,
            done: false,
            completions: 0,
            streak: 0
          };
          const updated = [...data, newHabit];
          fetch('http://localhost:3000/api/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).then(() => this.$router.push('/'));
        });
    },
  },
};
</script>

<style>
.form-page {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
}
.form-page input,
.form-page textarea,
.form-page select {
  padding: 0.5rem;
  font-size: 1rem;
}
.form-page button {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
