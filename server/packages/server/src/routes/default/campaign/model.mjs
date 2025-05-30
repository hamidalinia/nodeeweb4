export default (mongoose) =>
    new mongoose.Schema(
        {
            message: String,
            createdAt: {type: Date, default: Date.now},
            updatedAt: {type: Date, default: Date.now},
            active: {type: Boolean, default: true},
            views: [],
            title: {},
            slug: {
                type: String,
                unique: true,
                required: true,
                trim: true,
            },
            status: {type: String, default: "processing"},
            customers: [],
            participantsCount:Number,
            offset:Number,
            limit:Number,
            phoneNumber:String,
            link:String,
            customerGroup:String,
            source:String,
            viewsCount:{type: Number, default: 0}
        },
        {versionKey: false}
    );
