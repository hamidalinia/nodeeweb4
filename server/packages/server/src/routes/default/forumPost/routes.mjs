import controller from './controller.mjs'

export default [{
    "path": "/",
    "method": "get",
    "access": "customer_user,admin_user,admin_shopManager",
    "controller": controller.all

},
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "customer_user,admin_user,admin_shopManager",
        "controller": controller.all

    },{
        "path": "/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_user",
        "controller": controller.viewOne,

    }, {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_user",
        "controller": controller.create

    },
    {
        "path": "/like/:id",
        "method": "post",
        "access": "customer_user",
        "controller": controller.like,

    },
    {
        "path": "/reply",
        "method": "post",
        "access": "customer_user",
        "controller": controller.reply,

    },
    {
        "path": "/fileUpload",
        "method": "post",
        "access": "admin_user,customer_user",
        "controller": controller.fileUpload,

    }]