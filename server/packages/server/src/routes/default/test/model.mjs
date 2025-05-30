console.log('#model test');

export default (mongoose) => {
    const TestSchema = new mongoose.Schema({
        description: {},
        title: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        button: {
            type: String,
            default: "send"
        },
        createdAt: { type: Date, default: new Date() },
        updatedAt: { type: Date, default: new Date() },
        active: { type: Boolean, default: true },
        status: { type: String, enum: ['published', 'processing', 'deleted'], default: 'processing' },
        answerMode: { type: String, enum: ['piano', 'normal'], default: 'normal' },
        classes: { type: String },
        practiceText: { type: String },
        sort: { type: Number, default: 1 },
        isMatch: { type: Boolean, default: false },
        thumbnail: { type: String },
        questionWrapperClasses: { type: String },
        photos: [],
        dependency: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCategory' },

        // New field: score for the whole test
        score: { type: Number, default: 0 },

        // Array of questions
        questions: [{
            classes: { type: String},
            questionText: { type: String},
            questionType: { type: String, default: 'text' }, // enum: ['text', 'multiple-choice', 'checkbox','radiobutton'],
            options: [{ type: String }],  // Options for multiple choice or checkboxes
            score: { type: Number, default: 0 },  // Individual question score
            answer: { type: String}
        }]
    });

    return TestSchema;
};
