import controller from "./controller.mjs";

export default [
    // {
    //     "path": "/",
    //     "method": "get",
    //     "access": "admin_user,admin_shopManager",
    //     "controller": controller.getAll,
    // },
    {
        "path": "/",
        "method": "post",
        "controller": controller.create,
    }, {
        "path": "/:_id",
        "method": "put",
        "controller": controller.create,
    },
    {
        path: "/:offset/:limit",
        method: "get",
        controller: controller.getAll,
        access: "customer_all",
    },
    {
        path: "/count",
        method: "get",
        access: "admin_user,admin_shopManager",
    }
];
