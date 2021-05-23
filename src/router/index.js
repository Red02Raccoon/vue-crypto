import { createRouter, createWebHistory } from "vue-router";
import Test from "@/views/Test.vue";
import Crypto from "@/views/Crypto.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

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
  {
    name: "notFound",
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
