import controller from './controller.mjs'

export default [{
    "path": "/",
    "method": "get",
    "controller": controller.getAll,
    "access": "admin_user,admin_shopManager,customer_user",

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

        "access": "admin_user,admin_shopManager,customer_user",
    }, {
        "path": "/:offset/:limit/:search",
        "method": "get",
        "controller": controller.getAll,

        "access": "admin_user,admin_shopManager,customer_user",

    },{
        "path": "/copy/:_id",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.copy,

    }]