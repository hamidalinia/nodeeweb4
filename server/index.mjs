
import Server from "@nodeeweb/server";
import Shop from "@nodeeweb/shop";
import Entity from "./entity/index.mjs";
// import ssrRender from './front/src/ssr.mjs';
// import Form from '@nodeeweb/form'
// import Service from '@nodeeweb/service'
// import Front from '@nodeeweb/front'
// import pasar from './plugins/pasargad-gateway/index.js'
// import Chat , {createChatServer} from '@nodeeweb/chat'
//add shop ability
// let d=[...Shop,...Entity]
// console.log('entities',d.length)
Server({
  // client:Front,
  entity: [
    ...Shop,
    ...Entity,
    // ...Form,
    // ...Service,
    // ...Chat
  ],
    // server: [
    //     (app) => {
    //         // Handle SSR requests
    //         app.get('*', (req, res) => {
    //             const html = ssrRender(); // Get the SSR HTML from the React app
    //             res.send(html); // Send the rendered HTML
    //         });
    //     },
    // ],
  // server: [createChatServer]
});
// Server({entity:[...Shop,
// front:{},
// admin:{
// routes:[]
// }});
