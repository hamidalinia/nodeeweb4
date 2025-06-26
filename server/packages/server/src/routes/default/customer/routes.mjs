import controller from "./controller.mjs";

export default [
    {
        path: "/",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: controller.allCustomers,
    },
    {
        path: "/",
        method: "post",
        access: "admin_user,admin_shopManager",
        controller: controller.createOne,
    },
    {
        path: "/authCustomer",
        method: "post",
        access: "customer_all",
        controller: controller.authCustomer,
    },
    {
        path: "/activateCustomer",
        method: "post",
        access: "customer_all",
        controller: controller.activateCustomer,
    },
    {
        path: "/authCustomerWithPassword",
        method: "post",
        access: "customer_all",
        controller: controller.authCustomerWithPassword,
    },
    {
        path: "/authCustomerForgotPass",
        method: "post",
        access: "customer_all",
        controller: controller.authCustomerForgotPass,
    },
    {
        path: "/setPassword",
        method: "post",
        access: "customer_user",
        controller: controller.setPassword,
    },
    {
        path: "/updateAddress",
        method: "put",
        access: "customer_user",
        controller: controller.updateAddress,
    },
    {
        path: "/getAddress",
        method: "get",
        access: "customer_user",
        controller: controller.getAddress,
    },
    {
        path: "/:_id",
        method: "put",
        access: "admin_user,admin_shopManager",
        controller: controller.editCustomer,
    },
    {
        path: "/update",
        method: "put",
        access: "customer_user",
        controller: controller.updateCustomer,
    },
    {
        path: "/updateProfilePicture",
        method: "post",
        access: "customer_user",
        controller: controller.updateProfilePicture,
    },
    {
        path: "/fileUpload",
        method: "post",
        access: "customer_user",
        controller: controller.fileUpload,
    },
    {
        path: "/importFromExcel",
        method: "post",
        access: "admin_user,admin_shopManager",
        controller: controller.importFromExcel,
    },
    {
        path: "/rewriteCustomers",
        method: "get",
        access: "customer_all",
        controller: controller.rewriteCustomers,
    },
    {
        path: "/removeDuplicatesCustomers",
        method: "get",
        access: "customer_all",
        controller: controller.removeDuplicatesCustomers,
    },
    {
        path: "/getme",
        method: "get",
        access: "customer_user",
        controller: controller.getme,
    },
    {
        path: "/status/:_id",
        method: "put",
        access: "admin_user",
        controller: controller.status,
    },
    {
        path: "/getCustomer/:id",
        method: "get",
        access: "customer_user,admin_user,admin_shopManager",
        controller: controller.viewOneCustomer,
    },
    {
        path: "/:offset/:limit",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: controller.allCustomers,
    },
    {
        path: "/:id",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: controller.viewOne,
    },

];
