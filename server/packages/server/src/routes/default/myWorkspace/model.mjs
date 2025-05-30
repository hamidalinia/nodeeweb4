console.log('#model MyCourse');

export default (mongoose) => {
    const MyCourseSchema = new mongoose.Schema({
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        data: {},
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
