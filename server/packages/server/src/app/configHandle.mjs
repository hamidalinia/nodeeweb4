import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import logger from "morgan";
import busboy from "connect-busboy";
import path from "path";
import _forEach from "lodash/forEach.js";
import {createPublicRoute} from "#routes/index";
import expressSitemapXml from "express-sitemap-xml";
import siteMapHandle from "#root/app/siteMapHandle";

const __dirname = path.resolve();
// const viewsFolder = path.join(__dirname, "./src/views");
// const publicFolder = path.join(__dirname, "./public");

const assetsFolder = path.join(__dirname, "./src/client/assets/img");
const public_mediaFolder = path.join(__dirname, "./public_media");
const adminFolder = path.join(__dirname, "./admin");
const themeFolder = path.join(__dirname, "./theme");

// const adminFolder = path.join(__dirname, "./admin");

let configHandle = async (express, app, props = {}) => {
    console.log("configHandle===>")

    await app.disable("x-powered-by");
    await app.use(logger("dev"));
    await siteMapHandle(express, app, props);
    await app.use(expressSitemapXml(getUrls, process.env.BASE_URL));

    async function getUrls() {
        let g = [];
        let exclude_list = ['Campaign','Comment','Note','CourseCategory','QuestionCategory','Question']
        for (var i = 0; i < props.entity.length; i++) {
            if (props.entity[i].sitemap) {

                console.log("modelName:", props.entity[i].modelName)
                let Model = mongoose.model(props.entity[i].modelName);
                await allAsXml(Model).then(async (d) => {
                    // console.log("d",d)
                    g = [...g, ...d];
                });
            }
        }

        // await console.log("x", g);
        return await g;
    }

    // const adminFolder = path.join(__dirname, props.base, "./admin");
    // const themeFolder = path.join(__dirname, props.base, "./theme");

    app.use(express.json({limit: "50mb"}));
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use(busboy());
    app.use(express.static(public_mediaFolder, {maxage: "1y"}));

    path.adminFolder = adminFolder;
    path.themeFolder = themeFolder;
    const nextPath=path.resolve(__dirname, '../next');

    app.use("/_next", express.static(path.join(nextPath, '.next')));
    app.use("/site_setting", express.static(themeFolder + "/site_setting"));
    app.use("/static", express.static(themeFolder + "/static"));
    // app.use('/', express.static(themeFolder));
    // app.use('/', express.static(themeFolder , {index:'/robots.txt'}));
    app.use("/admin", express.static(adminFolder));
    // }
    // // let R = createPublicRoute('/admin')
    // if(props.admin) {
    //
    //     let adminFolder  = path.join(__dirname, props.base, "./admin");
    //     path.adminFolder=adminFolder;
    //

    //     app.use(express.static(adminFolder, {index: ['index.html']}));
    // }
    // app.set("view engine", "pug");
    // app.use(express.static(assetsFolder));
};
export const allAsXml = async function (Model) {
    // {
    //     url: "/",
    //         lastMod: new Date(),
    //     changefreq: "hourly",
    // },
    let XTL = [],
        offset = 0,
        search = {};
    return new Promise(async function (resolve, reject) {
        search["status"] = "published";

        Model.find({}, "_id slug updatedAt", function (err, posts) {
            if (err || !posts.length) {
                return resolve(XTL);
            }

            _forEach(posts, (p) => {
                let the_base = "/" + Model.modelName.toLowerCase();
                if ("page" == Model.modelName.toLowerCase()) the_base = "";
                if ("productcategory" == Model.modelName.toLowerCase()) the_base = "/product-category";


                XTL.push({
                    url: the_base + "/" + p.slug,
                    lastMod: p.updatedAt,
                    id: p._id,
                    changefreq: "hourly",
                });
                console.log("posts.length + 1 === XTL.length", posts.length + 1, XTL.length)
                if (posts.length === XTL.length) {
                    resolve(XTL);
                }
            });
        })
            .skip(offset)
            .sort({_id: -1});
        // resolve(XTL)
    });
};
export const allAsXmlRules = async function (Model, slug = null) {
    let f = [],
        counter = 0;
    let XTL = [],
        offset = 0,
        search = {};
    return new Promise(async function (resolve, reject) {
        search["status"] = "published";
        Model.find(
            {},
            "_id slug updatedAt thumbnail photos status",
            function (err, posts) {
                if (err || !posts.length) {
                    return resolve(XTL);
                }

                _forEach(posts, (p) => {
                    counter++;
                    if (f.indexOf(p.slug) > -1) {
                        //founded
                    } else {
                        f.push(p.slug);
                        let gy = "/" + (slug ? slug : Model.modelName.toLowerCase());

                        if (slug == "page") {
                            gy = "";
                        }

                        let tobj = {
                            id: p._id,
                            url: gy + "/" + p.slug,
                            lastMod: p.updatedAt,
                            changefreq: "hourly",
                        };
                        if (p.photos && p.photos[0]) {
                            tobj["image:image"] = p.photos[0];
                        }
                        if (p.thumbnail) {
                            tobj["image:image"] = p.thumbnail;
                        }
                        XTL.push(tobj);

                        if (posts.length === counter) {
                            resolve(XTL);
                        }
                    }
                });
            }
        )
            .skip(offset)
            .sort({_id: -1});
    });
};

export default configHandle;
