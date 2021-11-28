const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
//mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
blogSchema.plugin(mongooseUniqueValidator);

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Blog", blogSchema);
