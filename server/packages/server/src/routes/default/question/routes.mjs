import controller from './controller.mjs'
export default [{
    "path": "/createSampleQuestions/",
    "method": "post",
    "access": "admin_user",
    "controller": controller.createSampleQuestions,

}]