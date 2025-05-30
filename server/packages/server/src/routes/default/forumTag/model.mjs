console.log('#model ForumTag')
export default (mongoose)=>{
    const ForumTagSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        parent:{type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic'} //category_id
    });
    return ForumTagSchema

};
