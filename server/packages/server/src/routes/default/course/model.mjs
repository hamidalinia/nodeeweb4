console.log('#model course')
export default (mongoose)=>{
    const CourseSchema = new mongoose.Schema({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        active: { type: Boolean, default: true },
        courseCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourseCategory" }],
        attributes: [{attribute:{ type: mongoose.Schema.Types.ObjectId, ref: "Attributes" },values:[]}],
        include: [],
        sources: [],
        season: [
            {
                seasonTitle: String,
                lessons: [
                    {
                        lessonRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Reference to Lesson
                    }
                ],
                score: { type: String, default: '' }
            }
        ],
        labels: [],
        videos: [],
        in_stock: { type: Boolean, default: false },
        story: { type: Boolean, default: false },
        price: Number,
        weight: Number,
        quantity: Number,
        salePrice: Number,
        data: {},
        sku: String,
        courseLength: String,
        extra_button: String,
        miniTitle: {},
        excerpt: {},
        faq: [],
        options: [],
        extra_attr: [],
        // combinations: [],
        // sections: [],
        // countries: [],
        // like: [{
        //     customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
        //     userIp: String,
        //     createdAt: { type: Date, default: Date.now }
        // }],
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        type: { type: String, default: "normal" },
        description: {},

        views: [],
        title: {},
        metatitle: {},
        metadescription: {},
        keywords: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        thumbnail: String,
        icon: [],
        status: { type: String, default: "processing" },
        photos: [],
        postNumber: String
    });
    return CourseSchema

};
