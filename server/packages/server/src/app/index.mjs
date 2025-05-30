// console.log("#f index.mjs", new Date());
import "ignore-styles";
import express from "express";
import next from "next";
import httpProxy from 'http-proxy';
import child_process from 'child_process';
// import React from "react";
import fs from "fs";
import db from "#root/app/db";
import handlePlugins from "#root/app/handlePlugins";
import path from "path";
import mongoose from "mongoose";
// import ssrHandle from "#root/app/ssrHandle";
import global from "#root/global";
import configHandle from "#root/app/configHandle";
import routeHandle from "#root/app/routeHandle";
import headerHandle from "#root/app/headerHandle";
import Action from "#routes/default/action/index";
import Automation from "#routes/default/automation/index";
import Admin from "#routes/default/admin/index";
import Settings from "#routes/default/settings/index";
import Request from "#routes/default/request/index";
import CourseCategory from "#routes/default/courseCategory/index";
import QuestionCategory from "#routes/default/questionCategory/index";
import PostCategory from "#routes/default/postCategory/index";
import OrganisationRole from "#routes/default/organisationRole/index";
import TestCategory from "#routes/default/testCategory/index";
import TestResult from "#routes/default/testResult/index";
import ForumTag from "#routes/default/forumTag/index";
import ForumTopic from "#routes/default/forumTopic/index";
import ForumPost from "#routes/default/forumPost/index";
import ForumPostReply from "#routes/default/forumPostReply/index";
import Page from "#routes/default/page/index";
import Test from "#routes/default/test/index";
import Course from "#routes/default/course/index";
import Lesson from "#routes/default/lesson/index";
import MyCourse from "#routes/default/myCourse/index";
import MyWorkspace from "#routes/default/myWorkspace/index";
import CustomerGroup from "#routes/default/customerGroup/index";
import Customer from "#routes/default/customer/index";
import Menu from "#routes/default/menu/index";
import Template from "#routes/default/template/index";
import Media from "#routes/default/media/index";
import Post from "#routes/default/post/index";
import Form from "#routes/default/form/index";
import Game from "#routes/default/game/index";
import GameRound from "#routes/default/gameRound/index";
import Question from "#routes/default/question/index";
import Entry from "#routes/default/entry/index";
import Link from "#routes/default/link/index";
import Notification from "#routes/default/notification/index";
import Gateways from "#routes/default/gateways/index";
import Category from "#routes/default/category/index";
import Task from "#routes/default/task/index";
import Note from "#routes/default/note/index";
import Document from "#routes/default/document/index";
import Campaign from "#routes/default/campaign/index";
import defaultFront from "#root/app/defaultFront";
import defaultAdmin from "#root/app/defaultAdmin";
import initScheduledJobs from "#root/app/scheduleHandle";

// import router from "../routes/public/p";
// import uploadHandle from "#root/app/uploadHandle";

// to get rid of 'DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.'
// mongoose.set('strictQuery', false);
const dev = process.env.NODE_ENV !== 'production';

export default async function BaseApp(theProps = {}) {
    // if(!props){
    let handle={}
    const __dirname = path.resolve();
    // const nextPath = path.resolve(__dirname, '../next');
    // const standalonePath = path.resolve(nextPath, '.next/standalone/server.js');
    // const nextBuildPath = path.resolve(nextPath, '.next');
    //
    // console.log("nextPath:", nextPath);
    //
    // let handle = null;
    // let nextProcess = null;
    // const proxy = httpProxy.createProxyServer();
    //
    // const hasStandalone = fs.existsSync(standalonePath);
    // const hasNextBuild = fs.existsSync(nextBuildPath);
    //
    // if (hasStandalone) {
    //     // ✅ Run standalone server in a separate process
    //     const NEXT_PORT = process.env.NEXT_PORT || 3000;
    //     try {
    //         nextProcess = child_process.fork(standalonePath, {
    //             stdio: 'inherit',
    //             env: {
    //                 ...process.env,
    //                 PORT: NEXT_PORT,
    //             }
    //         });
    //
    //         console.log('🚀 Standalone Next.js server launched on port', NEXT_PORT);
    //
    //         // Proxy handler to standalone server
    //         handle = (req, res) => {
    //             proxy.web(req, res, {target: `http://localhost:${NEXT_PORT}`});
    //         };
    //     } catch (err) {
    //         console.error('❌ Failed to start standalone server:', err);
    //     }
    //
    // } else if (hasNextBuild || process.env.NODE_ENV !== 'production') {
    //     // ✅ Fallback to normal dev or production Next.js
    //     try {
    //         const nextApp = next({
    //             dev: process.env.NODE_ENV !== 'production',
    //             dir: nextPath,
    //             customServer: true,
    //         });
    //
    //         await nextApp.prepare();
    //         handle = nextApp.getRequestHandler();
    //         console.log('✅ Next.js app prepared (non-standalone)');
    //     } catch (err) {
    //         console.error('❌ Failed to prepare Next.js app:', err);
    //     }
    // } else {
    //     console.warn('⚠️ No Next.js build or dev mode found — skipping Next.js setup.');
    // }


    let props = {};
    // }
    props = theProps;
    // console.log("==> BaseApp()", new Date());
    // console.log('base:', props['base'])

    if (!props["base"]) {
        props["base"] = "";
    }

    // console.log('base:', props['base'])
    if (!props["entity"]) {
        props["entity"] = [];
    }

    props["entity"].push(Action);
    props["entity"].push(Automation);
    props["entity"].push(Admin);
    props["entity"].push(Settings);
    props["entity"].push(Page);
    props["entity"].push(PostCategory);
    props["entity"].push(OrganisationRole);
    props["entity"].push(CourseCategory);
    props["entity"].push(QuestionCategory);
    props["entity"].push(ForumTag);
    props["entity"].push(ForumPost);
    props["entity"].push(ForumPostReply);
    props["entity"].push(ForumTopic);
    props["entity"].push(Game);
    props["entity"].push(GameRound);
    props["entity"].push(Question);
    props["entity"].push(TestCategory);
    props["entity"].push(Lesson);
    props["entity"].push(Course);
    props["entity"].push(MyCourse);
    props["entity"].push(MyWorkspace);
    props["entity"].push(Test);
    props["entity"].push(Menu);
    props["entity"].push(CustomerGroup);
    props["entity"].push(Customer);
    props["entity"].push(Post);
    props["entity"].push(Media);
    props["entity"].push(Notification);
    props["entity"].push(Template);
    props["entity"].push(Form);
    props["entity"].push(Entry);
    props["entity"].push(Task);
    props["entity"].push(Gateways);
    props["entity"].push(Request);
    props["entity"].push(Document);
    props["entity"].push(Note);
    props["entity"].push(Category);
    props["entity"].push(TestResult);
    props["entity"].push(Campaign);
    props["entity"].push(Link);
    //make routes standard
    // console.log('rules',rules);
    if (!props["front"]) {
        props["front"] = {routes: defaultFront};
    }
    if (!props["admin"]) {
        props["admin"] = {
            routes: defaultAdmin,
        };
    }

    if (!props["plugin"]) {
        props["plugin"] = [];
    }

    let app = express();
    // app.use((req, res, next) => {
    //     if (req.path.startsWith('/public_media') ||
    //         req.path.startsWith('/customer') ||
    //         req.path.startsWith('/theme') ||
    //         req.path.startsWith('/api') ||
    //         req.path.startsWith('/admin') ||
    //         req.path.startsWith('/_next') ||
    //         req.path.startsWith('/static')) {
    //         return next();
    //     }
    //
    //     if (handle) {
    //         return handle(req, res);
    //     } else {
    //         return next();
    //
    //     }
    // });
    // redirect /:page/ to /:page
    app.use((req, res, next) => {
        const path = req.path;
        // req.handle=handle(req, res);

        if (
            path.length > 1 &&
            req.method?.toLowerCase() === "get" &&
            !["/admin", "/admin/", "/app/"].includes(path) &&
            path.slice(-1) === "/"
        ) {
            const query = req.url.slice(path.length);
            const safePath = path.slice(0, -1).replace(/\/+/g, "/");
            res.redirect(301, safePath + query);
        } else {
            // console.log("here we go next...")
            next()
        }
        ;
    });

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.header("origin"));
        // res.json(props);
        req.props = props;
        next();
    });

    handlePlugins(props, app).then((fsl) => {
        console.log("handlePlugins resolved()");
        db(props, app).then((e) => {
            headerHandle(app)
            // .catch(e=>console.log("e",e));
            configHandle(express, app, props).catch(e => console.log("e", e));
            // props.global=global
            //   return

            if (theProps.server)
                theProps.server.forEach((serv) => {
                    // console.log("serv",serv)

                    serv(app).catch(e => console.log("e", e));

                });

            function translate_method_to_action(method) {
                let method_permission_mapping = {
                    'GET': 'read',
                    'POST': 'write',
                    'PUT': 'update',
                    'DELETE': 'delete',
                }
                return method_permission_mapping[method.toUpperCase()]

            }

            function whoIsThis(req) {
                if (!req.headers.role)
                    return 'guest';
                if (req.headers.role)
                    return req.headers.role;
            }

            function isPathAllowed(theRole, path, method) {
                let action = translate_method_to_action(method);
                if (!theRole || (theRole && !(path in theRole))) {
                    return false
                }
                let pathAccess = theRole[path];


                return (pathAccess.indexOf(action) > -1)
            }

            function isNumber(arg) {
                try {
                    if (typeof arg === 'bigint') return true
                    if (typeof arg === 'number') return arg * 0 === 0
                    if (typeof arg === 'string' && arg.trim() !== '') {
                        if (mongoose.isValidObjectId(arg)) return true
                        return Number.isFinite ? Number.isFinite(+arg) : isFinite(+arg)
                    }
                    return false

                } catch (e) {
                    console.log("e", e)
                    return false

                }
            }

            function makeTheStandardRoute(path) {
                // console.log("=>makeTheStandardRoute")
                let pathes = path.split("/")
                // console.log("pathes", pathes)
                for (let i = 0; i < pathes.length; i++) {
                    let p = pathes[i];
                    if (isNumber(p)) {
                        pathes[i] = '{param}'
                    }
                }
                if (pathes[(pathes?.length - 1)] == '') {
                    pathes.pop();
                }
                path = pathes.join("/")
                return path
            }

            function roleHasPermissions(role, path, method) {
                try {
                    let standardPath = makeTheStandardRoute(path)
                    console.log("standardPath", standardPath)
                    path = standardPath;
                    let EXCLUDED_PATHS = ['/theme']
                    if (EXCLUDED_PATHS.indexOf(path) > -1) {
                        return true;
                    }
                    let roles = {
                        "admin": {},
                        "customer": {},
                        "guest": {},
                        "agent": {
                            "/admin/settings/customerStatus": ["read"],
                            "/admin/customerGroup/{param}/{param}": ["read"],
                            "/admin/customer": ["write"],
                            "/admin/customer/{param}": ["read", "update"],
                            "/admin/order": ["write"],
                            "/admin/order/{param}": ["read", "update"],
                            "/admin/order/{param}/{param}": ["read"],
                            "/admin/product/searchWithBarcode": ["write"],
                            "/admin/product/{param}/{param}": ["read"],
                            "/admin/admin/{param}": ['read', 'update']
                        },
                    }
                    let theRole = roles[role];
                    let isPathAllowedBool = isPathAllowed(theRole, path, method)
                    return (theRole && isPathAllowedBool)
                } catch (e) {
                    console.log("e", e)
                }
            }

            app.use((req, res, next) => {
                const path = req.path;
                req.props = props;
                let role = whoIsThis(req);
                if (role === 'admin' || role === 'customer' || role === 'guest') {
                    return next();
                }
                try {
                    let roleHasPermissionsBool = roleHasPermissions(role, path, req?.method)
                    if (roleHasPermissionsBool) {
                        next();
                    } else {
                        return res.status(403).json({
                            success: false,
                            message: "You have to authorize",
                        });
                    }
                } catch (e) {
                    return res.status(403).json({
                        success: false,
                        error: e,
                        message: "You have to authorize",
                    });
                }
            });
            // app.all('*', (req, res) => {
            //     return handle(req, res);
            // });
            app.use(function (err, req, res, next) {
                // console.log('here....');
                if (req.busboy) {
                    req.pipe(req.busboy);

                    req.busboy.on(
                        "file",
                        function (fieldname, file, filename, encoding, mimetype) {
                            // ...
                            // console.log('on file app', mimetype,filename);

                            let fstream;
                            let name = (global.getFormattedTime() + filename).replace(
                                /\s/g,
                                ""
                            );

                            if (mimetype.includes("image")) {
                                // name+=".jpg"
                            }
                            if (mimetype.includes("video")) {
                                // name+="mp4";
                            }
                            let filePath = path.join(
                                __dirname,
                                "/public_media/customer/",
                                name
                            );
                            fstream = fs.createWriteStream(filePath);
                            file.pipe(fstream);
                            fstream.on("close", function () {
                                // console.log('Files saved');
                                let url = "customer/" + name;
                                let obj = [{name: name, url: url, type: mimetype}];
                                req.photo_all = obj;
                                next();
                            });
                        }
                    );
                } else {
                    next();
                }
            });
            // ssrHandle(app);
            let Page = mongoose.model("Page");
            let routes = props["front"].routes.reverse() || [];

            Page.find({}, function (err, pages) {
                if (pages)
                    pages.forEach((page) => {
                        // console.log("page", page)
                        if (page.path) {
                            if (page.path.indexOf("product-category") > -1) {
                                routes.push({
                                    path: page.path,
                                    method: "get",
                                    access: "customer_all",
                                    controller: (req, res, next) => {

                                        let obj = {};
                                        obj["slug"] = req.params._id;

                                        let Product = req.mongoose.model("Product");
                                        let ProductCategory = req.mongoose.model("ProductCategory");
                                        let Settings = req.mongoose.model("Settings");

                                        console.log("\n\nproduct-category: file index.mjs && line 339", obj);

                                        Settings.findOne({}, "header_last", function (err, hea) {
                                            // if (err) {
                                            //     return res.status(500).json({ success: false, error: err });
                                            // }

                                            ProductCategory.findOne(
                                                obj,
                                                "name metadescription metatitle excerpt thumbnail photos slug _id",
                                                function (err, productCategory) {
                                                    if (err || !productCategory) {
                                                        return res.status(404).json({success: false, error: err});
                                                    }

                                                    let img = productCategory.thumbnail || (productCategory.photos && productCategory.photos[0]) || "";

                                                    let categoryData = {
                                                        _id: productCategory._id,
                                                        image: img,
                                                        keywords: productCategory.keywords?.[req.headers.lan] || "",
                                                        metadescription: productCategory.metadescription?.[req.headers.lan] || "",
                                                        name: productCategory.name?.[req.headers.lan] || "",
                                                        productCategory_name: productCategory.name?.[req.headers.lan] || "",
                                                        description: productCategory.description?.[req.headers.lan] || "",
                                                        slug: productCategory.slug || "",
                                                        labels: productCategory.labels || "",
                                                    };

                                                    let mainTitle = productCategory.metatitle?.[req.headers.lan] || categoryData.name;

                                                    console.log("categoryData.metadescription", categoryData.metadescription);

                                                    // Fetch paginated products based on offset and limit
                                                    let offset = parseInt(req.query.offset) || 0;
                                                    let limit = parseInt(req.query.limit) || 10;

                                                    Product.find({category: productCategory._id})
                                                        .skip(offset)
                                                        .limit(limit)
                                                        .lean()
                                                        .exec(function (err, products) {
                                                            // if (err) {
                                                            //     return res.status(500).json({
                                                            //         success: false,
                                                            //         error: err
                                                            //     });
                                                            // }

                                                            res.ssrParse().then((body) => {
                                                                if (mainTitle) {
                                                                    body = body.replace("</head>", `<title>${mainTitle}</title></head>`);
                                                                }
                                                                if (categoryData.metadescription) {
                                                                    body = body.replace(
                                                                        "</head>",
                                                                        `<meta name="description" content="${categoryData.metadescription}" /></head>`
                                                                    );
                                                                }
                                                                if (categoryData._id) {
                                                                    body = body.replace(
                                                                        "</head>",
                                                                        `<meta name="productCategory_id" content="${categoryData._id}" /></head>`
                                                                    );
                                                                }
                                                                if (categoryData.name) {
                                                                    body = body.replace(
                                                                        "</head>",
                                                                        `<meta name="productCategory_name" content="${categoryData.name}" /></head>`
                                                                    );
                                                                }
                                                                if (categoryData.image) {
                                                                    body = body.replace(
                                                                        "</head>",
                                                                        `<meta name="productCategory_image" content="/${categoryData.image}" /></head>`
                                                                    );
                                                                }

                                                                // Generate schema for structured data
                                                                let schema_obj = {
                                                                    "@context": "https://schema.org/",
                                                                    "@type": "CollectionPage", // Correct type for product category page
                                                                    "name": mainTitle,
                                                                    "image": categoryData.image ? `${process.env.SHOP_URL}${categoryData.image}` : undefined,
                                                                    "description": categoryData.metadescription || undefined,
                                                                    "url": `${process.env.SHOP_URL}product-category/${req.params._id}`,
                                                                    "mainEntity": {
                                                                        "@type": "ItemList",
                                                                        "name": `${mainTitle} Products`,
                                                                        "itemListElement": products
                                                                            .filter(product => product?.title?.fa && product?.slug) // Ensure each product has a name and slug
                                                                            .map(product => {
                                                                                // let currentDate = new Date();
                                                                                // currentDate.setDate(currentDate.getDate() + 7);
                                                                                // let validUntilDate = currentDate.toISOString().split('T')[0];
                                                                                let p_img = product.thumbnail || (product.photos && product.photos[0]) || "";
                                                                                let p_obj = {
                                                                                    "@type": "Product",
                                                                                    "name": product?.title?.fa,
                                                                                    "url": `${process.env.SHOP_URL}product/${product.slug}`,
                                                                                    "offers": {
                                                                                        "@type": "Offer",
                                                                                        "priceCurrency": "IRR", // Define the currency for the price
                                                                                        "price": product.price || 0,
                                                                                        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",  // Correct URL for availability
                                                                                        // "priceValidUntil": validUntilDate
                                                                                    }
                                                                                };


                                                                                if (p_img) {
                                                                                    p_obj['image'] = `${process.env.SHOP_URL}${p_img}`;
                                                                                }
                                                                                if (product.sku) {
                                                                                    p_obj['sku'] = product.sku;
                                                                                }

                                                                                return p_obj;
                                                                            })
                                                                    }
                                                                };

                                                                // Convert schema object to string
                                                                schema_obj = JSON.stringify(schema_obj);

                                                                // Inject canonical link and schema into the page body
                                                                body = body
                                                                    .replace("</head>", `<link rel="canonical" href="${process.env.SHOP_URL}product-category/${req.params._id}" /></head>`)
                                                                    .replace("</head>", `<script type="application/ld+json">${schema_obj}</script></head>`);

                                                                // Add custom header if it exists
                                                                if (hea?.header_last) {
                                                                    body = body.replace("</head>", hea.header_last + "</head>");
                                                                }

                                                                // Send the final response
                                                                res.status(200).send(body);
                                                            });
                                                        });
                                                }
                                            ).lean();
                                        });

                                    },

                                    layout: "DefaultLayout",
                                    element: "DynamicPage",
                                    elements: page.elements || [],
                                });
                            } else
                                routes.push({
                                    path: page.path,
                                    method: "get",
                                    access: "customer_all",
                                    controller: (req, res, next) => {
                                        console.log("show front, go visit ", process.env.SHOP_URL);
                                        res.show();
                                    },

                                    layout: "DefaultLayout",
                                    element: "DynamicPage",
                                    elements: page.elements || [],
                                });
                        }
                    });

                props["front"].routes = routes.reverse();

                // console.log('routes', props['front'].routes.reverse())
                // props['front'].routes=[...props['front'].routes,...routes]
                initScheduledJobs(props);
                props.handle = handle

                routeHandle(app, props);
            });
            // app.set("view engine", "pug");
            //         console.log('return app in BaseApp()')
        }).catch(e => {
            console.log("db error at app/index.mjs line 399", e)
        });
    });

// app.get("/", (req, res, next) => {
//     console.log('#r home /')
//     next();
// });
    // Kill child process on exit
    // process.on('exit', () => {
    //     if (nextProcess) nextProcess.kill();
    // });
    return app;
}
