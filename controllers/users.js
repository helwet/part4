const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("users", {
    content: 1,
    date: 1
  });
  response.json(users.map((u) => u.toJSON()));
});
//process.env.SECRET
usersRouter.post("/", async (request, response) => {
  try {
    const body = request.body;
    console.log("pass lenght :");
    console.log(body);
    if (body.password.length < 3 || body.username.length < 3) {
      return response.status(400).json({
        error: "password and name should be at least 3 characters"
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });

    const savedUser = await user.save();
    response.json(savedUser);
  } catch {
    response.json = { error: "bad format of post" };
  }
});

module.exports = usersRouter;
