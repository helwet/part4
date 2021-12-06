const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const authors = combineOnKey(blogs, "author");
  let ret = { likes: 0, author: "no one" };

  //console.log("authors: " + JSON.stringify(authors));
  for (let i = 0; i < authors.length; i++) {
    const auth = Object.values(authors[i].values);
    const sum = _.sumBy(auth, "likes");
    console.log("sum: " + sum);
    if (sum > ret.likes) {
      ret.likes = sum;
      ret.author = authors[i].key;
    }
  }
  console.log("total likes ret: " + ret);

  return ret;
};

//kerätään kaikki tietyn arvon matchaamat listoiksi
const combineOnKey = (data, key) => {
  const output = [];
  let keyString = data[0][key];
  let help = [];
  for (let i = 0; i < data.length; i++) {
    // output[itemsCount] = help.push(data[i]);
    if (keyString !== data[i][key]) {
      //console.log("log " + JSON.stringify(keyString));
      let copy = { ...help };
      output.push({ key: keyString, values: copy });
      //console.log("combine on key: " + JSON.stringify(copy));
      help = [];
      help.push(data[i]);
      keyString = data[i][key];
    } else {
      help.push(data[i]);
    }
  }
  let copy = { ...help };
  output.push({ key: keyString, values: copy });
  // console.log("log " + JSON.stringify(output));
  return output;
};
//whp has most blogs
const mostBlogs = (blogs) => {
  const authors = combineOnKey(blogs, "author");
  //_.groupBy(blogs, blogs.author);
  let ret = { author: "crap", blogs: 0 };

  //console.log("authors: " + JSON.stringify(authors));
  console.log("authors: " + JSON.stringify(authors));
  for (let i = 0; i < authors.length; i++) {
    const auth = Object.values(authors[i].values);
    const count = auth.length;
    //console.log("count: " + count);
    if (count > ret.blogs) {
      ret.blogs = count;
      ret.author = authors[i].key;
      // console.log("max updated: " + typeof authors[i].key + "  " + ret.blogs);
      //  console.log(ret);
    }
  }
  // console.log("wtf " + ret);

  return ret;
  /*
  let authors = {};
  blogs.forEach((blogPost) => {
    if (authors[blogPost.author]) {
      authors[blogPost.author] += 1;
    } else {
      authors[blogPost.author] = 1;
    }
  });
  let maxBlog = Math.max(...Object.values(authors));
  let maxAuthor = Object.keys(authors).find(
    (author) => authors[author] === maxBlog
  );

  let collection = new Map();


  let blog;
  for (let i = 0; i < blogs.length; i++) {
    blog = blogs[i];
    if (!collection.has(blog.author)) {
      collection.set(blog.author, Number(1));
    } else {
      collection[blog.author] = Number(collection[blog.author]) + 1;
    }
    if (Number(collection[blogs[i].author]) > max) {
      max = blog.likes;
      maxAuthor = blog.author;
    }
  }
  console.log(collection);

  return { author: maxAuthor, blogs: maxBlog };
    
  */
};

//just amount of likes on most liked blog
const favoriteBlog = (blogs) => {
  let ret = {
    title: "",
    author: "",
    likes: 0
  };

  console.log(blogs.length);
  for (var i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > ret.likes) {
      ret.title = blogs[i].title;
      ret.author = blogs[i].author;
      ret.likes = blogs[i].likes;
      //console.log(likes);
    }
  }
  console.log(ret);
  return ret;
  //{ title: blog.title, author: blog.author, likes: blog.likes };
};
/*
//just amount of likes on most liked blog
const mostLikes = (blogs) => {
  let max = 0;
  let blog = Object();
  console.log();
  for (let i = 0; i < blogs.length; i++) {
    console.log(blogs[i]);
    blog = blogs[i];
    if (blog.likes >= max) {
      max = blog.likes;
    }
  }
  console.log("max likes " + max);
  return max;
};
*/
//tän tehtävänanto on päinvittua
const mostLikes = (blogs) => {
  let sum = _.sumBy(blogs, "likes");
  return sum;
};

module.exports = {
  mostLikes,
  mostBlogs,
  totalLikes,
  favoriteBlog,
  combineOnKey,
  dummy
};
