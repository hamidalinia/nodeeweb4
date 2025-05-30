import _forEach from "lodash/forEach.js";
import _get from "lodash/get.js";
import global from "#root/global";

export default {
    create: function (req, res, next) {

        console.log('');
        let Model = req.mongoose.model("Link");


        // if (req.body && req.body.slug) {
        //     req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        // }

        if (!req?.body?.from) {
            req.body.from = global.makeid();
        }
        Model.create(req.body, function (err, link) {
            if (err || !link) {
                res.json({
                    err: err,
                    success: false,
                    message: "error!",
                });
                return 0;
            }

            res.json(link);
            return 0;
        });
    },
    getAll: function (req, res, next) {
        const Model = req.mongoose.model("Link");
        const sort = {updatedAt: -1};
        let offset = 0;
        if (req.params.offset) offset = parseInt(req.params.offset);

        let fields = "";
        if (req.headers && req.headers.fields) fields = req.headers.fields;

        let searchParams = null;
        let search = {};
        if (req.params.search) searchParams = req.params.search;
        if (req.query.search) searchParams = req.query.search;
        if (req.query.Search) searchParams = req.query.Search;
        let tempFilter = _get(req, "query.filter", null);

        if (tempFilter) {
            tempFilter = JSON.parse(tempFilter);

            if (tempFilter.search) searchParams = tempFilter.search;
        }

        if (searchParams) {
            search["$or"] = [
                {
                    ["title." + req.headers.lan]: {
                        $exists: true,
                        $regex: searchParams,
                        $options: "i",
                    },
                },
                {
                    ["description." + req.headers.lan]: {
                        $exists: true,
                        $regex: searchParams,
                        $options: "i",
                    },
                },
            ];
        }

        if (req.query && req.query.status) {
            search = {...search, status: req.query.status};
        }

        let tt = Object.keys(req.query);

        _forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Model.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Model.schema.paths[item].instance);
                let split = req.query[item].split(",");
                if (mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split,
                    };
                }
            } else {
                console.log("filter doesnot exist => ", item);
            }
        });

        Model.find(search, fields, function (err, model) {
            if (req.headers.response !== "json") return res.show();

            if (err || !model) return res.json([]);
            Model.countDocuments(search, function (err, count) {
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader("X-Total-Count", count);
                return res.json(model);
            });
        })
            .skip(offset)
            .sort(sort)
            .limit(parseInt(req.params.limit));
    },

};
