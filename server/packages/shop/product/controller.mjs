import _ from 'lodash'
import path from 'path'
import mime from 'mime'
import fs, {readFileSync} from "fs";
import persianJs from 'persianjs';

import https from 'https'
import requestIp from "request-ip";
import * as XLSX from 'xlsx';

const {read, utils} = XLSX;

let self = ({

    getAll: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        if (req.headers.response !== "json") {
            return res.show()

        }
        let sort = {in_stock: -1, updatedAt: -1}

        console.log('getAll()');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields
        }
        let search = {};
        if (req.params.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };
        }
        if (req.query.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.search,
                "$options": "i"
            };
        }
        if (req.query.q) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.q,
                "$options": "i"
            };
        }
        if (req.query.Search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.Search,
                "$options": "i"
            };
        }
        if (req.query && req.query.status) {
            search = {...search, status: req.query.status}
            // console.log('****************req.query', req.query);
        }

        // return res.json(Product.schema.paths);
        // console.log("Product.schema => ",Product.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Product.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Product.schema.paths[item].instance);
                let split = req.query[item].split(',');
                if (req.mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    }
                }

            }
            else {
                // console.log("filter doesnot exist => ", item);
            }
        });
        // console.log('search', search);
        let thef = '';

        function isStringified(jsonValue) { // use this function to check
            try {
                // console.log("need to parse");
                return JSON.parse(jsonValue);
            } catch (err) {
                // console.log("not need o parse");

                return jsonValue;
            }
        }

        // console.log('req.query.filter', req.query.filter)
        if (req.query.filter) {
            const json = isStringified(req.query.filter);

            if (typeof json == "object") {
                // console.log("string is a valid json");
                thef = JSON.parse(req.query.filter);
                if (thef.search) {

                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.search,
                        "$options": "i"
                    };
                    delete thef.search
                }
                if (thef.q) {

                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.q,
                        "$options": "i"
                    };
                    delete thef.q
                }
            } else {
                console.log("string is not a valid json")
            }
            // if (JSON.parse(req.query.filter)) {
            //     thef = JSON.parse(req.query.filter);
            // }
        }
        // console.log('thef', thef);
        if (thef && thef != '')
            search = thef;
        // console.log(req.mongoose.Schema(Product))
        var q;
        if (search['productCategory.slug']) {
            let ProductCategory = req.mongoose.model('ProductCategory');

            // console.log('search[\'productCategory.slug\']', search['productCategory.slug'])

            ProductCategory.findOne({slug: search['productCategory.slug']}, function (err, productcategory) {
                // console.log('err', err)
                // console.log('req', productcategory)
                if (err || !productcategory)
                    return res.json([]);
                if (productcategory._id) {
                    // console.log({productCategory: {
                    //         $in:[productcategory._id]
                    //     }})
                    let ss = {"productCategory": productcategory._id};
                    if (thef.device) {
                        ss['attributes.values'] = thef.device
                    }
                    if (thef.brand) {
                        ss['attributes.values'] = thef.brand
                    }
                    ss['status']='published';

                    Product.find(ss,'title slug in_stock quantity thumbnail price salePrice combinations options productCategory', function (err, products) {

                        Product.countDocuments(ss, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }
                            res.setHeader(
                                "X-Total-Count",
                                count
                            );
                            return res.json(products);

                        })
                    }).populate('productCategory', '_id slug name').skip(offset).sort(sort).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            // console.log('no \'productCategory.slug\'')
            if (!search['status'])
                search['status'] = 'published'
            console.log('sear ch q.exec', search)

            q = Product.find(search,'title slug in_stock quantity thumbnail price salePrice combinations options productCategory').populate('productCategory', '_id slug name').skip(offset).sort(sort).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                // console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count, model ? model.length : '');
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    return res.json(model);

                })
            });
        }

    },
    searchWithBarcode: function (req, res, next) {
        const Product = req.mongoose.model('Product');

        if (req.headers.response !== "json") {
            return res.show();
        }

        const sort = {in_stock: -1, updatedAt: -1};

        console.log('searchWithBarcode()');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields;
        }

        let search = {};

        // Handle search parameters for `title`
        const searchKey = req.params.search || req.query.search || req.query.q || req.query.Search;
        if (searchKey) {
            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": searchKey,
                "$options": "i"
            };
        }

        // Handle search for `status`
        if (req.query && req.query.status) {
            search = {...search, status: req.query.status};
        }

        // Handle JSON filter parsing
        let thef = '';

        function isStringified(jsonValue) {
            try {
                return JSON.parse(jsonValue);
            } catch (err) {
                return jsonValue;
            }
        }

        if (req.query.filter) {
            const json = isStringified(req.query.filter);
            if (typeof json == "object") {
                thef = JSON.parse(req.query.filter);
                if (thef.search) {
                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.search,
                        "$options": "i"
                    };
                    delete thef.search;
                }
                if (thef.q) {
                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.q,
                        "$options": "i"
                    };
                    delete thef.q;
                }
            }
        }
        if (thef && thef != '') search = thef;
        if (req.body.search)
            if (/^\d+$/.test(req.body.search)) { // Check if input is numeric
                search = {
                    $or: [
                        {"normalBarcode": req.global.textToBarcode(req.body.search)},
                        {"combinations.normalBarcode": req.global.textToBarcode(req.body.search)}
                    ]
                };
            } else { // Treat as Persian/English text
                search = {
                    $or: [
                        {"title.fa": {$regex: req.body.search, $options: 'i'}}
                    ]
                };
            }

        // // Check body search for `normalBarcode`
        // if (req.body.search) {
        //     const isPersianOrEnglishWithExtras = (text) => /^[\u0600-\u06FFa-zA-Z0-9\s.,!؟]+$/.test(text);
        //     if (isPersianOrEnglishWithExtras(req.body.search)) {
        //         search = {
        //             $or: [
        //                 { "title.fa": { $regex: req.body.search, $options: 'i' } }
        //             ]
        //         };
        //     } else {
        //         search = {
        //             $or: [
        //                 { "normalBarcode": req.global.textToBarcode(req.body.search) },
        //                 { "combinations.normalBarcode": req.global.textToBarcode(req.body.search) } // Add combinations search
        //             ]
        //         };
        //     }
        // }

        console.log('search with barcode q.exec', search, fields);

        const limit = parseInt(req.params.limit || 100);

        // Perform the search query
        const q = Product.find(search, fields)
            .populate('productCategory', '_id slug')
            .skip(offset)
            .sort(sort)
            .limit(limit);

        q.exec((err, model) => {
            if (err || !model) {
                return res.json([]);
            }

            Product.countDocuments(search, (err, count) => {
                if (err || !count) {
                    return res.json([]);
                }

                res.setHeader("X-Total-Count", count);
                return res.json(model);
            });
        });
    },


    createByAdmin: function (req, res, next) {
        let Product = req.mongoose.model('Product');

        const persianToLatin = (str) => {
            const map = {
                'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
                'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh',
                'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
                'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm',
                'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'y', ' ': '-', '‌': '-' // Include Persian space
            };
            return str
                .split('')
                .map(char => map[char] || char)
                .join('')
                .toLowerCase()
                .replace(/[^a-z0-9\-]/g, ''); // Remove unsupported characters
        };

        function convertToSlug(Text) {
            return Text.toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
        }

        function persianToUnicodeSlug(text) {
            // Normalize the text to NFKD form
            const normalizedText = text.normalize('NFKD');
            const slugg = normalizedText.replace(/\//g, '')  // Remove any characters that aren't alphanumeric or spaces
            return slugg;
        }

        function isPersian(text) {
            const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
            return persianRegex.test(text);
        }

        // Generate slug from name if slug is missing
        if (req.body && !req.body.slug && req.body.title) {
            const titleVal = Object.values(req.body.title)[0]
            if (isPersian(titleVal)) {
                req.body.slug = (persianToUnicodeSlug(titleVal))
            } else {
                req.body.slug = convertToSlug(titleVal)
            }
        }

        if (!req.body) {
            req.body = {}
        }
        if (!req.body.type) {
            req.body.type = 'normal';
        }
        if (req.body && req.body.slug) {
            req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
        }

        if (req.body.type == 'variable') {
            req.body.in_stock = false;
            if (req.body.combinations) {
                _.forEach(req.body.combinations, (comb) => {
                    if (comb.in_stock && comb.quantity != 0) {
                        req.body.in_stock = true;
                    }

                });
            }
        }
        if (req.body.type == 'normal') {
            // delete req.body.options;
            delete req.body.combinations;
        }
        if (req?.body?.price) {
            req.body.price = req.body.price.replace(/\s/g, '');
            req.body.price=persianJs(req.body.price).arabicNumber().toString().trim();
            req.body.price = persianJs(req.body.price).persianNumber().toString().trim();
            req.body.price = parseInt(req.body.price);
        }
        if (req.body.in_stock && !req.body.quantity) {
            req.body.quantity=1
        }
        if (req?.body?.quantity) {
            console.log("req.body.quantity",req.body.quantity)
            // req.body.quantity = req.body.quantity.replace(/\s/g, '');
            req.body.quantity=persianJs(req.body.quantity).arabicNumber().toString().trim();
            req.body.quantity = persianJs(req.body.quantity).persianNumber().toString().trim();
            req.body.quantity = parseInt(req.body.quantity);
        }

        if (req?.body?.salePrice) {
            req.body.salePrice = req.body.salePrice.replace(/\s/g, '');
            req.body.salePrice=persianJs(req.body.salePrice).arabicNumber().toString().trim();
            req.body.salePrice = persianJs(req.body.salePrice).persianNumber().toString().trim();
            req.body.salePrice = parseInt(req.body.salePrice);
        }
        if (req?.body?.normalBarcode) {
            req.body.normalBarcode = req.global.textToBarcode(req.body.normalBarcode)
        }
        Product.create(req.body, function (err, product) {
            if (err || !product) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            if (req.headers._id && req.headers.token) {
                delete req.body.views;
                let action = {
                    user: req.headers._id,
                    title: "create product " + product._id,
                    action: "create-product",
                    data: product,
                    history: req.body,
                    product: product._id
                };
                req.submitAction(action);
            }
            res.json(product);
            return 0;

        });
    },

    submitToOther: function (req) {
        console.log("submitToOther")
        console.log("submitToOther", process.env.SITE_TO_SUBMIT, process.env.TOKEN_TO_SUBMIT)

        if (process.env.SITE_TO_SUBMIT && process.env.TOKEN_TO_SUBMIT)
            req.httpRequest({
                method: "post",
                url: process.env.SITE_TO_SUBMIT,
                data: req.body,
                headers: {token: process.env.TOKEN_TO_SUBMIT},
                json: true
            }).then(function (parsedBody) {
                // console.log("parsedBody",parsedBody['data'])
            }).catch((e) => {
                // console.log("catch",e)

            });
    },
    editByAdmin: function (req, res, next) {
        let Product = req.mongoose.model('Product');

        if (!req.params.id) {

            return res.json({
                success: false,
                message: 'send /edit/:id please, you did not enter id',
            });


        }
        if (!req.body) {
            req.body = {}
        }
        if (!req.body.type) {
            req.body.type = 'normal';
        }
        if (req?.body?.price) {
            // req.body.price = req?.body?.price?.replace(/\s/g, '');
            req.body.price=persianJs(req.body.price).arabicNumber().toString().trim();
            req.body.price = persianJs(req.body.price).persianNumber().toString().trim();
            req.body.price = parseInt(req.body.price);
        }
        if (req?.body?.salePrice) {
            // req.body.salePrice = req?.body?.salePrice?.replace(/\s/g, '');
            req.body.salePrice=persianJs(req.body.salePrice).arabicNumber().toString().trim();
            req.body.salePrice = persianJs(req.body.salePrice).persianNumber().toString().trim();
            req.body.salePrice = parseInt(req.body.salePrice);
        }
        if (req?.body?.quantity) {
            // req.body.quantity = req.body.quantity.replace(/\s/g, '');
            req.body.quantity=persianJs(req.body.quantity).arabicNumber().toString().trim();
            req.body.quantity = persianJs(req.body.quantity).persianNumber().toString().trim();
            req.body.quantity = parseInt(req.body.quantity);
        }

        if (req.body.in_stock && !req.body.quantity) {
            req.body.quantity=1
        }
        if (req.body.type == 'variable') {
            req.body.in_stock = false;
            if (req.body.combinations) {
                _.forEach(req.body.combinations, (comb) => {
                    if (comb.in_stock && comb.quantity != 0) {
                        req.body.in_stock = true;
                    }

                });
            }
        }
        if (req.body.type == 'normal') {
            delete req.body.options;
            delete req.body.combinations;
        }
        if (req.body.like) {
            // delete req.body.options;
            delete req.body.like;
        }
        if (!req.body.status || req.body.status == '') {
            // delete req.body.options;
            req.body.status = 'processing';
        }
        req.body.updatedAt = new Date();
        if (req?.body?.normalBarcode) {
            req.body.normalBarcode = req.global.textToBarcode(req.body.normalBarcode)
        }
        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, product) {
            if (err || !product) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err
                });
                return 0;
            }
            if (req.headers._id && req.headers.token) {
                delete req.body.views;
                // delete req.body.views;
                let action = {
                    user: req.headers._id,
                    title: "edit product " + product._id,
                    action: "edit-product",
                    data: product,
                    history: req.body,
                    product: product._id
                };
                req.submitAction(action);
            }
            self.submitToOther(req);

            res.json(product);
            return 0;

        });
    }
    ,
    importFromWordpress: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }
        if (req.query.consumer_secret) {
            url += '?consumer_secret=' + req.query.consumer_secret;
        }
        if (req.query.consumer_key) {
            url += '&consumer_key=' + req.query.consumer_key;
        }

        if (req.query.per_page) {
            url += '&per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        // console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Product = req.mongoose.model('Product');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.name) {
                    obj['title'] = {
                        fa: dat.name

                    }
                }
                if (dat.description) {
                    obj['description'] = {
                        fa: dat.description

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.name.split(' ').join('-') + 'x' + x;
                }
                obj['data'] = dat;
                Product.create(obj)
            });
            // return res.json(response.data)
        });


    },
    importFromWebzi: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }
        if (req.query.consumer_secret) {
            url += '?consumer_secret=' + req.query.consumer_secret;
        }
        if (req.query.consumer_key) {
            url += '&consumer_key=' + req.query.consumer_key;
        }

        if (req.query.per_page) {
            url += '&per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        // console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Product = req.mongoose.model('Product');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.name) {
                    obj['title'] = {
                        fa: dat.name

                    }
                }
                if (dat.description) {
                    obj['description'] = {
                        fa: dat.description

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.name.split(' ').join('-') + 'x' + x;
                }
                obj['data'] = dat;
                Product.create(obj)
            });
            // return res.json(response.data)
        });


    },
    importFromExcel: function (req, res, next) {
        console.log('importFromExcel');
        let Product = req.mongoose.model("Product");
        const ProductCategory = req.mongoose.model('ProductCategory');

        function cleanJsonData(data) {
            // Remove empty keys and trim spaces around values
            let cleanedData = {};

            for (let key in data) {
                if (data.hasOwnProperty(key) && data[key] !== '') {
                    let normalizedKey = key.trim().toLowerCase();
                    cleanedData[normalizedKey] = data[key].trim();
                }
            }
            return cleanedData;
        }

        // Manually replace "ي" with "ی" and "ك" with "ک"
        function replacePersianCharacters(str) {
            // console.log("str",str)
            str = str.trim()
            // str=str.replaceAll(/ي/g, "ی").replaceAll(/ك/g, "ک")
            // console.log("str",str)

            return str.replaceAll(/ي/g, "ی").replaceAll(/ك/g, "ک");
        }

        async function processCategories(rows) {
            const allCategories = new Set();

            // Step 1: Extract unique categories from the Excel data
            rows.forEach(row => {
                const cleanRow = cleanJsonData(row);
                if (cleanRow.product_category) {
                    const category = replacePersianCharacters(cleanRow.product_category);
                    allCategories.add(category);
                }
            });

            const categoryNames = Array.from(allCategories);
            // console.log("categoryNames", categoryNames);

            // Fetch existing categories from the database
            const existingCategories = await ProductCategory.find({"name.fa": {$in: categoryNames}}, '_id name slug').lean();
            // console.log("existingCategories", existingCategories);

            // Create a mapping from category name to category ID
            const categoryMap = new Map();
            existingCategories.forEach(cat => {
                categoryMap.set(replacePersianCharacters(cat.name.fa), cat._id);  // Store category ID by its name (normalized)
            });

            // Step 2: Identify and create missing categories
            const newCategories = categoryNames.filter(catName => !categoryMap.has(catName));

            if (newCategories.length > 0) {
                const newCategoryDocs = newCategories.map(categoryName => ({
                    name: {fa: replacePersianCharacters(categoryName)},
                    slug: req.global.normalizeSlug(replacePersianCharacters(categoryName)),
                    type: "normal",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));

                // Insert in batch
                const insertedCategories = await ProductCategory.insertMany(newCategoryDocs);
                insertedCategories.forEach(cat => {
                    categoryMap.set(cat.name.fa.trim(), cat._id);
                });
            }

            // Return the category map as an array or object
            // const categoryArray = Array.from(categoryMap.entries());
            // return categoryArray;
            return categoryMap
        }

        async function generateUniqueSlug(title, slug, d, existingSlugsSet) {
            let normalizedSlug = replacePersianCharacters(slug) + '-' + d;
            normalizedSlug += `-${Math.floor(Math.random() * 10000)}-${Date.now()}`;

            // Check against the set of existing slugs
            while (existingSlugsSet.has(normalizedSlug)) {
                normalizedSlug = `${normalizedSlug}-${Math.floor(Math.random() * 10000)}-${Date.now()}`;
            }

            existingSlugsSet.add(normalizedSlug);
            return normalizedSlug;
        }

        async function RegisterProduct1000(rows, categoryMap, res) {
            try {
                // const Product = req.mongoose.model('Product');
                const batchSize = 1000;
                let batch = [];
                let d = 0;
                const generatedSlugs = new Set(); // To keep track of slugs generated within the batch
                const existingSlugsSet = new Set(); // To check slug uniqueness

                // Step 3: Process products and associate categories
                for (let row of rows) {
                    d++;
                    row = cleanJsonData(row);

                    let {slug, title, price, quantity = 10, product_category} = row;
                    let p_data = row;

                    if (title) {
                        title = replacePersianCharacters(title); // Apply transformation once
                        // title = persianJs(title).persianNumber().toString().trim(); // Apply Persian number transformation once
                    } else {
                        continue; // Skip processing this product if title is missing
                    }

                    delete p_data.title;
                    delete p_data.price;
                    delete p_data.slug;
                    delete p_data.quantity;
                    delete p_data.product_category;

                    // If slug is not provided, generate it from the title and a counter
                    if (!slug && title) {
                        slug = req.global.normalizeSlug(title);
                    }

                    // Generate a unique slug
                    slug = await generateUniqueSlug(title, slug, d, existingSlugsSet);

                    // Associate product category
                    let productCategoryIds = null; // Just a single category ID

                    if (product_category) {
                        const normalizedCategoryName = replacePersianCharacters(product_category.trim());
                        const category = categoryMap.get(normalizedCategoryName);
                        if (category) {
                            productCategoryIds = category;
                        }
                    }
                    price = price.replace(/[,\s]/g, '');
                    price = persianJs(price).arabicNumber().toString().trim();
                    price = persianJs(price).persianNumber().toString().trim();
                    price = parseInt(price);
                    batch.push({
                        title: {fa: title},
                        slug: slug + '-d-' + d,
                        price: price,
                        in_stock: true,
                        quantity: quantity ? quantity : 10,
                        status: "published",
                        type: "normal",
                        data: p_data,
                        excerpt: {},
                        description: {fa: ''},
                        metadescription: {},
                        metatitle: {},
                        photos: [],
                        productCategory: [productCategoryIds],
                        requireWarranty: false,
                        story: false,
                        updatedAt: new Date(),
                        createdAt: new Date(),
                    });

                    // Insert products in batches
                    if (batch.length >= batchSize) {
                        // console.log(`Inserting ${batch.length} products at record ${d}`);
                        // await Product.collection.insertMany(batch);
                        // batch = []; // Reset batch after insertion
                        try {
                            console.log(`Inserting ${batch.length} products at record ${d}`);
                            await Product.collection.insertMany(batch, {ordered: false}); // Continue even if some inserts fail
                            batch = []; // Reset batch after insertion
                        } catch (error) {
                            // Handle the bulk write error
                            if (error instanceof MongoBulkWriteError) {
                                // Skip the duplicates and continue with the next batch
                                const duplicateErrorIndex = error.writeErrors.findIndex(err => err.code === 11000);
                                if (duplicateErrorIndex !== -1) {
                                    console.warn("Skipping duplicate slugs and continuing.");
                                } else {
                                    console.error("Bulk insert failed:", error);
                                }
                            }
                        }
                    }
                }

                // Insert remaining products if any
                if (batch.length > 0) {
                    console.log(`Inserting final batch of ${batch.length} products`);
                    await Product.collection.insertMany(batch);
                }

                // Send final response after all products are processed
                console.log("All products processed, sending response...");
                return res.json({
                    success: true,
                    count: d,
                });
            } catch (error) {
                console.error("Error during product registration:", error);
                return res.status(500).json({
                    success: false,
                    message: "An error occurred during product registration.",
                    error: error.message
                });
            }
        }

        if (req.busboy) {
            req.pipe(req.busboy);

            req.busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
                let fstream;
                const __dirname = path.resolve();

                console.log("global.getFormattedTime() + filename", req.global.getFormattedTime(), filename["filename"]);
                let name = (req.global.getFormattedTime() + filename.filename).replace(/\s/g, "");

                let filePath = path.join(__dirname, "./public_media/customer/", name);
                console.log("on file app filePath", filePath);

                fstream = fs.createWriteStream(filePath);
                console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", async function () {
                    console.log('Files saved');
                    console.log('filePath', filePath);
                    try {
                        const buf = readFileSync(filePath);
                        const workbook = read(buf);
                        const sName = await workbook.SheetNames[0];
                        const she = await workbook.Sheets[sName];
                        const jsonData = await utils.sheet_to_json(she, {
                            raw: false,
                            defval: ''
                        });

                        let categoryMap = await processCategories(jsonData); // First process categories
                        // res.json(categoryMap)
                        await RegisterProduct1000(jsonData, categoryMap, res); // Now process products

                    } catch (error) {
                        console.error(error);
                        res.status(500).json({error: 'Failed to process the uploaded file'});
                    }
                });
            });
        } else {
            next();
        }
    },


    rewriteProducts: function (req, res, next) {
        const Product = req.mongoose.model('Product');
        let updatedCount = 0;

        Product.find({}, (err, products) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Error fetching products', error: err});
            }

            if (!products.length) {
                return res.json({success: true, message: 'No products found to update'});
            }

            products.forEach((item) => {
                let isUpdated = false;

                // Update main normalBarcode
                if (item?.normalBarcode) {
                    const updatedBarcode = req.global.textToBarcode(item.normalBarcode);
                    item.normalBarcode = updatedBarcode;
                    isUpdated = true;
                }

                // Update normalBarcode in combinations array
                if (Array.isArray(item.combinations)) {
                    item.combinations.forEach((comb) => {
                        if (comb?.normalBarcode) {
                            comb.normalBarcode = req.global.textToBarcode(comb.normalBarcode);
                            isUpdated = true;
                        }
                    });
                }

                // Only update if changes were made
                if (isUpdated) {
                    Product.findByIdAndUpdate(
                        item._id,
                        {$set: {normalBarcode: item.normalBarcode, combinations: item.combinations}},
                        (err) => {
                            if (err) {
                                console.error(`Error updating product with ID: ${item._id}`, err);
                                return;
                            }

                            updatedCount++;
                            if (updatedCount === products.length) {
                                return res.json({success: true, message: 'All products updated successfully'});
                            }
                        }
                    );
                } else {
                    updatedCount++;
                    if (updatedCount === products.length) {
                        return res.json({success: true, message: 'All products updated successfully'});
                    }
                }
            });
        });
    },

    torob: function (req, res, next) {
        console.log("----- torob -----");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let searchf = {};
        searchf["title.fa"] = {
            $exists: true
        };
        let Product = req.mongoose.model('Product');
        let Settings = req.mongoose.model('Settings');

        // _id:'61d71cf4365a2313a161456c'
        Settings.findOne({}, "tax taxAmount showPricesToPublic", function (err, setting) {
            Product.find({status: 'published'}, "_id title price type salePrice in_stock combinations firstCategory secondCategory thirdCategory slug status", function (err, products) {
                // console.log('err', err)
                // console.log('products', products)
                if (err || !products) {
                    return res.json([]);
                }

                function arrayMin(t) {
                    var arr = [];
                    t.map((item) => (item != 0) ? arr.push(item) : false);
                    if (arr && arr.length > 0)
                        return arr.reduce(function (p, v) {
                            // console.log("p", p, "v", v);
                            return (p < v ? p : v);
                        });
                    else
                        return false;
                }

                let modifedProducts = [];
                _.forEach(products, (c, cx) => {
                    let price_array = [];
                    let sale_array = [];
                    let price_stock = [];
                    let last_price = 0;
                    let last_sale_price = 0;

                    if (c.combinations && c.type == "variable") {
                        _.forEach(c.combinations, (comb, cxt) => {
                            if (comb.price && comb.price != null && parseInt(comb.price) != 0) {
                                price_array.push(parseInt(comb.price));
                            } else {
                                price_array.push(0);

                            }
                            if (comb.salePrice && comb.salePrice != null && parseInt(comb.salePrice) != 0) {
                                sale_array.push(parseInt(comb.salePrice));

                            } else {
                                sale_array.push(0);
                            }
                            if (comb.in_stock && !comb.quantity) {
                                comb.in_stock = false;
                            }
                            price_stock.push(comb.in_stock);
                            //
                            // if (parseInt(comb.price) < parseInt(last_price))
                            //     last_price = parseInt(comb.price);
                        });
                    }
                    if (c.type == "normal") {
                        price_array = [];
                        sale_array = [];
                        price_stock = [];
                        if (c.price && c.price != null)
                            price_array.push(c.price);
                    }
                    last_price = arrayMin(price_array);
                    last_sale_price = arrayMin(sale_array);
                    // console.log("last price", last_price, last_sale_price);

                    if ((last_price !== false && last_sale_price !== false) && (last_price < last_sale_price)) {
                        // console.log("we have got here");
                        var cd = price_array.indexOf(last_price);
                        if (sale_array[cd] && sale_array[cd] != 0)
                            last_sale_price = sale_array[cd];
                        else
                            last_sale_price = false;
                        // if(sale_array[cd] && (sale_array[cd]<last_sale_price)){
                        //
                        // }

                    } else if ((last_price !== false && last_sale_price !== false) && (last_price > last_sale_price)) {
                        // console.log("we have got there");

                        // last_price = last_sale_price;
                        // last_sale_price = tem;

                        var cd = sale_array.indexOf(last_sale_price);
                        if (price_array[cd] && price_array[cd] != 0)
                            last_price = price_array[cd];
                        // else {
                        // last_sale_price = false;
                        var tem = last_price;

                        last_price = last_sale_price;
                        last_sale_price = tem;
                        // }
                    }

                    //
                    // if (last_sale_price) {
                    //     var tem = last_price;
                    //     last_price = last_sale_price;
                    //     last_sale_price = tem;
                    //
                    // }
                    if (c.type == "normal") {
                        price_array = [];
                        sale_array = [];
                        price_stock = [];
                        if (c.in_stock) {
                            price_stock.push(true);
                        }
                        if (c.price && c.price != null)
                            price_array.push(c.price);
                    }
                    // console.log("price_stock", price_stock);


                    let slug = c.slug;
                    let cat_inLink = "";
                    if (c.firstCategory && c.firstCategory.slug)
                        cat_inLink = c.firstCategory.slug;
                    if (c.secondCategory && c.secondCategory.slug)
                        cat_inLink = c.secondCategory.slug;
                    if (c.thirdCategory && c.thirdCategory.slug)
                        cat_inLink = c.thirdCategory.slug;
                    // console.log('tax', setting)
                    if (setting && (setting.tax && setting.taxAmount)) {
                        if (last_price) {
                            let n = (parseInt(setting.taxAmount) * last_price) / 100
                            last_price = last_price + parseInt(n);
                        }

                        if (last_sale_price) {
                            let x = (parseInt(setting.taxAmount) * last_sale_price) / 100
                            last_sale_price = last_sale_price + parseInt(x);
                        }
                        // last_price
                    }
                    if (c.type == "normal") {

                        if (c.price && c.salePrice) {
                            last_price = c.salePrice;
                            last_sale_price = c.price;
                        }
                    }
                    let showPricesToPublic = setting?.showPricesToPublic;
                    modifedProducts.push({
                        product_id: c._id,
                        name: ((c.title && c.title.fa) ? c.title.fa : ""),

                        // page_url: CONFIG.SHOP_URL + "p/" + c._id + "/" + encodeURIComponent(c.title.fa),
                        page_url: process.env.BASE_URL + "/product/" + c.slug,
                        price: showPricesToPublic ? last_price : null,
                        old_price: showPricesToPublic ? last_sale_price : null,
                        availability: (price_stock.indexOf(true) >= 0 ? "instock" : "outofstock")
                        // comb: price_array,
                        // combSale: sale_array,
                        // price_stock: price_stock,

                    });
                });
                return res.json(modifedProducts);


            }).skip(offset).sort({
                in_stock: -1,
                updatedAt: -1,
                createdAt: -1
                // "combinations.in_stock": -1,
            }).limit(parseInt(req.params.limit)).lean();
        })
    },
    updateAllPrices: async function (req, res, next) {
        console.log("updateAllPrices");

        try {
            const Product = req.mongoose.model('Product');
            const { updateType, value, operation, updateSalePrice } = req.body;

            if (!updateType || isNaN(value) || !['add', 'subtract'].includes(operation)) {
                return res.status(400).json({ success: false, message: 'Invalid input parameters' });
            }

            let multiplier = updateType === 'percentage' ? (operation === 'add' ? 1 + (value / 100) : 1 - (value / 100)) : null;
            let increment = updateType === 'constant' ? (operation === 'add' ? value : -value) : null;

            // Define aggregation pipeline
            let pipeline = [];
            if (operation === 'subtract' && updateSalePrice) {
                let decrement = updateType === 'constant' ? (value) : null;

                // console.log("we have subtract and updateSalePrice and increment is:",increment)
                // Pipeline for subtract operation and updateSalePrice is true: Update only salePrice
                pipeline = [
                    {
                        $set: {
                            salePrice: {
                                $round: [
                                    updateType === 'percentage' ?
                                        { $subtract: ["$price", { $multiply: ["$price", value / 100] }] } :  // Apply percentage subtraction
                                        { $subtract: ["$price", decrement] },  // Apply constant subtraction
                                    0 // Round to 0 decimal places
                                ]
                            }
                        },

                    },
                    {
                        $set: {
                            salePrice: {
                                $multiply: [
                                    { $round: [{ $divide: ["$salePrice", 1000] }, 0] }, // Divide by 1000, round, and multiply back by 1000
                                    1000
                                ]
                            }
                        }
                    },
                    {
                        $merge: {
                            into: "products", // specify the target collection
                            whenMatched: "merge", // Change this to 'merge' instead of 'replace' to preserve other fields
                            whenNotMatched: "discard" // Optionally discard if no match is found
                        }
                    }
                ];
            } else {
                // Default pipeline for other operations (including add/subtract without updateSalePrice)
                pipeline = [
                    {
                        $addFields: {
                            price: {
                                $round: [
                                    updateType === 'percentage' ?
                                        { $multiply: ["$price", multiplier] } :
                                        { $add: ["$price", increment] },
                                    0 // Round to 0 decimal places
                                ]
                            },
                            salePrice: {
                                $cond: {
                                    if: { $ne: ["$salePrice", undefined] },
                                    then: {
                                        $round: [
                                            updateType === 'percentage' ?
                                                { $multiply: ["$salePrice", multiplier] } :
                                                { $add: ["$salePrice", increment] },
                                            0 // Round to 0 decimal places
                                        ]
                                    },
                                    else: "$salePrice"
                                }
                            }
                        }
                    },
                    {
                        $merge: {
                            into: "products", // specify the target collection
                            whenMatched: "replace"
                        }
                    }
                ];
            }

            // Execute the aggregation pipeline
            console.log("pipeline",JSON.stringify(pipeline))
            await Product.aggregate(pipeline);

            return res.json({
                success: true,
                message: 'Prices updated successfully'
            });
        } catch (error) {
            console.error('Error updating prices:', error);
            return res.status(500).json({ success: false, message: 'Failed to update prices', error: error.message });
        }
    },

    updateAllPricesOld: async function (req, res, next) {
        console.log("updateAllPrices");

        try {
            const Product = req.mongoose.model('Product');
            const { updateType, value, operation,updateSalePrice } = req.body;

            if (!updateType || isNaN(value) || !['add', 'subtract'].includes(operation)) {
                return res.status(400).json({success: false, message: 'Invalid input parameters'});
            }

            let multiplier = updateType === 'percentage' ? (operation === 'add' ? 1 + (value / 100) : 1 - (value / 100)) : null;
            let increment = updateType === 'constant' ? (operation === 'add' ? value : -value) : null;

            // Define aggregation pipeline
            let pipeline=[]
            if (operation === 'subtract' && updateSalePrice) {
                // Pipeline for subtract operation and updateSalePrice is true: Update only salePrice
                pipeline = [
                    {
                        $addFields: {
                            salePrice: {
                                $round: [
                                    updateType === 'percentage' ?
                                        { $subtract: ["$price", { $multiply: ["$price", value / 100] }] } :  // Apply percentage subtraction
                                        { $subtract: ["$price", increment] },  // Apply constant subtraction
                                    0 // Round to 0 decimal places
                                ]
                            }
                        }
                    },
                    {
                        $merge: {
                            into: "products", // specify the target collection
                            whenMatched: "replace"
                        }
                    }
                ];
            } else {
                 pipeline = [
                    {
                        $addFields: {
                            price: {
                                $round: [
                                    updateType === 'percentage' ?
                                        {$multiply: ["$price", multiplier]} :
                                        {$add: ["$price", increment]},
                                    0 // Round to 0 decimal places
                                ]
                            },
                            salePrice: {
                                $cond: {
                                    if: {$ne: ["$salePrice", undefined]},
                                    then: {
                                        $round: [
                                            updateType === 'percentage' ?
                                                {$multiply: ["$salePrice", multiplier]} :
                                                {$add: ["$salePrice", increment]},
                                            0 // Round to 0 decimal places
                                        ]
                                    },
                                    else: "$salePrice"
                                }
                            }
                        }
                    },
                    {
                        $merge: {
                            into: "products", // specify the target collection
                            whenMatched: "replace"
                        }
                    }
                ];
            }

            await Product.aggregate(pipeline);

            return res.json({
                success: true,
                message: 'Prices updated successfully'
            });
        } catch (error) {
            console.error('Error updating prices:', error);
            return res.status(500).json({success: false, message: 'Failed to update prices', error: error.message});
        }
    },

    rewriteProductsImages: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        let Media = req.mongoose.model('Media');
        Product.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                let photos = [];
                if (item.photos) {
                    _.forEach((item.photos ? item.photos : []), async (c, cx) => {
                        let mainUrl = encodeURI(c);
                        // console.log('images[', cx, ']', mainUrl);

                        let filename =
                                c.split('/').pop(),
                            __dirname = path.resolve(),
                            // name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                            name = filename,
                            type = path.extname(name),
                            mimtype = mime.getType(type),
                            filePath = path.join(__dirname, "./public_media/customer/", name),
                            fstream = fs.createWriteStream(filePath);
                        // console.log('name', filename)
                        // console.log('getting mainUrl', req.query.url + mainUrl);

                        https.get(req.query.url + mainUrl, function (response) {
                            response.pipe(fstream);
                        });

                        // console.log('cx', cx);

                        fstream.on("close", function () {
                            // console.log('images[' + cx + '] saved');
                            let url = "customer/" + name,
                                obj = [{name: name, url: url, type: mimtype}];
                            // Media.create({
                            //     name: obj[0].name,
                            //     url: obj[0].url,
                            //     type: obj[0].type
                            //
                            // }, function (err, media) {
                            //     if (err) {
                            //         // console.log({
                            //         //     err: err,
                            //         //     success: false,
                            //         //     message: 'error'
                            //         // })
                            //     } else {
                            // console.log(cx, ' imported');

                            // photos.push(media.url);
                            // if (photos.length == item.photos.length) {
                            //     Product.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                            //     })
                            // }
                            //     }
                            // });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Product.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                //     })

            })
        })
    },
    viewOneS: function (req, res, next) {
        console.log("----- viewOne -----");
        return new Promise(function (resolve, reject) {
            // console.log('req.params._id', req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return (p < v ? p : v);
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
            let Product = req.mongoose.model('Product');

            Product.findOne(obj, "title metadescription relatedProducts keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                function (err, product) {
                    if (err || !product) {
                        resolve({});
                        return 0;
                    }
                    let in_stock = "outofstock";
                    let product_price = 0;
                    let product_old_price = 0;
                    let product_prices = [];
                    let product_sale_prices = [];
                    if (product.type === "variable") {
                        if (product.combinations)
                            _.forEach(product.combinations, (c) => {
                                if (c.in_stock) {
                                    in_stock = "instock";
                                    product_prices.push(parseInt(c.price) || 1000000000000);
                                    product_sale_prices.push(parseInt(c.salePrice) || 1000000000000);
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
                    // console.log(" product", product);
                    let img = '';
                    if (product.photos && product.photos[0]) {
                        img = product.photos[0]

                    }
                    if (product.thumbnail) {
                        img = product.thumbnail
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
                        obj["keywords"] = product["keywords"][req.headers.lan] || product["keywords"];

                    }
                    if (product["metadescription"]) {
                        obj["metadescription"] = product["metadescription"][req.headers.lan] || product["metadescription"];

                    }
                    if (product["title"]) {
                        obj["title"] = product["title"][req.headers.lan] || product["title"];
                    } else {
                        obj["title"] = "";
                    }
                    if (product["product_name"]) {
                        obj["product_name"] = product["product_name"][req.headers.lan] || product["product_name"];
                    } else {
                        obj["product_name"] = "";
                    }
                    if (product["description"]) {
                        obj["description"] = product["description"][req.headers.lan] || product["description"];
                    } else {
                        obj["description"] = "";
                    }
                    if (product["slug"]) {
                        obj["slug"] = product["slug"];
                    }
                    if (product["labels"]) {
                        obj["labels"] = product["labels"];
                    }
                    if (product["relatedProducts"]) {
                        obj["relatedProducts"] = product["relatedProducts"];
                    }
                    resolve(obj);
                    return 0;

                }).lean();
        });
    },
    viewOne: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        const ObjectId = req.mongoose.Types.ObjectId;

// Validator function
        function isValidObjectId(id) {

            if (ObjectId.isValid(id)) {
                if ((String)(new ObjectId(id)) === id)
                    return true;
                return false;
            }
            return false;
        }

        let obj = {};
        // console.log('req.params.id', req.params.id)
        if (isValidObjectId(req.params.id)) {
            obj["_id"] = req.params.id;
        } else {
            obj["slug"] = req.params.id;

        }
        // console.log('get product: ', obj)
        Product.findOne(obj,
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err
                    });
                    return 0;
                }

                let views = product.views;
                if (!views) {
                    views = [];
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Product.findByIdAndUpdate(product._id, {
                        "$set": {
                            // getContactData: product.getContactData,
                            views: views
                        }
                    },
                    {
                        "fields": {"_id": 1, "views": 1}
                    }, function (err, updatedProduct) {
                        // console.log("err",err)
                        // console.log("updatedProduct",updatedProduct)
                    });

                // delete product.views;
                if (product.views) {
                    product.views = product.views.length;
                } else {
                    product.views = 0;
                }
                // console.log("product.views:",product.views)
                if (product.like) {
                    product.like = product.like.length;
                } else {
                    product.like = 0;
                }
                delete product.getContactData;
                delete product.transaction;
                delete product.firstCategory;
                res.json(product);

            }).lean();
    },
    addComment: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        let Customer = req.mongoose.model('Customer');
        let customer_id = false
        if (!req.params.id) {
            return res.json({
                success: false,
                message: 'Please provide an ID or slug as /add-comment/:id',
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false,
                message: 'No comment data provided.',
            });
        }

        if (!req.headers._id) {
            return res.json({
                success: false,
                message: 'User is not authenticated',
            });
        }
        if (req.headers._id != req.body?.customer_data?._id) {
            return res.json({
                success: false,
                message: 'User is not same as logged in user',
            });
        }
        customer_id = req.headers._id
        const ObjectId = req.mongoose.Types.ObjectId;

        function isValidObjectId(id) {
            return ObjectId.isValid(id) && (String)(new ObjectId(id)) === id;
        }

        let query = {};
        if (isValidObjectId(req.params.id)) {
            query["_id"] = req.params.id;
        } else {
            query["slug"] = req.params.id;
        }

        Customer.findOne({_id: customer_id}, '_id firstName', function (err, customer) {
            if (err || !customer) {
                return res.json({
                    success: false,
                    message: 'Customer not found or an error occurred!',
                    err: err
                });
            }
            Product.findOne(query, 'comment _id updatedAt', function (err, product) {
                if (err || !product) {
                    return res.json({
                        success: false,
                        message: 'Product not found or an error occurred!',
                        err: err
                    });
                }

                // Initialize the comment array if it doesn't exist
                if (!product.comment) {
                    product.comment = [];
                }
                // Add the createdAt timestamp to the comment data before pushing
                // req.body.createdAt = new Date();
                // req.body.customer_data = {
                //     _id: customer._id,
                //     firstName: customer.firstName,
                // }  // Generate a unique _id for the comment
                // req.body._id = new ObjectId();  // Generate a unique _id for the comment
                // Add the new comment
                let commentObject = {
                    _id: new ObjectId(),
                    createdAt: new Date(),
                    rate: req.body.rate,
                    text: req.body.text,
                    customer_data: {
                        _id: customer._id,
                        firstName: customer.firstName,
                    }
                }

                product.comment.push(commentObject);

                // Set the updatedAt timestamp
                product.updatedAt = new Date();
                // Save the updated product
                Product.findByIdAndUpdate(product._id, product, {
                    new: true,
                    select: {
                        _id: 1,
                        comment: 1,
                    }
                }, function (updateErr, updatedProduct) {
                    if (updateErr || !updatedProduct) {
                        return res.json({
                            success: false,
                            message: 'Failed to save the updated product!',
                            err: updateErr
                        });
                    }
                    Customer.findByIdAndUpdate(customer._id, {
                        $push: {
                            comments: {...commentObject, productId: product._id},
                        }

                    }, {
                        new: true,
                        select: {
                            _id: 1,
                            comments: 1,
                        }
                    }, function (updateErr, updatedCustomer) {


                        // Return the updated product
                        res.json({
                            success: true,
                            message: 'Comment added successfully!',
                            product: updatedProduct,
                            // customer: updatedCustomer,

                        });
                    });
                });
            });
        })
    },
    updateComment: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        if (!req.params.id) {
            return res.json({
                success: false,
                message: 'Please provide an ID or slug as /add-comment/:id',
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false,
                message: 'No comment data provided.',
            });
        }

        const ObjectId = req.mongoose.Types.ObjectId;

        function isValidObjectId(id) {
            return ObjectId.isValid(id) && (String)(new ObjectId(id)) === id;
        }

        let query = {};
        if (isValidObjectId(req.params.id)) {
            query["_id"] = req.params.id;
        } else {
            query["slug"] = req.params.id;
        }

        Product.findOne(query, function (err, product) {
            if (err || !product) {
                return res.json({
                    success: false,
                    message: 'Product not found or an error occurred!',
                    err: err
                });
            }

            // Add the createdAt timestamp to the comment data before pushing
            req.body.createdAt = new Date();
            // Add the new comment
            console.log('req.body.title: ', req.body.text)
            if (req.body.commentId) {
                // Find the parent comment and push the new comment into its `child` array
                const parentComment = product.comment.find(
                    (comment) => String(comment._id) === String(req.body.commentId)
                );
                if (parentComment) {
                    parentComment.child = parentComment.child || [];
                    const {commentId, ...commentDataWithoutId} = req.body;

                    // Push the new object into the child array
                    parentComment.child.push(commentDataWithoutId);
                } else {
                    return res.json({
                        success: false,
                        message: 'Parent comment not found!',
                    });
                }
                console.log('parent comment ', parentComment)
            }
            // Set the updatedAt timestamp
            product.updatedAt = new Date();

            // Save the updated product
            Product.findByIdAndUpdate(product._id, product, {new: true}, function (updateErr, updatedProduct) {
                if (updateErr || !updatedProduct) {
                    return res.json({
                        success: false,
                        message: 'Failed to save the updated product!',
                        err: updateErr
                    });
                }

                // Return the updated product
                res.json({
                    success: true,
                    message: 'Comment added successfully!',
                    product: updatedProduct
                });
            });
        });
    },
    destroy: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        // {
        //     $set: {
        //         status: "trash"
        //     }
        // },
        Product.findByIdAndDelete(req.params.id,

            function (err, product) {
                if (err || !product) {
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: 'delete product ' + product._id,
                        // data:order,
                        action: "delete-product",

                        history: product,
                        product: product._id,
                    };
                    req.submitAction(action);
                }
                return res.json({
                    success: true,
                    message: 'Deleted!'
                });


            }
        );
    },
    deleteAll: function (req, res, next) {
        let Product = req.mongoose.model('Product');

        Product.deleteMany(function (err, product) {
                if (err || !product) {
                    console.log("err", product)
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: 'delete all products',
                        // data:order,
                        action: "delete-product",

                        history: {}
                    };

                    req.submitAction(action);
                }
                return res.json({
                    success: true,
                    message: 'Deleted!'
                });


            }
        );
    }


});
export default self;
