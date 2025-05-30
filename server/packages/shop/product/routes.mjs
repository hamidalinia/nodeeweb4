import controller from './controller.mjs'
export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.getAll,
    },
    {
        "path": "/torob/:offset/:limit",
        "method": "get",
        "controller": controller.torob,

        // "access": "admin_user,admin_shopManager,customer_all",
    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "controller": controller.getAll,

        "access": "admin_user,admin_shopManager,customer_user,customer_all",
    }, {
        "path": "/:offset/:limit/:search",
        "method": "get",
        "controller": controller.getAll,

        "access": "admin_user,admin_shopManager,customer_user,customer_all",
    },
    {
        "path": "/searchWithBarcode",
        "method": "post",
        "controller": controller.searchWithBarcode,
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/updateAllPrices",
        "method": "post",
        "controller": controller.updateAllPrices,
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_user,customer_all",
        "controller": controller.viewOne,

        // "controller":()=>{
        //     console.log('hi')
        // }
    },
    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.createByAdmin,

    },
    {
        "path": "/importFromExcel",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.importFromExcel,
    }, {
        "path": "/deleteAll",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.deleteAll,
    },
    {
        "path": "/rewriteProducts",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.rewriteProducts,
    },
    {
        "path": "/rewriteProductsImages",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.rewriteProductsImages,
    },
    {
        "path": "/:id",
        "method": "put",
        "access": "admin_user,admin_shopManager",
        "controller": controller.editByAdmin,

    },
    {
        "path": "/:id",
        "method": "delete",
        "access": "admin_user,admin_shopManager",
        "controller": controller.destroy,

    },
    {
        "path": "/comment/:id",
        "method": "post",
        "access": "customer_user,admin_shopManager",
        "controller": controller.addComment,

    },
    {
        "path": "/comment/:id",
        "method": "put",
        "access": "customer_user,admin_shopManager",
        "controller": controller.updateComment,

    },
]
