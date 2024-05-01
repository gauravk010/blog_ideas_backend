const mongoose = require("mongoose");
const blogsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    author: {
      type: String,
      required: true,
    },
    blog_title: {
      type: String,
      required: true,
    },
    blog_img: {
      type: String,
      required: true,
    },
    blog_desc: {
      type: String,
      required: true,
    },
    blog_category: {
      type: String,
      default: "General",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogs", blogsSchema);
