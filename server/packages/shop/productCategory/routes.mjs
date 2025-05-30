import controller from './controller.mjs'

export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.all,

    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_all",
        "controller": controller.all,

    },
    {
        "path": "/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_user,customer_all",
        "controller": controller.viewOne,

    },
    {
        "path": "/:id/product-count",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.productCount,

    },
   {
        "path": "/:id/product-count",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.productCount,

    },

   {
        "path": "/:id/update-prices",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.updatePrices,

    },

    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/deleteAll",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.deleteAll,
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