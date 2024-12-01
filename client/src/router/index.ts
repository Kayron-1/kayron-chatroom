import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "登录",
    },
  },
];
// TODO:路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes,
});
export default router;
