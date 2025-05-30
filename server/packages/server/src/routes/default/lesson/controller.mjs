import _ from 'lodash'
import path from 'path'
import mime from 'mime'
import fs from 'fs'
import https from 'https'
import requestIp from "request-ip";

let self = ({

    getAll: function (req, res, next) {
        console.log("get all lessons...")
        let Lesson = req.mongoose.model('Lesson');
        if (req.headers.response !== "json") {
            return res.show()

        }
        let sort = { in_stock: -1,updatedAt: -1}

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

        // return res.json(Lesson.schema.paths);
        // console.log("Lesson.schema => ",Lesson.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Lesson.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Lesson.schema.paths[item].instance);
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
        // console.log(req.mongoose.Schema(Lesson))
        var q;
        if (search['lessonCategory.slug']) {
            let LessonCategory = req.mongoose.model('LessonCategory');

            // console.log('search[\'lessonCategory.slug\']', search['lessonCategory.slug'])

            LessonCategory.findOne({slug: search['lessonCategory.slug']}, function (err, lessoncategory) {
                // console.log('err', err)
                // console.log('req', lessoncategory)
                if (err || !lessoncategory)
                    return res.json([]);
                if (lessoncategory._id) {
                    // console.log({lessonCategory: {
                    //         $in:[lessoncategory._id]
                    //     }})
                    let ss = {"lessonCategory": lessoncategory._id};
                    if (thef.device) {
                        ss['attributes.values'] = thef.device
                    }
                    if (thef.brand) {
                        ss['attributes.values'] = thef.brand
                    }
                    Lesson.find(ss, function (err, lessons) {

                        Lesson.countDocuments(ss, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }
                            res.setHeader(
                                "X-Total-Count",
                                count
                            );
                            return res.json(lessons);

                        })
                    }).populate('lessonCategory', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            // console.log('no \'lessonCategory.slug\'')
            if (!search['status'])
                search['status'] = 'published'
            console.log('sear ch q.exec', search)

            q = Lesson.find(search, fields).skip(offset).sort(sort).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                // console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Lesson.countDocuments(search, function (err, count) {
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

    createByAdmin: function (req, res, next) {
        let Lesson = req.mongoose.model('Lesson');
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
        Lesson.create(req.body, function (err, lesson) {
            if (err || !lesson) {
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
                    title: "create lesson " + lesson._id,
                    action: "create-lesson",
                    data: lesson,
                    history: req.body,
                    lesson: lesson._id
                };
                req.submitAction(action);
            }
            res.json(lesson);
            return 0;

        });
    },

    submitToOther: function (req) {
        console.log("submitToOther")
        req.httpRequest({
            method: "post",
            url: "https://mrgamestore.com/admin/settings/update-lesson-prices",
            data: req.body,
            headers: {token:"0kkz04xgwlo9l3nqympeqak72ui4gq5o"},
            json: true
        }).then(function (parsedBody) {
            // console.log("parsedBody",parsedBody['data'])
        }).catch((e)=>{
            // console.log("catch",e)

        });
    },
    editByAdmin: function (req, res, next) {
        let Lesson = req.mongoose.model('Lesson');

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
        //export new object saved
        if (req.body.slug) {
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
            delete req.body.options;
            delete req.body.combinations;
        }
        if (req.body.like) {
            // delete req.body.options;
            delete req.body.like;
        }
        if (!req.body.status || req.body.status == '') {
            // delete req.body.options;
            req.body.status = 'processings';
        }
        req.body.updatedAt = new Date();

        Lesson.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, lesson) {
            if (err || !lesson) {
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
                    title: "edit lesson " + lesson._id,
                    action: "edit-lesson",
                    data: lesson,
                    history: req.body,
                    lesson: lesson._id
                };
                req.submitAction(action);
            }
            self.submitToOther(req);

            res.json(lesson);
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
            let Lesson = req.mongoose.model('Lesson');

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
                Lesson.create(obj)
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
            let Lesson = req.mongoose.model('Lesson');

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
                Lesson.create(obj)
            });
            // return res.json(response.data)
        });


    },
    rewriteLessons: function (req, res, next) {
        let Lesson = req.mongoose.model('Lesson');
        let p = 0;
        // let Media = req.mongoose.model('Media');
        Lesson.find({}, function (err, lessons) {
            _.forEach(lessons, (item) => {
                let obj = {};
                if (item['slug']) {
                    // obj['slug'] = item['slug'].replace(/\s+/g, '-').toLowerCase();
                    item['slug'] = item['slug'].replace(/\s+/g, '-').toLowerCase();

                    if (item.type == 'variable') {
                        item.in_stock = false;
                        if (item.combinations) {
                            _.forEach(item.combinations, (comb) => {
                                if (comb.in_stock && comb.quantity != 0) {
                                    item.in_stock = true;
                                }

                            });
                        }
                    }
                    if (item.type == 'normal') {
                        // delete item.options;
                        delete item.combinations;
                    }
                    // if (item.price) {
                    //     obj['price'] = (item.price /109) * 100
                    // }
                    // if (item.salePrice) {
                    //     obj['salePrice'] = (item.salePrice/109) * 100
                    // }
                    // if (item.data.regular_price) {
                    //     obj['price'] = item.data.regular_price;
                    // }
                    // if (item.data.regular_price) {
                    //     obj['salePrice'] = item.data.sale_price;
                    // }
                    Lesson.findByIdAndUpdate(item._id, item, function (err, pro) {
                        p++;
                        // console.log('p: ', p, ' lessons.length:', lessons.length)
                        if (p == lessons.length) {
                            return res.json({
                                success: true
                            })
                        }

                    })
                }
            })
        })
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
        let Lesson = req.mongoose.model('Lesson');
        let Settings = req.mongoose.model('Settings');

        // _id:'61d71cf4365a2313a161456c'
        Settings.findOne({}, "tax taxAmount", function (err, setting) {
            Lesson.find({status:'published'}, "_id title price type salePrice in_stock combinations firstCategory secondCategory thirdCategory slug", function (err, lessons) {
                // console.log('err', err)
                // console.log('lessons', lessons)
                if (err || !lessons) {
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

                let modifedLessons = [];
                _.forEach(lessons, (c, cx) => {
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
                    modifedLessons.push({
                        lesson_id: c._id,
                        name: ((c.title && c.title.fa) ? c.title.fa : ""),

                        // page_url: CONFIG.SHOP_URL + "p/" + c._id + "/" + encodeURIComponent(c.title.fa),
                        page_url: process.env.BASE_URL + "/lesson/" + c._id + "/" + c.slug,
                        price: last_price,
                        old_price: last_sale_price,
                        availability: (price_stock.indexOf(true) >= 0 ? "instock" : "outofstock")
                        // comb: price_array,
                        // combSale: sale_array,
                        // price_stock: price_stock,

                    });
                });
                return res.json(modifedLessons);


            }).skip(offset).sort({
                in_stock: -1,
                updatedAt: -1,
                createdAt: -1
                // "combinations.in_stock": -1,
            }).limit(parseInt(req.params.limit)).lean();
        })
    },

    rewriteLessonsImages: function (req, res, next) {
        let Lesson = req.mongoose.model('Lesson');
        let Media = req.mongoose.model('Media');
        Lesson.find({}, function (err, lessons) {
            _.forEach(lessons, (item) => {
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
                            //     Lesson.findByIdAndUpdate(item._id, {photos: photos}, function (err, lessons) {
                            //     })
                            // }
                            //     }
                            // });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Lesson.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, lessons) {
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
            let Lesson = req.mongoose.model('Lesson');

            Lesson.findOne(obj, "title metadescription relatedLessons keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                function (err, lesson) {
                    if (err || !lesson) {
                        resolve({});
                        return 0;
                    }
                    let in_stock = "outofstock";
                    let lesson_price = 0;
                    let lesson_old_price = 0;
                    let lesson_prices = [];
                    let lesson_sale_prices = [];
                    if (lesson.type === "variable") {
                        if (lesson.combinations)
                            _.forEach(lesson.combinations, (c) => {
                                if (c.in_stock) {
                                    in_stock = "instock";
                                    lesson_prices.push(parseInt(c.price) || 1000000000000);
                                    lesson_sale_prices.push(parseInt(c.salePrice) || 1000000000000);
                                }

                            });
                        // console.log("gfdsdf");
                        // console.log(lesson_prices);
                        // console.log(lesson_sale_prices);
                        let min_price = arrayMin(lesson_prices);
                        let min_sale_price = arrayMin(lesson_sale_prices);
                        // console.log("min_price", min_price);
                        // console.log("min_sale_price", min_sale_price);
                        lesson_price = min_price;
                        if (min_sale_price > 0 && min_sale_price < min_price) {
                            lesson_price = min_sale_price;
                            lesson_old_price = min_price;
                        }
                    }
                    if (lesson.type === "normal") {
                        if (lesson.in_stock) {
                            in_stock = "instock";
                        }
                        if (lesson.price) {
                            lesson_price = lesson.price;
                        }
                        if (lesson.price && lesson.salePrice) {
                            lesson_price = lesson.salePrice;
                            lesson_old_price = lesson.price;
                        }
                    }

                    // lesson.title = lesson['title'][req.headers.lan] || '';
                    // lesson.description = '';
                    // console.log(c);
                    // });
                    delete lesson.data;
                    delete lesson.transaction;
                    // console.log(" lesson", lesson);
                    let img = '';
                    if (lesson.photos && lesson.photos[0]) {
                        img = lesson.photos[0]

                    }
                    if (lesson.thumbnail) {
                        img = lesson.thumbnail
                    }

                    let obj = {
                        _id: lesson._id,
                        lesson_price: lesson_price || "",
                        lesson_old_price: lesson_old_price || "",
                        availability: in_stock || "",
                        image: img,
                        keywords: "",
                        metadescription: "",
                    };
                    if (lesson["keywords"]) {
                        obj["keywords"] = lesson["keywords"][req.headers.lan] || lesson["keywords"];

                    }
                    if (lesson["metadescription"]) {
                        obj["metadescription"] = lesson["metadescription"][req.headers.lan] || lesson["metadescription"];

                    }
                    if (lesson["title"]) {
                        obj["title"] = lesson["title"][req.headers.lan] || lesson["title"];
                    } else {
                        obj["title"] = "";
                    }
                    if (lesson["lesson_name"]) {
                        obj["lesson_name"] = lesson["lesson_name"][req.headers.lan] || lesson["lesson_name"];
                    } else {
                        obj["lesson_name"] = "";
                    }
                    if (lesson["description"]) {
                        obj["description"] = lesson["description"][req.headers.lan] || lesson["description"];
                    } else {
                        obj["description"] = "";
                    }
                    if (lesson["slug"]) {
                        obj["slug"] = lesson["slug"];
                    }
                    if (lesson["labels"]) {
                        obj["labels"] = lesson["labels"];
                    }
                    if (lesson["relatedLessons"]) {
                        obj["relatedLessons"] = lesson["relatedLessons"];
                    }
                    resolve(obj);
                    return 0;

                }).lean();
        });
    },
    viewOne: function (req, res, next) {
        let Lesson = req.mongoose.model('Lesson');
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
        // console.log('get lesson: ', obj)
        Lesson.findOne(obj,
            function (err, lesson) {
                if (err || !lesson) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err
                    });
                    return 0;
                }

                let views = lesson.views;
                if (!views) {
                    views = [];
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Lesson.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: lesson.getContactData,
                            views: views
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedLesson) {
                    });
                // delete lesson.views;
                if (lesson.views) {
                    lesson.views = lesson.views.length;
                } else {
                    lesson.views = 0;
                }
                if (lesson.like) {
                    lesson.like = lesson.like.length;
                } else {
                    lesson.like = 0;
                }
                delete lesson.getContactData;
                delete lesson.transaction;
                // delete lesson.relatedLessons;
                delete lesson.firstCategory;
                // Lesson.findOne({_id: {$lt: req.params.id}}, "_id title", function (err, pl) {
                //     if (pl && pl._id && pl.title)
                //         lesson.nextLesson = {_id: pl._id, title: pl.title[req.headers.lan]};
                //     res.json(lesson);
                //     return 0;
                // }).sort({_id: 1}).limit(1);

                res.json(lesson);

            }).lean();
    },
    destroy: function (req, res, next) {
        let Lesson = req.mongoose.model('Lesson');

        Lesson.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    status: "trash"
                }
            },
            function (err, lesson) {
                if (err || !lesson) {
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: 'delete lesson ' + lesson._id,
                        // data:order,
                        action: "delete-lesson",

                        history: lesson,
                        lesson: lesson._id,
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
