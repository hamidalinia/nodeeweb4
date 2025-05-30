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
      data: {},
      description: {},
      excerpt: {},
      views: [],
      slug: String,
      title: {},
      elements: { type: [mongoose.Schema.Types.Mixed], default: [] },
      access: { type: String, default: "public" },
      kind: { type: String, default: "page" },
      classes: { type: String, default: "" },
      backgroundColor: String,
      padding: String,
      margin: String,
      path: String,
      maxWidth: { type: String, default: "100%" },
      status: { type: String, default: "processing" },
      photos: [],
      thumbnail: String,
    },
    { versionKey: false }
  );
