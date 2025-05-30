// console.log('#f routes/index')
// import React from 'react';

import express from "express";
import path from "path";
import axios from "axios";
import controller from "#controllers/index";
// import post from "#routes/post";
// import settings from "#routes/settings";
import mongoose from "mongoose";
// import user from "#routes/default/user/index";
import global from "#root/global";
import fs from "fs";
// const publicFolder = path.join(__dirname, "./public");
// import _ from 'loadash';
// import menu from "#routes/menu";
// import {StaticRouter} from "react-router-dom/server";
// import store from "#c/store";
// import "ignore-styles";
// import * as React from "react";
// import * as ReactDOMServer from "react-router-dom/server";
// import * as ReactDOMServer from "react-dom/server";

// import {Provider} from "react-redux";
// import { StaticRouter } from "react-router-dom/server";

const __dirname = path.resolve();

// import {persistor, store} from "#c/functions/store";
// export function createDefaultRoute(app) {
//     Object.keys(mongoose.models).forEach((model, is) => {
//         console.log('model', model);
//         // app.use('/'mode)
//
//
//     });
// };
export function returnDefaultModels() {
    //     return user.model(mongoose)
}

var Models = [];

export function createRoute(modelName, routes, label,handle) {
    let router = express.Router();
    console.log('in createRoute...',handle)
    let model = mongoose.model(modelName);
    Models[modelName] = model;
    let cont = controller(Models[modelName]);
    router = create_standard_route("", routes, router,handle);
    router.get("/", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.all,
            ...returnThisRouteRules("/", "get", routes),
        },handle)
    );
    router.get("/count", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.all,
            ...returnThisRouteRules("/count", "get", routes),
        },handle)
    );
    router.post("/copy/:id", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.copy,
            ...returnThisRouteRules("/copy/:id", "post", routes),
        },handle)
    );

    router.get("/:offset/:limit", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.all,
            ...returnThisRouteRules("/:offset/:limit", "get", routes),
        },handle)
    );
    router.get("/:offset/:limit/:search", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.all,
            ...returnThisRouteRules("/:offset/:limit/:search", "get", routes),
        },handle)
    );
    router.get("/:id", (req, res, next) =>{
        console.log("get id");
        return make_routes_safe(req, res, next, {
            controller: cont.viewOne,
            ...returnThisRouteRules("/:id", "get", routes),
        },handle)

}   );
    router.post("/", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.create,
            ...returnThisRouteRules("/", "post", routes),
        },handle)
    );
    router.post("/import", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.importEntity,
            ...returnThisRouteRules("/import", "post", routes),
        },handle)
    );
    router.post("/export", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.exportEntity,
            ...returnThisRouteRules("/export", "post", routes),
        },handle)
    );
    router.put("/:id", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.edit,
            ...returnThisRouteRules("/:id", "put", routes),
        },handle)
    );
    router.delete("/:id", (req, res, next) =>
        make_routes_safe(req, res, next, {
            controller: cont.destroy,
            ...returnThisRouteRules("/:id", "delete", routes),
        },handle)
    );

    return router;
}

export function createPublicRoute(suf = "", routes,handle) {
    // console.log('createPublicRoute ...');
    const router = express.Router();

    return create_standard_route(suf, routes, router,handle);
    // return [router];
}

function returnThisRouteRules(path, method, routes) {
    let obj = {
        path: path,
        method: method,
    };
    routes.forEach((ro) => {
        if (ro.method == method && ro.path == path) {
            obj["access"] = ro.access;
            if (ro.controller) {
                obj["controller"] = ro.controller;
            }
        }
    });
    return obj;
}

async function make_routes_safe(req, res, next, rou,handle) {
    console.log(
        "make_routes_safe:",
        "\npath: " + rou.path || "no path",
        "\nmethod: " + rou.method || "no method",
        "\naccess: " + rou.access || "no need access check",
        "\ncontroller: ", rou.controller || "no controller",
        // "\nhandle: ", handle || "no handle"
    );
    req.mongoose = mongoose;
    // req.handle = handle(req,res);
    req.props.entity.forEach((en, d) => {
        if (en.req) {
            let op = Object.keys(en.req);
            op.forEach((o) => {
                req[o] = en.req[o];
            });
        }
    });

    res.ssrParse = (req, res, next) => {
        // return res.json(req);
        return new Promise(function (resolve, reject) {
            fs.readFile(path.themeFolder + "/index.html", "utf8", (err, body) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("An error occurred");
                }
                let obj = {};
                // resolve();
                // body = body.replace('</head>', `<title>${obj.title}</title></head>`);
                // body = body.replace('</head>', `<meta name="description" content="${obj.metadescription}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_image" content="${obj.product_image}" /></head>`);
                // body = body.replace('</head>', `<meta name="image" content="${obj.image}" /></head>`);
                // body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image" content="${obj.image}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image:secure_url" content="${obj.image}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image:width" content="1200" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image:height" content="675" /></head>`);
                // body = body.replace('</head>', `<meta name="og:locale" content="fa_IR" /></head>`);
                // body = body.replace('</head>', `<meta name="og:type" content="website" /></head>`);
                // body = body.replace('</head>', `<meta name="og:title" content="${obj.title}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:description" content="${obj.description}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:url" content="." /></head>`);
                // body = body.replace('</head>', `<meta name="og:site_name" content="Arvandshop" /></head>`);
                // body = body.replace('</head>', `<meta name="og:site_name" content="Arvandshop" /></head>`);
                // if(req.route.path=='/product/:_id/:_slug'){
                //
                // }
                // handle_ssr(req, res, next)
                // const renderedData = (<div></div>);
                // return res.status(200).send(body);
                resolve(body);
            });
        });
    };
    res.show = () => {
        // res.ssrParse(req,res,next);
        return res.sendFile(path.themeFolder + "/index.html");
    };
    res.admin = () => {
        return res.sendFile(path.adminFolder + "/index.html");
    };

    req.global = global;

    req.publishToTelegram = (message) => {
        if (!process.env.telegramLink) {
            console.error("process.env.telegramLink is empty");
            return;
        }
        if (!process.env.telegramChatID) {
            console.error("process.env.telegramChatID is empty");
            return;
        }
        return new Promise(function (resolve, reject) {
            let url = encodeURI(process.env.telegramLink);
            req
                .httpRequest({
                    method: "post",
                    url: url,
                    data: {message, chatId: process.env.telegramChatID},
                    json: true,
                })
                .then(function (parsedBody) {
                    resolve({
                        success: true,
                        // body:parsedBody
                    });
                })
                .catch(function (err) {
                    reject({
                        success: false,
                    });
                });
        });
    };
    req.models = () => global.models();
    req.adminRules = () => {
        // var models = mongoose.modelNames()
        return models;
    };
    req.builderComponents = (rules, req) => global.builderComponents(rules, req);
    req.httpRequest = axios;
    req.fireEvent = (event, params = {}) => {
        return global.fireEvent(event, params, req.props, req, res, next);
    };
    req.functions = () => {
        let functions = [];
        req.props.entity.forEach((en) => {
            if (en.functions) {
                en.functions.forEach((fn) => {
                    functions.push(fn);
                });
            }
        });
        return functions;
    };
    req.events = () => {
        let events = [];
        req.props.entity.forEach((en) => {
            if (en.events) {
                en.events.forEach((fn) => {
                    events.push(fn);
                });
            }
        });
        return events;
    };
    req.submitAction = (obj) => global.submitAction(obj);

    req.rules = (rules) => global.rules(rules, {props});
    if (rou.access) {
        let accessList = rou.access.split(",");

        // Check if "customer_all" exists in the access list
        if (accessList.indexOf("customer_all") > -1) {
            return rou.controller(req, res, next);
        }

        let isPassed = false;
        let the_id = null;

        // Check if the token is available in the request headers
        if (!req.headers.token) {
            if (req.headers.response !== "json") {
                return res.redirect("/admin/login");
            } else {
                return res.status(403).json({
                    success: false,
                    message: "You have to authorize",
                });
            }
        }

        // Process each access type asynchronously using for...of
        for (const al of accessList) {
            if (isPassed) break; // Exit early if access is granted

            let the_role = al.split("_");
            the_role[0] = the_role[0].trim().toLowerCase();
            the_role[0] = the_role[0].charAt(0).toUpperCase() + the_role[0].slice(1);
            console.log("the_role[0]", the_role[0]);

            let theModel = mongoose.model(the_role[0]);
            let findObject = {"tokens.token": req.headers.token};
            if (the_role[0] === "Admin") findObject = {token: req.headers.token};

            console.log("findObject:", findObject);  // Log query before searching

            try {
                const obj = await theModel.findOne(findObject).exec(); // Await the query result

                if (obj && obj.type === the_role[1]) {
                    isPassed = true;
                    the_id = obj._id;
                    req.headers.role = obj.role; // Fetch role directly from the object
                } else {
                    console.log(`Role mismatch or object not found for: ${al}`);
                }
            } catch (err) {
                console.log("Error during findOne:", err);
                // Optionally handle errors like returning a response here
                return res.status(500).json({
                    success: false,
                    message: "Error checking access",
                    error: err.message,
                });
            }
        }

        // After checking all roles, perform final check
        if (isPassed && the_id) {
            req.headers._id = the_id;
            return rou.controller(req, res, next);
        } else {
            return res.json({
                success: false,
                message: "You do not have access!",
            });
        }
    } else {
        return rou.controller(req, res, next);
    }


    // if (rou.access) {
    //     let accessList = rou.access.split(",");
    //     if (accessList.indexOf("customer_all") > -1) {
    //         return rou.controller(req, res, next);
    //     }
    //     let isPassed = false,
    //         the_id = null;
    //
    //     if (!req.headers.token) {
    //         if (req.headers.response !== "json") {
    //             return res.redirect("/admin/login");
    //         } else {
    //             return res.status(403).json({
    //                 success: false,
    //                 message: "You have to authorize",
    //             });
    //         }
    //     }
    //     let counter = 0;
    //     accessList.forEach((al, j) => {
    //         let the_role = al.split("_");
    //
    //         the_role[0] = the_role[0].trim().toLowerCase();
    //         the_role[0] = the_role[0].charAt(0).toUpperCase() + the_role[0].slice(1);
    //         console.log("the_role[0]", the_role[0]);
    //
    //         let theModel = mongoose.model(the_role[0]);
    //         let findObject = { "tokens.token": req.headers.token };
    //         if (the_role[0] === "Admin") findObject = { token: req.headers.token };
    //
    //         console.log("findObject:", findObject);  // Log query before searching
    //
    //         if (!isPassed) {
    //             theModel.findOne(findObject, function (err, obj) {
    //                 counter++;
    //
    //                 if (err || !obj) {
    //                     console.log("Error or no obj:", err || "No matching obj");
    //                 } else {
    //                     console.log("Found obj:", obj);  // Log found obj
    //                 }
    //
    //                 // Proceed only if obj is not null
    //                 if (obj && obj.type === the_role[1]) {
    //                     isPassed = true;
    //                     the_id = obj._id;
    //                 }
    //
    //                 if (counter === accessList.length) {
    //                     console.log("Final check - obj:", obj, "the_id:", the_id);
    //
    //                     if (isPassed && the_id) {
    //                         req.headers._id = the_id;
    //                         req.headers.role = obj ? obj.role : undefined;
    //                         return rou.controller(req, res, next);
    //                     } else {
    //                         return res.json({
    //                             success: false,
    //                             message: "You do not have access!",
    //                         });
    //                     }
    //                 }
    //             });
    //         } else {
    //             console.log("Already passed!");
    //         }
    //     });
    //
    // } else {
    //     return rou.controller(req, res, next);
    // }
}

function create_standard_route(suf = "/", routes = [], router,handle) {
    if (routes)
        routes.forEach((rou) => {
            if (rou.path && rou.controller) {
                if (rou.method === "get") {
                    router.get(suf + rou.path, (req, res, next) =>
                        make_routes_safe(req, res, next, {
                            ...returnThisRouteRules(suf + rou.path, "get", routes),
                        },handle)
                    );
                }
                if (rou.method === "post") {
                    router.post(suf + rou.path, (req, res, next) =>
                        make_routes_safe(req, res, next, {
                            ...returnThisRouteRules(suf + rou.path, "post", routes),
                        },handle)
                    );
                }
                if (rou.method === "put") {
                    router.put(suf + rou.path, (req, res, next) =>
                        make_routes_safe(req, res, next, {
                            ...returnThisRouteRules(suf + rou.path, "put", routes),
                        },handle)
                    );
                }
                if (rou.method === "delete") {
                    router.delete(suf + rou.path, (req, res, next) =>
                        make_routes_safe(req, res, next, {
                            ...returnThisRouteRules(suf + rou.path, "delete", routes),
                        },handle)
                    );
                }
            }
        });
    return router;
}

function handle_ssr(req, res, next) {
    {
        /*<StaticRouter context={context} location={req.url}>*/
    }
    {
        /*<AppSSR url={req.url}/></StaticRouter>*/
    }
    // const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
    //
    // </Provider>);
}

//
//         let ua = req.get("user-agent");
//         if (!req.headers.lan)
//             req.headers.lan = "fa";
//
//         if (isbot(ua)) {
//
//             fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send("An error occurred");
//                 }
//                 const context = {};
//                 let cccc = [];
//                 const dataRequirements =
//                     routes
//                         .filter(route => {
//                             return (matchPath(route, req.url));
//                         })
//                         .map(route => {
//                             if (req.params._firstCategory && req.params._id) {
//                                 route.server[0].params = req.params._id;
//                             }
//                             return route;
//                         })
//                         .filter(comp => {
//                             return comp.server;
//                         })
//                         .map(comp => {
//                             if (typeof comp.server === "object") {
//                                 comp.server.forEach(s => {
//                                     cccc.push(store.dispatch(s.func(s.params)));
//                                 });
//                                 return cccc;
//                             } else {
//                                 cccc.push(store.dispatch(comp.server(comp.params)));
//                                 return store.dispatch(comp.server(comp.params));
//
//                             }
//                             // return store.dispatch(comp.server(comp.parameter))
//                         }); // dispatch data requirement
//                 Promise.all(cccc).then(() => {
//                     const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
//                         <StaticRouter context={context} location={req.url}>
//                 <AppSSR url={req.url}/></StaticRouter></Provider>);
//                     res.locals.renderedData = renderedData;
//                     res.locals.body = data.replace(
//                         "<div id=\"root\"></div>",
//                         `<div id="root">${renderedData}</div>`
//                     );
//       // const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
//       //                   <StaticRouter context={context} location={req.url}>
//       //           <AppSSR url={req.url}/></StaticRouter></Provider>);
//       //               res.locals.renderedData = renderedData;
//       //               res.locals.body = data.replace(
//       //                   "<div id=\"root\"></div>",
//       //                   `<div id="root">${renderedData}</div>`
//       //               );
//
//                     resolve();
//                 });
//             });
//         }
//         else {
//             resolve();
//         }
//     });
// };
// export const handle_ssr_response = (req, res, next) => {
//
//     global.getSettings(['title','description','logo']).then(set => {
//         let body = res.locals.body;
//         if (body) {
//             body = body.replace('</head>', `<title>${set.title}</title></head>`);
//             body = body.replace('</head>', `<meta name="description" content="${set.description}" /></head>`);

//             return res.status(200).send(body);
//         } else {
//             return res.status(200).render('index',{
//                 title:set.title || "",
//
//                 description: set.description || "",
//                 url: global.domain + "/",
//                 width: "512",
//                 height: "512",
//                 image: global.domain + "/"+set.logo || "",
//                 html: global.body || ""
//
//             });
//         }
//     })
// };

export default {};
