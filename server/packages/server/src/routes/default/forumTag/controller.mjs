import _ from "lodash";
// const rp from 'request-promise');

var self = ({

    all: async function(req, res, next) {
        const ForumTag = req.mongoose.model('ForumTag');
        try {
            const offset = req.params.offset ? parseInt(req.params.offset) : 0;
            const limit = req.params.limit || 10; // Set default limit if not provided
            const search = {}; // Your search filter can be added here

            // console.log("Fetching all attributes...", search);

            // Get the list of attributes with pagination
            const questionCategories = await ForumTag.find(search)
                .skip(offset)
                .sort({ _id: -1 })
                .limit(limit);

            if (!questionCategories) {
                console.log("questionCategories not found!")
                return res.status(404).json({
                    success: false,
                    message: "questionCategories not found!"
                });
            }
            // console.log("questionCategories",questionCategories)

            // Get the total count of documents
            const count = await ForumTag.countDocuments(search);
            // console.log("count",count)

            // Set the total count in the response header
            res.setHeader("X-Total-Count", count);

            // Return the result
            return res.json(questionCategories);

        } catch (err) {
            console.error("Error fetching attributes:", err);
            return res.status(500).json({
                success: false,
                message: "Error fetching attributes!",
                error: err.message
            });
        }
  },
    getListByTopic: async function(req, res, next) {
        console.log("getListByTopic...")
        const ForumTag = req.mongoose.model('ForumTag');
        const ForumTopic = req.mongoose.model('ForumTopic');
        try {
            const topicId = req.params.topicId; // Topic slug (from the URL or request params)
            const offset = req.params.offset ? parseInt(req.params.offset) : 0;
            const limit = req.params.limit ? parseInt(req.params.limit) : 50; // Default limit if not provided

            // First, find the ForumTopic by its slug
            const forumTopic = await ForumTopic.findById(topicId);

            if (!forumTopic) {
                return res.status(404).json({
                    success: false,
                    message: "Forum topic not found!"
                });
            }

            // Now, find the tags for the specific forum topic
            const forumTags = await ForumTag.find({ parent: forumTopic._id }) // Filter tags by the topic's ID
                .skip(offset)
                .sort({ _id: -1 })
                .limit(limit);

            if (!forumTags || forumTags.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No tags found for this topic!"
                });
            }

            // Get the total count of tags for the given topic
            const count = await ForumTag.countDocuments({ parent: forumTopic._id });

            // Set the total count in the response header
            res.setHeader("X-Total-Count", count);

            // Return the list of forum tags
            return res.json(forumTags);

        } catch (err) {
            console.error("Error fetching forum tags by topic:", err);
            return res.status(500).json({
                success: false,
                message: "Error fetching forum tags!",
                error: err.message
            });
        }
  },

    viewOne: function(req, res, next) {

        Attributes.findById(req.params.id,
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
        console.log('creating attributes...', req.body);

        Attributes.create(req.body, function(err, attributes) {
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
        Attributes.findByIdAndDelete(req.params.id,
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
        Attributes.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, attributes) {
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
        Attributes.countDocuments({}, function(err, count) {
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
