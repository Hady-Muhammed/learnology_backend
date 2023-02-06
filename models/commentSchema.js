const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  belongsTo: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  commentedAt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: {
    type: Number,
    required: true,
  },
  reacts: {
    type: Number,
    required: true,
  },
  commentHasLikes: {
    type: Boolean,
    required: true
  },
  commentHasLoves: {
    type: Boolean,
    required: true
  },
  commentHasWows: {
    type: Boolean,
    required: true
  },
});

const Comment = mongoose.model("Comment", commentSchema, "comments");

const validateComment = (comment) => {
  const schema = joi.object({
    postID: joi.string(),
    belongsTo: joi.string(),
    content: joi.string(),
    commentedAt: joi.string(),
    reacts: joi.number(),
    commentHasLikes: joi.boolean(),
    commentHasLoves: joi.boolean(),
    commentHasWows: joi.boolean(),
    replies: joi.number()
  });
  return schema.validate(comment);
};

module.exports = { Comment, validateComment };
