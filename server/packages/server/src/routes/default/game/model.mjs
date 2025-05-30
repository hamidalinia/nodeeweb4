console.log('#model course')
export default (mongoose) => {
    const GameSchema = new mongoose.Schema({
            title: {}, // Game title
            description: {type: String, default: ''}, // Description of the game
            startTime: {type: Date, required: false}, // Game start time
            endTime: {type: Date, required: false}, // Game end time
            limitTime: {type: Number, required: false}, // Game end time
            status: {
                type: String,
                enum: ["pending", "running", "ended"],
                default: "pending" // Status of the game
            },
            minParticipants: {type: Number}, // Minimum participants required
            maxParticipants: {type: Number}, // Maximum participants allowed
            randomQuestions: {type: Boolean, default: false}, // Whether the game uses random questions
            levels: [
                {
                    levelNumber: {type: Number, required: false}, // Level sequence
                    numberOfQuestions: {type: Number, required: false}, // Questions in this level
                    difficulty: {type: String, enum: ["easy", "medium", "hard"], default: "easy"} // Difficulty of this level

                }
            ],
            questions: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question" // Pool of questions for the game
                }
            ],
            gameRounds: [
                {type: mongoose.Schema.Types.ObjectId, ref: "GameRound"} // Reference to GameRounds
            ],
            questionCategory: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "QuestionCategory", // Reference to the category
                required: false // Optional; can be left unset
            }]
        },
        {timestamps: true});
    return GameSchema

};
