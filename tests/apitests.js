const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})




/*
test('onhan id', async () => {
  const blogs = await api
    .get('/api/blogs');
  expect(blogs.id).toBeDefined()
});
*/




afterAll(() => {
  mongoose.connection.close()
})