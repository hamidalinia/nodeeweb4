import controller from './controller.mjs'
export default [{
    "path": "/",
    "method": "post",
    "access": "admin_user,admin_shopManager",
    "controller": controller.create,

},{
    "path": "/details/:gameId",
    "method": "post",
    "access": "customer_user",
    "controller": controller.details,

},{
    "path": "/start/:gameId",
    "method": "post",
    "access": "customer_user",
    "controller": controller.start,

},{
    "path": "/round/:roundId",
    "method": "post",
    "access": "customer_user",
    "controller": controller.getRoundDetails,

},{
    "path": "/answer/",
    "method": "post",
    "access": "customer_user",
    "controller": controller.answer,

}]