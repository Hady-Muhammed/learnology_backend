const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  authorID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  image: {
    type: String,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Number,
    required: true,
  },
  reacts: {
    type: Number,
    required: true
  },
  postHasLikes: {
    type: Boolean,
    required: true
  },
  postHasLoves: {
    type: Boolean,
    required: true
  },
  postHasWows: {
    type: Boolean,
    required: true
  },
});

const Post = mongoose.model("Post", postSchema, 'posts');

const validatePost = (post) => {
  const schema = joi.object({
    authorID: joi.string().required(),
    image: joi.string(),
    publishedAt: joi.string().required(),
    content: joi.string().required(),
    comments: joi.number(),
    reacts: joi.number(),
    postHasLikes: joi.boolean(),
    postHasLoves: joi.boolean(),
    postHasWows: joi.boolean(),
  });
  return schema.validate(post);
};

module.exports = {Post, validatePost};

