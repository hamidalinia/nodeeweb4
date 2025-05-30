console.log('#model ForumPost')

export default (mongoose) => {
    const { Schema } = mongoose;

    // Define the ForumPost schema
    const ForumPostSchema = new Schema(
        {

            // Post content (text)
            text: { type: String, required: true },

            // References to ForumTopic model
            forumTopic: [{ type: Schema.Types.ObjectId, ref: "ForumTopic", required: true }],
            forumTag: [{ type: Schema.Types.ObjectId, ref: "ForumTag", required: true }],

            // Post status (e.g., "processing", "published", etc.)
            status: { type: String, default: "processing", enum: ["processing", "published", "archived"] },

            // Code (optional field for code snippets)
            code: { type: String, default: '' },
            likeCount: { type: Number, default: 0 },
            likeList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
            customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
            admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
            views: [],

            // Media (for handling uploaded files like images or videos)
            reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "ForumPostReply" }],
            media: [
                {
                    name: { type: String, required: true },
                    url: { type: String, required: true },
                    type: { type: String, required: true },
                }
            ]
        },
        {
            timestamps: true, // Automatically manage createdAt and updatedAt
        }
    );




    // You can add any additional methods or indexes here
    // For example, an index on ForumTopic for faster lookups:
    ForumPostSchema.index({ ForumTopic: 1 });

    return  ForumPostSchema;
};
