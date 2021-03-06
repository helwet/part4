const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const api = supertest(app);
beforeEach(() => {
  //jest.useFakeTimers();
  //npmjest.setTimeout(8000);
});

//4.8
test("blogs are returned as json", async () => {
  const rep = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

//4.9
test("blog has id in json format", async () => {
  const reply = await api.get("/api/blogs");
  expect(reply.body[0].id).toBeDefined();
});

//4.10,  4.11 ja 4.12..
test("testaa kaikki muu kerralla, koska post tarvitsee tokenin, ja lisätty blogi täytyy poistaa, että testi menee läpi seuraavan kerran koska unique constraint", async () => {
  jest.setTimeout(20000);
  const initial = await api.get("/api/blogs");

  const initialCount = initial.body.length;
  console.log("count:" + initialCount);
  const user = await api
    .post("/api/login")
    .send({
      username: "testrunner",
      password: "testrunner"
    })
    .set("Content-type", "application/json");

  //console.log("user: " + JSON.stringify(user.body));
  expect(user.body.token).toBeDefined();
  const payload = {
    title: "testiii",
    author: "erkki",
    url: "mitaa merkitysta"
  };
  const blog = await api
    .post("/api/blogs")
    .send(payload)
    .set("Authorization", `bearer ${user.body.token}`)
    .set("Content-type", "application/json");

  console.log(
    "blog body :" + JSON.stringify(blog.body) + "  stat :" + blog.status
  );
  expect(blog.body.likes).toBe(0);

  const after = await api.get("/api/blogs");
  const afterPostCount = after.body.length;
  console.log("after post count : " + afterPostCount);

  expect(initialCount < afterPostCount);
  const deleteReply = await api
    .delete(`/api/blogs/${blog.body.id}`)
    .set("Authorization", `bearer ${user.body.token}`);
  expect(deleteReply.status).toBe(200);

  const badPayload = {
    author: "erkki",
    id: user.id
  };

  const badReply = await api
    .post("/api/blogs")
    .send(badPayload)
    .set("Authorization", `bearer ${user.body.token}`);
  expect(badReply.status).toBe(401);
});

afterAll(() => {
  mongoose.connection.close();
});
