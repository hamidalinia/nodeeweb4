import controller from './controller.mjs'
export default [{
    "path": "/courses",
    "method": "post",
    "access": "customer_user",
    "controller": controller.getMyCourses,

},{
    "path": "/course/:courseId",
    "method": "post",
    "access": "customer_user",
    "controller": controller.getCourse,

}]