console.log('#model course')
export default (mongoose)=>{
    const LessonSchema = new mongoose.Schema({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        active: { type: Boolean, default: true },
        lessons: [],
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        title: {},
        secondTitle: {},
        status: { type: String, default: "published" },

    });
    return LessonSchema

};
