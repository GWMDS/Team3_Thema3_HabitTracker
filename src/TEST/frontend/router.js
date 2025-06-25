import { createRouter, createWebHistory } from 'vue-router';
import Heute from './pages/Heute.vue';
import Statistik from './pages/Statistik.vue';
import Erstellen from './pages/Erstellen.vue';
import Profil from './pages/Profil.vue';
import EditHabit from './pages/EditHabit.vue';

const routes = [
  { path: '/', component: Heute },
  { path: '/statistik', component: Statistik },
  { path: '/erstellen', component: Erstellen },
  { path: '/profil', component: Profil },
    { path: '/editHabit/:id', name: 'EditHabit', component: EditHabit },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } // immer zum Seitenanfang scrollen
  },
});
