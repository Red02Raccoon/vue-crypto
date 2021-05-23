import { createRouter, createWebHistory } from "vue-router";
import Test from "@/views/Test.vue";
import Crypto from "@/views/Crypto.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "crypto",
    path: "/crypto",
    component: Crypto,
  },
  {
    name: "test",
    path: "/test",
    component: Test,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
