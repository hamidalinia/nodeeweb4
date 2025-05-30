console.log('#model ForumPostReply')

export default (mongoose) => {
    const { Schema } = mongoose;

    // Define the schema for replies themselves
    const ForumPostReplySchema = new Schema(
        {
            admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
            customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
            text: { type: String, required: true },
            createdAt: { type: Date, default: new Date() },
            code: { type: String, default: '' },
            media: [
                {
                    name: { type: String, required: true },
                    url: { type: String, required: true },
                    type: { type: String, required: true },
                }
            ],
            reply: [{ type: Schema.Types.ObjectId, ref: "ForumPostReply" }] // Recursive reference to replies
        },
        {
            timestamps: true,
        }
    );

    // You can add any additional methods or indexes here
    // For example, an index on ForumTopic for faster lookups:

    return  ForumPostReplySchema ;
};
