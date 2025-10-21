import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import i18n from "../i18n";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home-en",
      component: Home,
      beforeEnter: (to, from, next) => {
        i18n.global.locale.value = "en";
        next();
      },
    },
    {
      path: "/sk",
      name: "home-sk",
      component: Home,
      beforeEnter: (to, from, next) => {
        i18n.global.locale.value = "sk";
        next();
      },
    },
    {
      path: "/es",
      name: "home-es",
      component: Home,
      beforeEnter: (to, from, next) => {
        i18n.global.locale.value = "es";
        next();
      },
    },
    {
      path: "/de",
      name: "home-de",
      component: Home,
      beforeEnter: (to, from, next) => {
        i18n.global.locale.value = "de";
        next();
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0 };
  },
});

export default router;
