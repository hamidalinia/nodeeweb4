export default (mongoose) =>
  new mongoose.Schema(
    {

      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      active: { type: Boolean, default: true },
      data: {},
      views: [],

      status: { type: String, default: "301" },
      to: String,
      from: String,
    },
    { versionKey: false }
  );
