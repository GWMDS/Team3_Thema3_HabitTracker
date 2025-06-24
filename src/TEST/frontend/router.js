import { createRouter, createWebHistory } from 'vue-router';
import Heute from './pages/Heute.vue';
import Statistik from './pages/Statistik.vue';
import Erstellen from './pages/Erstellen.vue';
import Profil from './pages/Profil.vue';

const routes = [
  { path: '/', component: Heute },
  { path: '/statistik', component: Statistik },
  { path: '/erstellen', component: Erstellen },
  { path: '/profil', component: Profil },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } // immer zum Seitenanfang scrollen
  },
});
