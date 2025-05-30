console.log('#model OrganisationRole')
export default (mongoose)=>{
    const PostCategorySchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        }
    });
    return PostCategorySchema

};
