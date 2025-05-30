import _ from 'lodash'

let self = ({

    getAll: function (req, res, next) {
        console.log('getAll tests...');
        let Test = req.mongoose.model('Test');
        let Customer = req.mongoose.model('Customer');  // Make sure the Customer model is available

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

        let fields = 'slug _id category updatedAt createdAt sort title photos dependency';
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

            // Fetch the customer to check their passed tests
            Customer.findById(customerId, 'tests', function (err, customer) {
                if (err || !customer) return callback(tests);

                // Check if customer passed the tests and their dependencies
                const passedTests = customer.tests.filter(test => test.passed).map(test => test.test.toString());

                // Add passable property and score for each test
                const updatedTests = tests.map(test => {
                    // Find the customer's score for the test, or set it to 0 if not passed
                    const customerTest = customer.tests.find(ct => ct.test.toString() === test._id.toString());
                    const score = customerTest ? customerTest.score : 0;

                    // Handle dependency as a single object reference (ObjectId)
                    const dependencyPassed = test.dependency && passedTests.includes(test.dependency.toString());

                    return {
                        ...test.toObject(),
                        passable: test.dependency ? dependencyPassed : true,
                        score: score  // Add the score to the test object
                    };
                });

                return callback(updatedTests);
            });
        }
    },

    addTestResult: async function (req, res, next) {
        const {score, passed} = req.body;
        const customerId = req.headers._id;
        const testId = req.params.testId
        // Validate that all required fields are provided
        if (!customerId || !testId || score === undefined || passed === undefined) {
            return res.status(400).json({message: "Missing required fields: customerId, testId, score, passed"});
        }

        try {
            // Find the customer in the database
            const Customer = req.mongoose.model("Customer");
            const TestResult = req.mongoose.model("TestResult");

            const customer = await Customer.findById(customerId);
            if (!customer) {
                return res.status(404).json({message: "Customer not found"});
            }

            // Check if a test result already exists for this customer and test
            let testResult = await TestResult.findOne({customer: customerId, test: testId});

            if (testResult) {
                // Update the existing test result
                testResult.score = score;
                testResult.passed = passed;
                await testResult.save();
                return res.status(200).json({message: "Test result updated successfully"});
            } else {
                // Create a new test result
                const newTestResult = new TestResult({
                    customer: customerId,
                    test: testId,
                    score: score,
                    passed: passed,
                });
                await newTestResult.save();
                return res.status(201).json({message: "Test result added successfully"});
            }
        } catch (err) {
            console.error("Error processing test result:", err);
            res.status(500).json({message: "Error processing test result", error: err});
        }
    }


});
export default self;