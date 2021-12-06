const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs.map((blog) => blog.toJSON()));
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!request.token && !request.token.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  if (request.user) {
    const user = request.user;
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      user: request.user.id
    });
    if (!blog.title || !blog.url) {
      return response.status(401).json({ error: "must have title and url" });
    }
    const savedBlog = await blog.save();
    console.log(JSON.stringify(savedBlog.body));
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.json(savedBlog.toJSON());
  }
  return response.status(401).json({ error: "bad token" });
});
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const b = await Blog.findByIdAndRemove(request.params.id);
  if (request.user && request.user._id === b.user) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(500).end();
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  if (request.user) {
    const b = await Blog.findByIdAndRemove(request.params.id);
    b.likes = b.likes + 1;
    await b.save();
  }
  return;

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog.toJSON());
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
