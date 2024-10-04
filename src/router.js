import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/v-Home"),
    },

    {
      path: "/about",
      name: "about",
      component: () => import("@/views/v-About"),
    },

    {
      path: "/coin/:id",
      name: "coin-detail",
      component: () => import("@/views/v-CoinDetail"),
    },

    {
      path: "/:catchAll(.*)",
      name: "error",
      component: () => import("@/views/v-Error"),
    },
  ],
});

export default router;
