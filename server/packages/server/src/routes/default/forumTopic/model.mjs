console.log('#model ForumTopic')
export default (mongoose) => {
    const ForumTopicSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        }
    });
    return ForumTopicSchema

};
