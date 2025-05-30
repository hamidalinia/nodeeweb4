console.log('#model test');

export default (mongoose) => {
    const TestResultSchema = new mongoose.Schema({
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Link to the customer
        test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true }, // Link to the test
        // answers: [{
        //     question: { type: mongoose.Schema.Types.ObjectId, ref: 'Test.questions', required: true }, // Ref to the question
        //     answer: { type: String, required: true }, // Customer's answer
        //     score: { type: Number, default: 0 }, // Score for each answer
        // }],
        score: { type: Number, default: 0 }, // Total score for the test
        passed: { type: Boolean, default: false }, // Did the customer pass the test
        completedAt: { type: Date, default: Date.now }, // When the test was completed
    });

    return TestResultSchema;
};
