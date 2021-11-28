const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const favoriteBlog = (blogs) => {
  var collection = {};

  var max = 0;
  var maxAuthor = "";
  for (var i = 0; i < blogs.length; ++i) {
    collection[blogs[i].author] = collection[blogs[i].author] + blogs[i].likes;
    if (collection[blogs[i].author] > max) {
      max = blogs[i].likes;
      maxAuthor = blogs[i].author;
    }
  }
  return { max, maxAuthor };
};

const mostBlogs = (blogs) => {
  var collection = {};

  var max = 0;
  var maxAuthor = "";
  for (var i = 0; i < blogs.length; ++i) {
    collection[blogs[i].author] = collection[blogs[i].author] + 1;
    if (collection[blogs[i].author] > max) {
      max = blogs[i].likes;
      maxAuthor = blogs[i].author;
    }
  }
  return { max, maxAuthor };
};

const mostLikes = (blogs) => {
  var max = 0;
  for (var i = 0; i < blogs.length; ++i) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes;
    }
  }
  return max;
};

const totalLikes = (blogs) => {
  var total = 0;
  for (var i = 0; i < blogs.length; ++i) {
    if (blogs[i].likes > total) {
      total = blogs[i].likes;
    }
  }
  return total;
};

module.exports = {
  dummy
};
