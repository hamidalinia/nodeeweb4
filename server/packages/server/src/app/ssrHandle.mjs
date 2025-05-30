console.log("#f ssrHandle");

import path from "path";
import isbot from "isbot";
import fs from "fs";
import "ignore-styles";
import * as ReactDOMServer from "react-dom/server";
import * as React from "react";
import AppSSR from "#c/dist/AppSSR.js";  // Path to transpiled file
import routes from "#c/dist/ssrRoutes.js";
import * as StoreModule from "#c/dist/functions/store.js"; // Updated path
import {

    matchPath
} from "react-router-dom";
// import { matchPath } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server.js"; // Fixed import
// import AppSSR from "#c/AppSSR.mjs";
// import routes from "#c/ssrRoutes.js";
import { Provider } from "react-redux";
// import store, { persistor } from "#c/functions/store.js";
import config from "#c/src/config.js";
// import { the_public_route } from "#routes/public/p";

const ssrHandle = (app) => {
    const persistor=StoreModule.persistor
    const store=StoreModule.store
    console.log("persistor",StoreModule.persistor)
    const vars = config;
    if (vars.BASE_URL) {
        console.log("base url found");

        const ssrRoutes = [
            "/",
            "/p/:_id/:title",
            "/post/:_id/:title",
            "/page/:_id/:title",
            "/:_firstCategory/:_id"
        ];

        ssrRoutes.forEach(route => {
            app.get(route, (req, res, next) => {
                console.log(`Handling route: ${route}`);
                ssrParse(req, res, next);
            });
        });
    } else {
        console.log("base url NOT found, we should go through wizard...");
        app.get("/", (req, res) => {
            return res.json({ error: "app is not installed!" });
        });
    }
};

const ssrParse = (req, res, next) => {
    const ua = req.get("user-agent");
    if (!req.headers.lan) req.headers.lan = "fa";
    console.log("==> ssrParse()");

    if (isbot(ua)) {
        console.log("Bot detected, performing SSR...");
        console.log("BOT => ", ua);

        const filePath = path.resolve("./build/index.html");
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading index.html:", err);
                return res.status(500).send("An error occurred");
            }

            const context = {};
            const dispatchPromises = [];

            // Find matching routes and collect data requirements
            routes
                .filter(route => matchPath(route.path, req.url)) // Fixed to use route.path
                .forEach(route => {
                    if (req.params._firstCategory && req.params._id) {
                        const param = req.params._id;
                        if (route.server) {
                            if (Array.isArray(route.server)) {
                                route.server.forEach(s => {
                                    if (s.func) {
                                        dispatchPromises.push(store.dispatch(s.func(param)));
                                    }
                                });
                            } else if (typeof route.server === 'function') {
                                dispatchPromises.push(store.dispatch(route.server(param)));
                            }
                        }
                    }
                });

            Promise.all(dispatchPromises)
                .then(() => {
                    // Create React elements without JSX
                    const appElement = React.createElement(
                        Provider,
                        { store: store },
                        React.createElement(
                            StaticRouter,
                            { context: context, location: req.url },
                            React.createElement(AppSSR, { url: req.url })
                        )
                    );

                    const renderedData = ReactDOMServer.renderToString(appElement);

                    // Replace root element with rendered content
                    const modifiedHtml = data.replace(
                        '<div id="root"></div>',
                        `<div id="root">${renderedData}</div>`
                    );

                    res.locals.renderedData = renderedData;
                    res.locals.body = modifiedHtml;
                    next();
                })
                .catch(e => {
                    console.error("Error in SSR data fetching:", e);
                    next();
                });
        });
    } else {
        console.log("Not a bot, skipping SSR");
        next();
    }
};

export default ssrHandle;