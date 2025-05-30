import _ from "lodash";
// const rp from 'request-promise');

var self = ({

    all: function(req, res, next) {
        let TestCategory = req.mongoose.model('TestCategory');

        console.log("fetch all...");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        TestCategory.find(search, function(err, testcategorys) {
            if (err || !testcategorys) {
                res.json({
                    success: false,
                    message: "error testcategorys!",
                    testcategorys: testcategorys
                });
                return 0;
            }
            TestCategory.countDocuments({}, function(err, count) {
                if (err || !count) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                res.json(testcategorys);
                return 0;


            });

        }).skip(offset).sort({ _id: -1 }).limit((req.params.limit));
    },
    f: function(req, res, next) {
        console.log("fetch all f...");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search["parent"] = {
            $exists: false
        };
        // console.log('search', search);
        TestCategory.find(search, function(err, testcategorys) {
            // console.log('err', err);
            // console.log('testcategorys', testcategorys);
            if (err || !testcategorys) {
                res.json({
                    success: false,
                    message: "error!",
                    testcategorys: testcategorys
                });
                return 0;
            }
            TestCategory.countDocuments({}, function(err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                res.json(testcategorys);
                return 0;


            });

        }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
    },

    allS: function(req, res, next) {
        return new Promise(function(resolve, reject) {
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            search["name." + req.headers.lan] = {
                $exists: true
            };
            TestCategory.find(search, function(err, testcategorys) {
                if (err || !testcategorys) {
                    resolve([]);

                }
                TestCategory.countDocuments({}, function(err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(testcategorys, (c) => {
                        c.name = c["name"][req.headers.lan];
                        // console.log(c);
                    });
                    resolve(testcategorys);


                });

            }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
        });
    },
    allSXml: async function() {
        let XTL = [{
            url: "/",
            lastMod: new Date(),
            changeFreq: "hourly"
        },
            {
                url: "/add-new-post",
                lastMod: new Date(),
                changeFreq: "monthly"
            }], offset = 0, search = {};
        return new Promise(async function(resolve, reject) {

            await TestCategory.find(search, async function(err, testcategorys) {
                if (err || !testcategorys) {
                    return await ([]);
                }
                await console.log("allSXml1", "allSXml1");
                let cd = new Date();
                await _.forEach(testcategorys, async (c) => {
                    await XTL.push({
                        url: "/attributes/" + c._id + "/" + c.name["fa"],
                        lastMod: cd,
                        changeFreq: "daily"
                    });
                });
                search["active"] = true;
                await Post.find(search, async function(err, posts) {
                    await _.forEach(posts, async (p) => {
                        await XTL.push({
                            url: "/p/" + p._id + "/" + p.title["fa"],
                            lastMod: p.updatedAt,
                            changeFreq: "weekly"
                        });
                    });
                    resolve(XTL);
                }).skip(offset).sort({ _id: -1 });


            }).skip(offset).sort({ _id: -1 });
        });
    },
    level:function(req, res, next) {
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            if (!req.params.catId) {
                search["parent"] = null;
            } else {
                search["parent"] = req.params.catId;
            }
            search["name." + req.headers.lan] = {
                $exists: true
            };
            // console.log(search);
            TestCategory.find(search, function(err, testcategorys) {
                if (err || !testcategorys) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                TestCategory.countDocuments({}, function(err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        res.json({
                            success: false,
                            message: "error!"
                        });
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(testcategorys, (c) => {
                        c.name = c["name"][req.headers.lan];
                        // console.log(c);
                    });
                    res.json(testcategorys);
                    return 0;


                });

            }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
        },
    s: function(req, res, next) {
        console.log("s()...");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (!req.params.catId) {
            search["parent"] = null;
        } else {
            search["parent"] = req.params.catId;
        }
        search["name." + req.headers.lan] = {
            $exists: true
        };
        // console.log('jhgfghj', search);
        TestCategory.find(search, function(err, testcategorys) {
            if (err) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            if (!testcategorys) {
                testcategorys = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(testcategorys);
            _.forEach(testcategorys, (c) => {
                c.name = c["name"][req.headers.lan];
                // console.log(c);
            });
            // testcategorys.push({});
            TestCategory.countDocuments({}, function(err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                if (req.params.catId)
                    TestCategory.findById(req.params.catId, function(err, mainCat) {
                        // console.log('here');
                        // if (testcategorys && testcategorys.length >= 0) {
                        //   if (mainCat) {
                        //     mainCat.back = true;
                        //     mainCat.name = mainCat['name'][req.headers.lan];
                        //     testcategorys[testcategorys.length] = mainCat;
                        //   }
                        // }
                        res.json(testcategorys.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(testcategorys.reverse());
                    return 0;
                }


            });

        }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit)).lean();
    },
    sidebar: function(req, res, next) {
        console.log("sidebar()...");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (!req.params.catId) {
            search["parent"] = null;
        } else {
            search["parent"] = req.params.catId;
        }
        search["name." + req.headers.lan] = {
            $exists: true
        };
        // console.log('jhgfghj', search);
        TestCategory.find(search, function(err, testcategorys) {
            if (err) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            if (!testcategorys) {
                testcategorys = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(testcategorys);
            _.forEach(testcategorys, (c) => {
                c.name = c["name"][req.headers.lan];
                // console.log(c);
            });
            TestCategory.countDocuments({}, function(err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                if (req.params.catId)
                    TestCategory.findById(req.params.catId, function(err, mainCat) {
                        // console.log('here');
                        if (testcategorys && testcategorys.length >= 0) {
                            if (mainCat) {
                                mainCat.back = true;
                                mainCat.name = mainCat["name"][req.headers.lan];
                                testcategorys[testcategorys.length] = mainCat;
                            }
                        }
                        res.json(testcategorys.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(testcategorys.reverse());
                    return 0;
                }


            });

        }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
    },
    sidebarS: function(req, res, next) {
        return new Promise(function(resolve, reject) {

            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            if (!req.params.catId) {
                search["parent"] = null;
            } else {
                search["parent"] = req.params.catId;
            }
            search["name." + req.headers.lan] = {
                $exists: true
            };
            // console.log('jhgfghj', search);
            TestCategory.find(search, function(err, testcategorys) {
                if (err) {
                    resolve([]);
                    return 0;
                }
                if (!testcategorys) {
                    testcategorys = [];

                }
                _.forEach(testcategorys, (c) => {
                    c.name = c["name"][req.headers.lan];
                });
                TestCategory.countDocuments({}, function(err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        res.json({
                            success: false,
                            message: "error!"
                        });
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    if (req.params.catId)
                        TestCategory.findById(req.params.catId, function(err, mainCat) {
                            // console.log('here');
                            if (testcategorys && testcategorys.length >= 0) {
                                if (mainCat) {
                                    mainCat.back = true;
                                    mainCat.name = mainCat["name"][req.headers.lan];
                                    testcategorys[testcategorys.length] = mainCat;
                                }
                            }
                            resolve(testcategorys.reverse());
                            return 0;
                        }).lean();
                    else {
                        resolve(testcategorys.reverse());
                        return 0;
                    }


                });

            }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
        });
    },
    viewOne: function(req, res, next) {

        TestCategory.findById(req.params.id,
            function(err, attributes) {
                if (err || !attributes) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.json(attributes);
                return 0;

            });
    }
    ,
    exparty: function(req, res, next) {

        res.json(s);
        return 0;

    }
    ,
    create: function(req, res, next) {
        // console.log('creating attributes...', req.body);

        TestCategory.create(req.body, function(err, attributes) {
            if (err || !attributes) {
                res.json({
                    err: err,
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            res.json(attributes);
            return 0;

        });
    }
    ,
    destroy: function(req, res, next) {
        TestCategory.findByIdAndDelete(req.params.id,
            function(err, attributes) {
                if (err || !attributes) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.json({
                    success: true,
                    message: "Deleted!"
                });
                return 0;


            }
        );
    }
    ,
    edit: function(req, res, next) {
        TestCategory.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, attributes) {
            if (err || !attributes) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }

            res.json(attributes);
            return 0;

        });
    }
    ,
    count: function(req, res, next) {
        TestCategory.countDocuments({}, function(err, count) {
            // console.log('countDocuments', count);
            if (err || !count) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }

            res.json({
                success: true,
                count: count
            });
            return 0;


        });
    }



});
export default self;
