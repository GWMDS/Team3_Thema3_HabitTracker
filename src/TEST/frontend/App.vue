<template>
  <div>
    <header>
      <h1>Habit Tracker</h1>
      <nav>
        <button @click="$router.push('/')">Heute</button>
        <button @click="$router.push('/statistik')">Statistik</button>
        <button @click="$router.push('/Profil')">Profil</button>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>

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
