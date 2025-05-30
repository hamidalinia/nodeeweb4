import _ from "lodash";
// const rp from 'request-promise');

var self = ({
    all: async function(req, res, next) {
        console.log("Fetching all product categories...");

        const ProductCategory = req.mongoose.model("ProductCategory");
        const Product = req.mongoose.model("Product");

        let offset = req.params.offset ? parseInt(req.params.offset) : 0;
        let search = {};

        // Function to check if the value is stringified JSON
        function isStringified(jsonValue) {
            try {
                return JSON.parse(jsonValue);
            } catch (err) {
                return jsonValue;
            }
        }

        // Build the search object based on filters or search parameters
        if (req.query.filter) {
            const filterData = isStringified(req.query.filter);
            if (typeof filterData === "object") {
                if (filterData.search) {
                    search["name." + req.headers.lan] = {
                        $exists: true,
                        $regex: filterData.search,
                        $options: "i"
                    };
                    delete filterData.search;
                }
                if (filterData.q) {
                    search["name." + req.headers.lan] = {
                        $exists: true,
                        $regex: filterData.q,
                        $options: "i"
                    };
                    delete filterData.q;
                }
                Object.assign(search, filterData);
            }
        }

        if (req.query.Search) {
            search["name." + req.headers.lan] = {
                $exists: true,
                $regex: req.query.Search,
                $options: "i"
            };
        }

        // Fetch product categories and include product counts for each
        try {
            const productCategories = await ProductCategory.find(search)
                .skip(offset)
                .sort({ _id: -1 })
                .limit(req.params.limit)
                .exec();

            if (!productCategories || productCategories.length === 0) {
                return res.json({
                    success: false,
                    message: "No product categories found!"
                });
            }

            // Log the fetched product categories
            // console.log('Fetched product categories:', productCategories);

            // Count products for each category and add the product count to each category
            const productCategoryPromises = productCategories.map(async (category) => {
                try {
                    // console.log(`Counting products for category ${category._id}`);
                    // Count products where productCategory contains this category _id
                    const productCount = await Product.countDocuments(
                        { productCategory: { $in: [req.mongoose.Types.ObjectId(category._id)] } }
                    ).exec();

                    // console.log(`Product count for category ${category._id}: ${productCount}`);
                    return {
                        ...category.toObject(),  // Make sure to return a plain object with productCount
                        productCount: productCount
                    }; // Add product count field to each category
                } catch (err) {
                    // console.error(`Error counting products for category ${category._id}:`, err);
                    return {
                        ...category.toObject(),
                        productCount: 0 // Default to 0 if there's an error
                    };
                }
            });

            // Wait for all the product count promises to resolve
            const categoriesWithCount = await Promise.all(productCategoryPromises);

            // Get the total count of the product categories
            const totalCount = await ProductCategory.countDocuments(search).exec();

            // Set the X-Total-Count header and return the categories with product counts
            res.setHeader("X-Total-Count", totalCount);
            res.json(categoriesWithCount); // Send the categories with the productCount field
        } catch (err) {
            console.error("Error fetching product categories:", err);
            res.json([]);
        }
    },



    updatePricesOld: async function(req, res, next) {
        try {
            const Product = req.mongoose.model("Product");

            const { id } = req.params; // Category ID
            const { updateType, value, operation } = req.body; // 'percentage' or 'constant' and the value, and operation ('add' or 'subtract')
            if (!id || !updateType || isNaN(value) || !['add', 'subtract'].includes(operation)) {
                return res.status(400).json({ success: false, message: 'Invalid input parameters' });
            }

            // Fetch all products for the category
            const products = await Product.find({ productCategory: id });

            // Update the price of each product
            const updatedProducts = [];
            for (let product of products) {
                let updatedPrice = product.price;
                let updatedSalePrice = product.salePrice;

                if (updateType === 'percentage') {
                    // Calculate the percentage update (add or subtract based on operation)
                    const percentageChange = (updatedPrice * value) / 100;
                    if (operation === 'add') {
                        updatedPrice = updatedPrice + percentageChange;
                        if (updatedSalePrice) updatedSalePrice = updatedSalePrice + percentageChange;
                    } else if (operation === 'subtract') {
                        updatedPrice = updatedPrice - percentageChange;
                        if (updatedSalePrice) updatedSalePrice = updatedSalePrice - percentageChange;
                    }
                } else if (updateType === 'constant') {
                    // Calculate the constant price change (add or subtract based on operation)
                    if (operation === 'add') {
                        updatedPrice = updatedPrice + value;
                        if (updatedSalePrice) updatedSalePrice = updatedSalePrice + value;
                    } else if (operation === 'subtract') {
                        updatedPrice = updatedPrice - value;
                        if (updatedSalePrice) updatedSalePrice = updatedSalePrice - value;
                    }
                }

                // Update the product's price and salePrice
                const updatedProduct = await Product.findByIdAndUpdate(product._id, {
                    price: updatedPrice,
                    salePrice: updatedSalePrice !== undefined ? updatedSalePrice : product.salePrice, // Only update if salePrice exists
                }, { new: true });

                updatedProducts.push(updatedProduct);
            }

            return res.json({
                success: true,
                message: 'Prices updated successfully',
                updatedProductsCount: updatedProducts.length,
            });
        } catch (error) {
            console.error('Error updating prices:', error);
            return res.status(500).json({ success: false, message: 'Failed to update prices', error: error.message });
        }
    },
    updatePrices: async function(req, res, next) {
        try {
            const Product = req.mongoose.model("Product");

            const { id } = req.params; // Category ID
            const { updateType, value, operation, updateSalePrice } = req.body; // Added updateSalePrice
            if (!id || !updateType || isNaN(value) || !['add', 'subtract'].includes(operation)) {
                return res.status(400).json({ success: false, message: 'Invalid input parameters' });
            }

            // Fetch all products for the category
            const products = await Product.find({ productCategory: id });

            // Update the price of each product
            const updatedProducts = [];
            for (let product of products) {
                let updatedPrice = product.price;
                let updatedSalePrice = product.salePrice;

                // Only process updateSalePrice logic if it is true and in subtract operation
                if (updateSalePrice && operation === 'subtract') {
                    if (updateType === 'percentage') {
                        // Handle percentage subtraction for salePrice
                        const percentageChange = (updatedPrice * value) / 100;
                        updatedSalePrice = updatedPrice - percentageChange;
                    } else if (updateType === 'constant') {
                        // Handle constant subtraction for salePrice
                        updatedSalePrice = updatedPrice - value;
                    }
                } else {
                    if (updateType === 'percentage') {
                        // Calculate the percentage update (add or subtract based on operation)
                        const percentageChange = (updatedPrice * value) / 100;
                        console.log("percentageChange",percentageChange)
                        if (operation === 'add') {
                            updatedPrice = updatedPrice + percentageChange;
                            if (updatedSalePrice) updatedSalePrice = updatedSalePrice + percentageChange;
                        } else if (operation === 'subtract') {
                            updatedPrice = updatedPrice - percentageChange;
                            if (updatedSalePrice) updatedSalePrice = updatedSalePrice - percentageChange;
                        }
                    } else if (updateType === 'constant') {
                        // Calculate the constant price change (add or subtract based on operation)
                        if (operation === 'add') {
                            updatedPrice = updatedPrice + value;
                            if (updatedSalePrice) updatedSalePrice = updatedSalePrice + value;
                        } else if (operation === 'subtract') {
                            updatedPrice = updatedPrice - value;
                            if (updatedSalePrice) updatedSalePrice = updatedSalePrice - value;
                        }
                    }
                }

                // Update the product's price and salePrice
                const updatedProduct = await Product.findByIdAndUpdate(product._id, {
                    price: updatedPrice,
                    salePrice: updatedSalePrice !== undefined ? updatedSalePrice : product.salePrice, // Only update if salePrice exists
                }, { new: true });

                updatedProducts.push(updatedProduct);
            }

            return res.json({
                success: true,
                message: 'Prices updated successfully',
                updatedProductsCount: updatedProducts.length,
            });
        } catch (error) {
            console.error('Error updating prices:', error);
            return res.status(500).json({ success: false, message: 'Failed to update prices', error: error.message });
        }
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
        ProductCategory.find(search, function(err, product_categories) {
            // console.log('err', err);
            // console.log('product_categories', product_categories);
            if (err || !product_categories) {
                res.json({
                    success: false,
                    message: "error!",
                    product_categories: product_categories
                });
                return 0;
            }
            ProductCategory.countDocuments({}, function(err, count) {
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
                res.json(product_categories);
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
            ProductCategory.find(search, function(err, product_categories) {
                if (err || !product_categories) {
                    resolve([]);

                }
                ProductCategory.countDocuments({}, function(err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(product_categories, (c) => {
                        c.name = c["name"][req.headers.lan];
                        // console.log(c);
                    });
                    resolve(product_categories);


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

            await ProductCategory.find(search, async function(err, product_categories) {
                if (err || !product_categories) {
                    return await ([]);
                }
                await console.log("allSXml1", "allSXml1");
                let cd = new Date();
                await _.forEach(product_categories, async (c) => {
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
    level:

        function(req, res, next) {
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
            ProductCategory.find(search, function(err, product_categories) {
                if (err || !product_categories) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                ProductCategory.countDocuments({}, function(err, count) {
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
                    _.forEach(product_categories, (c) => {
                        c.name = c["name"][req.headers.lan];
                        // console.log(c);
                    });
                    res.json(product_categories);
                    return 0;


                });

            }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
        }

    ,
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
        ProductCategory.find(search, function(err, product_categories) {
            if (err) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            if (!product_categories) {
                product_categories = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(product_categories);
            _.forEach(product_categories, (c) => {
                c.name = c["name"][req.headers.lan];
                // console.log(c);
            });
            // product_categories.push({});
            ProductCategory.countDocuments({}, function(err, count) {
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
                    ProductCategory.findById(req.params.catId, function(err, mainCat) {
                        // console.log('here');
                        // if (product_categories && product_categories.length >= 0) {
                        //   if (mainCat) {
                        //     mainCat.back = true;
                        //     mainCat.name = mainCat['name'][req.headers.lan];
                        //     product_categories[product_categories.length] = mainCat;
                        //   }
                        // }
                        res.json(product_categories.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(product_categories.reverse());
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
        ProductCategory.find(search, function(err, product_categories) {
            if (err) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            if (!product_categories) {
                product_categories = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(product_categories);
            _.forEach(product_categories, (c) => {
                c.name = c["name"][req.headers.lan];
                // console.log(c);
            });
            ProductCategory.countDocuments({}, function(err, count) {
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
                    ProductCategory.findById(req.params.catId, function(err, mainCat) {
                        // console.log('here');
                        if (product_categories && product_categories.length >= 0) {
                            if (mainCat) {
                                mainCat.back = true;
                                mainCat.name = mainCat["name"][req.headers.lan];
                                product_categories[product_categories.length] = mainCat;
                            }
                        }
                        res.json(product_categories.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(product_categories.reverse());
                    return 0;
                }


            });

        }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
    }
    ,
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
            ProductCategory.find(search, function(err, product_categories) {
                if (err) {
                    resolve([]);
                    return 0;
                }
                if (!product_categories) {
                    product_categories = [];

                }
                _.forEach(product_categories, (c) => {
                    c.name = c["name"][req.headers.lan];
                });
                ProductCategory.countDocuments({}, function(err, count) {
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
                        ProductCategory.findById(req.params.catId, function(err, mainCat) {
                            // console.log('here');
                            if (product_categories && product_categories.length >= 0) {
                                if (mainCat) {
                                    mainCat.back = true;
                                    mainCat.name = mainCat["name"][req.headers.lan];
                                    product_categories[product_categories.length] = mainCat;
                                }
                            }
                            resolve(product_categories.reverse());
                            return 0;
                        }).lean();
                    else {
                        resolve(product_categories.reverse());
                        return 0;
                    }


                });

            }).skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
        });
    }
    ,
    viewOne: function(req, res, next) {
        console.log("viewOne")
        const ProductCategory = req.mongoose.model("ProductCategory");

        function isValidObjectId(value) {
            return req.mongoose.Types.ObjectId.isValid(value);
        }
        const query = isValidObjectId(req.params.id)
            ? { _id: req.params.id }
            : { slug: req.params.id };

        ProductCategory.findOne(query,
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

        ProductCategory.create(req.body, function(err, attributes) {
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
        ProductCategory.findByIdAndDelete(req.params.id,
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
        ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, attributes) {
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

    productCount: function (req, res, next) {
        let Product = req.mongoose.model("Product");

        // Debugging input
        console.log('Params ID:', req.params.id);
        console.log('Query:', { productCategory: { $in: [req.params.id] } });

        try {
            Product.countDocuments(
                { productCategory: { $in: [req.mongoose.Types.ObjectId(req.params.id)] } },
                function (err, count) {
                    console.log('Count Documents:', count);

                    if (err) {
                        console.error('Error counting documents:', err);
                        return res.json({
                            success: false,
                            message: "Error counting documents",
                            err: err
                        });
                    }

                    return res.json({
                        success: true,
                        count: count
                    });
                }
            );
        } catch (error) {
            console.error('Unexpected error:', error);
            return res.json({
                success: false,
                message: "Unexpected error occurred",
                error: error
            });
        }
    },
    count: function(req, res, next) {
        ProductCategory.countDocuments({}, function(err, count) {
            // console.log('countDocuments', count);
            if (err) {
                res.json({
                    success: false,
                    message: "Error counting documents",
                    err: err
                });
                return;
            }


            res.json({
                success: true,
                count: count
            });
            return 0;


        });
    },
    deleteAll: function (req, res, next) {
        let ProductCategory = req.mongoose.model('ProductCategory');

        ProductCategory.deleteMany(function (err, productCategories) {
                if (err || !productCategories) {

                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: 'delete all product categories',
                        // data:order,
                        action: "delete-product-categories",

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
