import _ from 'lodash'

let self = ({
    copy: function (req, res, next) {
        console.log('copy test...', req?.params?._id);
        let Test = req.mongoose.model('Test');

        if (req.headers.response !== "json") {
            return res.show();
        }

        const { _id } = req.params;

        // Validate that _id is provided
        if (!_id) {
            return res.status(400).json({ message: "Test ID is required" });
        }

        // Find the test by _id
        Test.findById(_id)
            .then(test => {
                if (!test) {
                    return res.status(404).json({ message: "Test not found" });
                }

                // Create a copy of the test object
                const newTestData = { ...test.toObject() };
                newTestData._id = undefined;  // Remove the _id to create a new one
                newTestData.title = {fa:`${test.title.fa} - Copy`}; // Optionally modify title to indicate it's a copy
                newTestData.slug = `${test.slug}-${new Date()}`; // Optionally modify title to indicate it's a copy
                newTestData.sort = (test.sort + 1); // Optionally modify title to indicate it's a copy
                newTestData.dependency = test._id; // Optionally modify title to indicate it's a copy
                newTestData.createdAt = new Date();  // Set createdAt to current time for the new test
                newTestData.updatedAt = new Date();  // Set updatedAt to current time for the new test

                // Create the new test in the database
                const newTest = new Test(newTestData);
                return newTest.save()
                    .then(savedTest => {
                        res.status(201).json({
                            message: "Test copied successfully",
                            test: savedTest
                        });
                    })
                    .catch(err => {
                        console.error("Error saving new test:", err);
                        res.status(500).json({ message: "Error copying test", error: err });
                    });
            })
            .catch(err => {
                console.error("Error finding test:", err);
                res.status(500).json({ message: "Error finding test", error: err });
            });
    },
    getAll: function (req, res, next) {
        console.log('getAll tests...');
        let Test = req.mongoose.model('Test');
        let Customer = req.mongoose.model('Customer');  // Make sure the Customer model is available
        let TestResult = req.mongoose.model('TestResult'); // Add TestResult model

        if (req.headers.response !== "json") {
            return res.show();
        }

        let customerId = null;
        if (req?.headers?._id) {
            customerId = req.headers._id;
        }

        let sort = {sort: 1, updatedAt: -1};
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let fields = 'slug _id category updatedAt createdAt sort title photos dependency score practiceText';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields;
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
            search = {...search, status: req.query.status};
        }

        let tt = Object.keys(req.query);
        _.forEach(tt, (item) => {
            if (Test.schema.paths[item]) {
                let split = req.query[item].split(',');
                if (req.mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    };
                }
            }
        });

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

        var q;
        if (search['category.slug']) {
            let TestCategory = req.mongoose.model('TestCategory');

            TestCategory.findOne({slug: search['category.slug']}, function (err, testcategory) {
                if (err || !testcategory) return res.json([]);
                if (testcategory._id) {
                    let ss = {"testCategory": testcategory._id};
                    if (thef.device) ss['attributes.values'] = thef.device;
                    if (thef.brand) ss['attributes.values'] = thef.brand;

                    Test.find(ss, function (err, tests) {
                        Test.countDocuments(ss, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }

                            // Add passable property and score for each test based on dependencies
                            addPassableProperty(tests, customerId, function (updatedTests) {
                                res.setHeader("X-Total-Count", count);
                                return res.json(updatedTests);
                            });
                        });
                    }).populate('category', '_id slug name').skip(offset).sort(sort).limit(parseInt(req.params.limit));
                }
            });
        } else {
            if (!search['status']) search['status'] = 'published';

            q = Test.find(search, fields)
                .populate('category', '_id slug name')
                .populate('dependency', '_id slug title')
                .skip(offset)
                .sort(sort)
                .limit(parseInt(req.params.limit));

            q.exec(function (err, model) {
                if (err || !model) return res.json([]);

                Test.countDocuments(search, function (err, count) {
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }

                    // Add passable property and score for each test based on dependencies
                    addPassableProperty(model, customerId, function (updatedTests) {
                        res.setHeader("X-Total-Count", count);
                        return res.json(updatedTests);
                    });
                });
            });
        }

        function addPassableProperty(tests, customerId, callback) {
            if (!customerId) return callback(tests);

            // Fetch the test results for the customer
            const _idsToFind = tests.map(t => t._id);
            console.log("_idsToFind", _idsToFind);

            TestResult.find({customer: customerId, test: {$in: _idsToFind}}, function (err, testResults) {
                if (err || !testResults) return callback(tests);

                console.log("testResults", testResults);
                const testResultsMap = testResults.reduce((acc, result) => {
                    console.log("result.test", result.test);
                    acc[result.test.toString()] = result;
                    return acc;
                }, {});

                console.log("testResultsMap", testResultsMap);

                // Add passable property and score for each test
                const updatedTests = tests.map(test => {
                    console.log("test._id", test._id);

                    const testResult = testResultsMap[test._id.toString()];
                    const customerScore = testResult ? testResult.score : 0;
                    const passed = testResult ? testResult.passed : false;
                    console.log("testResult", testResult);

                    // Handle dependency: If the test has a dependency, check if the dependency is passed
                    const dependencyPassed = test.dependency ?
                        testResultsMap[test.dependency._id.toString()]?.passed : true; // Use test.dependency._id for correct comparison
                    console.log("test.dependency", test.dependency);
                    console.log("dependencyPassed", dependencyPassed);

                    return {
                        ...test.toObject(),
                        passable: test.dependency ? dependencyPassed : true,
                        customerScore: customerScore,  // Add the score to the test object
                        passed: passed  // Add the passed status to the test object
                    };
                });

                return callback(updatedTests);
            });
        }

    }
});
export default self;