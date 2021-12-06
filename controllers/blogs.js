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
    // console.log(JSON.stringify(body));
    if (!blog.title || !blog.url) {
      return response.status(401).json({ error: "must have title and url" });
    }
    const savedBlog = await blog.save();
    //console.log(JSON.stringify(savedBlog.body));
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
  console.log("param:  " + request.params.id);
  const b = await Blog.findById(request.params.id);
  if (!b) {
    response.status(404).json({ error: "no such blog" });
  }
  //console.log("compare: " + (String(request.user._id) === String(b.user)));
  //console.log(request.user._id);
  //console.log(b.user);
  if (request.user && String(request.user._id) === String(b.user)) {
    await Blog.findByIdAndRemove(request.params.id);

    request.user.blogs = request.user.blogs.filter(function (ele) {
      return String(ele.user) === String(request.params.id);
    });
    //await request.user.blogs.findByIdAndRemove(request.params.id);
    await request.user.save();
    response.status(200).end();
  } else {
    response.status(401).json({ error: "unauthorized" });
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  console.log("param:  " + request.params.id);
  if (request.user) {
    const b = await Blog.findById(request.params.id);
    b.likes = b.likes + 1;
    await b.save();
  }
  response.status(401).json({ error: "unauthorized" });
  return;
});

module.exports = blogsRouter;
