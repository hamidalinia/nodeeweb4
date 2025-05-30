import controller from "./controller.mjs";

export default [
    {
        path: "/",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: controller.all,
    },
  {
    path: "/:offset/:limit",
    method: "get",
    controller: controller.all,
      access: "admin_user,admin_shopManager",

  },
    {
    path: "/login",
    method: "post",
    controller: controller.login,
  },
  {
    path: "/",
    method: "post",
    access: "admin_user",
    controller: controller.register,
  },
  {
    path: "/resetAdmin",
    method: "post",
    access: "admin_user",
    controller: controller.resetAdmin,
  },
  {
    path: "/:id",
    method: "put",
    access: "admin_user",
    controller: controller.edit,
  },
];
