import controller from './controller.mjs'
export default [{
    "path": "/allRound/",
    "method": "post",
    "access": "customer_user",
    "controller": controller.allRound,

}]

// {
//     "path": "/join/",
//     "method": "post",
//     "access": "customer_user",
//     "controller": controller.join,
//
// },{
//     "path": "/answer/",
//         "method": "post",
//         "access": "customer_user",
//         "controller": controller.answer,
//
// }