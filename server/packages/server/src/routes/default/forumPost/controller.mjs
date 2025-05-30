import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

const self = {

        all: async function (req, res, next) {
            const ForumPost = req.mongoose.model('ForumPost');
            try {
                const offset = req.params.offset ? parseInt(req.params.offset) : 0; // Default offset is 0
                const limit = req.params.limit ? parseInt(req.params.limit) : 10; // Default limit if not provided is 10
                const {forumTags, forumTopic} = req.query; // Retrieve filters from query params

                const search = {};  // Initialize the search object

                // Add filters based on the query parameters
                if (forumTags && forumTags.trim() !== '') {
                    // Split the tags by comma and filter by the given tags
                    const tagsArray = forumTags.split(',').map(tag => tag.trim());
                    search.forumTag = {$in: tagsArray};  // Filter by multiple tags
                }

                if (forumTopic) {
                    // Validate forumTopic to ensure it's a valid ID (optional, depending on your schema validation)
                    search.forumTopic = forumTopic;  // Filter by the given forumTopic
                }
                console.log("search", search);

                // Use aggregation to get forum posts with the last photo for each customer
                const forumPosts = await ForumPost.aggregate([
                    {
                        $match: search,  // Filter by the search object
                    },
                    {
                        $skip: offset,  // Pagination - skip offset
                    },
                    {
                        $limit: limit,  // Pagination - limit to the given number
                    },
                    {
                        $sort: {_id: -1},  // Sort by descending order (latest first)
                    },
                    {
                        $lookup: {
                            from: 'customers',  // Assuming 'customers' is the collection name
                            localField: 'customer',  // Field to join on
                            foreignField: '_id',  // Join by the customer's _id
                            as: 'customer',
                        },
                    },
                    {
                        $unwind: {
                            path: '$customer',  // Unwind the customer array (since we used $lookup)
                            preserveNullAndEmptyArrays: false,  // Ensures no documents are dropped
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            text: 1,
                            forumTopic: 1,
                            forumTag: 1,
                            status: 1,
                            views: {
                                $size: {$ifNull: ["$views", []]} // If 'views' is missing or null, use an empty array
                            },
                            replyCount: {
                                $size: {$ifNull: ["$reply", []]} // Count the number of replies, default to 0 if 'reply' is null
                            },
                            likeCount: {
                                $ifNull: ["$likeCount", 0] // Return 0 if likeCount is null or doesn't exist
                            },
                            code: 1,
                            customer: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                photos: {$arrayElemAt: ['$customer.photos', -1]},  // Get the last element of the photos array
                            },
                            media: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            customerLiked: {
                                // Check if the current customer has liked this post
                                $cond: {
                                    if: {
                                        $and: [
                                            {$ne: [req.headers._id, null]}, // Ensure customer ID is present
                                            {$ne: [req.headers._id, ""]}, // Ensure customer ID is not empty
                                            {$isArray: "$likeList"} // Ensure likeList is an array
                                        ]
                                    },
                                    then: {
                                        $in: [req.headers._id, {
                                            $ifNull: ["$likeList", []] // Ensure likeList is always an array
                                        }]
                                    }, // Check if customer liked
                                    else: false // If no customer ID or invalid likeList, assume they didn't like the post
                                }
                            }
                        },
                    },
                    {
                        $lookup: {
                            from: 'forumTopics',  // Populate forumTopic collection
                            localField: 'forumTopic',
                            foreignField: '_id',
                            as: 'forumTopic',
                        },
                    },
                    {
                        $lookup: {
                            from: 'forumTags',  // Populate forumTag collection
                            localField: 'forumTag',
                            foreignField: '_id',
                            as: 'forumTag',
                        },
                    },

                ]);

                if (!forumPosts || forumPosts.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "No forum posts found with the given filters!"
                    });
                }

                // Get the total count of documents that match the search criteria (ignoring pagination)
                const count = await ForumPost.countDocuments(search);

                // Set the total count in the response header
                res.setHeader("X-Total-Count", count);

                // Return the filtered, populated forum posts
                return res.json(forumPosts);

            } catch (err) {
                console.error("Error fetching forum posts:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error fetching forum posts!",
                    error: err.message
                });
            }

        },
        reply: async function (req, res, next) {
            let ForumPost = req.mongoose.model('ForumPost');
            let ForumPostReply = req.mongoose.model('ForumPostReply');
            const ObjectId = req.mongoose.Types.ObjectId;

            // Helper function to validate ObjectId
            const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

            const {postId, replyId, text, media} = req.body;  // Extract postId, replyId, text, media from the request body
            const customerId = req.headers._id;  // Assuming the customer ID is in the request headers

            // Check if the provided postId is a valid ObjectId
            if (!isValidObjectId(postId)) {
                return res.status(400).json({error: 'Invalid forum post ID.'});
            }

            // Find the forum post by postId
            const forumPost = await ForumPost.findById(postId);
            if (!forumPost) {
                return res.status(404).json({error: 'Forum post not found.'});
            }

            // Create a new reply object
            const newReply = new ForumPostReply({
                customer: customerId,
                text,
                media,
                createdAt: new Date(),
            });

            // If replyId is provided, it means the reply is to an existing reply (nested reply)
            if (replyId) {
                // Check if the provided replyId is valid
                if (!isValidObjectId(replyId)) {
                    return res.status(400).json({error: 'Invalid reply ID.'});
                }

                // Find the parent reply by replyId
                const parentReply = await ForumPostReply.findById(replyId);
                if (!parentReply) {
                    return res.status(404).json({error: 'Reply not found.'});
                }

                // Add the new reply's ID to the parent reply's replies array (recursive nesting)
                parentReply.replies.push(newReply._id);
                await parentReply.save();

                // Save the new reply
                await newReply.save();

                return res.status(200).json({message: 'Reply added to the reply successfully.'});
            }

            // Otherwise, the reply is directly to the original forum post
            forumPost.reply.push(newReply._id);
            await forumPost.save();

            // Save the new reply
            await newReply.save();

            return res.status(200).json({message: 'Reply added to the post successfully.'});
        },
        like: function (req, res, next) {
            let ForumPost = req.mongoose.model('ForumPost');
            const ObjectId = req.mongoose.Types.ObjectId;

// Helper function to validate ObjectId
            function isValidObjectId(id) {
                return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
            }

            // Ensure post ID is valid
            if (!req.params.id || !isValidObjectId(req.params.id)) {
                return res.json({
                    success: false,
                    message: "Invalid post ID"
                });
            }

            const postId = req.params.id;
            const customerId = req.headers._id; // The ID of the customer who is liking/unliking the post

            // Ensure customer ID is valid
            if (!ObjectId.isValid(customerId)) {
                return res.json({
                    success: false,
                    message: "Invalid customer ID"
                });
            }

            // Find the post by its ID
            ForumPost.findById(postId, function (err, post) {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Error while fetching post",
                        err: err.message
                    });
                }

                if (!post) {
                    return res.json({
                        success: false,
                        message: "Post not found"
                    });
                }

                // Check if the customer has already liked the post
                const alreadyLiked = post.likeList.includes(customerId);

                if (alreadyLiked) {
                    // If the customer has already liked the post, remove them from the likeList and decrement the likeCount
                    ForumPost.updateOne(
                        {_id: postId},
                        {
                            $pull: {likeList: customerId},
                            $inc: {likeCount: -1}
                        },
                        function (updateErr, updateResult) {
                            if (updateErr) {
                                return res.json({
                                    success: false,
                                    message: "Error while unliking the post",
                                    err: updateErr.message
                                });
                            }
                            res.json({
                                success: true,
                                message: "Post unliked successfully",
                                likeCount: post.likeCount - 1
                            });
                        }
                    );
                } else {
                    // If the customer hasn't liked the post yet, add them to the likeList and increment the likeCount
                    ForumPost.updateOne(
                        {_id: postId},
                        {
                            $push: {likeList: customerId},
                            $inc: {likeCount: 1}
                        },
                        function (updateErr, updateResult) {
                            if (updateErr) {
                                return res.json({
                                    success: false,
                                    message: "Error while liking the post",
                                    err: updateErr.message
                                });
                            }
                            res.json({
                                success: true,
                                message: "Post liked successfully",
                                likeCount: post.likeCount + 1
                            });
                        }
                    );
                }
            });
        },


        viewOne: function (req, res, next) {
            console.log("viewOne forumPost", req.headers._id, req.headers.role);

            let ForumPost = req.mongoose.model('ForumPost');
            const ObjectId = req.mongoose.Types.ObjectId;

            function isValidObjectId(id) {
                return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
            }

            let obj = {};
            console.log('Request ID:', req.params.id);

            if (isValidObjectId(req.params.id)) {
                obj["_id"] = new ObjectId(req.params.id);
            } else {
                obj["slug"] = req.params.id;
            }

            console.log('Query Object:', obj);

            ForumPost.findOne(obj)
                .populate('customer', 'firstName lastName photos')  // Populate customer with specific fields
                .populate('forumTopic', 'name slug')  // Populate forum topics with specific fields
                .populate('forumTag', 'name')  // Populate forum tags with specific fields
                .populate({
                    path: 'reply',
                    populate: {
                        path: 'customer',  // Populate the customer of each reply
                        select: 'firstName lastName photos'  // Only include specific fields for the customer in each reply
                    }
                })
                .lean()  // Populate replies (this assumes replies are stored as ObjectIds in the reply field)
                .exec((err, populatedPost) => {
                    if (err) {
                        console.error("Error during population:", err);
                        return res.json({
                            success: false,
                            message: "Error occurred while fetching forum post",
                            err: err.message
                        });
                    }

                    if (!populatedPost) {
                        console.log("No ForumPost found with the given criteria:", obj);
                        return res.json({
                            success: false,
                            message: "Forum post not found!"
                        });
                    }

                    console.log('Populated Post:', populatedPost);

                    // Track the view if the user hasn't already viewed it
                    const userIp = req.ip;
                    const existingView = populatedPost.views?.some(view => view.userIp === userIp);

                    if (!existingView) {
                        ForumPost.updateOne(
                            { _id: populatedPost._id },
                            { $push: { views: { userIp: userIp, createdAt: new Date() } } },
                            (updateErr, updateResult) => {
                                if (updateErr) {
                                    console.error('Error updating views array:', updateErr);
                                } else {
                                    console.log('Views updated successfully:', updateResult);
                                }
                            }
                        );
                    }
                    // Check if photos array exists and get the last photo
                    if (populatedPost && populatedPost.customer && populatedPost.customer.photos) {
                        const lastPhoto = populatedPost.customer.photos[populatedPost.customer.photos.length - 1];
                        if (lastPhoto) {
                            populatedPost.customer.photos = lastPhoto; // Replace photos array with the last photo object
                        }
                    }

                    // Similarly, modify the replies to use the last customer photo if applicable
                    if (populatedPost.reply) {
                        // populatedPost.reply.forEach(reply => {
                        //     if (reply.customer && reply.customer.photos) {
                        //         const lastReplyPhoto = reply.customer.photos[reply.customer.photos.length - 1];
                        //         if (lastReplyPhoto) {
                        //             reply.customer.photos = lastReplyPhoto; // Replace photos array with the last photo object
                        //         }
                        //     }
                        // });
                    }

                    // Calculate replyCount
                    const replyCount = populatedPost.reply ? populatedPost.reply.length : 0;

                    // Calculate likeCount from likeList (assuming likeList is an array of user IDs who liked the post)
                    const likeCount = populatedPost.likeList ? populatedPost.likeList.length : 0;

                    // Calculate views count by checking the size of the views array
                    const views = populatedPost.views ? populatedPost.views.length : 0;

                    // Add counts to the response object
                    populatedPost.replyCount = replyCount;
                    populatedPost.likeCount = likeCount;
                    populatedPost.views = views;
                    // Return populated post along with counts
                    res.json(populatedPost);  // Return the populated post, now with the counts for replies, likes, and views
                });

        },
        viewOneold: function (req, res, next) {
            console.log("viewOne forumPost", req.headers._id, req.headers.role);

            let ForumPost = req.mongoose.model('ForumPost');
            const ObjectId = req.mongoose.Types.ObjectId;

            function isValidObjectId(id) {
                return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
            }

            let obj = {};
            console.log('Request ID:', req.params.id);

            if (isValidObjectId(req.params.id)) {
                obj["_id"] = new ObjectId(req.params.id);
            } else {
                obj["slug"] = req.params.id;
            }

            console.log('Query Object:', obj);

            ForumPost.aggregate([
                {$match: obj},
                {
                    $lookup: {
                        from: "customers",
                        localField: "customer",
                        foreignField: "_id",
                        as: "customer"
                    }
                },
                {
                    $lookup: {
                        from: "forumtopics",
                        localField: "forumTopic",
                        foreignField: "_id",
                        as: "forumTopic"
                    }
                },
                {
                    $lookup: {
                        from: "forumtags",
                        localField: "forumTag",
                        foreignField: "_id",
                        as: "forumTag"
                    }
                },
                {
                    $lookup: {
                        from: "forumpostreplies",
                        localField: "reply",  // Use "reply" to match the reply ObjectId
                        foreignField: "_id",
                        as: "replies"  // Populates the `replies` field with the actual replies data
                    }
                },
                {
                    $addFields: {
                        // Only take the most recent photo for each customer
                        "customer": {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: "$customer",
                                        as: "cust",
                                        in: {
                                            _id: "$$cust._id",
                                            firstName: "$$cust.firstName",
                                            lastName: "$$cust.lastName",
                                            photos: {
                                                $arrayElemAt: [
                                                    {$reverseArray: "$$cust.photos"},
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                },
                                0 // Take the first item in the array (assuming there's only one customer)
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        text: 1,
                        forumTopic: 1,
                        forumTag: 1,
                        status: 1,
                        code: 1,
                        likeCount: {
                            $ifNull: ["$likeCount", 0] // Return 0 if likeCount is null or doesn't exist
                        },
                        media: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        views: {
                            $size: {$ifNull: ["$views", []]} // If 'views' is missing or null, use an empty array
                        },
                        replyCount: {
                            $size: {$ifNull: ["$reply", []]} // Count the number of replies, default to 0 if 'reply' is null
                        },
                        reply: 1,
                        customer: 1, // Customer object with only the latest photo
                        customerLiked: {
                            // Check if the current customer has liked this post
                            $cond: {
                                if: {
                                    $and: [
                                        {$ne: [req.headers._id, null]}, // Ensure customer ID is present
                                        {$ne: [req.headers._id, ""]}, // Ensure customer ID is not empty
                                        {$isArray: "$likeList"} // Ensure likeList is an array
                                    ]
                                },
                                then: {
                                    $in: [req.headers._id, {
                                        $ifNull: ["$likeList", []] // Ensure likeList is always an array
                                    }]
                                }, // Check if customer liked
                                else: false // If no customer ID or invalid likeList, assume they didn't like the post
                            }
                        }
                    }
                }
            ]).exec(function (err, result) {
                if (err) {
                    console.error("Error during aggregation:", err);
                    return res.json({
                        success: false,
                        message: "Error occurred while fetching forum post",
                        err: err.message
                    });
                }

                if (!result || result.length === 0) {
                    console.log("No ForumPost found with ID or slug:", req.params.id);
                    return res.json({
                        success: false,
                        message: "Forum post not found!"
                    });
                }

                let populatedPost = result[0];
                console.log('Populated Post line 459:', populatedPost);

                const userIp = req.ip;
                const existingView = populatedPost.views?.some?.(view => view.userIp === userIp);

                if (!existingView) {
                    ForumPost.updateOne(
                        {_id: populatedPost._id},
                        {$push: {views: {userIp: userIp, createdAt: new Date()}}},
                        (updateErr, updateResult) => {
                            if (updateErr) {
                                console.error('Error updating views array:', updateErr);
                            } else {
                                console.log('Views updated successfully:', updateResult);
                            }
                        }
                    );
                }

                res.json(populatedPost); // Return the populated post with likeCount
            });
        },


        create: async (req, res, next) => {
            console.log("create forumPost", req.headers._id, req.headers.role);
            try {
                // Destructure data from the request body
                const {forumTopic, forumTag, text, code, media} = req.body;

                // Check if all required fields are present
                if (!forumTopic || !forumTag || !text) {
                    return res.status(400).json({success: false, message: "All fields are required"});
                }

                // Validate media data if provided
                if (media && media.length > 0) {
                    media.forEach(item => {
                        if (!item.type) {
                            return res.status(400).json({success: false, message: "Media type is required"});
                        }
                        if (!item.url || !item.name) {
                            return res.status(400).json({success: false, message: "Media URL and name are required"});
                        }
                    });
                }

                // Create a new forum post with media if available
                const ForumPost = mongoose.model('ForumPost');
                const newPost = new ForumPost({
                    forumTopic,
                    forumTag,
                    text,
                    customer: req?.headers?._id,
                    code: code || '', // Optional code field
                    media: media || [], // Optional media field
                    createdAt: new Date(),
                });

                // Save the post to the database
                const savedPost = await newPost.save();

                return res.status(201).json({
                    success: true,
                    message: "Post created successfully",
                    post: savedPost,
                });
            } catch (error) {
                console.error("Error creating forum post:", error);
                return res.status(500).json({success: false, message: "Internal Server Error"});
            }
        },
        // File Upload Function
        fileUpload:

            function (req, res, next) {
                if (req.busboy) {
                    req.pipe(req.busboy);

                    req.busboy.on("file", function (
                        fieldname,
                        file,
                        filename, // this is the object containing file info
                        encoding,
                        mimetype  // this is an object containing mimeType
                    ) {
                        let fstream;
                        const __dirname = path.resolve();

                        // Log the filename to understand its structure
                        console.log("Filename object:", filename);

                        // Use filename.filename for the file name
                        // and filename.mimeType for the mime type
                        const formattedFilename = req.global.getFormattedTime() + filename.filename.replace(/\s/g, "");
                        const filePath = path.join(__dirname, "./public_media/customer/", formattedFilename);

                        console.log("Saving file to", filePath);

                        // Use the correct mimeType from the filename object
                        const fileMimeType = filename.mimeType || 'application/octet-stream';  // Default to application/octet-stream if mimeType is undefined

                        fstream = fs.createWriteStream(filePath);

                        // Pipe the file to the write stream
                        file.pipe(fstream);

                        fstream.on("close", function () {
                            // Once file is saved, create the URL
                            let fileUrl = "customer/" + formattedFilename;

                            // Prepare media data with the name, URL, and mimeType (type)
                            let mediaData = {
                                name: formattedFilename,
                                url: fileUrl,
                                type: fileMimeType,  // Use fileMimeType here
                            };

                            // Log media data to verify it includes the 'type' field
                            console.log("Media Data:", mediaData);

                            // Use Mongoose to save the media data to the database
                            let Media = req.mongoose.model('Media');
                            Media.create(mediaData, function (err, media) {
                                if (err || !media) {
                                    // Send an error response if media creation fails
                                    return res.json({
                                        success: false,
                                        message: "File upload failed",
                                        error: err || "Unknown error",
                                    });
                                }

                                // Send the media object back to the client, including the 'type'
                                res.json({
                                    success: true,
                                    media: media, // The media object now contains 'type'
                                });
                            });
                        });
                    });
                } else {
                    next(); // Proceed if there's no file upload handler
                }
            }


    }
;

export default self;
