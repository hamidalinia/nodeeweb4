import controller from "./controller.mjs";

export default [
    {
        "path": "/",
        "method": "get",
        "access": "customer_all,admin_user,admin_shopManager",
        "controller":controller.all
    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "customer_all,admin_user,admin_shopManager",
        "controller":controller.all

    },
    {
        "path": "/:id",
        "method": "get",
        "access": "customer_all,admin_user,admin_shopManager",
        "controller":controller.viewOne

    },
    {
        "path": "/topic/:topicId/:offset/:limit",
        "method": "get",
        "access": "customer_all,admin_user,admin_shopManager",
        "controller":controller.getListByTopic

    },
    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "put",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "delete",
        "access": "admin_user,admin_shopManager",
    },
]