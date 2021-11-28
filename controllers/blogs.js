const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

//edit post
blogRouter.put("/:id", async (req, res, next) => {
  try {
    const blog = req.body;

    const updatedBLog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true
    });
    res.json(updatedBLog.toJSON());
  } catch {
    console.log("put error");
    return res.status(401).json({ error: "bad request" });
  }
});
//delete post
blogRouter.delete("/:id", async (req, res, next) => {
  try {
    const token = req.token;
    const blog = await Blog.findById(req.params.id);

    if (!token || !token.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }

    if (token.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(blog.id);
      res.status(204).end();
    } else {
      res.status(401).json({
        error: "only user who created the blog can delete it"
      });
    }
  } catch {
    next();
  }
});
// route to post a new blog
blogRouter.post("/", async (request, res, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: request.user._id
  });

  try {
    const savedBlog = await blog.save();
    request.user.blogs.push(savedBlog._id);
    await request.user.save();
    res.json(savedBlog);
  } catch (exception) {
    next();
  }
});

module.exports = blogRouter;
