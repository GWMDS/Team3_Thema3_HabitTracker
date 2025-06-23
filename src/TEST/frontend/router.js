import { createRouter, createWebHistory } from 'vue-router';
import Heute from './pages/Heute.vue';
import Statistik from './pages/Statistik.vue';
import Erstellen from './pages/Erstellen.vue';

const routes = [
  { path: '/', component: Heute },
  { path: '/statistik', component: Statistik },
  { path: '/erstellen', component: Erstellen },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
