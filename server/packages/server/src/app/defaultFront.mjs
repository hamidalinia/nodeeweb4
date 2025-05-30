// console.log("#f index.mjs", new Date());
import "ignore-styles";
import _forEach from "lodash/forEach.js";
import _get from "lodash/get.js";
import {format as DateFormat} from "date-fns";

import global from "#root/global";

const addMetaTags = (body, data) => {
    // default values
    console.log('addMetaTags', data);
    const obj = {
        image: "",
        logo: `${process.env.SHOP_URL}site_setting/logo.png`,
        site_name: "",
        site_phone: "",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: "Persian",
        ...data,
    };

    body = body
    // title
        .replace("</head>", `<title>${obj.title}</title></head>`)
        // description
        .replace(
            "</head>",
            `<meta name="description" content="${obj.description}" /></head>`
        )
        // keywords
        .replace(
            "</head>",
            `<meta name="keywords" content="${obj.keywords}"/></head>`
        )
        // canonical
        .replace("</head>", `<link rel="canonical" href="${obj.url}" /></head>`)

        // og
        .replace(
            "</head>",
            `<meta property="og:title" content="${obj.title}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="og:description" content="${obj.description}" /></head>`
        )
        .replace("</head>", `<meta property="og:type" content="website" /></head>`)
        .replace(
            "</head>",
            `<meta property="og:image" content="${obj.image}" /></head>`
        )
        .replace("</head>", `<meta name="og:image:width" content="1200" /></head>`)
        .replace("</head>", `<meta name="og:image:height" content="675" /></head>`)
        .replace(
            "</head>",
            `<meta property="og:image:secure_url" content="${obj.image}" /></head>`
        )
        .replace("</head>", `<meta property="og:locale" content="fa_IR" /></head>`)

        .replace(
            "</head>",
            `<meta property="og:url" content="${obj.url}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="og:site_name" content="${obj.site_name}" /></head>`
        )

        // twitter
        .replace(
            "</head>",
            '<meta property="twitter:card" content="summary_large_image" /></head>'
        )
        .replace(
            "</head>",
            `<meta property="twitter:site" content="@" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="twitter:title" content="${obj.title}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="twitter:description" content="${obj.description}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="twitter:image" content="${obj.image}" /></head>`
        )

        // schema
        .replace(
            "</head>",
            `<script type="application/ld+json">{"@context": "https://schema.org","@type": "Organization","name": "${obj.site_name}", "url": "${obj.url}", "logo": "${obj.logo}", "contactPoint": {"@type": "ContactPoint", "telephone": "${obj.site_phone}", "contactType": "customer service", "areaServed": "IR", "availableLanguage": "Persian", "sameAs": ["", "https://t.me/", "https://www.aparat.com/", "https://www.linkedin.com/company/", "https://www.pinterest.com/"]}}</script>` +
            "</head>"
        );

    if (obj.date)
        body = body.replace(
            "</head>",
            `<meta property="article:published_time" content="${DateFormat(
                obj.date,
                "yyyy-MM-dd'T'HH:mm:ss+00:00"
            )}" /></head>`
        );
    if (obj.header_last)
        body = body.replace("</head>", `${obj.header_last}</head>`);
    if (obj.body_first) body = body.replace("<body>", `<body>${obj.body_first}`);

    if (obj.availability)
        body = body.replace(
            "</head>",
            `<meta name="availability" content="${obj.availability || ""}" /></head>`
        );

    return body;
};

export default [
    {
        path: "/",
        method: "get",
        access: "customer_all",
        controller: async (req, res, next) => {
            // console.log("req.handle()",req.handle(req,res))
            // app.all('*', (req, res) => {
            //     return handle(req, res);
            // });
            const Settings = req.mongoose.model("Settings");
            const Page = req.mongoose.model("Page");
            try {
                const data = await Settings.findOne(
                    {},
                    "title header_last body_first description factore_shop_name factore_shop_phoneNumber keywords createdAt",
                );
                const page = await Page.findOne(
                    {slug: "home"},
                    "keywords",
                );
                // console.log('data', data)
                // console.log('page', page)
                const {lan} = req.headers;
                const obj = {
                    site_name: data.factore_shop_name,
                    site_phone: data.factore_shop_phoneNumber || "",
                    image: `${process.env.SHOP_URL}site_setting/logo.png`,
                    keywords: page?.keywords ? _get(page, `keywords.${lan}`, "") : _get(data, `keywords.${lan}`, ""),
                    description: _get(data, `description.${lan}`, ""),
                    url: process.env.SHOP_URL,
                    logo: `${process.env.SHOP_URL}site_setting/logo.png`,
                    title: _get(data, `title.${lan}`, ""),
                    header_last: data.header_last,
                    body_first: data.body_first,
                    date: data.createdAt,
                };

                res.ssrParse().then((body) => {
                    const newBody = addMetaTags(body, obj);
                    res.status(200).send(newBody);
                });
            } catch (e) {
                // res.status(200).send(newBody);
                res.ssrParse().then((body) => {
                    // const newBody = addMetaTags(body, obj);
                    res.status(200).send(body);
                });
                console.log('e', e)
            }

        },
    },
    {
        path: "/login",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            let Settings = req.mongoose.model("Settings");

            Settings.findOne({}, "header_last", function (err, hea) {

                res.ssrParse().then((body) => {

                    body = body.replace(
                        "</head>",
                        hea && hea.header_last ? hea.header_last : "" + `</head>`
                    );

                    res.status(200).send(body);
                });
            });

        },
    },
    {
        path: "/l/:id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show l, go visit ", req.params.id);
            const Link = req.mongoose.model("Link");
            Link.findOne(
                {
                    from: req.params.id
                },
                function (err, data = {}) {
                    console.log('data', data);
                    if (data?.to) {
                        return res.redirect(parseInt(data?.status), data?.to);
                    }
                })

        },
    },
    {
        path: "/cm/:id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show l, go visit ", req.params.id);
            const Campaign = req.mongoose.model("Campaign");
            const Customer = req.mongoose.model("Customer");
            let slug = req?.params?.id;
            if (slug.indexOf('-') !== -1) {
                let split = slug.split('-');
                let customer_token = split[1];
                let campaignSlug = split[0];
                Campaign.findOneAndUpdate(
                    {
                        slug: campaignSlug
                    },
                    {
                        "$inc": {
                            viewsCount: 1
                        }
                    },
                    function (err, campaign = {}) {

                        Customer.findOneAndUpdate(
                            {
                                "campaign.token": customer_token
                            },
                            {
                                "campaign.$.status": "visited"
                            },
                            function (err, customer = {}) {
                                console.log('customer updated!')
                                if (customer && customer.campaign) {
                                    if (campaign?.link) {
                                        return res.redirect(302, campaign?.link);
                                    }

                                }

                            }).lean()
                    })

            } else {
                Campaign.findOne(
                    {
                        slug: req.params.id
                    },
                    function (err, data = {}) {
                        console.log('data', data);
                        if (data?.link) {
                            return res.redirect(302, data?.link);
                        }
                    })

            }
        },
    },
    {
        path: "/checkout",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/login/:_action",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/page/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/category/:_slug/:_slug2",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(". we need to redirect");
            res.redirect("/product-category/" + req.params._slug2);
        },
    },
    {
        path: "/course/study/:_id/",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show course");

            res.show();
        },
    },
    {
        path: "/course/study/:_id/:_lesson",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show course lesson");

            res.show();
        },
    },
    {
        path: "/game/:gameId/round/:roundId",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show game");
            res.show();
        },
    },
    {
        path: "/game/:gameId/round/:roundId/level/:level",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(". we need to redirect");
            res.show();
        },
    },
    {
        path: "/p/:_slug/:_slug2",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(". we need to redirect");
            res.redirect("/product/" + req.params._slug2);
        },
    },
    {
        path: "/p/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /p/:_id, /defaultFront.mjs line: 230 ",
                process.env.SHOP_URL
            );
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {
            //     obj["slug"] = req.params._slug;
            //
            // }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                // delete obj["slug"];
            }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            // console.log('obj', obj)
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || "",
                            product_old_price: product_old_price || "",
                            availability: in_stock || "",
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] ||
                                product["metadescription"];
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["description"];
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle && product.metatitle[req.headers.lan]) {
                            mainTitle = product.metatitle[req.headers.lan];
                        }
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${product.slug}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.description}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="." /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product/:_id/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "\n\n\nshow /product/:_id/:_slug, /defaultFront.mjs line: 66 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;
            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                delete obj["slug"];
            }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            console.log("obj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || "",
                            product_old_price: product_old_price || "",
                            availability: in_stock || "",
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] ||
                                product["metadescription"];
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["description"];
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle;
                        }
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._id}/${req.params._slug}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="/${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.description}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="." /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /product/:_slug, /defaultFront.mjs line: 230 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};

            obj["slug"] = req.params._slug;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] || "";
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                            B;
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["metadescription"] || "";
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle[req.headers.lan]
                                ? product.metatitle[req.headers.lan]
                                : obj.title;
                        }
                        console.log("obj.metadescription", obj.metadescription);
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._slug}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${req.params._slug}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2024-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product-category/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /product-category/:_slug, /defaultFront.mjs line: 1094 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            // let obj = {};

            // obj["slug"] = req.params._slug;

            function isValidObjectId(value) {
                return req.mongoose.Types.ObjectId.isValid(value);
            }
            let obj = isValidObjectId(req.params._slug)
                ? { _id: req.params._slug }
                : { slug: req.params._slug };

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let ProductCategory = req.mongoose.model("ProductCategory");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nmain obj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                ProductCategory.findOne(
                    obj,
                    function (err, productCategory) {
                        if (err) {
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });
                        }

                        if (!productCategory) return res.status(404).json({ success: false });

                        // Image fallback logic
                        let img = "";
                        if (productCategory.thumbnail) {
                            img = productCategory.thumbnail;
                        } else if (productCategory.photos && productCategory.photos[0]) {
                            img = productCategory.photos[0];
                        }

                        // Prepare metadata object
                        const lang = req.headers.lan;
                        const obj = {
                            _id: productCategory._id,
                            image: img,
                            keywords: productCategory.keywords?.[lang] || productCategory.keywords || "",
                            metadescription: productCategory.metadescription?.[lang] || "",
                            name: productCategory.name?.[lang] || productCategory.name || "",
                            description: productCategory.description?.[lang] || productCategory.description || "",
                            slug: productCategory.slug || "",
                            product_price: productCategory.product_price || "0", // fallback if needed
                        };

                        // Define mainTitle (priority to metatitle, fallback to name)
                        const mainTitle = productCategory.metatitle?.[lang] || obj.name || "Product Category";

                        res.ssrParse().then((body) => {
                            const fullImageUrl = `${process.env.SHOP_URL}${obj.image}`;
                            const canonicalUrl = `${process.env.SHOP_URL}product/${obj.slug}`;

                            const metaTags = `
            <title>${mainTitle}</title>
            <meta name="description" content="${obj.metadescription}" />
            <meta name="product_category_id" content="${obj._id}" />
            <meta name="product_category_name" content="${obj.name}" />
            <meta name="product_image" content="${fullImageUrl}" />
            <meta name="image" content="${fullImageUrl}" />
            <link rel="canonical" href="${canonicalUrl}" />
            <meta property="og:image" content="${fullImageUrl}" />
            <meta property="og:image:secure_url" content="${fullImageUrl}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="675" />
            <meta property="og:locale" content="fa_IR" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="${mainTitle}" />
            <meta property="og:description" content="${obj.metadescription}" />
            <meta property="og:url" content="${canonicalUrl}/" />
            <meta name="twitter:image" content="${fullImageUrl}" />
            <script type="application/ld+json">
            {
                "@context": "https://schema.org/",
                "@type": "CollectionPage",
                "name": "${mainTitle}",
                "description": "${obj.metadescription}",
                "url": "${canonicalUrl}",
                "image": "${fullImageUrl}"
            }
            </script>
        `;

                            body = body.replace("</head>", metaTags + (hea?.header_last || "") + "</head>");
                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /product/:_id, /defaultFront.mjs line: 1060 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._id;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] || "";
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["metadescription"] || "";
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle[req.headers.lan]
                                ? product.metatitle[req.headers.lan]
                                : obj.title;
                        }
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${product["slug"]}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="${process.env.SHOP_URL}product/${product["slug"]}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            // console.log("obj.metadescription", obj.metadescription);

                            body = body.replace(
                                "</head>",
                                `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${product["slug"]}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2025-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/user/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /user/:_id, /defaultFront.mjs line: 1316 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._id;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Customer = req.mongoose.model("Customer");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Customer.findOne(
                    obj,
                    "photos firstName lastName _id active",
                    function (err, customer) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!customer) return res.status(404).json({success: false});
                        res.ssrParse().then((body) => {


                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/test/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /forum-post/:_id, /defaultFront.mjs line: 1373 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._id;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Test = req.mongoose.model("Test");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Test.findOne(
                    obj,
                    function (err, test) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!test) return res.status(404).json({success: false});
                        res.ssrParse().then((body) => {


                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/forum-post/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /forum-post/:_id, /defaultFront.mjs line: 1572 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._id;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let ForumPost = req.mongoose.model("ForumPost");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                ForumPost.findOne(
                    obj,
                    function (err, forumPost) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!forumPost) return res.status(404).json({success: false});
                        res.ssrParse().then((body) => {


                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/course/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /course/:_id, /defaultFront.mjs line: 1485 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._id;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Course = req.mongoose.model("Course");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Course.findOne(
                    obj,
                    function (err, course) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!course) return res.status(404).json({success: false});
                        res.ssrParse().then((body) => {

                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/add/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /add/:_slug, /defaultFront.mjs line: 941 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._slug;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Add = req.mongoose.model("Add");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Add.findOne(
                    obj,
                    "title metadescription description metatitle excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];

                        delete product.data;
                        delete product.transaction;
                        console.log(" add", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }
                        if (!img) {
                            img = product.photos[0];
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] || "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] || "";
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        console.log('obj["metadescription"]', obj["metadescription"]);
                        console.log('obj["description"]', obj["description"]);
                        if (!obj["metadescription"]) {
                            obj["metadescription"] = obj["description"];
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["metadescription"] || "";
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle[req.headers.lan]
                                ? product.metatitle[req.headers.lan]
                                : obj.title;
                        }
                        console.log("obj.metadescription", obj.metadescription);
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._slug}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${req.params._slug}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2024-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },

    {
        path: "/post/:_id/:_slug",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/post/:_slug",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            let query = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                query["_id"] = req.params._slug;
            } else {
                query["slug"] = req.params._slug;
            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                query["_id"] = req.params._id;
                delete query["slug"];
            }
            const Post = req.mongoose.model("Post");
            const Settings = req.mongoose.model("Settings");

            Settings.findOne(
                {},
                "header_last factore_shop_name factore_shop_phoneNumber",
                function (err, setting) {
                    Post.findOne(
                        query,
                        "title description metadescription metatitle keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id createdAt updatedAt",
                        function (err, data) {
                            if (err)
                                return res.status(503).json({
                                    success: false,
                                    message: "error!",
                                    err: err,
                                });

                            if (!data) return res.status(404).json({success: false});

                            const {lan} = req.headers;
                            const obj = {
                                _id: data._id,
                                image: `${process.env.SHOP_URL}/site_setting/logo.png`,
                                keywords: _get(data, `keywords.${lan}`, ""),
                                slug: data.slug,
                                description: _get(data, `metadescription.${lan}`, ""),
                                title:
                                _get(data, `metatitle.${lan}`, "") ||
                                _get(data, `title.${lan}`, ""),
                                url: `${process.env.SHOP_URL}post/${req.params._slug}`,
                                date: data.createdAt,
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                site_name: setting.factore_shop_name,
                                site_phone: setting.factore_shop_phoneNumber,
                                header_last: setting.header_last,
                            };
                            if (data.photos && data.photos[0]) {
                                obj.image = `${process.env.SHOP_URL}${data.photos[0]}`;
                            }
                            if (data.thumbnail) {
                                obj.image = `${process.env.SHOP_URL}${data.thumbnail}`;
                            }
                            if (data.keywords) {
                                obj.keywords = data.keywords[lan] || data.keywords;
                            }
                            if (data.metadescription) {
                                obj.description = data.metadescription[lan] || "";
                            }
                            if (data.metatitle) {
                                obj.title = data.metatitle[lan] || "";
                            }

                            res.ssrParse().then((body) => {
                                let newBody = addMetaTags(body, obj);
                                newBody = newBody.replace(
                                    "</head>",
                                    `<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "BlogPosting", "mainEntityOfPage": { "@type": "WebPage", "@id": "${
                                        obj.url
                                        }" }, "headline": "${obj.title}", "description": "${
                                        obj.description
                                        }", "image": "${obj.image}", "datePublished": "${DateFormat(
                                        obj.createdAt,
                                        "yyyy-MM-dd'T'HH:mm:ss+00:00"
                                    )}", "dateModified": "${DateFormat(
                                        obj.updatedAt,
                                        "yyyy-MM-dd'T'HH:mm:ss+00:00"
                                    )}" }</script></head>`
                                );

                                res.status(200).send(newBody);
                            });
                        }
                    ).lean();
                }
            );
        },
    },
    {
        path: "/chat",
        method: "get",
        access: "admin_user,admin_shopManager,customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/transaction/:method",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },  {
        path: "/transaction/:method",
        method: "post",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("req.body",req?.body);
            let Transaction = req.mongoose.model("Transaction");
            let Order = req.mongoose.model("Order");

            if(req?.body?.Token){
                Transaction.findOne({'Authority':req.body.Token},function (err,transaction) {
                    if(err){
                        console.log('err',err)
                    }
                    if(transaction){
                        let obj={}
                        obj['TerminalId']=req.body.TerminalId;

                        if(req?.body?.HashedCardNumber){
                            obj['cardNumber']=req.body.HashedCardNumber;
                        }
                        if(req?.body?.State){
                            obj['reason']=req.body.State;
                        }
                        if(req?.body?.State && req?.body?.State=='CanceledByUser'){
                            obj['statusCode']='3';
                        }
                        if(req?.body?.State && req?.body?.State=='OK' && req?.body?.Status=='2' && req?.body?.RefNum){
                            obj['statusCode']='1';
                            obj['status']=true;

                        }
                        if(req?.body?.Status){
                            obj['Status']=req.body.Status;
                        }
                        if(req?.body?.RefNum){
                            obj['RefID']=req.body.RefNum;
                        }
                        // if(transaction?.orderNumber){
                        //     obj['orderNumber']=transaction?.orderNumber;
                        // }
                        Transaction.findByIdAndUpdate(transaction?._id,{
                            $set:obj
                        },function (err,updatedTransaction) {
                            if(err){
                                console.log('err',err)
                            }
                            if(updatedTransaction){
                                console.log('updatedTransaction',updatedTransaction)
                                if(req?.body?.State && req?.body?.State=='OK' && req?.body?.Status=='2' && req?.body?.RefNum){
                                    let getToken = {
                                        'method': 'POST',
                                        'headers': { 'Content-Type': 'application/json' },
                                        'url': 'https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction',
                                        'data': {
                                            'TerminalNumber': req.body.TerminalId,
                                            'RefNum': req?.body?.RefNum
                                        },
                                        'json': true,
                                    };

                                    req.httpRequest(getToken).then(function(parsedBody) {
                                        Order.findByIdAndUpdate(transaction?.order?._id,{
                                            $set:{
                                                updatedAt:new Date(),
                                                paid:true,
                                                paymentStatus:'paid',
                                                status:'processing',
                                            }
                                        },function (err,updatedOrder) {
                                            console.log("parsedBody at updating transaction", parsedBody['data'])
                                            return res.redirect('/transaction/saman/?Status=OK&method=saman&orderNumber=' + transaction?.order?.orderNumber);
                                        })
                                    })
                                }else{
                                    Order.findByIdAndUpdate(transaction?.order?._id,{
                                        $set:{
                                            updatedAt:new Date(),
                                            paid:false,
                                            paymentStatus:'unsuccessful',
                                            status:'processing',
                                        }
                                    },function (err,updatedOrder) {
                                        return res.redirect('/transaction/saman/?Status=NOK&method=saman&orderNumber=' + transaction?.order?.orderNumber);
                                    })
                                }
                            }

                        })
                    }

                }).populate("order","orderNumber")
            }else {
                // console.log("req.query",req.query);
                // res.show();
                // orderObject['paymentStatus'] = 'unsuccessful';

                return res.redirect('/transaction/saman/?Status=NOK');

            }
        },
    },
    {
        path: "/order-details/:id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/transaction",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/theme",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            global.theme("admin", req, res, next);
        },
    },
    {
        path: "/robots.txt",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            global.getRobots(req, res, next);
        },
    },
    {
        path: "/admin",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: (req, res, next) => {
            return res.admin();
        },
    },
    {
        path: "/admin/theme",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: (req, res, next) => {
            global.theme("admin", req, res, next);
        },
    },
    {
        path: "/admin/:model",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            if (req.headers.response != "json") return res.admin();
        },
    },
    {
        path: "/profile",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/my-orders",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show here line 1457");

            const obj = {};  // This will hold the query parameters
            // console.log("req.params._slug", req.params._slug);
            // console.log("req.params._id", req.params._id);

            // Check if the _slug is a valid ObjectId (24 characters, hex format)
            const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

            // If _slug looks like an ObjectId, treat it as such; otherwise, treat it as a slug
            if (isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;
            }

            // If _id is provided and valid, override the previous value of _id or slug
            if (req.params._id && isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;  // Use the provided _id
                delete obj["slug"];  // If we have a valid _id, remove the slug
            }

            // console.log("obj", obj);  // To confirm the content of the query object

            // Proceed with the query
            const Page = req.mongoose.model("Page");
            const Settings = req.mongoose.model("Settings");

            // Fetch header_last from Settings and Page data
            Settings.findOne({}, "header_last", function (err, hea) {
                if (err) return res.status(503).json({success: false, message: "error!", err: err});

                Page.findOne(
                    obj,
                    "metatitle metadescription keywords thumbnail photos slug _id createdAt",
                    function (err, data) {
                        if (err) return res.status(503).json({success: false, message: "error!", err: err});

                        if (!data) return res.status(404).json({success: false});

                        // Prepare response object
                        const {lan} = req.headers;
                        const responseObj = {
                            _id: data._id,
                            image: `${process.env.SHOP_URL}/site_setting/logo.png`, // Default image
                            slug: data.slug,
                            url: `${process.env.SHOP_URL}${req.params._slug}`,
                            date: data.createdAt,
                            keywords: _get(data, `keywords.${lan}`, ""),
                            description: _get(data, `description.${lan}`, ""),
                            title: _get(data, `title.${lan}`, ""),
                        };

                        // If there are photos or a thumbnail, use them
                        if (data.photos && data.photos[0]) {
                            responseObj.image = `${process.env.SHOP_URL}${data.photos[0]}`;
                        }
                        if (data.thumbnail) {
                            responseObj.image = `${process.env.SHOP_URL}${data.thumbnail}`;
                        }

                        // Handle meta fields (keywords, description, title)
                        if (data.keywords) {
                            responseObj.keywords = data.keywords[lan] || data.keywords;
                        }
                        if (data.metadescription) {
                            responseObj.description = data.metadescription[lan] || "";
                        }
                        if (data.metatitle) {
                            responseObj.title = data.metatitle[lan] || "";
                        }

                        // Parse the body and add meta tags
                        res.ssrParse().then((body) => {
                            const newBody = addMetaTags(body, responseObj);
                            res.status(200).send(newBody);
                        });
                    }
                ).lean();
            });
        },

    },

    {
        path: "/a/:_entity/:_id/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
];
