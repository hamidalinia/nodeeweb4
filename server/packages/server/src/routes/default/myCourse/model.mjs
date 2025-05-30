console.log('#model MyCourse');

export default (mongoose) => {
    const MyCourseSchema = new mongoose.Schema({
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        seasonScoreData: {
            type: Array,
            default: []
        }, // Stores score data per season
        currentScore: {
            type: Number,
            default: 0
        }, // Stores the latest score
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }, {timestamps: true}); // Enables automatic createdAt and updatedAt updates

    return MyCourseSchema;
};
