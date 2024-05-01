const express = require("express");
const route = express.Router();
const multer = require("multer");
const Blog = require("../models/blog");
const authenticate = require("../middlewares/authenticateUser");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// / ROUTE 1: Get All the blogs using: GET "/fetchall". No Login required
route.get("/fetchall", async (req, res) => {
  try {
    const blog = await Blog.find({}).sort({ date: -1 });
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// / ROUTE 2: Get All the blogs using: GET "/fetchall". No Login required
route.get("/fetchByCategory", async (req, res) => {
  try {
    const category = req.query.category;
    const blog = await Blog.find({ blog_category: category }).sort({
      date: -1,
    });
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// / / ROUTE 2: Get All the blogs of user using: GET "/fetchUser". Login required
route.get("/fetchUser", authenticate, async (req, res) => {
  try {
    const blog = await Blog.find({ user: req.user.id }).sort({ date: -1 });
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// / / ROUTE 3: Get blogs by id using: GET "/fetchblog/:id". Login required
route.get("/fetchblog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// / / ROUTE 4: Get blogs by id using: GET "/fetchblog/:id". Login required
route.get("/fetchuserblog/:id", authenticate, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// / / ROUTE 4: Create a new blog using: POST "/upload". Login required
route.post(
  "/upload",
  authenticate,
  upload.single("files"),
  async (req, res) => {
    let blog = await Blog.create({
      blog_title: req.body.blog_title,
      blog_img: req.file.filename,
      blog_desc: req.body.blog_desc,
      blog_category: req.body.blog_category,
      user: req.user.id,
      author: req.user.fullname,
    });
    res.send(blog);
  }
);

// / / ROUTE 5: Delete an existing Note using: DELETE "/delete". Login required
route.delete("/delete/:id", authenticate, async (req, res) => {
  let blog = await Blog.deleteOne({ _id: req.params.id });
  res.send(blog);
});

// / / ROUTE 6: Update an existing Note using: PUT "/update". Login required
route.put(
  "/update/:id",
  authenticate,
  upload.single("files"),
  async (req, res) => {
    const UpdatedBlog = {};
    if (req.body.blog_title) {
      UpdatedBlog.blog_title = req.body.blog_title;
    }
    if (req.file) {
      UpdatedBlog.blog_img = req.file.filename;
    }
    if (req.body.blog_desc) {
      UpdatedBlog.blog_desc = req.body.blog_desc;
    }
    if (req.body.blog_category) {
      UpdatedBlog.blog_category = req.body.blog_category;
    }

    let blog = await Blog.updateOne(
      { _id: req.params.id },
      {
        $set: UpdatedBlog,
      }
    );
    res.send(blog);
  }
);

// / / ROUTE 7: Get All the blogs of user as per category using: GET "/fetchUser". Login required
route.get("/category/:cat", async (req, res) => {
  console.log(req.params.cat);
  try {
    const blog = await Blog.find({ blog_category: req.params.cat }).sort({
      date: -1,
    });
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = route;
