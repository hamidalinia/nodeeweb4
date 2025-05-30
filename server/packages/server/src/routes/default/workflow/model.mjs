export default (mongoose) => {
    const WorkflowSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true }, // نام فرایند
        description: { type: String }, // توضیحات درباره این فرایند
        conditions: [{
            role: { type: String, required: true }, // اگر کاربر این نقش را داشت...
            assignTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // سفارش به چه کسی برود؟
            nextState: { type: String, required: true }, // وضعیت بعدی سفارش (مثلاً: تایید شده، در حال بررسی، ارسال شده)
        }],
        createdAt: { type: Date, default: Date.now },
    });

    return WorkflowSchema;
};
