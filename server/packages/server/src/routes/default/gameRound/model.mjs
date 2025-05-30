console.log('#model gameRound')
export default (mongoose) => {
    const GameRoundSchema = new mongoose.Schema({
            startTime: {type: Date, default: Date.now}, // Round start time
            endTime: {type: Date}, // Round end time
            status: {
                type: String,
                enum: ["pending", "running", "completed", "paused", "disqualified"], // Extended statuses
                default: "pending", // Status of the round
            },
            questions: [
                {
                    levelNumber: { type: Number, required: true },
                    questions: [
                        {
                            question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
                            level: { type: Number, required: true },
                        },
                    ],
                },
            ],
            participants: [
                {
                    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
                    score: { type: Number, default: 0 },
                    accuracy: { type: Number },
                    currentQuestionIndex: { type: Number, default: 0 },
                    currentLevel: { type: Number, default: 1 },
                    levels: [
                        {
                            levelNumber: { type: Number, required: true },
                            answers: [
                                {
                                    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
                                    answer: { type: mongoose.Schema.Types.Mixed },
                                    isCorrect: { type: Boolean, default: false },
                                    timeTaken: { type: Number },
                                },
                            ],
                        },
                    ],
                },
            ],
            winner: {type: mongoose.Schema.Types.ObjectId, ref: "Customer"}, // Winner of the round
        },
        {timestamps: true});
    return GameRoundSchema

};
