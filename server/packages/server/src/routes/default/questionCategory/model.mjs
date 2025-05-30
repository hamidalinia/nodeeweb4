console.log('#model QuestionCategory')
export default (mongoose)=>{
    const QuestionCategorySchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        type: {
            type: String,
            default: "normal"
        },
        values:[],
        parent:{type: mongoose.Schema.Types.ObjectId, ref: 'QuestionCategory'} //category_id
    });
    return QuestionCategorySchema

};
