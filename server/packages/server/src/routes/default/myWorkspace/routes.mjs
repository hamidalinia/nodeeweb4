import controller from './controller.mjs'
export default [{
    "path": "/workspaces",
    "method": "post",
    "access": "customer_user",
    "controller": controller.getMyWorkspaces,

},{
    "path": "/workspace/:workspaceId",
    "method": "post",
    "access": "customer_user",
    "controller": controller.getWorkspace,

}]