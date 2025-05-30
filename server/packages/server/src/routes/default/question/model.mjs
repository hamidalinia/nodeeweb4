console.log('#model question')
export default (mongoose)=>{
    const optionSchema = new mongoose.Schema({
        answer: {
            type: String,
        },
        isAnswer: {
            type: Boolean,
            default:false
        },
    });
    const QuestionSchema = new mongoose.Schema({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        title: {},
        questionCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuestionCategory" }],
        status: { type: String, default: "processing" },
        score: { type: Number, default: 0 },
        options:  [optionSchema], // Answer options
        // correctAnswer: { type: String, required: true }, // Correct answer
    });
    return QuestionSchema

};
