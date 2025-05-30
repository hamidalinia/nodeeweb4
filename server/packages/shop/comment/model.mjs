console.log('#model comment')
export default (mongoose)=>{
    const CommentSchema = new mongoose.Schema({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        active: { type: Boolean, default: true },
        product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        comment: String,
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        inReplyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
        status: { type: String, default: "processing" },

    });
    return CommentSchema

};
