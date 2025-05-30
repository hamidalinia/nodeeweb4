import controller from './controller.mjs'
export default [   {
    "path": "/",
    "method": "get",
    "access": "admin_user,admin_shopManager",
    "controller": controller.getAll,
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
    },{
    "path": "/entry/:form",
    "method": "post",
    "access": "customer_all",
    "controller": controller.addEntry,

}]