import global from "#root/global";
import {differenceInDays} from "date-fns";
import mongoose from "mongoose"

const Self = {
    copy: async function (req, res, next) {
        let Page = req.mongoose.model("Page");

        // Check if the id is provided in the request params
        if (!req.params.id) {
            return res.json({
                success: false,
                message: "Please provide an ID as /copy/:id",
            });
        }

        try {
            // Fetch the page to copy
            const originalPage = await Page.findById(req.params.id);

            if (!originalPage) {
                return res.json({
                    success: false,
                    message: "Page not found",
                });
            }

            // Create a new page by copying the original page
            let copiedPage = new Page(originalPage.toObject());

            // Prevent copying certain fields and update others
            copiedPage._id = undefined;  // Ensure new _id is generated
            copiedPage.createdAt = new Date();  // Set current time for createdAt
            copiedPage.updatedAt = new Date();  // Set current time for updatedAt

            // Do not update certain fields: `path`, `thumbnail`, `photos`
            copiedPage.path = originalPage.path;
            copiedPage.thumbnail = originalPage.thumbnail;
            copiedPage.photos = [...originalPage.photos]; // Copy photos array as is

            // Generate the base of the new slug
            const slugBase = originalPage.slug;
            let newSlug = `${slugBase}-copy`;

            // Query once to get all slugs that match the pattern 'slugBase-copy-%'
            const existingSlugs = await Page.find({
                slug: { $regex: `^${slugBase}-copy-`, $options: 'i' },
            }).select('slug');

            // Find the next available copy number
            let copyNumber = 1;
            if (existingSlugs.length > 0) {
                const numbers = existingSlugs
                    .map(page => {
                        const match = page.slug.match(new RegExp(`${slugBase}-copy-(\\d+)`));
                        return match ? parseInt(match[1], 10) : null;
                    })
                    .filter(num => num !== null);
                copyNumber = Math.max(...numbers) + 1; // Get the next available number
            }

            // Set the final slug
            newSlug = `${slugBase}-copy-${copyNumber}`;
            copiedPage.slug = newSlug;

            // Optionally, you can modify other fields or leave them as they are:
            copiedPage.status = "processing"; // Set status to "processing" or any default value
            copiedPage.title = {fa:`Copy of ${originalPage.title?.fa}`}; // Set title as a copy

            // Save the copied page
            const newPage = await copiedPage.save();

            return res.json({
                success: true,
                message: "Page copied successfully",
                copiedPage: newPage,
            });
        } catch (err) {
            return res.json({
                success: false,
                message: "Error occurred",
                error: err,
            });
        }
    },

    create: function (req, res, next) {
        let Model = req.mongoose.model("Page");

        if (req.body && req.body.slug) {
            req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        }
        Model.create(req.body, function (err, menu) {
            if (err || !menu) {
                res.json({
                    err: err,
                    success: false,
                    message: "error!",
                });
                return 0;
            }
            let modelName = Model.modelName;
            modelName = global.capitalize(modelName);
            // console.log('modelName',modelName,req.headers._id,req.headers.token)
            if (req.headers._id && req.headers.token) {
                let action = {
                    user: req.headers._id,
                    title: "create " + modelName + " " + menu._id,
                    action: "create-" + modelName,
                    data: menu,
                    history: req.body,
                };
                action[modelName] = menu;
                req.submitAction(action);
            }
            global.updateThemeConfig(req.props);

            res.json(menu);
            return 0;
        });
    },

    edit: function (req, res, next) {
        let Model = req.mongoose.model("Page");

        if (!req.params.id) {
            return res.json({
                success: false,
                message: "send /edit/:id please, you did not enter id",
            });
        }
        //export new object saved
        if (req.body.slug) {
            req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        }
        if (!req.body) {
            req.body = {};
        }
        req.body.updatedAt = new Date();
        Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
            function (err, menu) {
                if (err || !menu) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err,
                    });
                    return 0;
                }
                let modelName = Model.modelName;
                modelName = global.capitalize(modelName);
                // console.log('modelName',modelName,req.headers._id,req.headers.token)
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: "edit " + modelName + " " + menu._id,
                        action: "edit-" + modelName,
                        data: menu,
                        history: req.body,
                    };
                    action[modelName] = menu;
                    // console.log('submit action:')

                    req.submitAction(action);
                }
                global.updateThemeConfig(req.props);

                res.json(menu);
                return 0;
            }
        );
    },
    viewOneOld: function (req, res, next) {
        const Model = req.mongoose.model("Page");

        const obj = {};
        if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
        else obj.slug = req.params.id;

        const searchParams = req.query.search;

        if (searchParams) {
            obj["$or"] = [
                {
                    ["title." + req.headers.lan]: {
                        $exists: true,
                        $regex: req.params.search,
                        $options: "i",
                    },
                },
            ];
        }

        Model.findOne(obj, function (err, item) {
            if (err)
                return res.status(503).json({
                    success: false,
                    message: "error!",
                    err: err,
                });

            if (!item)
                return res.status(404).json({
                    success: false,
                });

            // public access
            if (!item.access || (item.access && item.access == "public"))
                return res.json(item);

            if (item.access && item.access == "private") {
                if (!req.headers.token) {
                    return res.status(401).json({
                        success: false,
                        _id: item && item._id ? item._id : null,
                        slug: item && item.slug ? item.slug : null,
                        access: "private",
                        message: "login please",
                    });
                }

                const Customer = req.mongoose.model("Customer");
                let Settings = req.mongoose.model('Settings');

                const Admin = req.mongoose.model("Admin");

                Customer.findOne(
                    {"tokens.token": req.headers.token},
                    "_id , tokens , credit , active , expireDate , data",
                    function (err, customer) {
                        if (err || !customer) {
                            console.error(
                                "==> authenticateCustomer() got error",
                                err,
                                customer
                            );
                            Admin.findOne(
                                {token: req.headers.token},
                                "token , _id",
                                function (err, admin) {
                                    if (err || !admin) {
                                        return res.status(403).json({
                                            success: false,
                                            _id: item && item._id ? item._id : null,
                                            slug: item && item.slug ? item.slug : null,
                                            access: "private",
                                            message: "login please",
                                        });
                                    } else {
                                        return res.json(item);
                                    }
                                }
                            );
                        } else {
                            if (!customer.active) {
                                return res.json({
                                    success: false,
                                    _id: item && item._id ? item._id : null,
                                    slug: item && item.slug ? item.slug : null,
                                    access: "private",
                                    active: customer.active,
                                    message: "customer is not active",
                                });
                            }
                            if (!customer.data) customer.data = {};

                            if (!customer.data.expireDate) {
                                const appointment = new Date();
                                appointment.setDate(appointment.getDate() + 14);
                                let obj = {
                                    $set: {
                                        data: {expireDate: appointment, ...customer.data},
                                    },
                                };
                                Customer.findByIdAndUpdate(
                                    customer._id,
                                    obj,
                                    {
                                        new: true,
                                        select: {
                                            _id: 1,
                                            data: 1,
                                        },
                                    },
                                    function (err, cus) {
                                        console.error("err", err, cus);
                                        item.customerExpireDate = customer.data.expireDate;
                                        return res.json(item);
                                    }
                                );
                            }
                            if (customer.data.expireDate) {
                                const diffInDays = differenceInDays(
                                    new Date(customer.data.expireDate),
                                    new Date()
                                );

                                item.diffInDays = parseInt(diffInDays);
                                item.customerExpireDate = customer.data.expireDate;
                                if (diffInDays < 1) {
                                    return res.json({
                                        success: false,
                                        _id: item && item._id ? item._id : null,
                                        slug: item && item.slug ? item.slug : null,
                                        access: "private",
                                        expire: true,
                                        diffInDays: diffInDays,
                                        message: "customer is expire",
                                    });
                                }

                                return res.json(item);
                            }
                        }
                    }
                );
            }
        }).lean();
    },
    viewOne: async function (req, res, next) {
        try {
            const Model = req.mongoose.model("Page");

            const obj = Self.getQueryObject(req);
            const searchParams = req.query.search;

            if (searchParams) {
                obj["$or"] = [
                    {
                        ["title." + req.headers.lan]: {
                            $exists: true,
                            $regex: req.params.search,
                            $options: "i",
                        },
                    },
                ];
            }

            const item = await Model.findOne(obj, 'access , _id , elements , active , classes , kind , maxWidth , slug , status , updatedAt , createdAt , views , backgroundColor').lean();
            // console.log("item", item)
            if (!item) {
                return res.status(404).json({
                    success: false,
                });
            }

            // Public access
            if (!item.access || item.access === "public") {
                return res.json(item);
            }

            // Private access
            if (item.access === "private") {
                if (!req.headers.token) {
                    return res.status(401).json({
                        success: false,
                        _id: item._id || null,
                        slug: item.slug || null,
                        access: "private",
                        message: "login please",
                    });
                }

                const expireDateMode = await Self.getExpireDateMode();
                const customer = await Self.getCustomer(req.headers.token);
                if (!customer) {
                    const admin = await Self.getAdmin(req.headers.token);
                    if (!admin) {
                        return res.status(403).json({
                            success: false,
                            _id: item._id || null,
                            slug: item.slug || null,
                            access: "private",
                            message: "login please",
                        });
                    } else {
                        return res.json(item);
                    }
                }

                if (!customer.active) {
                    return res.json({
                        success: false,
                        _id: item._id || null,
                        slug: item.slug || null,
                        access: "private",
                        active: customer.active,
                        message: "customer is not active",
                    });
                }

                if (!customer.data) customer.data = {};

                // Handle expireDate if expireDateMode is enabled
                if (expireDateMode) {
                    if (!customer.data.expireDate) {
                        await Self.setExpireDateForCustomer(customer);
                        item.customerExpireDate = customer.data.expireDate;
                        return res.json(item);
                    }

                    const diffInDays = Self.differenceInDays(new Date(customer.data.expireDate), new Date());
                    item.diffInDays = parseInt(diffInDays);
                    item.customerExpireDate = customer.data.expireDate;

                    if (diffInDays < 1) {
                        return res.json({
                            success: false,
                            _id: item._id || null,
                            slug: item.slug || null,
                            access: "private",
                            expire: true,
                            diffInDays,
                            message: "customer is expired",
                        });
                    }
                }

                // If expireDateMode is false, skip the expire date check
                return res.json(item);
            }
        } catch (err) {
            console.error("Error in viewOne:", err);
            return res.status(503).json({
                success: false,
                message: "Error processing the request.",
                err: err,
            });
        }
    },

    getQueryObject: function (req) {
        const obj = {};
        if (mongoose.isValidObjectId(req.params.id) && /^[a-fA-F0-9]{24}$/.test(req.params.id)) {
            obj._id = req.params.id;
        } else {
            obj.slug = req.params.id;
        }
        return obj;
    },


    getExpireDateMode: async function () {
        try {
            const Settings = mongoose.model('Settings');
            const settings = await Settings.findOne({}, 'expireDateMode');
            return settings ? settings.expireDateMode : false;
        } catch (err) {
            console.log("err", err)
            throw new Error("Error fetching settings.");
        }
    },

    getCustomer: async function (token) {
        try {
            const Customer = mongoose.model("Customer");
            return await Customer.findOne(
                {"tokens.token": token},
                "_id tokens credit active expireDate data"
            );
        } catch (err) {
            throw new Error("Error fetching customer.");
        }
    },

    getAdmin: async function (token) {
        try {
            const Admin = mongoose.model("Admin");
            return await Admin.findOne({token}, "token _id");
        } catch (err) {
            throw new Error("Error fetching admin.");
        }
    },

    setExpireDateForCustomer: async function (customer) {
        try {
            const Customer = mongoose.model("Customer");
            const appointment = new Date();
            appointment.setDate(appointment.getDate() + 14);

            const updateObj = {
                $set: {data: {expireDate: appointment, ...customer.data}},
            };

            await Customer.findByIdAndUpdate(customer._id, updateObj, {
                new: true,
                select: {_id: 1, data: 1},
            });
        } catch (err) {
            throw new Error("Error setting expire date for customer.");
        }
    },

    differenceInDays: function (date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

};
export default Self