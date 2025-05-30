console.log('#model TestCategory')
export default (mongoose)=>{
    const TestCategorySchema = new mongoose.Schema({
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
        image: String,
        data: {},
        metatitle: {},
        metadescription: {},
        description: {},
        values:[],
        parent:{type: mongoose.Schema.Types.ObjectId, ref: 'TestCategory'} //category_id
    });
    return TestCategorySchema

};
