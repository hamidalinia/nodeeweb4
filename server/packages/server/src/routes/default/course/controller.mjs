import _ from 'lodash'
import path from 'path'
import mime from 'mime'
import fs from 'fs'
import https from 'https'
import requestIp from "request-ip";

let self = ({

    getAll: function (req, res, next) {
        console.log("get all courses...")
        let Course = req.mongoose.model('Course');
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

        // return res.json(Course.schema.paths);
        // console.log("Course.schema => ",Course.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Course.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Course.schema.paths[item].instance);
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
        // console.log(req.mongoose.Schema(Course))
        var q;
        if (search['courseCategory.slug']) {
            let CourseCategory = req.mongoose.model('CourseCategory');

            // console.log('search[\'courseCategory.slug\']', search['courseCategory.slug'])

            CourseCategory.findOne({slug: search['courseCategory.slug']}, function (err, coursecategory) {
                // console.log('err', err)
                // console.log('req', coursecategory)
                if (err || !coursecategory)
                    return res.json([]);
                if (coursecategory._id) {
                    // console.log({courseCategory: {
                    //         $in:[coursecategory._id]
                    //     }})
                    let ss = {"courseCategory": coursecategory._id};
                    if (thef.device) {
                        ss['attributes.values'] = thef.device
                    }
                    if (thef.brand) {
                        ss['attributes.values'] = thef.brand
                    }
                    Course.find(ss, function (err, courses) {

                        Course.countDocuments(ss, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }
                            res.setHeader(
                                "X-Total-Count",
                                count
                            );
                            return res.json(courses);

                        })
                    }).populate('courseCategory', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            // console.log('no \'courseCategory.slug\'')
            if (!search['status'])
                search['status'] = 'published'
            console.log('sear ch q.exec', search)

            q = Course.find(search, fields).populate('courseCategory', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                // console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Course.countDocuments(search, function (err, count) {
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
        let Course = req.mongoose.model('Course');
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
        Course.create(req.body, function (err, course) {
            if (err || !course) {
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
                    title: "create course " + course._id,
                    action: "create-course",
                    data: course,
                    history: req.body,
                    course: course._id
                };
                req.submitAction(action);
            }
            res.json(course);
            return 0;

        });
    },

    editByAdmin: function (req, res, next) {
        let Course = req.mongoose.model('Course');

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

        Course.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, course) {
            if (err || !course) {
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
                    title: "edit course " + course._id,
                    action: "edit-course",
                    data: course,
                    history: req.body,
                    course: course._id
                };
                req.submitAction(action);
            }
            self.submitToOther(req);

            res.json(course);
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
            let Course = req.mongoose.model('Course');

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
                Course.create(obj)
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
            let Course = req.mongoose.model('Course');

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
                Course.create(obj)
            });
            // return res.json(response.data)
        });


    },
    rewriteCourses: function (req, res, next) {
        let Course = req.mongoose.model('Course');
        let p = 0;
        // let Media = req.mongoose.model('Media');
        Course.find({}, function (err, courses) {
            _.forEach(courses, (item) => {
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
                    Course.findByIdAndUpdate(item._id, item, function (err, pro) {
                        p++;
                        // console.log('p: ', p, ' courses.length:', courses.length)
                        if (p == courses.length) {
                            return res.json({
                                success: true
                            })
                        }

                    })
                }
            })
        })
    },


    rewriteCoursesImages: function (req, res, next) {
        let Course = req.mongoose.model('Course');
        let Media = req.mongoose.model('Media');
        Course.find({}, function (err, courses) {
            _.forEach(courses, (item) => {
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
                            //     Course.findByIdAndUpdate(item._id, {photos: photos}, function (err, courses) {
                            //     })
                            // }
                            //     }
                            // });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Course.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, courses) {
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
            let Course = req.mongoose.model('Course');

            Course.findOne(obj, "title metadescription relatedCourses keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                function (err, course) {
                    if (err || !course) {
                        resolve({});
                        return 0;
                    }
                    let in_stock = "outofstock";
                    let course_price = 0;
                    let course_old_price = 0;
                    let course_prices = [];
                    let course_sale_prices = [];
                    if (course.type === "variable") {
                        if (course.combinations)
                            _.forEach(course.combinations, (c) => {
                                if (c.in_stock) {
                                    in_stock = "instock";
                                    course_prices.push(parseInt(c.price) || 1000000000000);
                                    course_sale_prices.push(parseInt(c.salePrice) || 1000000000000);
                                }

                            });
                        // console.log("gfdsdf");
                        // console.log(course_prices);
                        // console.log(course_sale_prices);
                        let min_price = arrayMin(course_prices);
                        let min_sale_price = arrayMin(course_sale_prices);
                        // console.log("min_price", min_price);
                        // console.log("min_sale_price", min_sale_price);
                        course_price = min_price;
                        if (min_sale_price > 0 && min_sale_price < min_price) {
                            course_price = min_sale_price;
                            course_old_price = min_price;
                        }
                    }
                    if (course.type === "normal") {
                        if (course.in_stock) {
                            in_stock = "instock";
                        }
                        if (course.price) {
                            course_price = course.price;
                        }
                        if (course.price && course.salePrice) {
                            course_price = course.salePrice;
                            course_old_price = course.price;
                        }
                    }

                    // course.title = course['title'][req.headers.lan] || '';
                    // course.description = '';
                    // console.log(c);
                    // });
                    delete course.data;
                    delete course.transaction;
                    // console.log(" course", course);
                    let img = '';
                    if (course.photos && course.photos[0]) {
                        img = course.photos[0]

                    }
                    if (course.thumbnail) {
                        img = course.thumbnail
                    }

                    let obj = {
                        _id: course._id,
                        course_price: course_price || "",
                        course_old_price: course_old_price || "",
                        availability: in_stock || "",
                        image: img,
                        keywords: "",
                        metadescription: "",
                    };
                    if (course["keywords"]) {
                        obj["keywords"] = course["keywords"][req.headers.lan] || course["keywords"];

                    }
                    if (course["metadescription"]) {
                        obj["metadescription"] = course["metadescription"][req.headers.lan] || course["metadescription"];

                    }
                    if (course["title"]) {
                        obj["title"] = course["title"][req.headers.lan] || course["title"];
                    } else {
                        obj["title"] = "";
                    }
                    if (course["course_name"]) {
                        obj["course_name"] = course["course_name"][req.headers.lan] || course["course_name"];
                    } else {
                        obj["course_name"] = "";
                    }
                    if (course["description"]) {
                        obj["description"] = course["description"][req.headers.lan] || course["description"];
                    } else {
                        obj["description"] = "";
                    }
                    if (course["slug"]) {
                        obj["slug"] = course["slug"];
                    }
                    if (course["labels"]) {
                        obj["labels"] = course["labels"];
                    }
                    if (course["relatedCourses"]) {
                        obj["relatedCourses"] = course["relatedCourses"];
                    }
                    resolve(obj);
                    return 0;

                }).lean();
        });
    },
    viewOne: function (req, res, next) {
        let Course = req.mongoose.model('Course');
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
        // console.log('get course: ', obj)
        Course.findOne(obj,
            function (err, course) {
                if (err || !course) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err
                    });
                    return 0;
                }

                let views = course.views;
                if (!views) {
                    views = [];
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Course.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: course.getContactData,
                            views: views
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedCourse) {
                    });
                // delete course.views;
                if (course.views) {
                    course.views = course.views.length;
                } else {
                    course.views = 0;
                }
                if (course.like) {
                    course.like = course.like.length;
                } else {
                    course.like = 0;
                }
                delete course.getContactData;
                delete course.transaction;
                // delete course.relatedCourses;
                delete course.firstCategory;
                // Course.findOne({_id: {$lt: req.params.id}}, "_id title", function (err, pl) {
                //     if (pl && pl._id && pl.title)
                //         course.nextCourse = {_id: pl._id, title: pl.title[req.headers.lan]};
                //     res.json(course);
                //     return 0;
                // }).sort({_id: 1}).limit(1);

                res.json(course);

            }).lean();
    },
    destroy: function (req, res, next) {
        let Course = req.mongoose.model('Course');

        Course.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    status: "trash"
                }
            },
            function (err, course) {
                if (err || !course) {
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: 'delete course ' + course._id,
                        // data:order,
                        action: "delete-course",

                        history: course,
                        course: course._id,
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
