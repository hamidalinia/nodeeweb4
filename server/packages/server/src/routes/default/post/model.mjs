export default (mongoose) =>
  new mongoose.Schema(
    {
      // seo
      metatitle: {},
      metadescription: {},
      keywords: {},


      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      active: { type: Boolean, default: true },
      category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        postCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
      data: {},
      description: {},
      excerpt: {},
      views: [],
      slug: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      title: {},
      elements: {},
      kind: { type: String, default: "post" },
      status: { type: String, default: "processing" },
      photos: [],
      thumbnail: String,
    },
    { versionKey: false }
  );
